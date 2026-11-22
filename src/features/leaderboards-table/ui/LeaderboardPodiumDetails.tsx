'use client'

import { useLocale, useTranslations } from 'next-intl'
import type { LeaderboardSolve } from '@nexustimer/contracts'
import formatTime from '@/shared/lib/formatTime'
import { formatTps } from '@/shared/lib/formatTps'
import dayjs from '@/shared/lib/dayjs'
import { cn } from '@/shared/lib/utils'
import { useSolveAnalysis } from '@/features/leaderboards-table/model/useSolveAnalysis'
import { startFaceLayer } from '@/shared/lib/startFaceLayer'
import { FaceGlyph } from '@/shared/ui/face-glyph/FaceGlyph'

export default function LeaderboardPodiumDetails({ solve, isFirst }: { solve: LeaderboardSolve; isFirst: boolean }) {
  const t = useTranslations('Index.LeaderboardsPage.table')
  const tColors = useTranslations('Index.MainColors.colors')
  const locale = useLocale()
  const analysis = useSolveAnalysis(solve)
  const startColor = startFaceLayer(analysis)
  const tps = analysis?.tps != null ? formatTps(analysis.tps) : null
  const moveCount = analysis ? analysis.turnCount : null
  const date = dayjs(solve.createdAt).locale(locale).format('ll')

  return (
    <>
      <span className="flex items-center gap-1.5">
        {startColor && (
          <span role="img" aria-label={tColors(startColor)} title={tColors(startColor)} className="inline-flex">
            <FaceGlyph color={startColor} className="size-3 sm:size-3.5" />
          </span>
        )}
        <span
          className={cn(
            'font-mono font-bold tabular-nums leading-none',
            isFirst ? 'text-base sm:text-xl' : 'text-sm sm:text-base'
          )}
        >
          {formatTime(solve.time)}
        </span>
      </span>
      {(tps || moveCount != null) && (
        <span className="flex flex-wrap items-baseline justify-center gap-x-2 font-mono text-[10px] tabular-nums text-muted-foreground sm:text-[11px]">
          {tps && (
            <span>
              {tps} <span className="font-display uppercase tracking-wider text-muted-foreground/70">{t('tps')}</span>
            </span>
          )}
          {moveCount != null && (
            <span>
              {moveCount}{' '}
              <span className="font-display uppercase tracking-wider text-muted-foreground/70">{t('moves')}</span>
            </span>
          )}
        </span>
      )}
      <span className="text-[10px] text-muted-foreground tabular-nums sm:text-xs">{date}</span>
    </>
  )
}
