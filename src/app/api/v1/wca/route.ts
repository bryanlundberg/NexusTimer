import connectDB from '@/shared/config/mongodb/mongodb'
import User from '@/entities/user/model/user'
import { auth } from '@/shared/config/auth/auth'
import { noContent, serverError, unauthorized } from '@/shared/api/responses'

export async function DELETE() {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()

    await connectDB()
    await User.findByIdAndUpdate(session.user.id, { $unset: { wcaId: 1, wcaVerifiedAt: 1 } })

    return noContent()
  } catch (error) {
    return serverError('wca:DELETE', error)
  }
}
