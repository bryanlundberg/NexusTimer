import type { Env } from '../src/config/env'
import { createApp } from '../src/create-app'
import type { SessionReader } from '../src/http/require-user'
import type { HealthChecks } from '../src/modules/health/health.routes'

export const TEST_EDGE_SECRET = 'test-edge-secret-0123456789abcdef'

export function testEnv(overrides: Partial<Env> = {}): Env {
  return {
    NODE_ENV: 'test',
    PORT: 4000,
    MONGODB_URI: 'mongodb://localhost:27017/test',
    REDIS_URL: 'redis://localhost:6379',
    EDGE_SECRET: undefined,
    BETTER_AUTH_SECRET: 'test-better-auth-secret',
    BETTER_AUTH_URL: 'http://localhost:3000',
    REALTIME_URL: undefined,
    REALTIME_SECRET: undefined,
    ...overrides
  }
}

export function testSessions(userId: string | null = null, setCookies: string[] = []): SessionReader {
  return () => {
    const headers = new Headers()
    for (const cookie of setCookies) headers.append('set-cookie', cookie)
    return Promise.resolve({ userId, headers })
  }
}

const passing = () => Promise.resolve()

export function buildTestApp({
  env = testEnv(),
  checks,
  sessions = testSessions()
}: { env?: Env; checks?: HealthChecks; sessions?: SessionReader } = {}) {
  return createApp({ env, checks: checks ?? { mongo: passing, redis: passing }, sessions })
}
