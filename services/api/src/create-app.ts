import { Hono } from 'hono'
import type { Env } from './config/env'
import { edgeGuard } from './http/edge-guard'
import { handleError, handleNotFound } from './http/errors'
import { requestId } from './http/request-id'
import { requestLogger } from './http/request-logger'
import { optionalUser, requireUser, type SessionReader } from './http/require-user'
import type { AppEnv } from './http/types'
import { suggestionsRoutes } from './modules/algorithms/suggestions.routes'
import type { SuggestionsService } from './modules/algorithms/suggestions.service'
import { authRoutes, type AuthServices } from './modules/auth/auth.routes'
import { avatarsRoutes } from './modules/avatars/avatars.routes'
import type { AvatarsService } from './modules/avatars/avatars.service'
import { backupsRoutes } from './modules/backups/backups.routes'
import type { BackupsService } from './modules/backups/backups.service'
import { chatsRoutes } from './modules/chats/chats.routes'
import type { ChatsService } from './modules/chats/chats.service'
import { feedbackRoutes } from './modules/feedback/feedback.routes'
import type { FeedbackService } from './modules/feedback/feedback.service'
import { healthRoutes, type HealthChecks } from './modules/health/health.routes'
import { profilesRoutes } from './modules/profiles/profiles.routes'
import type { ProfilesService } from './modules/profiles/profiles.service'
import { presenceRoutes } from './modules/realtime/presence.routes'
import type { PresenceStore } from './modules/realtime/presence.store'
import { realtimeRoutes } from './modules/realtime/realtime.routes'
import { roomsRoutes } from './modules/rooms/rooms.routes'
import type { RoomsService } from './modules/rooms/rooms.service'
import { searchRoutes } from './modules/search/search.routes'
import type { SearchService } from './modules/search/search.service'
import { sharedSolvesRoutes } from './modules/shared-solves/shared-solves.routes'
import type { SharedSolvesService } from './modules/shared-solves/shared-solves.service'
import type { BlocksService } from './modules/social/blocks.service'
import type { FriendsService } from './modules/social/friends.service'
import { blocksRoutes, friendsRoutes } from './modules/social/social.routes'
import { leaderboardsRoutes } from './modules/solves/leaderboards.routes'
import type { LeaderboardsService } from './modules/solves/leaderboards.service'
import { solvesRoutes } from './modules/solves/solves.routes'
import type { SolvesService } from './modules/solves/solves.service'
import { trainerRoutes } from './modules/trainer/trainer.routes'
import { wcaRoutes } from './modules/wca/wca.routes'
import type { WcaService } from './modules/wca/wca.service'
import type { TrainerService } from './modules/trainer/trainer.service'
import { type PrivacyService, privacyRoutes } from './modules/users/privacy.routes'

export type AppDeps = {
  env: Env
  checks: HealthChecks
  sessions: SessionReader
  auth: AuthServices
  leaderboards: LeaderboardsService
  search: SearchService
  trainer: TrainerService
  sharedSolves: SharedSolvesService
  profiles: ProfilesService
  friends: FriendsService
  blocks: BlocksService
  privacy: PrivacyService
  presence: PresenceStore
  chats: ChatsService
  backups: BackupsService
  avatars: AvatarsService
  feedback: FeedbackService
  suggestions: SuggestionsService
  rooms: RoomsService
  wca: WcaService
  solves: SolvesService
}

const PUBLIC_PATHS = ['/api/health']

export function createApp(deps: AppDeps) {
  const { env, sessions } = deps
  const app = new Hono<AppEnv>().basePath('/api')
  const signedIn = requireUser(sessions)
  const viewer = optionalUser(sessions)

  app.use(requestId())
  app.use(requestLogger())
  app.use(edgeGuard(env.EDGE_SECRET, PUBLIC_PATHS))

  app.route('/health', healthRoutes(deps.checks))
  app.route('/', authRoutes(deps.auth))
  app.route('/v1/realtime', realtimeRoutes({ url: env.REALTIME_URL, secret: env.REALTIME_SECRET }, signedIn))
  app.route('/v1/leaderboards', leaderboardsRoutes(deps.leaderboards))
  app.route('/v1/solves', solvesRoutes(deps.solves, signedIn))
  app.route('/v1/search', searchRoutes(deps.search))
  app.route('/v1/trainer', trainerRoutes(deps.trainer, signedIn))
  app.route('/v1/shared-solves', sharedSolvesRoutes(deps.sharedSolves, signedIn, viewer))
  app.route('/v1/users', avatarsRoutes(deps.avatars, signedIn))
  app.route('/v1/users', profilesRoutes(deps.profiles, signedIn, viewer))
  app.route('/v1/friends', friendsRoutes(deps.friends, signedIn))
  app.route('/v1/blocks', blocksRoutes(deps.blocks, signedIn))
  app.route('/v1/privacy', privacyRoutes(deps.privacy, signedIn))
  app.route('/v1/presence', presenceRoutes(deps.presence, signedIn))
  app.route('/v1/chats', chatsRoutes(deps.chats, signedIn))
  app.route('/v1/backups', backupsRoutes(deps.backups, signedIn))
  app.route('/v1/feedback', feedbackRoutes(deps.feedback, signedIn))
  app.route('/v1/algorithms/suggestions', suggestionsRoutes(deps.suggestions))
  app.route('/v1/rooms', roomsRoutes(deps.rooms))
  app.route('/v1/wca', wcaRoutes(deps.wca, { secureCookies: env.NODE_ENV === 'production' }, signedIn, viewer))

  app.notFound(handleNotFound)
  app.onError(handleError)
  return app
}
