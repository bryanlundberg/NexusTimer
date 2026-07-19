import crypto from 'node:crypto'

const GITHUB_API = 'https://api.github.com'

function base64url(input: Buffer | string) {
  return Buffer.from(input).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function createAppJwt(appId: string, privateKey: string) {
  const now = Math.floor(Date.now() / 1000)
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const payload = base64url(JSON.stringify({ iat: now - 60, exp: now + 9 * 60, iss: appId }))
  const data = `${header}.${payload}`
  const signature = crypto.createSign('RSA-SHA256').update(data).sign(privateKey)
  return `${data}.${base64url(signature)}`
}

let cachedToken: { token: string; expiresAt: number } | null = null

async function getInstallationToken(): Promise<string> {
  const appId = process.env.GITHUB_APP_ID
  const privateKey = process.env.GITHUB_APP_PRIVATE_KEY?.replace(/\\n/g, '\n')
  const installationId = process.env.GITHUB_APP_INSTALLATION_ID

  if (!appId || !privateKey || !installationId) {
    throw new Error('GitHub App environment variables are not configured')
  }

  if (cachedToken && cachedToken.expiresAt - 60_000 > Date.now()) {
    return cachedToken.token
  }

  const jwt = createAppJwt(appId, privateKey)
  const res = await fetch(`${GITHUB_API}/app/installations/${installationId}/access_tokens`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jwt}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })

  if (!res.ok) {
    throw new Error(`Failed to get installation token: ${res.status} ${await res.text()}`)
  }

  const data = (await res.json()) as { token: string; expires_at: string }
  cachedToken = { token: data.token, expiresAt: new Date(data.expires_at).getTime() }
  return data.token
}

type CreateIssueParams = {
  title: string
  body: string
}

export async function createGithubIssue({ title, body }: CreateIssueParams) {
  const repo = process.env.GITHUB_REPO || 'bryanlundberg/NexusTimer'
  const token = await getInstallationToken()

  const res = await fetch(`${GITHUB_API}/repos/${repo}/issues`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title, body })
  })

  if (!res.ok) {
    throw new Error(`Failed to create issue: ${res.status} ${await res.text()}`)
  }

  return (await res.json()) as { html_url: string; number: number }
}
