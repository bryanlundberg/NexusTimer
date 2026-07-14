import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { SkipForward, Check, Circle, ListChecks, Eye, EyeOff, Undo2 } from 'lucide-react'
import AlgorithmRender from '@/shared/ui/twisty/AlgorithmRender'
import type { TwistyPlayer } from 'cubing/twisty'
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
  ao12?: string
  execIndex?: number
  execTotal?: number
  onSkip?: () => void
  onUndoLast?: () => void
  lastSolveTime?: string
  onToggleLearned?: () => void
  targetSeconds?: number
  onEditTarget?: () => void
  pickedCount?: number
  totalCount?: number
  onPickCases?: () => void
  showSolveInfo?: boolean
  onToggleSolveInfo?: () => void
  smartToggleSlot?: ReactNode
  sparklineSlot?: ReactNode
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
  ao12,
  execIndex,
  execTotal,
  onSkip,
  onUndoLast,
  lastSolveTime,
  onToggleLearned,
  targetSeconds,
  onEditTarget,
  pickedCount,
  totalCount,
  onPickCases,
  showSolveInfo = true,
  onToggleSolveInfo,
  smartToggleSlot,
  sparklineSlot,
  centerSlot
}: TrainerCurrentCaseProps) {
  const t = useTranslations('Index.TrainerPage')
  const [intPart, decPart] = currentTime.includes('.')
    ? [currentTime.split('.')[0], '.' + currentTime.split('.')[1]]
    : [currentTime, '']

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {smartToggleSlot}

          {onPickCases && pickedCount != null && totalCount != null && (
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 shrink-0"
              onClick={onPickCases}
              aria-label={t('actions.pickCases')}
              title={`${t('actions.pickCases')} (${pickedCount}/${totalCount})`}
            >
              <ListChecks className="h-4 w-4" />
            </Button>
          )}
          {onSkip && (
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 shrink-0"
              onClick={onSkip}
              aria-label={t('actions.skip')}
              title={t('actions.skip')}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          )}
        </div>

        {onEditTarget && targetSeconds != null && (
          <Button
            variant="outline"
            size="sm"
            onClick={onEditTarget}
            aria-label={t('actions.editTargetTime')}
            title={t('actions.editTargetTime')}
            className="h-9 shrink-0 gap-1.5 text-xs"
          >
            <span className="text-muted-foreground">{t('stats.target')}</span>
            <span className="font-mono font-semibold tabular-nums text-primary">&lt;{targetSeconds}s</span>
          </Button>
        )}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 min-h-0 py-6">
        {centerSlot ?? (
          <>
            {(caseName || caseGroup) && (
              <div className="flex flex-col items-center leading-tight text-center">
                <span className="text-base font-bold tracking-tight">{caseName || '—'}</span>
                {caseGroup && <span className="text-xs text-muted-foreground">{caseGroup}</span>}
              </div>
            )}

            {showSolveInfo && vizConfig && (
              <div
                className="size-32 sm:size-40 rounded-lg border bg-muted/40 p-2 flex items-center justify-center overflow-hidden"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, color-mix(in oklab, currentColor 8%, transparent) 0 6px, transparent 6px 14px)'
                }}
              >
                <AlgorithmRender config={vizConfig} width="100%" height="100%" className="size-full" />
              </div>
            )}

            {setup && (
              <code className="max-w-2xl text-center text-base sm:text-lg font-mono tracking-wide text-muted-foreground break-words px-4">
                {setup}
              </code>
            )}

            <div className="relative flex items-center justify-center">
              <div
                className={cn(
                  'flex items-baseline tabular-nums tracking-tight leading-none transition-colors font-normal',
                  timeColorClass
                )}
              >
                <span className="text-7xl sm:text-8xl md:text-9xl">{intPart}</span>
                <span className="text-5xl sm:text-6xl md:text-7xl opacity-60">{decPart}</span>
              </div>

              {onUndoLast && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onUndoLast}
                  aria-label={t('actions.undoLast')}
                  className="absolute left-full top-1/2 -translate-y-1/2 ml-3 h-8 gap-2 text-muted-foreground hover:text-foreground"
                >
                  <Undo2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t('actions.undoLast')}</span>
                  {lastSolveTime && <span className="font-mono tabular-nums opacity-75">{lastSolveTime}</span>}
                </Button>
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 rounded-2xl border bg-muted/40 px-4 py-3">
        <div className="flex items-center gap-5 sm:gap-8 min-w-0">
          <BarStat label={t('stats.best')} value={best ?? '--'} />
          <BarStat label="ao5" value={ao5 ?? '--'} />
          <BarStat label="ao12" value={ao12 ?? '--'} className="hidden sm:flex" />
          {execTotal != null && (
            <BarStat label="exec" value={`${execIndex ?? 0} / ${execTotal}`} className="hidden md:flex" />
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {sparklineSlot && <div className="mr-1.5">{sparklineSlot}</div>}

          {onToggleSolveInfo && (
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={onToggleSolveInfo}
              aria-label={showSolveInfo ? t('actions.hideSolveInfo') : t('actions.showSolveInfo')}
              title={showSolveInfo ? t('actions.hideSolveInfo') : t('actions.showSolveInfo')}
            >
              {showSolveInfo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleLearned}
            disabled={!onToggleLearned}
            aria-pressed={isLearned}
            aria-label={isLearned ? t('actions.markedAsLearned') : t('actions.markAsLearned')}
            title={isLearned ? t('actions.markedAsLearned') : t('actions.markAsLearned')}
            className={cn(
              'h-9 gap-1.5 px-2.5 text-xs font-medium',
              isLearned
                ? 'border-primary/40 bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary'
                : 'text-muted-foreground'
            )}
          >
            {isLearned ? <Check className="size-3.5" /> : <Circle className="size-3.5" />}
            <span className="hidden sm:inline">
              {isLearned ? t('actions.markedAsLearned') : t('actions.markAsLearned')}
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
}

function BarStat({
  label,
  value,
  accent,
  className
}: {
  label: string
  value: string
  accent?: boolean
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-0.5 min-w-0', className)}>
      <span className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className={cn('text-sm font-mono font-semibold tabular-nums truncate', accent && 'text-emerald-500')}>
        {value}
      </span>
    </div>
  )
}
