import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import type { MongoClient } from 'mongodb'
import type { Env } from '../config/env'
import type { SessionReader } from '../http/require-user'
import { connectMongo } from './mongo'

const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60
const SESSION_REFRESH_AGE_SECONDS = 24 * 60 * 60
const SESSION_COOKIE_CACHE_SECONDS = 5 * 60

// Session options must match src/shared/config/auth/auth.ts while the web still reads sessions itself.
function createAuth(env: Env, client: MongoClient) {
  return betterAuth({
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    database: mongodbAdapter(client.db(), { client }),
    user: { modelName: 'users' },
    session: {
      modelName: 'auth_sessions',
      expiresIn: SESSION_MAX_AGE_SECONDS,
      updateAge: SESSION_REFRESH_AGE_SECONDS,
      cookieCache: { enabled: true, maxAge: SESSION_COOKIE_CACHE_SECONDS },
      additionalFields: {
        ipHash: { type: 'string', required: false, input: false, returned: false }
      }
    },
    account: { modelName: 'accounts' },
    verification: { modelName: 'verifications' }
  })
}

type Auth = ReturnType<typeof createAuth>

export function createSessionReader(env: Env): SessionReader {
  let pending: Promise<Auth> | undefined

  const getAuth = () =>
    (pending ??= connectMongo(env.MONGODB_URI)
      .then(({ connection }) => createAuth(env, connection.getClient()))
      .catch((error: unknown) => {
        pending = undefined
        throw error
      }))

  return async (headers) => {
    const auth = await getAuth()
    const result = await auth.api.getSession({ headers, returnHeaders: true })
    return { userId: result.response?.user.id ?? null, headers: result.headers }
  }
}
