import type { Env } from '../src/config/env'
import { createApp } from '../src/create-app'
import type { HealthChecks } from '../src/modules/health/health.routes'

export const TEST_EDGE_SECRET = 'test-edge-secret-0123456789abcdef'

export function testEnv(overrides: Partial<Env> = {}): Env {
  return {
    NODE_ENV: 'test',
    PORT: 4000,
    MONGODB_URI: 'mongodb://localhost:27017/test',
    REDIS_URL: 'redis://localhost:6379',
    EDGE_SECRET: undefined,
    ...overrides
  }
}

const passing = () => Promise.resolve()

export function buildTestApp({ env = testEnv(), checks }: { env?: Env; checks?: HealthChecks } = {}) {
  return createApp({ env, checks: checks ?? { mongo: passing, redis: passing } })
}
