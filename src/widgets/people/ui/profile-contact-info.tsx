'use client'

import { type CSSProperties, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowUpRight } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { parseProfileLink } from '@/shared/lib/profile-links'
import { PLATFORM_ACCENTS, PLATFORM_LABELS } from '@/shared/const/platform-brand'
import { PlatformIcon } from '@/shared/ui/brand-icons/PlatformIcon'

interface Props {
  name: string
  links: string[]
}

const displayUrl = (href: string) => href.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

export function ProfileContactInfo({ name, links }: Props) {
  const t = useTranslations('Index.PeoplePage.hero')
  const [open, setOpen] = useState(false)
  const parsed = links.map(parseProfileLink).filter((link) => link !== null)

  if (!parsed.length) return null

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-semibold text-primary underline-offset-2 outline-none hover:underline focus-visible:underline"
      >
        {t('contact-info')}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('contact-info')}</DialogTitle>
            <DialogDescription>{t('contact-info-description', { name })}</DialogDescription>
          </DialogHeader>
          <ul className="flex flex-col gap-1">
            {parsed.map(({ href, host, platform, handle }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer nofollow ugc"
                  data-brand
                  style={{ '--brand': platform ? PLATFORM_ACCENTS[platform] : 'var(--primary)' } as CSSProperties}
                  className="group flex items-center gap-3 border border-transparent p-2 outline-none transition-colors duration-(--dur-fast) hover:border-border hover:bg-muted/40 focus-visible:border-(--brand)"
                >
                  <span className="grid size-9 shrink-0 place-items-center border bg-background transition-colors group-hover:border-(--brand)">
                    <PlatformIcon platform={platform} branded className="size-4" />
                  </span>
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-sm font-medium leading-none">
                      {platform ? PLATFORM_LABELS[platform] : host}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">{handle ?? displayUrl(href)}</span>
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="ml-auto size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                  />
                </a>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </>
  )
}
