import type { Env } from '../src/config/env'
import { type AppDeps, createApp } from '../src/create-app'
import type { SessionProfile, SessionReader } from '../src/http/require-user'
import type { AuthServices } from '../src/modules/auth/auth.routes'

export const TEST_EDGE_SECRET = 'test-edge-secret-0123456789abcdef'

export function testEnv(overrides: Partial<Env> = {}): Env {
  return {
    NODE_ENV: 'test',
    PORT: 4100,
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
    MEILISEARCH_HOST: undefined,
    MEILISEARCH_API_KEY: undefined,
    REALTIME_URL: undefined,
    REALTIME_SECRET: undefined,
    ADMIN_EMAIL: undefined,
    ADMIN_TOKEN: undefined,
    WCA_CLIENT_ID: undefined,
    WCA_CLIENT_SECRET: undefined,
    GITHUB_APP_ID: undefined,
    GITHUB_APP_PRIVATE_KEY: undefined,
    GITHUB_APP_INSTALLATION_ID: undefined,
    GITHUB_REPO: 'bryanlundberg/NexusTimer',
    FILES_BUCKET: undefined,
    FILES_ACCESS_KEY_ID: undefined,
    FILES_SECRET_ACCESS_KEY: undefined,
    FILES_PUBLIC_BASE_URL: undefined,
    FILES_REGION: undefined,
    FILES_EMULATOR: false,
    FILES_ENDPOINT: undefined,
    ...overrides
  }
}

export function testSessions(
  userId: string | null = null,
  setCookies: string[] = [],
  profile?: SessionProfile
): SessionReader {
  return () => {
    const headers = new Headers()
    for (const cookie of setCookies) headers.append('set-cookie', cookie)
    return Promise.resolve({ userId, profile, headers })
  }
}

const unused = () => Promise.reject(new Error('not used in this test'))

const allowed = () => Promise.resolve(true)

export function testAuthServices(overrides: Partial<AuthServices> = {}): AuthServices {
  return {
    handler: () => Promise.resolve(new Response(null, { status: 204 })),
    registration: { register: unused, confirm: unused },
    passwordReset: { request: unused, validate: unused, reset: unused },
    limits: { sendCode: allowed, sendReset: allowed, checkCode: allowed },
    ...overrides
  }
}

const passing = () => Promise.resolve()

export function buildTestApp(overrides: Partial<AppDeps> = {}) {
  return createApp({
    env: testEnv(),
    checks: { mongo: passing, redis: passing },
    sessions: testSessions(),
    auth: testAuthServices(),
    leaderboards: { get: unused },
    solves: { submit: unused },
    admin: {
      achievements: unused,
      grant: unused,
      revoke: unused,
      saveRarity: unused,
      userSummary: unused,
      deleteUser: unused
    },
    products: {
      index: unused,
      deleteIndex: unused,
      stats: unused,
      discover: unused,
      pending: unused,
      recordScrapes: unused,
      publish: unused
    },
    search: { search: unused },
    trainer: {
      learned: unused,
      setLearned: unused,
      solves: unused,
      recordSolve: unused,
      deleteSolve: unused,
      stats: unused,
      setTarget: unused,
      learnedSummary: unused
    },
    sharedSolves: {
      myIds: unused,
      share: unused,
      detail: unused,
      remove: unused,
      userPage: unused,
      forgetUser: unused
    },
    profiles: { list: unused, profile: unused, update: unused, learned: unused, stats: unused, sharedSolves: unused },
    friends: { list: unused, relationship: unused, request: unused, remove: unused },
    blocks: { list: unused, block: unused, unblock: unused },
    privacy: { privacy: unused, updatePrivacy: unused },
    presence: { setStatus: unused, clear: unused },
    chats: {
      inbox: unused,
      open: unused,
      find: unused,
      findMessage: unused,
      summary: unused,
      setMuted: unused,
      hide: unused,
      markRead: unused,
      markDelivered: unused,
      messages: unused,
      send: unused,
      clear: unused,
      edit: unused,
      deleteMessage: unused,
      react: unused
    },
    backups: { upload: unused, list: unused, remove: unused },
    avatars: { upload: unused },
    feedback: { submit: unused },
    suggestions: { allow: unused, suggest: unused },
    roomLobby: { list: unused },
    scrambles: async () => [],
    wca: {
      start: () => null,
      link: unused,
      unlink: unused,
      resultUrl: (status) => `http://localhost:3000/account?wca=${status}`
    },
    ...overrides
  })
}
