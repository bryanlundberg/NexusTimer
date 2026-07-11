import { NextRequest } from 'next/server'
import { z } from 'zod'
import connectDB from '@/shared/config/mongodb/mongodb'
import User from '@/entities/user/model/user'
import { userProfileCache } from '@/entities/user/model/user-cache'
import UserAchievement from '@/entities/achievement/model/user-achievement'
import { GRANTED_ACHIEVEMENT_KEYS, isGrantedAchievementKey } from '@/entities/achievement/model/granted-keys'
import { requireAdmin } from '@/shared/api/require-admin'
import { parseEmailParam } from '@/shared/api/admin-helpers'
import { parseJsonBody } from '@/shared/api/parse-json'
import { badRequest, notFound, ok, serverError } from '@/shared/api/responses'

const grantBodySchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  key: z.string().trim().min(1)
})

async function findUserByEmail(email: string) {
  return User.findOne({ email })
}

export async function GET(request: NextRequest) {
  try {
    const denied = requireAdmin(request)
    if (denied) return denied

    const email = parseEmailParam(request)
    if (!email) return badRequest('email query param is required')

    await connectDB()
    const user = await findUserByEmail(email)
    if (!user) return notFound('User not found')

    const achievements = await UserAchievement.find({ userId: user._id }).sort({ createdAt: -1 }).lean()

    return ok({
      user: { _id: user._id, email: user.email, name: user.name },
      achievements: achievements.map((a) => ({ key: a.key, createdAt: a.createdAt }))
    })
  } catch (error) {
    return serverError('admin/achievements:GET', error)
  }
}

// Grant an achievement: body { email, key }
export async function POST(request: NextRequest) {
  try {
    const denied = requireAdmin(request)
    if (denied) return denied

    const body = await parseJsonBody(request, grantBodySchema)
    if (body instanceof Response) return body

    if (!isGrantedAchievementKey(body.key)) {
      return badRequest(`Invalid key. Allowed: ${GRANTED_ACHIEVEMENT_KEYS.join(', ')}`)
    }

    await connectDB()
    const user = await findUserByEmail(body.email)
    if (!user) return notFound('User not found')

    const achievement = await UserAchievement.findOneAndUpdate(
      { userId: user._id, key: body.key },
      { $setOnInsert: { userId: user._id, key: body.key } },
      { upsert: true, new: true }
    )

    await userProfileCache.invalidate(user._id.toString())

    return ok({
      granted: { key: achievement.key, createdAt: achievement.createdAt },
      user: { _id: user._id, email: user.email }
    })
  } catch (error) {
    return serverError('admin/achievements:POST', error)
  }
}

// Remove an achievement: ?email=&key=
export async function DELETE(request: NextRequest) {
  try {
    const denied = requireAdmin(request)
    if (denied) return denied

    const email = parseEmailParam(request)
    const key = request.nextUrl.searchParams.get('key')?.trim() || null

    if (!email || !key) return badRequest('email and key query params are required')

    await connectDB()
    const user = await findUserByEmail(email)
    if (!user) return notFound('User not found')

    const result = await UserAchievement.deleteOne({ userId: user._id, key })

    await userProfileCache.invalidate(user._id.toString())

    return ok({
      removed: { key, deletedCount: result.deletedCount },
      user: { _id: user._id, email: user.email }
    })
  } catch (error) {
    return serverError('admin/achievements:DELETE', error)
  }
}
