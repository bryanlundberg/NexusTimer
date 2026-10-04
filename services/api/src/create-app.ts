import { Hono } from 'hono'
import type { Env } from './config/env'
import { edgeGuard } from './http/edge-guard'
import { handleError, handleNotFound } from './http/errors'
import { requestId } from './http/request-id'
import { requestLogger } from './http/request-logger'
import type { AppEnv } from './http/types'
import { healthRoutes, type HealthChecks } from './modules/health/health.routes'

export type AppDeps = {
  env: Env
  checks: HealthChecks
}

export function createApp({ env, checks }: AppDeps) {
  const app = new Hono<AppEnv>().basePath('/api')

  app.use(requestId())
  app.use(requestLogger())
  app.use(edgeGuard(env.EDGE_SECRET))

  app.route('/health', healthRoutes(checks))

  app.notFound(handleNotFound)
  app.onError(handleError)
  return app
}
