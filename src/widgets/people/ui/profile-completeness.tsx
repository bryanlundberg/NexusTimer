'use client'

import { Link } from '@/shared/config/i18n/navigation'
import { useTranslations } from 'next-intl'
import { Plus } from 'lucide-react'
import type { UserDocument } from '@/entities/user/model/user'
import { type CompletenessKey, getProfileCompleteness } from '@/entities/user/model/profile-completeness'
import { cn } from '@/shared/lib/utils'

const SLANT = 'polygon(0 0, calc(100% - 4px) 0, 100% 100%, 4px 100%)'

export function ProfileCompletenessBar({ user }: { user: UserDocument }) {
  const t = useTranslations('Index.ProfileCompleteness')
  const tAccount = useTranslations('Index.AccountPage')
  const tMethod = useTranslations('Index.CubingMethod')
  const tColors = useTranslations('Index.MainColors')

  const { percent, done, total, missing } = getProfileCompleteness(user)
  if (!missing.length) return null

  const labels: Record<CompletenessKey, string> = {
    bio: tAccount('bio'),
    pronoun: tAccount('pronoun'),
    country: tAccount('country'),
    goal: tAccount('goal'),
    method: tMethod('label'),
    mainColors: tColors('label')
  }

  return (
    <section
      aria-label={t('title', { percent })}
      className="w-full px-4 md:px-6 py-3 flex flex-col sm:flex-row sm:items-center gap-3 border-b border-border/40"
    >
      <div className="flex items-center gap-3 shrink-0">
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-label={t('title', { percent })}
          className="flex h-2 w-28 gap-0.5"
        >
          {Array.from({ length: total }, (_, i) => (
            <span
              key={i}
              className={cn(
                'h-full flex-1 origin-left',
                i < done
                  ? 'bg-primary [animation:lp-grow_320ms_cubic-bezier(0.16,1,0.3,1)_both] motion-reduce:animate-none'
                  : 'bg-muted-foreground/20'
              )}
              style={{ clipPath: SLANT, animationDelay: `${i * 50}ms` }}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold tabular-nums text-foreground">{percent}%</span> {t('complete')}
        </p>
      </div>

      <ul className="flex flex-wrap items-center gap-1.5">
        {missing.map(({ key, href }) => (
          <li key={key}>
            <Link
              href={href}
              className="badge-notch inline-flex h-6 items-center gap-1 bg-muted px-2 text-[11px] font-medium text-muted-foreground outline-none transition-colors hover:bg-primary/15 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <Plus className="size-3" aria-hidden />
              {labels[key]}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
