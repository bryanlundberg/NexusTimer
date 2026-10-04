import { getEnv } from './config/env'
import { createApp } from './create-app'
import { createMailers } from './infra/mail'
import { pingMongo, startMongo } from './infra/mongo'
import { getRedis, pingRedis } from './infra/redis'
import { createSearchEngine } from './infra/search'
import { createAuthProvider, createSessionReader } from './modules/auth/auth'
import { createAccountStore } from './modules/auth/auth.accounts'
import { authRepository } from './modules/auth/auth.repository'
import { hashPassword } from './modules/auth/password'
import { createPasswordResetService } from './modules/auth/password-reset.service'
import { createRegistrationService } from './modules/auth/registration.service'
import { createProfilesService } from './modules/profiles/profiles.service'
import { createSearchService } from './modules/search/search.service'
import { createSharedSolvesCache } from './modules/shared-solves/shared-solves.cache'
import { createShareQuota } from './modules/shared-solves/shared-solves.quota'
import { sharedSolvesRepository } from './modules/shared-solves/shared-solves.repository'
import { createSharedSolvesService } from './modules/shared-solves/shared-solves.service'
import { createAchievementsService } from './modules/achievements/achievements.service'
import { achievementsRepository } from './modules/achievements/achievements.repository'
import { blocksRepository } from './modules/social/blocks.repository'
import { createFriendsCache } from './modules/social/friends.cache'
import { friendsRepository } from './modules/social/friends.repository'
import { createSocialService } from './modules/social/social.service'
import { createLeaderboardCache } from './modules/solves/leaderboards.cache'
import { createLeaderboardsService } from './modules/solves/leaderboards.service'
import { solvesRepository } from './modules/solves/solves.repository'
import { createLearnedCache, createSolvesCache } from './modules/trainer/trainer.cache'
import { trainerRepository } from './modules/trainer/trainer.repository'
import { createTrainerService } from './modules/trainer/trainer.service'
import { createProfileCache, createStatsCache } from './modules/users/users.cache'
import { usersRepository } from './modules/users/users.repository'
import { createUsersService } from './modules/users/users.service'

export function buildApp() {
  const env = getEnv()
  startMongo(env.MONGODB_URI)

  const redis = () => getRedis(env.REDIS_URL)
  const mail = createMailers({ resend: env.RESEND_API_KEY, brevo: env.BREVO_API_KEY })
  const getAuth = createAuthProvider(env, mail)
  const accounts = createAccountStore(getAuth)
  const users = createUsersService({
    repository: usersRepository,
    profileCache: createProfileCache(redis),
    statsCache: createStatsCache(redis),
    achievements: createAchievementsService(achievementsRepository)
  })
  const social = createSocialService({
    blocks: blocksRepository,
    friends: friendsRepository,
    friendsCache: createFriendsCache(redis)
  })
  const trainer = createTrainerService({
    repository: trainerRepository,
    learnedCache: createLearnedCache(redis),
    solvesCache: createSolvesCache(redis)
  })
  const sharedSolves = createSharedSolvesService({
    repository: sharedSolvesRepository,
    cache: createSharedSolvesCache(redis),
    quota: createShareQuota(redis),
    users,
    social
  })

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
      cache: createLeaderboardCache(redis)
    }),
    search: createSearchService(createSearchEngine({ host: env.MEILISEARCH_HOST, apiKey: env.MEILISEARCH_API_KEY })),
    trainer,
    sharedSolves,
    profiles: createProfilesService({ users, social, trainer, sharedSolves })
  })
  return { env, app }
}
