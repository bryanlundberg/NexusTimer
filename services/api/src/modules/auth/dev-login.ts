import { DEV_LOGIN_PATH } from '@nexustimer/contracts'
import type { BetterAuthPlugin } from 'better-auth'
import { createAuthEndpoint } from 'better-auth/api'
import { setSessionCookie } from 'better-auth/cookies'

const DEV_USER = { email: 'dev@local.test', name: 'Dev User' }

export const devLogin = (): BetterAuthPlugin => ({
  id: 'dev-login',
  endpoints: {
    devLogin: createAuthEndpoint(DEV_LOGIN_PATH, { method: 'POST' }, async (ctx) => {
      const { internalAdapter } = ctx.context
      const existing = await internalAdapter.findUserByEmail(DEV_USER.email)
      const user =
        existing?.user ??
        (await internalAdapter.createUser({ ...DEV_USER, emailVerified: true }, { method: 'dev-login' }))
      const session = await internalAdapter.createSession(user.id)
      await setSessionCookie(ctx, { session, user })
      return ctx.json({ ok: true })
    })
  }
})
