import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/shared/config/mongodb/mongodb'
import User from '@/entities/user/model/user'
import UserAchievement from '@/entities/achievement/model/user-achievement'
import { auth } from '@/shared/config/auth/auth'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = (await params).id

    if (!userId) {
      return NextResponse.json({ error: 'ID is required' }, { status: 404 })
    }

    const session = await auth()
    if (!session || session.user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    await connectDB()

    const { email, createdAt, updatedAt, __v, ...rest } = body
    const updatedUser = await User.findOneAndUpdate({ _id: userId }, { ...rest }, { returnDocument: 'after' })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = (await params).id

    if (!userId) {
      return NextResponse.json({ error: 'ID is required' }, { status: 404 })
    }

    await connectDB()
    const user = await User.findById(userId)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const granted = await UserAchievement.find({ userId: user._id }, { key: 1, _id: 0 }).lean<{ key: string }[]>()

    const { email, __v, ...rest } = user.toObject()

    return NextResponse.json({ ...rest, grantedAchievements: granted.map((a) => a.key) })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
