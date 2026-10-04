import type { Env } from '../src/config/env'
import { createApp } from '../src/create-app'
import type { SessionReader } from '../src/http/require-user'
import type { AuthServices } from '../src/modules/auth/auth.routes'
import type { HealthChecks } from '../src/modules/health/health.routes'
import type { LeaderboardsService } from '../src/modules/solves/leaderboards.service'

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
    AUTH_GOOGLE_ID: undefined,
    AUTH_GOOGLE_SECRET: undefined,
    AUTH_DISCORD_ID: undefined,
    AUTH_DISCORD_SECRET: undefined,
    RESEND_API_KEY: undefined,
    BREVO_API_KEY: undefined,
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

const unused = () => Promise.reject(new Error('not used in this test'))

export function testAuthServices(overrides: Partial<AuthServices> = {}): AuthServices {
  return {
    handler: () => Promise.resolve(new Response(null, { status: 204 })),
    registration: { register: unused, resendCode: unused, confirm: unused },
    passwordReset: { request: unused, validate: unused, reset: unused },
    ...overrides
  }
}

const passing = () => Promise.resolve()

type TestAppDeps = {
  env?: Env
  checks?: HealthChecks
  sessions?: SessionReader
  auth?: AuthServices
  leaderboards?: LeaderboardsService
}

export function buildTestApp({
  env = testEnv(),
  checks,
  sessions = testSessions(),
  auth = testAuthServices(),
  leaderboards = { get: unused }
}: TestAppDeps = {}) {
  return createApp({ env, checks: checks ?? { mongo: passing, redis: passing }, sessions, auth, leaderboards })
}
