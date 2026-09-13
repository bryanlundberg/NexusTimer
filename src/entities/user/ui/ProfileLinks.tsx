import type { CSSProperties } from 'react'
import { parseProfileLink } from '@/shared/lib/profile-links'
import { PLATFORM_ACCENTS, PLATFORM_LABELS } from '@/shared/const/platform-brand'
import { PlatformIcon } from '@/shared/ui/brand-icons/PlatformIcon'
import { cn } from '@/shared/lib/utils'

interface ProfileLinksProps {
  links?: string[]
  className?: string
}

export function ProfileLinks({ links, className }: ProfileLinksProps) {
  const parsed = (links ?? []).map(parseProfileLink).filter((link) => link !== null)
  if (!parsed.length) return null

  return (
    <ul className={cn('flex flex-wrap items-center gap-2', className)}>
      {parsed.map(({ href, host, platform, handle }) => {
        const label = platform ? [PLATFORM_LABELS[platform], handle].filter(Boolean).join(' ') : host

        return (
          <li key={href}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer nofollow ugc"
              aria-label={label}
              title={label}
              data-brand
              style={{ '--brand': platform ? PLATFORM_ACCENTS[platform] : 'var(--primary)' } as CSSProperties}
              className={cn(
                'btn-notch btn-notch-border relative inline-flex h-9 items-center justify-center gap-2 text-sm font-medium outline-none transition-colors duration-(--dur-fast) [&_svg]:transition-transform [&_svg]:duration-150 hover:[&_svg]:scale-110 focus-visible:[&_svg]:scale-110 motion-reduce:[&_svg]:transition-none',
                platform
                  ? 'w-9 text-foreground'
                  : 'max-w-52 px-3 text-muted-foreground hover:text-(--brand) focus-visible:text-(--brand)'
              )}
            >
              <PlatformIcon platform={platform} branded className="size-4 shrink-0" />
              {!platform && <span className="truncate">{host}</span>}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
