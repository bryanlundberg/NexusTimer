'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'
import dayjs from '@/shared/lib/dayjs'
import { cn } from '@/shared/lib/utils'
import { CategoryBadge } from '@/shared/ui/category-badge/CategoryBadge'
import ScrambleDisplay from '@/shared/ui/scramble-display/ui/ScrambleDisplay'
import { formatSolveCardTime, type SolveCardData } from '@/entities/chat/lib/solve-card'

interface Props {
  data: SolveCardData
  className?: string
}

// Spans only: the card sits inside the inline flow of a message bubble
export function SolveCard({ data, className }: Props) {
  const t = useTranslations('Index.ChatPage')
  const locale = useLocale()

  const copyScramble = () => {
    void navigator.clipboard
      ?.writeText(data.scramble)
      .then(() => toast('', { description: t('copied'), duration: 1000 }))
  }

  return (
    <span
      className={cn(
        '@container my-0.5 flex w-full min-w-0 flex-col gap-2 border border-border/60 bg-background/70 p-2.5 whitespace-normal',
        className
      )}
    >
      <span className="flex items-center justify-between gap-2">
        <CategoryBadge category={data.puzzle} />
        {data.date && (
          <time dateTime={new Date(data.date).toISOString()} className="text-[10px] text-muted-foreground">
            {dayjs(data.date).locale(locale).format('ll')}
          </time>
        )}
      </span>

      <span className="flex items-center justify-between gap-3">
        <span className="flex min-w-0 flex-col">
          <span
            className={cn(
              'font-mono text-2xl leading-none font-bold tracking-tight tabular-nums @[15rem]:text-3xl',
              data.dnf && 'text-destructive'
            )}
          >
            {formatSolveCardTime(data)}
          </span>
          {data.dnf && (
            <span className="mt-1 font-mono text-[11px] text-muted-foreground tabular-nums">
              {formatSolveCardTime({ ...data, dnf: false })}
            </span>
          )}
        </span>
        {/* The player paints at its default size before fitting, so the box clips it and isolates the layout */}
        <span className="block h-12 w-16 shrink-0 overflow-hidden [contain:strict] @[15rem]:h-16 @[15rem]:w-24">
          <ScrambleDisplay
            show
            scramble={data.scramble}
            event={data.puzzle}
            className="flex size-full items-center justify-center"
          />
        </span>
      </span>

      <span className="flex items-start gap-1.5">
        <span className="min-w-0 flex-1 font-mono text-[11px] leading-relaxed break-words text-muted-foreground select-all">
          {data.scramble}
        </span>
        <button
          type="button"
          onClick={copyScramble}
          aria-label={t('copy-scramble')}
          title={t('copy-scramble')}
          className="shrink-0 border p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Copy className="size-3" />
        </button>
      </span>

      {data.moves && (
        <details className="text-[11px]">
          <summary className="cursor-pointer text-muted-foreground select-none hover:text-foreground">
            {t('solution')}
          </summary>
          <span className="mt-1 block font-mono leading-relaxed break-words select-all">{data.moves}</span>
        </details>
      )}
    </span>
  )
}
