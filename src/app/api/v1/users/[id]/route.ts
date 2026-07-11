import { NextRequest } from 'next/server'
import { z } from 'zod'
import { hasFlag } from 'country-flag-icons'
import connectDB from '@/shared/config/mongodb/mongodb'
import User, { type UserProfile } from '@/entities/user/model/user'
import { userProfileCache } from '@/entities/user/model/user-cache'
import UserAchievement from '@/entities/achievement/model/user-achievement'
import { auth } from '@/shared/config/auth/auth'
import { parseJsonBody } from '@/shared/api/parse-json'
import { badRequest, notFound, ok, serverError, unauthorized } from '@/shared/api/responses'
import { bioSchema, goalSchema, nameSchema } from '@/features/account-form/model/types'

const PUBLIC_PROJECTION = '-email -providers -__v'

const updateUserSchema = z
  .object({
    name: nameSchema.optional(),
    image: z.string().url().optional(),
    bio: bioSchema.optional(),
    pronoun: z.string().max(30).optional(),
    country: z.string().length(2).toUpperCase().refine(hasFlag, 'Invalid country code').optional(),
    goal: goalSchema.optional()
  })
  .strict()

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = (await params).id
    if (!userId) return badRequest('ID is required')

    const session = await auth()
    if (!session || session.user.id !== userId) return unauthorized()

    const body = await parseJsonBody(request, updateUserSchema)
    if (body instanceof Response) return body

    await connectDB()

    const updatedUser = await User.findOneAndUpdate({ _id: userId }, body, { returnDocument: 'after' })
      .select(PUBLIC_PROJECTION)
      .lean()

    await userProfileCache.invalidate(userId)

    return ok(updatedUser)
  } catch (error) {
    return serverError('users/[id]:PATCH', error)
  }
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = (await params).id

    if (!userId) return badRequest('ID is required')

    const cached = await userProfileCache.get(userId)
    if (cached) return ok(cached)

    await connectDB()
    const user = await User.findById(userId).select(PUBLIC_PROJECTION).lean()

    if (!user) return notFound('User not found')

    const granted = await UserAchievement.find({ userId: user._id }, { key: 1, _id: 0 }).lean<{ key: string }[]>()

    const profile = { ...user, grantedAchievements: granted.map((a) => a.key) } as unknown as UserProfile
    await userProfileCache.set(userId, profile)

    return ok(profile)
  } catch (error) {
    return serverError('users/[id]:GET', error)
  }
}
