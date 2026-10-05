import { createHash } from 'node:crypto'
import { AUTH_COOKIE_PREFIX, CLIENT_IP_HEADER, DEV_LOGIN_PATH } from '@nexustimer/contracts'
import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { isAPIError } from 'better-auth/api'
import type { MongoClient } from 'mongodb'
import type { Env } from '../../config/env'
import type { SessionReader } from '../../http/require-user'
import type { Mailers } from '../../infra/mail'
import { connectMongo } from '../../infra/mongo'
import { logger, serializeError } from '../../lib/logger'
import { runInBackground } from '../../platform/background'
import { recordLog } from '../logs/logs.service'
import { welcomeEmail } from './auth.emails'
import { devLogin } from './dev-login'
import { hashPassword, verifyPassword } from './password'

const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60
const SESSION_REFRESH_AGE_SECONDS = 24 * 60 * 60
const SESSION_COOKIE_CACHE_SECONDS = 5 * 60
const MAX_PASSWORD_LENGTH = 72

type AuthDeps = { env: Env; client: MongoClient; mail: Mailers }

function defaultAvatarUrl(name: string | null | undefined) {
  const encoded = (name ?? '').replace(/\s+/g, '+')
  return `https://ui-avatars.com/api/?name=${encoded}&background=random&size=128`
}

function hashIp(ip: string | null | undefined) {
  return ip ? createHash('sha256').update(ip).digest('hex') : undefined
}

function socialProviders(env: Env) {
  return {
    ...(env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET
      ? { google: { clientId: env.AUTH_GOOGLE_ID, clientSecret: env.AUTH_GOOGLE_SECRET } }
      : {}),
    ...(env.AUTH_DISCORD_ID && env.AUTH_DISCORD_SECRET
      ? { discord: { clientId: env.AUTH_DISCORD_ID, clientSecret: env.AUTH_DISCORD_SECRET } }
      : {})
  }
}

async function logAuthError(error: unknown) {
  if (isAPIError(error) && error.statusCode < 500) return
  logger.error('auth error', { error: serializeError(error) })
  await recordLog({
    type: 'auth_error',
    message: error instanceof Error ? error.message : String(error),
    metadata: { stack: error instanceof Error ? error.stack : undefined }
  })
}

function sendWelcomeEmail(mail: Mailers, email: string, name: string) {
  return runInBackground('welcome-email', async () => {
    try {
      await mail.brevo({ to: email, ...welcomeEmail({ name }) })
    } catch (error) {
      logger.error('welcome email failed', { error: serializeError(error) })
      await recordLog({
        type: 'api_error',
        message: error instanceof Error ? error.message : String(error),
        metadata: { source: 'welcome-email', email, stack: error instanceof Error ? error.stack : undefined }
      })
    }
  })
}

function createAuth({ env, client, mail }: AuthDeps) {
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
    account: {
      modelName: 'accounts',
      accountLinking: { enabled: true, trustedProviders: ['google'] }
    },
    verification: { modelName: 'verifications' },
    emailAndPassword: {
      enabled: true,
      disableSignUp: true,
      maxPasswordLength: MAX_PASSWORD_LENGTH,
      password: { hash: hashPassword, verify: verifyPassword }
    },
    socialProviders: socialProviders(env),
    databaseHooks: {
      user: {
        create: {
          before: async (user) => ({ data: { ...user, image: user.image || defaultAvatarUrl(user.name) } }),
          after: async (user, ctx) => {
            if (ctx?.path === DEV_LOGIN_PATH) return
            void sendWelcomeEmail(mail, user.email, user.name)
          }
        }
      },
      session: {
        create: {
          before: async (session) => ({ data: { ...session, ipAddress: null, ipHash: hashIp(session.ipAddress) } })
        }
      }
    },
    advanced: { cookiePrefix: AUTH_COOKIE_PREFIX, ipAddress: { ipAddressHeaders: [CLIENT_IP_HEADER] } },
    onAPIError: { errorURL: '/sign-in', onError: logAuthError },
    plugins: env.NODE_ENV === 'production' ? [] : [devLogin()]
  })
}

export type Auth = ReturnType<typeof createAuth>
export type AuthProvider = () => Promise<Auth>

export function createAuthProvider(env: Env, mail: Mailers): AuthProvider {
  let pending: Promise<Auth> | undefined

  return () =>
    (pending ??= connectMongo(env.MONGODB_URI)
      .then(({ connection }) => createAuth({ env, client: connection.getClient(), mail }))
      .catch((error: unknown) => {
        pending = undefined
        throw error
      }))
}

export function createSessionReader(getAuth: AuthProvider): SessionReader {
  return async (headers) => {
    const auth = await getAuth()
    const result = await auth.api.getSession({ headers, returnHeaders: true })
    return { userId: result.response?.user.id ?? null, headers: result.headers }
  }
}
