import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { nextCookies } from 'better-auth/next-js'
import { authDb, authMongoClient } from '@/shared/config/mongodb/auth-db'

const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60
const SESSION_REFRESH_AGE_SECONDS = 24 * 60 * 60
const SESSION_COOKIE_CACHE_SECONDS = 5 * 60

// Reads the sessions issued by services/api; session options are copied there and change together.
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(authDb, { client: authMongoClient }),
  user: {
    modelName: 'users'
  },
  session: {
    modelName: 'auth_sessions',
    expiresIn: SESSION_MAX_AGE_SECONDS,
    updateAge: SESSION_REFRESH_AGE_SECONDS,
    cookieCache: { enabled: true, maxAge: SESSION_COOKIE_CACHE_SECONDS },
    additionalFields: {
      ipHash: { type: 'string', required: false, input: false, returned: false }
    }
  },
  account: {
    modelName: 'accounts'
  },
  verification: {
    modelName: 'verifications'
  },
  plugins: [nextCookies()]
})

export type AuthSession = typeof auth.$Infer.Session
