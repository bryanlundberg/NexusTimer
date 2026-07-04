'use client'

import PuzzleSwitch from '@/features/leaderboards/ui/PuzzleSwitch'
import { useTranslations } from 'next-intl'

interface LeaderboardHeroProps {
  value: string
  onChange: (value: string) => void
}

export default function LeaderboardHero({ value, onChange }: LeaderboardHeroProps) {
  const t = useTranslations('Index.LeaderboardsPage')

  return (
    <div className="relative w-full overflow-hidden border-b border-border/40 bg-muted/20">
      {/* cube-color hairline accent */}
      <div aria-hidden className="absolute inset-x-0 top-0 flex h-0.5">
        <div className="flex-1 bg-cube-white" />
        <div className="flex-1 bg-cube-yellow" />
        <div className="flex-1 bg-cube-red" />
        <div className="flex-1 bg-cube-orange" />
        <div className="flex-1 bg-cube-blue" />
        <div className="flex-1 bg-cube-green" />
      </div>

      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[52rem] max-w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]"
      />

      <div className="relative mx-auto w-full max-w-4xl px-4 md:px-6 py-6 md:py-8">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="space-y-1.5">
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground">{t('title')}</h1>
              <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground text-balance">
                {t('description')}
              </p>
            </div>
          </div>

          <div className="-mx-4 md:mx-0 w-full overflow-x-auto px-4 md:px-0">
            <div className="flex justify-start sm:justify-center">
              <PuzzleSwitch value={value} onChange={onChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
