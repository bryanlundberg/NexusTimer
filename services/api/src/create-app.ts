import { Hono } from 'hono'
import type { Env } from './config/env'
import { edgeGuard } from './http/edge-guard'
import { handleError, handleNotFound } from './http/errors'
import { requestId } from './http/request-id'
import { requestLogger } from './http/request-logger'
import { requireUser, type SessionReader } from './http/require-user'
import type { AppEnv } from './http/types'
import { authRoutes, type AuthServices } from './modules/auth/auth.routes'
import { healthRoutes, type HealthChecks } from './modules/health/health.routes'
import { realtimeRoutes } from './modules/realtime/realtime.routes'

export type AppDeps = {
  env: Env
  checks: HealthChecks
  sessions: SessionReader
  auth: AuthServices
}

const PUBLIC_PATHS = ['/api/health']

export function createApp({ env, checks, sessions, auth }: AppDeps) {
  const app = new Hono<AppEnv>().basePath('/api')
  const signedIn = requireUser(sessions)

  app.use(requestId())
  app.use(requestLogger())
  app.use(edgeGuard(env.EDGE_SECRET, PUBLIC_PATHS))

  app.route('/health', healthRoutes(checks))
  app.route('/', authRoutes(auth))
  app.route('/v1/realtime', realtimeRoutes({ url: env.REALTIME_URL, secret: env.REALTIME_SECRET }, signedIn))

  app.notFound(handleNotFound)
  app.onError(handleError)
  return app
}
