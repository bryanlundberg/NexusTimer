import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { isAPIError } from 'better-auth/api'
import { nextCookies } from 'better-auth/next-js'
import { createHash } from 'crypto'
import { authDb, authMongoClient } from '@/shared/config/mongodb/auth-db'
import connectDB from '@/shared/config/mongodb/mongodb'
import Log, { LogType } from '@/entities/log/model/log'
import { defaultAvatarUrl } from '@/entities/user/lib/default-avatar'
import { hashPassword, verifyPassword } from '@/shared/config/auth/password'
import { DevAuthPlugins } from '@/shared/config/auth/dev-provider'
import { DEV_LOGIN_PATH } from '@/shared/config/auth/constants'
import { sendWelcomeEmailInBackground } from '@/features/authentication/server/welcome-email'

const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60
const SESSION_REFRESH_AGE_SECONDS = 24 * 60 * 60
const SESSION_COOKIE_CACHE_SECONDS = 5 * 60
const MAX_PASSWORD_LENGTH = 72

function hashIp(ip: string | null | undefined) {
  return ip ? createHash('sha256').update(ip).digest('hex') : undefined
}

async function logAuthError(error: unknown) {
  if (isAPIError(error) && error.statusCode < 500) return
  console.error('Auth error:', error)
  try {
    await connectDB()
    await Log.create({
      type: LogType.AuthError,
      message: error instanceof Error ? error.message : String(error),
      metadata: { stack: error instanceof Error ? error.stack : undefined }
    })
  } catch (logErr) {
    console.error('Failed to write log:', logErr)
  }
}

// Session options are copied in services/api/src/infra/auth.ts; change both together.
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
    modelName: 'accounts',
    accountLinking: { enabled: true, trustedProviders: ['google'] }
  },
  verification: {
    modelName: 'verifications'
  },
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    maxPasswordLength: MAX_PASSWORD_LENGTH,
    password: { hash: hashPassword, verify: verifyPassword }
  },
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string
    },
    discord: {
      clientId: process.env.AUTH_DISCORD_ID as string,
      clientSecret: process.env.AUTH_DISCORD_SECRET as string
    }
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({ data: { ...user, image: user.image || defaultAvatarUrl(user.name) } }),
        after: async (user, ctx) => {
          if (ctx?.path === DEV_LOGIN_PATH) return
          sendWelcomeEmailInBackground({ email: user.email, name: user.name })
        }
      }
    },
    session: {
      create: {
        before: async (session) => ({ data: { ...session, ipAddress: null, ipHash: hashIp(session.ipAddress) } })
      }
    }
  },
  onAPIError: {
    errorURL: '/sign-in',
    onError: logAuthError
  },
  plugins: [...DevAuthPlugins, nextCookies()]
})

export type AuthSession = typeof auth.$Infer.Session
