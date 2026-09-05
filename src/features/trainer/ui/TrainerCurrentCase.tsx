import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { SkipForward, Check, Circle, Undo2 } from 'lucide-react'
import AlgorithmRender from '@/shared/ui/twisty/AlgorithmRender'
import type { TwistyPlayer } from '@rednaxela101/cubing/twisty'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

interface TrainerCurrentCaseProps {
  caseGroup: string
  caseName: string
  setup: string
  currentTime: string
  timeColorClass?: string
  vizConfig?: Partial<TwistyPlayer>
  isLearned?: boolean
  best?: string
  ao5?: string
  onSkip?: () => void
  onUndoLast?: () => void
  lastSolveTime?: string
  onToggleLearned?: () => void
  showSolveInfo?: boolean
  sparklineSlot?: ReactNode
  statsSlot?: ReactNode
  centerSlot?: ReactNode
}

export default function TrainerCurrentCase({
  caseGroup,
  caseName,
  setup,
  currentTime,
  timeColorClass,
  vizConfig,
  isLearned,
  best,
  ao5,
  onSkip,
  onUndoLast,
  lastSolveTime,
  onToggleLearned,
  showSolveInfo = true,
  sparklineSlot,
  statsSlot,
  centerSlot
}: TrainerCurrentCaseProps) {
  const t = useTranslations('Index.TrainerPage')
  const [intPart, decPart] = currentTime.includes('.')
    ? [currentTime.split('.')[0], '.' + currentTime.split('.')[1]]
    : [currentTime, '']

  const showViz = !centerSlot && showSolveInfo && !!vizConfig

  const learnedButton = (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggleLearned}
      disabled={!onToggleLearned}
      aria-pressed={isLearned}
      aria-label={isLearned ? t('actions.markedAsLearned') : t('actions.markAsLearned')}
      title={isLearned ? t('actions.markedAsLearned') : t('actions.markAsLearned')}
      className={cn(
        'btn-notch size-9',
        isLearned ? 'bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary' : 'text-muted-foreground'
      )}
    >
      {isLearned ? <Check className="size-4" /> : <Circle className="size-4" />}
    </Button>
  )

  const skipButton = onSkip && (
    <Button
      variant="ghost"
      size="icon"
      onClick={onSkip}
      aria-label={t('actions.skip')}
      title={t('actions.skip')}
      className="btn-notch size-9 text-muted-foreground"
    >
      <SkipForward className="size-4" />
    </Button>
  )

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex flex-1 flex-col items-center justify-center gap-7 min-h-0 py-6">
        {centerSlot ?? (
          <>
            {(caseName || caseGroup) && (
              <div className="flex flex-col items-center gap-1 text-center">
                {caseGroup && (
                  <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{caseGroup}</span>
                )}
                <span className="text-lg font-semibold tracking-tight leading-none">{caseName || '—'}</span>
              </div>
            )}

            {showViz && (
              <div className="relative">
                <div className="algo-panel-notch [--ap-notch:10px] size-32 sm:size-36 p-2.5 flex items-center justify-center overflow-hidden">
                  <AlgorithmRender config={vizConfig} width="100%" height="100%" className="size-full" />
                </div>

                {/* Absolute so the two controls never shift the cube off the page's centre line. */}
                <div className="absolute left-full top-1/2 ml-2 flex -translate-y-1/2 flex-col gap-1">
                  {learnedButton}
                  {skipButton}
                </div>
              </div>
            )}

            {setup && (
              <code className="max-w-2xl px-4 text-center font-mono text-sm sm:text-base tracking-wide text-muted-foreground break-words">
                {setup}
              </code>
            )}

            <div
              className={cn(
                'flex items-baseline tabular-nums tracking-tight leading-none transition-colors font-normal',
                timeColorClass
              )}
            >
              <span className="text-7xl sm:text-8xl md:text-9xl">{intPart}</span>
              <span className="text-5xl sm:text-6xl md:text-7xl opacity-40">{decPart}</span>
            </div>
          </>
        )}
      </div>

      <div className="algo-panel-notch [--ap-notch:12px] flex items-center justify-between gap-4 px-4 py-2.5">
        <div className="flex items-center gap-6 min-w-0">
          <BarStat label={t('stats.best')} value={best ?? '--'} />
          <BarStat label="ao5" value={ao5 ?? '--'} />
          {sparklineSlot && <div className="hidden sm:block">{sparklineSlot}</div>}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {onUndoLast && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onUndoLast}
              aria-label={t('actions.undoLast')}
              title={lastSolveTime ? `${t('actions.undoLast')} · ${lastSolveTime}` : t('actions.undoLast')}
              className="btn-notch size-9 text-muted-foreground"
            >
              <Undo2 className="size-4" />
            </Button>
          )}

          {/* Without the cube there is nothing to anchor them to, so they fall back to the bar. */}
          {!showViz && (
            <>
              {learnedButton}
              {skipButton}
            </>
          )}

          {statsSlot}
        </div>
      </div>
    </div>
  )
}

function BarStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="text-sm font-mono font-semibold tabular-nums truncate">{value}</span>
    </div>
  )
}
