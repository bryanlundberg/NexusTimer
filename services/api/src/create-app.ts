import { Hono } from 'hono'
import type { Env } from './config/env'
import { edgeGuard } from './http/edge-guard'
import { handleError, handleNotFound } from './http/errors'
import { requestId } from './http/request-id'
import { requestLogger } from './http/request-logger'
import { optionalUser, requireUser, type SessionReader } from './http/require-user'
import type { AppEnv } from './http/types'
import { authRoutes, type AuthServices } from './modules/auth/auth.routes'
import { healthRoutes, type HealthChecks } from './modules/health/health.routes'
import { profilesRoutes } from './modules/profiles/profiles.routes'
import type { ProfilesService } from './modules/profiles/profiles.service'
import { realtimeRoutes } from './modules/realtime/realtime.routes'
import { searchRoutes } from './modules/search/search.routes'
import type { SearchService } from './modules/search/search.service'
import { sharedSolvesRoutes } from './modules/shared-solves/shared-solves.routes'
import type { SharedSolvesService } from './modules/shared-solves/shared-solves.service'
import { leaderboardsRoutes } from './modules/solves/leaderboards.routes'
import type { LeaderboardsService } from './modules/solves/leaderboards.service'
import { trainerRoutes } from './modules/trainer/trainer.routes'
import type { TrainerService } from './modules/trainer/trainer.service'

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
  app.route('/v1/search', searchRoutes(deps.search))
  app.route('/v1/trainer', trainerRoutes(deps.trainer, signedIn))
  app.route('/v1/shared-solves', sharedSolvesRoutes(deps.sharedSolves, signedIn, viewer))
  app.route('/v1/users', profilesRoutes(deps.profiles, signedIn, viewer))

  app.notFound(handleNotFound)
  app.onError(handleError)
  return app
}
