import { requireUser } from './require-user'
import { badRequest } from './responses'
import { objectIdSchema } from './zod-helpers'

export type UserIdParams = { params: Promise<{ userId: string }> }

export async function requireUserPair({ params }: UserIdParams) {
  const userId = await requireUser()
  if (userId instanceof Response) return userId

  const otherId = (await params).userId
  if (!objectIdSchema.safeParse(otherId).success) return badRequest('Invalid user id')
  if (otherId === userId) return badRequest('Cannot target yourself')

  return { userId, otherId }
}
