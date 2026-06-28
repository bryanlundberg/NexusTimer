import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  SkipForward,
  BookmarkCheck,
  Bookmark,
  History,
  Target,
  ListChecks,
  Eye,
  EyeOff,
  BookOpen,
  Undo2
} from 'lucide-react'
import AlgorithmRender from '@/shared/ui/twisty/AlgorithmRender'
import type { TwistyPlayer } from 'cubing/twisty'
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
  totalSolves?: number
  onSkip?: () => void
  onUndoLast?: () => void
  lastSolveTime?: string
  onToggleLearned?: () => void
  historyHref?: string
  targetSeconds?: number
  onEditTarget?: () => void
  pickedCount?: number
  totalCount?: number
  onPickCases?: () => void
  showSolveInfo?: boolean
  onToggleSolveInfo?: () => void
  onViewAlgorithms?: () => void
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
  totalSolves,
  onSkip,
  onUndoLast,
  lastSolveTime,
  onToggleLearned,
  historyHref,
  targetSeconds,
  onEditTarget,
  pickedCount,
  totalCount,
  onPickCases,
  showSolveInfo = true,
  onToggleSolveInfo,
  onViewAlgorithms
}: TrainerCurrentCaseProps) {
  const t = useTranslations('Index.TrainerPage')
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2 min-w-0">
        {caseGroup && (
          <Badge variant="outline" className="text-[10px] font-normal shrink-0">
            {caseGroup}
          </Badge>
        )}
        <h2 className="text-base sm:text-lg font-bold tracking-tight truncate">{caseName || '—'}</h2>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {onEditTarget && targetSeconds != null && (
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={onEditTarget}
            aria-label={t('actions.editTargetTime')}
            title={t('actions.editTargetTime')}
          >
            <Target className="h-3.5 w-3.5" />
            <span className="font-mono tabular-nums">&lt;{targetSeconds}s</span>
          </Button>
        )}
        {onPickCases && pickedCount != null && totalCount != null && (
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={onPickCases}
            aria-label={t('actions.pickCases')}
            title={t('actions.pickCases')}
          >
            <ListChecks className="h-3.5 w-3.5" />
            <span className="tabular-nums">
              {pickedCount}/{totalCount}
            </span>
          </Button>
        )}
        <div className="ml-auto flex items-center gap-1.5">
          {onViewAlgorithms && (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={onViewAlgorithms}
              aria-label={t('actions.viewAlgorithms')}
              title={t('actions.viewAlgorithms')}
            >
              <BookOpen className="h-4 w-4" />
            </Button>
          )}
          {onToggleSolveInfo && (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={onToggleSolveInfo}
              aria-label={showSolveInfo ? t('actions.hideSolveInfo') : t('actions.showSolveInfo')}
              title={showSolveInfo ? t('actions.hideSolveInfo') : t('actions.showSolveInfo')}
            >
              {showSolveInfo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          )}
          <Button
            variant={isLearned ? 'default' : 'outline'}
            size="icon"
            className="h-8 w-8"
            onClick={onToggleLearned}
            disabled={!onToggleLearned}
            aria-label={isLearned ? t('actions.markedAsLearned') : t('actions.markAsLearned')}
            title={isLearned ? t('actions.markedAsLearned') : t('actions.markAsLearned')}
          >
            {isLearned ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={onSkip}
            aria-label={t('actions.skip')}
            title={t('actions.skip')}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          {historyHref && (
            <Link
              href={historyHref}
              aria-label={t('actions.history')}
              title={t('actions.history')}
              className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'h-8 w-8')}
            >
              <History className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      {setup && (
        <div className="flex items-center gap-2 rounded-md border bg-background/60 px-2.5 py-1.5 md:justify-end">
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider shrink-0">
            {t('setup')}
          </span>
          <code className="text-sm sm:text-lg font-mono break-all">{setup}</code>
        </div>
      )}

      <div className="flex flex-row items-center gap-3 sm:gap-4">
        {showSolveInfo && (
          <div
            className="shrink-0 size-16 sm:size-28 rounded-md border bg-muted/40 p-1 sm:p-2 flex items-center justify-center relative overflow-hidden"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, color-mix(in oklab, currentColor 8%, transparent) 0 6px, transparent 6px 14px)'
            }}
          >
            {vizConfig ? (
              <AlgorithmRender config={vizConfig} width="100%" height="100%" className="size-full" />
            ) : (
              <div className="size-14 sm:size-24 rounded-md bg-muted" />
            )}
          </div>
        )}

        <div className="flex flex-1 min-w-0 items-center justify-center">
          <div
            className={cn(
              'flex items-baseline tabular-nums tracking-tight leading-none transition-colors font-normal',
              timeColorClass
            )}
          >
            <span className="text-6xl sm:text-7xl md:text-8xl">{currentTime.split('.')[0]}</span>
            <span className="text-4xl sm:text-5xl md:text-6xl opacity-80">
              {currentTime.includes('.') ? '.' + currentTime.split('.')[1] : ''}
            </span>
          </div>
        </div>
      </div>

      {onUndoLast && (
        <div className="flex justify-center">
          <Button
            variant="destructive"
            size="sm"
            onClick={onUndoLast}
            aria-label={t('actions.undoLast')}
            className="h-9 gap-2"
          >
            <Undo2 className="h-4 w-4" />
            <span>{t('actions.undoLast')}</span>
            {lastSolveTime && <span className="font-mono tabular-nums opacity-75">{lastSolveTime}</span>}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-center">
        <Stat label={t('stats.best')} value={best ?? '--'} />
        <Stat label="ao5" value={ao5 ?? '--'} />
        <Stat label="ao12" value={ao12 ?? '--'} />
        <Stat label={t('stats.solves')} value={String(totalSolves ?? 0)} />
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 px-1 py-1 rounded-md bg-muted/40">
      <span className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="text-xs sm:text-sm font-mono tabular-nums">{value}</span>
    </div>
  )
}
