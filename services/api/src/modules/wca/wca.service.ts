import { randomUUID } from 'node:crypto'
import type { WcaLinkStatus } from '@nexustimer/contracts'
import type { WcaClient } from '../../infra/wca'
import type { UsersService } from '../users/users.service'

export type WcaService = {
  /** Where to send the browser to authorize, or `null` when the WCA app is not configured. */
  start(): { url: string; state: string } | null
  link(userId: string, code: string): Promise<WcaLinkStatus>
  unlink(userId: string): Promise<void>
  resultUrl(status: WcaLinkStatus): string
}

type WcaDeps = {
  wca: WcaClient
  users: Pick<UsersService, 'setWca'>
  appUrl: string
  now?: () => number
  newState?: () => string
}

export function createWcaService({
  wca,
  users,
  appUrl,
  now = () => Date.now(),
  newState = randomUUID
}: WcaDeps): WcaService {
  const redirectUri = `${appUrl}/api/v1/wca/callback`

  return {
    start() {
      if (!wca.configured) return null
      const state = newState()
      return { url: wca.authorizeUrl(redirectUri, state), state }
    },

    async link(userId, code) {
      const accessToken = await wca.exchangeCode(code, redirectUri)
      if (!accessToken) return 'error'

      const profile = await wca.profile(accessToken)
      if (!profile) return 'error'
      if (!profile.wcaId) return 'no-id'

      const result = await users.setWca(userId, { wcaId: profile.wcaId, verifiedAt: now() })
      return result === 'taken' ? 'taken' : 'success'
    },

    async unlink(userId) {
      await users.setWca(userId, null)
    },

    resultUrl: (status) => `${appUrl}/account?tab=account&wca=${status}`
  }
}
