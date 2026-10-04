import { createSign } from 'node:crypto'

const GITHUB_API = 'https://api.github.com'
const GITHUB_HEADERS = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }
const TOKEN_REFRESH_MARGIN_MS = 60_000

export type GithubIssue = { html_url: string; number: number }

export type Github = {
  createIssue(issue: { title: string; body: string }): Promise<GithubIssue>
}

export type GithubConfig = {
  appId?: string
  privateKey?: string
  installationId?: string
  repo: string
  fetch?: typeof fetch
  now?: () => number
}

const base64url = (input: Buffer | string) => Buffer.from(input).toString('base64url')

function createAppJwt(appId: string, privateKey: string, nowMs: number) {
  const now = Math.floor(nowMs / 1000)
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const payload = base64url(JSON.stringify({ iat: now - 60, exp: now + 9 * 60, iss: appId }))
  const data = `${header}.${payload}`
  const signature = createSign('RSA-SHA256').update(data).sign(privateKey)
  return `${data}.${base64url(signature)}`
}

export function createGithub({
  appId,
  privateKey,
  installationId,
  repo,
  fetch: request = fetch,
  now = () => Date.now()
}: GithubConfig): Github {
  // Hosts often store the PEM on one line with literal \n.
  const pem = privateKey?.replace(/\\n/g, '\n')
  let cached: { token: string; expiresAt: number } | null = null

  async function installationToken() {
    if (!appId || !pem || !installationId) throw new Error('GitHub App environment variables are not configured')
    if (cached && cached.expiresAt - TOKEN_REFRESH_MARGIN_MS > now()) return cached.token

    const res = await request(`${GITHUB_API}/app/installations/${installationId}/access_tokens`, {
      method: 'POST',
      headers: { ...GITHUB_HEADERS, Authorization: `Bearer ${createAppJwt(appId, pem, now())}` }
    })
    if (!res.ok) throw new Error(`Failed to get installation token: ${res.status} ${await res.text()}`)

    const data = (await res.json()) as { token: string; expires_at: string }
    cached = { token: data.token, expiresAt: new Date(data.expires_at).getTime() }
    return data.token
  }

  return {
    async createIssue({ title, body }) {
      const token = await installationToken()
      const res = await request(`${GITHUB_API}/repos/${repo}/issues`, {
        method: 'POST',
        headers: { ...GITHUB_HEADERS, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body })
      })
      if (!res.ok) throw new Error(`Failed to create issue: ${res.status} ${await res.text()}`)
      return (await res.json()) as GithubIssue
    }
  }
}
