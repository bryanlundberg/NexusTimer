import connectDB from '@/shared/config/mongodb/mongodb'
import User from '@/entities/user/model/user'
import { userProfileCache } from '@/entities/user/model/user-cache'
import { auth } from '@/shared/config/auth/auth'
import { noContent, serverError, unauthorized } from '@/shared/api/responses'

export async function DELETE() {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()

    await connectDB()
    await User.findByIdAndUpdate(session.user.id, { $unset: { wcaId: 1, wcaVerifiedAt: 1 } })
    await userProfileCache.invalidate(session.user.id)

    return noContent()
  } catch (error) {
    return serverError('wca:DELETE', error)
  }
}
