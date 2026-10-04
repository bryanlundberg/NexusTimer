const WCA_BASE = 'https://www.worldcubeassociation.org'
const REQUEST_TIMEOUT_MS = 10_000

export type WcaProfile = { wcaId: string | null }

export type WcaClient = {
  configured: boolean
  authorizeUrl(redirectUri: string, state: string): string
  /** The access token, or `null` when WCA refuses the code. */
  exchangeCode(code: string, redirectUri: string): Promise<string | null>
  /** `null` when the profile cannot be read; `wcaId: null` for an account without a WCA ID. */
  profile(accessToken: string): Promise<WcaProfile | null>
}

export type WcaConfig = { clientId?: string; clientSecret?: string; fetch?: typeof fetch }

export function createWcaClient({ clientId, clientSecret, fetch: request = fetch }: WcaConfig): WcaClient {
  return {
    configured: !!clientId && !!clientSecret,

    authorizeUrl(redirectUri, state) {
      const url = new URL('/oauth/authorize', WCA_BASE)
      url.searchParams.set('client_id', clientId ?? '')
      url.searchParams.set('redirect_uri', redirectUri)
      url.searchParams.set('response_type', 'code')
      url.searchParams.set('scope', 'public')
      url.searchParams.set('state', state)
      return url.toString()
    },

    async exchangeCode(code, redirectUri) {
      const res = await request(`${WCA_BASE}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: redirectUri
        }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
      })
      if (!res.ok) return null
      const { access_token: accessToken } = (await res.json()) as { access_token?: string }
      return accessToken || null
    },

    async profile(accessToken) {
      const res = await request(`${WCA_BASE}/api/v0/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
      })
      if (!res.ok) return null
      const data = (await res.json()) as { me?: { wca_id?: string | null } }
      return { wcaId: data?.me?.wca_id || null }
    }
  }
}
