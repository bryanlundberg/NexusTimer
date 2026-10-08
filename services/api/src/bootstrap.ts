import { getEnv } from './config/env'
import { createApp } from './create-app'
import { createGithub } from './infra/github'
import { createMailers } from './infra/mail'
import { pingMongo, startMongo } from './infra/mongo'
import { createRealtimePublisher } from './infra/realtime'
import { getRedis, pingRedis } from './infra/redis'
import { createSearchAdmin, createSearchEngine } from './infra/search'
import { createStorage } from './infra/storage'
import { createWcaClient } from './infra/wca'
import { runInBackground } from './platform/background'
import { createSuggestionLimits } from './modules/algorithms/suggestions.limits'
import { createSuggestionsService } from './modules/algorithms/suggestions.service'
import { createAuthProvider, createSessionReader } from './modules/auth/auth'
import { createAccountStore } from './modules/auth/auth.accounts'
import { createAuthLimits } from './modules/auth/auth.limits'
import {
  authRepository,
  legacyCredentialsUserData,
  legacyEmailVerificationsUserData,
  legacySessionsUserData,
  passwordResetTokensUserData,
  pendingRegistrationsUserData
} from './modules/auth/auth.repository'
import { hashPassword } from './modules/auth/password'
import { createAvatarsService } from './modules/avatars/avatars.service'
import { createBackupsService } from './modules/backups/backups.service'
import { chatsRepository } from './modules/chats/chats.repository'
import { createChatsService } from './modules/chats/chats.service'
import { feedbackRepository, feedbackUserData } from './modules/feedback/feedback.repository'
import { createFeedbackService } from './modules/feedback/feedback.service'
import { recordLog } from './modules/logs/logs.service'
import { createPasswordResetService } from './modules/auth/password-reset.service'
import { createRegistrationService } from './modules/auth/registration.service'
import { createProfilesService } from './modules/profiles/profiles.service'
import { createPresenceStore } from './modules/realtime/presence.store'
import { createRoomLobby } from './modules/rooms/lobby.store'
import { generateScrambles } from './modules/rooms/scrambles.service'
import { createSearchService } from './modules/search/search.service'
import { createSharedSolvesCache } from './modules/shared-solves/shared-solves.cache'
import { createShareQuota } from './modules/shared-solves/shared-solves.quota'
import { sharedSolvesRepository, sharedSolvesUserData } from './modules/shared-solves/shared-solves.repository'
import { createSharedSolvesService } from './modules/shared-solves/shared-solves.service'
import { createRarityCache } from './modules/achievements/achievements.cache'
import { createAchievementsService } from './modules/achievements/achievements.service'
import { createAdminService } from './modules/admin/admin.service'
import { productsRepository } from './modules/products/products.repository'
import { createProductsService } from './modules/products/products.service'
import { achievementsRepository } from './modules/achievements/achievements.repository'
import { blocksRepository } from './modules/social/blocks.repository'
import { createBlocksService } from './modules/social/blocks.service'
import { createFriendRequestLimits } from './modules/social/friend-requests.limits'
import { createFriendsCache } from './modules/social/friends.cache'
import { friendsRepository } from './modules/social/friends.repository'
import { createFriendsService } from './modules/social/friends.service'
import { createSocialService } from './modules/social/social.service'
import { createLeaderboardCache } from './modules/solves/leaderboards.cache'
import { createLeaderboardsService } from './modules/solves/leaderboards.service'
import { solvesRepository, solvesUserData } from './modules/solves/solves.repository'
import { createSolvesService } from './modules/solves/solves.service'
import { createLearnedCache, createSolvesCache } from './modules/trainer/trainer.cache'
import {
  trainerLearnedUserData,
  trainerRepository,
  trainerSolvesUserData,
  trainerStatsUserData
} from './modules/trainer/trainer.repository'
import { createTrainerService } from './modules/trainer/trainer.service'
import { createProfileCache, createStatsCache } from './modules/users/users.cache'
import { userStatsUserData, usersRepository } from './modules/users/users.repository'
import { createUsersService } from './modules/users/users.service'
import { createWcaService } from './modules/wca/wca.service'

export function buildApp() {
  const env = getEnv()
  startMongo(env.MONGODB_URI)

  const redis = () => getRedis(env.REDIS_URL)
  const mail = createMailers({ resend: env.RESEND_API_KEY, brevo: env.BREVO_API_KEY })
  const appUrl = new URL(env.BETTER_AUTH_URL).origin
  const realtime = createRealtimePublisher(redis)
  const storage = createStorage({
    bucket: env.FILES_BUCKET,
    accessKeyId: env.FILES_ACCESS_KEY_ID,
    secretAccessKey: env.FILES_SECRET_ACCESS_KEY,
    publicBaseUrl: env.FILES_PUBLIC_BASE_URL,
    region: env.FILES_REGION,
    emulator: env.FILES_EMULATOR,
    endpoint: env.FILES_ENDPOINT
  })
  const getAuth = createAuthProvider(env, mail)
  const accounts = createAccountStore(getAuth)
  const achievements = createAchievementsService(achievementsRepository, createRarityCache(redis))
  const presence = createPresenceStore(redis, realtime)
  const users = createUsersService({
    repository: usersRepository,
    profileCache: createProfileCache(redis),
    statsCache: createStatsCache(redis),
    achievements
  })
  const friendsCache = createFriendsCache(redis)
  const social = createSocialService({ blocks: blocksRepository, friends: friendsRepository, friendsCache })
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
        appUrl
      }),
      limits: createAuthLimits(redis)
    },
    leaderboards: createLeaderboardsService({
      solves: solvesRepository,
      users,
      cache: createLeaderboardCache(redis)
    }),
    search: createSearchService(createSearchEngine({ host: env.MEILISEARCH_HOST, apiKey: env.MEILISEARCH_API_KEY })),
    trainer,
    sharedSolves,
    profiles: createProfilesService({ users, social, trainer, sharedSolves }),
    friends: createFriendsService({
      repository: friendsRepository,
      cache: friendsCache,
      limits: createFriendRequestLimits(redis),
      social,
      users,
      realtime,
      mail: mail.brevo,
      appUrl,
      background: runInBackground
    }),
    blocks: createBlocksService({
      repository: blocksRepository,
      friendships: friendsRepository,
      friendsCache,
      users,
      realtime
    }),
    privacy: users,
    presence,
    chats: createChatsService({ repository: chatsRepository, social, users, realtime }),
    backups: createBackupsService({ storage, users, background: runInBackground }),
    avatars: createAvatarsService({ storage, users }),
    feedback: createFeedbackService({
      repository: feedbackRepository,
      users,
      mail: mail.brevo,
      adminEmail: env.ADMIN_EMAIL,
      log: recordLog,
      background: runInBackground
    }),
    suggestions: createSuggestionsService({
      github: createGithub({
        appId: env.GITHUB_APP_ID,
        privateKey: env.GITHUB_APP_PRIVATE_KEY,
        installationId: env.GITHUB_APP_INSTALLATION_ID,
        repo: env.GITHUB_REPO
      }),
      limits: createSuggestionLimits(redis)
    }),
    roomLobby: createRoomLobby(redis),
    scrambles: generateScrambles,
    wca: createWcaService({
      wca: createWcaClient({ clientId: env.WCA_CLIENT_ID, clientSecret: env.WCA_CLIENT_SECRET }),
      users,
      appUrl
    }),
    solves: createSolvesService({ repository: solvesRepository }),
    admin: createAdminService({
      users,
      achievements,
      userData: {
        solves: solvesUserData,
        sharedSolves: sharedSolvesUserData,
        trainerSolves: trainerSolvesUserData,
        trainerLearned: trainerLearnedUserData,
        trainerStats: trainerStatsUserData,
        userStats: userStatsUserData,
        feedback: feedbackUserData,
        credentials: legacyCredentialsUserData,
        emailVerifications: legacyEmailVerificationsUserData,
        passwordResetTokens: passwordResetTokensUserData,
        pendingRegistrations: pendingRegistrationsUserData,
        sessions: legacySessionsUserData
      },
      accounts,
      storage,
      presence,
      sharedSolves
    }),
    products: createProductsService({
      repository: productsRepository,
      search: createSearchAdmin({ host: env.MEILISEARCH_HOST, apiKey: env.MEILISEARCH_API_KEY })
    })
  })
  return { env, app }
}
