import type { ComponentType } from 'react'
import { Globe } from 'lucide-react'
import type { SocialPlatform } from '@/shared/lib/profile-links'
import type { BrandIconProps } from '@/shared/ui/brand-icons/brand-icon-props'
import { InstagramIcon } from '@/shared/ui/brand-icons/InstagramIcon'
import { YoutubeIcon } from '@/shared/ui/brand-icons/YoutubeIcon'
import { TiktokIcon } from '@/shared/ui/brand-icons/TiktokIcon'
import { TwitchIcon } from '@/shared/ui/brand-icons/TwitchIcon'

const PLATFORM_ICONS: Record<SocialPlatform, ComponentType<BrandIconProps>> = {
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  tiktok: TiktokIcon,
  twitch: TwitchIcon
}

export function PlatformIcon({ platform, branded, ...props }: BrandIconProps & { platform: SocialPlatform | null }) {
  if (!platform) return <Globe aria-hidden {...props} />
  const Icon = PLATFORM_ICONS[platform]
  return <Icon branded={branded} {...props} />
}
