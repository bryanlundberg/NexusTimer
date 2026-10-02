import { toNextJsHandler } from 'better-auth/next-js'
import { auth } from '@/shared/config/auth/auth'

export const { GET, POST } = toNextJsHandler(auth)
