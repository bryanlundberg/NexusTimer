import { requireUser } from './require-user'
import { badRequest } from './responses'
import { objectIdSchema } from './zod-helpers'

export type UserIdParams = { params: Promise<{ userId: string }> }

/**
 * Resolves the signed-in user and the `[userId]` route param, or a 400/401 response.
 * Use: `const ids = await requireUserPair(context); if (ids instanceof Response) return ids`
 */
export async function requireUserPair({ params }: UserIdParams) {
  const userId = await requireUser()
  if (userId instanceof Response) return userId

  const otherId = (await params).userId
  if (!objectIdSchema.safeParse(otherId).success) return badRequest('Invalid user id')
  if (otherId === userId) return badRequest('Cannot target yourself')

  return { userId, otherId }
}
