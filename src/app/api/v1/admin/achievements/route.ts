import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/shared/config/mongodb/mongodb'
import User from '@/entities/user/model/user'
import UserAchievement from '@/entities/achievement/model/user-achievement'
import { GRANTED_ACHIEVEMENT_KEYS, isGrantedAchievementKey } from '@/entities/achievement/model/granted-keys'

function unauthorized(request: NextRequest) {
  const expected = process.env.ADMIN_TOKEN
  const token = request.headers.get('x-admin-token')
  return !expected || !token || token !== expected
}

function parseEmail(request: NextRequest) {
  return request.nextUrl.searchParams.get('email')?.trim().toLowerCase() || null
}

async function findUserByEmail(email: string) {
  return User.findOne({ email })
}

export async function GET(request: NextRequest) {
  try {
    if (unauthorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const email = parseEmail(request)
    if (!email) return NextResponse.json({ error: 'email query param is required' }, { status: 400 })

    await connectDB()
    const user = await findUserByEmail(email)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const achievements = await UserAchievement.find({ userId: user._id }).sort({ createdAt: -1 }).lean()

    return NextResponse.json({
      user: { _id: user._id, email: user.email, name: user.name },
      achievements: achievements.map((a) => ({ key: a.key, createdAt: a.createdAt }))
    })
  } catch (error) {
    console.error('Error listing achievements:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Grant an achievement: body { email, key }
export async function POST(request: NextRequest) {
  try {
    if (unauthorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json().catch(() => null)
    const email = body?.email?.trim().toLowerCase()
    const key = body?.key?.trim()

    if (!email || !key) return NextResponse.json({ error: 'email and key are required' }, { status: 400 })
    if (!isGrantedAchievementKey(key)) {
      return NextResponse.json(
        { error: `Invalid key. Allowed: ${GRANTED_ACHIEVEMENT_KEYS.join(', ')}` },
        { status: 400 }
      )
    }

    await connectDB()
    const user = await findUserByEmail(email)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const achievement = await UserAchievement.findOneAndUpdate(
      { userId: user._id, key },
      { $setOnInsert: { userId: user._id, key } },
      { upsert: true, new: true }
    )

    return NextResponse.json({
      granted: { key: achievement.key, createdAt: achievement.createdAt },
      user: { _id: user._id, email: user.email }
    })
  } catch (error) {
    console.error('Error granting achievement:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Remove an achievement: ?email=&key=
export async function DELETE(request: NextRequest) {
  try {
    if (unauthorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const email = parseEmail(request)
    const key = request.nextUrl.searchParams.get('key')?.trim() || null

    if (!email || !key) return NextResponse.json({ error: 'email and key query params are required' }, { status: 400 })

    await connectDB()
    const user = await findUserByEmail(email)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const result = await UserAchievement.deleteOne({ userId: user._id, key })

    return NextResponse.json({
      removed: { key, deletedCount: result.deletedCount },
      user: { _id: user._id, email: user.email }
    })
  } catch (error) {
    console.error('Error removing achievement:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
