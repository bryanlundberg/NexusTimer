import connectDB from '@/shared/config/mongodb/mongodb'
import { requireUser } from '@/shared/api/require-user'
import { ok, serverError } from '@/shared/api/responses'
import { getFriendsRanking } from '@/features/friends/server/friends-ranking'

export async function GET() {
  try {
    const userId = await requireUser()
    if (userId instanceof Response) return userId

    await connectDB()

    return ok(await getFriendsRanking(userId))
  } catch (error) {
    return serverError('friends/ranking:GET', error)
  }
}
