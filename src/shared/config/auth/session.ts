import { headers } from 'next/headers'
import { auth } from '@/shared/config/auth/auth'

export async function getSession() {
  return auth.api.getSession({ headers: await headers() })
}
