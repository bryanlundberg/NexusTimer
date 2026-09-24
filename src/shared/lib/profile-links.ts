export const MAX_PROFILE_LINKS = 5
export const PROFILE_LINK_MAX_LENGTH = 200

export const SOCIAL_PLATFORMS = ['instagram', 'youtube', 'tiktok', 'twitch', 'cubeindex'] as const
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number]

const PLATFORM_DOMAINS: Record<SocialPlatform, string[]> = {
  instagram: ['instagram.com', 'instagr.am'],
  youtube: ['youtube.com', 'youtu.be'],
  tiktok: ['tiktok.com'],
  twitch: ['twitch.tv'],
  cubeindex: ['thecubeindex.com']
}

const NON_HANDLE_SEGMENTS = new Set([
  'p',
  'reel',
  'reels',
  'stories',
  'watch',
  'shorts',
  'channel',
  'c',
  'user',
  'video',
  'videos',
  'playlist',
  'embed',
  'live'
])

export interface ProfileLinkInfo {
  href: string
  host: string
  platform: SocialPlatform | null
  handle: string | null
}

export function normalizeProfileLink(input: string): string | null {
  const value = input.trim()
  if (!value || value.length > PROFILE_LINK_MAX_LENGTH || /\s/.test(value)) return null

  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(value)
  // `twitch.tv:443/x` parses as scheme "twitch.tv", real schemes never contain a dot.
  const looksLikeHost = hasScheme && !value.includes('://') && value.split(':')[0].includes('.')
  const candidate = hasScheme && !looksLikeHost ? value : `https://${value}`

  let url: URL
  try {
    url = new URL(candidate)
  } catch {
    return null
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
  if (url.username || url.password) return null
  if (!/^[^.]+(\.[^.]+)+$/.test(url.hostname)) return null

  return url.href
}

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export function parseProfileLink(href: string): ProfileLinkInfo | null {
  const normalized = normalizeProfileLink(href)
  if (!normalized) return null

  const url = new URL(normalized)
  const host = url.hostname.toLowerCase().replace(/^www\./, '')
  const platform =
    SOCIAL_PLATFORMS.find((id) =>
      PLATFORM_DOMAINS[id].some((domain) => host === domain || host.endsWith(`.${domain}`))
    ) ?? null

  let handle: string | null = null
  const segments = url.pathname.split('/').filter(Boolean)
  const segment = platform === 'cubeindex' ? (segments[0] === 'user' ? segments[1] : undefined) : segments[0]
  if (segment && platform) {
    const needsAt = platform === 'youtube' || platform === 'tiktok'
    const name = segment.replace(/^@/, '')
    if ((!needsAt || segment.startsWith('@')) && name && !NON_HANDLE_SEGMENTS.has(name.toLowerCase())) {
      handle = `@${safeDecode(name)}`
    }
  }

  return { href: normalized, host, platform, handle }
}
