import { NextRequest } from 'next/server'
import { auth } from '@/shared/config/auth/auth'
import connectDB from '@/shared/config/mongodb/mongodb'
import User from '@/entities/user/model/user'
import { userProfileCache } from '@/entities/user/model/user-cache'
import { files } from '@/shared/config/files'
import { badRequest, notFound, ok, serverError, unauthorized } from '@/shared/api/responses'

const MAX_AVATAR_BYTES = 2 * 1024 * 1024

const avatarKey = (userId: string) => `avatars/${userId}`

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) return badRequest('No file provided')
    if (file.size === 0) return badRequest('Empty file')
    if (file.size > MAX_AVATAR_BYTES) return badRequest('File too large')
    if (!file.type.startsWith('image/')) return badRequest('Invalid file type')

    const userId = session.user.id
    const key = avatarKey(userId)

    await files.upload(key, file, { contentType: file.type })

    const baseUrl = await files.url(key)
    const url = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}v=${Date.now()}`

    await connectDB()
    const user = await User.findByIdAndUpdate(userId, { image: url }, { new: true })
    if (!user) return notFound('User not found')

    await userProfileCache.invalidate(userId)

    return ok({ url, public_id: key })
  } catch (error) {
    return serverError('users/avatar:POST', error)
  }
}
