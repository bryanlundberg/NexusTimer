import { auth } from '@/shared/config/auth/auth'
import { unauthorized } from './responses'

/**
 * Returns the authenticated user's id, or a 401 NextResponse if there is no session.
 * Use: `const userId = await requireUser(); if (userId instanceof Response) return userId`
 */
export async function requireUser() {
  const session = await auth()
  if (!session?.user?.id) return unauthorized()
  return session.user.id
}
