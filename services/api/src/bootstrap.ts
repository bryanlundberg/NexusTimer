import { getEnv } from './config/env'
import { createApp } from './create-app'
import { createMailers } from './infra/mail'
import { pingMongo, startMongo } from './infra/mongo'
import { getRedis, pingRedis } from './infra/redis'
import { createAuthProvider, createSessionReader } from './modules/auth/auth'
import { createAccountStore } from './modules/auth/auth.accounts'
import { authRepository } from './modules/auth/auth.repository'
import { hashPassword } from './modules/auth/password'
import { createPasswordResetService } from './modules/auth/password-reset.service'
import { createRegistrationService } from './modules/auth/registration.service'
import { createLeaderboardCache } from './modules/solves/leaderboards.cache'
import { createLeaderboardsService } from './modules/solves/leaderboards.service'
import { solvesRepository } from './modules/solves/solves.repository'
import { usersRepository } from './modules/users/users.repository'
import { createUsersService } from './modules/users/users.service'

export function buildApp() {
  const env = getEnv()
  startMongo(env.MONGODB_URI)

  const mail = createMailers({ resend: env.RESEND_API_KEY, brevo: env.BREVO_API_KEY })
  const getAuth = createAuthProvider(env, mail)
  const accounts = createAccountStore(getAuth)
  const users = createUsersService(usersRepository)

  const app = createApp({
    env,
    checks: {
      mongo: () => pingMongo(env.MONGODB_URI),
      redis: () => pingRedis(env.REDIS_URL)
    },
    sessions: createSessionReader(getAuth),
    auth: {
      handler: async (request) => (await getAuth()).handler(request),
      registration: createRegistrationService({
        accounts,
        repository: authRepository,
        mail: mail.resend,
        hashPassword
      }),
      passwordReset: createPasswordResetService({
        accounts,
        repository: authRepository,
        mail: mail.resend,
        hashPassword,
        appUrl: new URL(env.BETTER_AUTH_URL).origin
      })
    },
    leaderboards: createLeaderboardsService({
      solves: solvesRepository,
      users,
      cache: createLeaderboardCache(() => getRedis(env.REDIS_URL))
    })
  })
  return { env, app }
}
