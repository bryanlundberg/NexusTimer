import type { CSSProperties } from 'react'
import { parseProfileLink } from '@/shared/lib/profile-links'
import { PLATFORM_ACCENTS, PLATFORM_LABELS } from '@/shared/const/platform-brand'
import { PlatformIcon } from '@/shared/ui/brand-icons/PlatformIcon'
import { cn } from '@/shared/lib/utils'

interface ProfileLinksProps {
  links?: string[]
  size?: 'default' | 'sm'
  className?: string
}

export function ProfileLinks({ links, size = 'default', className }: ProfileLinksProps) {
  const parsed = (links ?? []).map(parseProfileLink).filter((link) => link !== null)
  if (!parsed.length) return null

  const small = size === 'sm'

  return (
    <ul className={cn('flex flex-wrap items-center', small ? 'gap-1.5' : 'gap-2', className)}>
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
                'relative inline-flex border bg-background hover:border-(--brand) hover:bg-[color-mix(in_oklab,var(--brand)_10%,var(--background))] focus-visible:border-(--brand) focus-visible:bg-[color-mix(in_oklab,var(--brand)_10%,var(--background))] items-center justify-center gap-2 font-medium outline-none transition-colors duration-(--dur-fast) [&_svg]:transition-transform [&_svg]:duration-150 hover:[&_svg]:scale-110 focus-visible:[&_svg]:scale-110 motion-reduce:[&_svg]:transition-none',
                small ? 'h-8 text-xs' : 'h-9 text-sm',
                platform
                  ? cn('text-foreground', small ? 'w-8' : 'w-9')
                  : cn(
                      'max-w-52 text-muted-foreground hover:text-(--brand) focus-visible:text-(--brand)',
                      small ? 'px-2.5' : 'px-3'
                    )
              )}
            >
              <PlatformIcon platform={platform} branded className={cn('shrink-0', small ? 'size-3.5' : 'size-4')} />
              {!platform && <span className="truncate">{host}</span>}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
