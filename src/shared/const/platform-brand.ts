import type { SocialPlatform } from '@/shared/lib/profile-links'

export const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  twitch: 'Twitch'
}

export const PLATFORM_ACCENTS: Record<SocialPlatform, string> = {
  instagram: '#C13584',
  youtube: '#FF0000',
  tiktok: '#25F4EE',
  twitch: '#9146FF'
}

export const platformTextColor = (platform: SocialPlatform) =>
  `color-mix(in oklab, ${PLATFORM_ACCENTS[platform]} 65%, var(--foreground))`
