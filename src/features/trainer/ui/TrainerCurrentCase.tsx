import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SkipForward, BookmarkCheck, Bookmark, History, Target, ListChecks } from 'lucide-react'
import AlgorithmRender from '@/shared/ui/twisty/AlgorithmRender'
import { TwistyPlayer } from 'cubing/twisty'
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
  onToggleLearned?: () => void
  historyHref?: string
  targetSeconds?: number
  onEditTarget?: () => void
  pickedCount?: number
  totalCount?: number
  onPickCases?: () => void
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
  onToggleLearned,
  historyHref,
  targetSeconds,
  onEditTarget,
  pickedCount,
  totalCount,
  onPickCases
}: TrainerCurrentCaseProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          {caseGroup && (
            <Badge variant="outline" className="text-[10px] font-normal shrink-0">
              {caseGroup}
            </Badge>
          )}
          <h2 className="text-base sm:text-lg font-bold tracking-tight truncate">{caseName || '—'}</h2>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
          {onEditTarget && targetSeconds != null && (
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={onEditTarget}
              aria-label="Edit target time"
              title="Edit target time"
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
              aria-label="Pick cases"
              title="Pick cases"
            >
              <ListChecks className="h-3.5 w-3.5" />
              <span className="tabular-nums">
                {pickedCount}/{totalCount}
              </span>
            </Button>
          )}
          <Button
            variant={isLearned ? 'default' : 'outline'}
            size="icon"
            className="h-8 w-8"
            onClick={onToggleLearned}
            disabled={!onToggleLearned}
            aria-label={isLearned ? 'Marked as learned' : 'Mark as learned'}
            title={isLearned ? 'Marked as learned' : 'Mark as learned'}
          >
            {isLearned ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={onSkip} aria-label="Skip" title="Skip">
            <SkipForward className="h-4 w-4" />
          </Button>
          {historyHref && (
            <Link
              href={historyHref}
              aria-label="History"
              title="History"
              className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'h-8 w-8')}
            >
              <History className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      {setup && (
        <div className="flex items-center gap-2 rounded-md border bg-background/60 px-2.5 py-1.5">
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider shrink-0">Setup</span>
          <code className="text-xs sm:text-sm font-mono break-all">{setup}</code>
        </div>
      )}

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="shrink-0 rounded-md border bg-muted/40 p-1.5 sm:p-2 flex items-center justify-center">
          {vizConfig ? (
            <AlgorithmRender config={vizConfig} width={96} height={96} />
          ) : (
            <div className="size-24 rounded-md bg-muted" />
          )}
        </div>

        <div className="flex flex-1 min-w-0 items-center justify-center">
          <div
            className={cn(
              'font-mono font-bold tabular-nums leading-none transition-colors',
              'text-5xl sm:text-6xl md:text-7xl',
              timeColorClass
            )}
          >
            {currentTime}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1.5 text-center">
        <Stat label="Best" value={best ?? '—'} />
        <Stat label="ao5" value={ao5 ?? '—'} />
        <Stat label="ao12" value={ao12 ?? '—'} />
        <Stat label="Solves" value={String(totalSolves ?? 0)} />
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
