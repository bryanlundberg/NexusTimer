import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SkipForward, BookmarkCheck, Bookmark } from 'lucide-react'
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
  onToggleLearned
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
        <div className="flex items-center gap-1.5 shrink-0">
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
        </div>
      </div>

      <div className="flex items-stretch gap-3 sm:gap-4">
        <div className="shrink-0 rounded-md border bg-muted/40 p-2 flex items-center justify-center">
          {vizConfig ? (
            <AlgorithmRender config={vizConfig} width={104} height={104} />
          ) : (
            <div className="size-26 rounded-md bg-muted" />
          )}
        </div>

        <div className="flex flex-col flex-1 min-w-0 justify-between gap-2">
          <div
            className={cn(
              'font-mono font-bold tabular-nums leading-none transition-colors',
              'text-5xl sm:text-6xl md:text-7xl',
              timeColorClass
            )}
          >
            {currentTime}
          </div>

          <div className="grid grid-cols-4 gap-1 text-center">
            <Stat label="Best" value={best ?? '—'} />
            <Stat label="ao5" value={ao5 ?? '—'} />
            <Stat label="ao12" value={ao12 ?? '—'} />
            <Stat label="Solves" value={String(totalSolves ?? 0)} />
          </div>
        </div>
      </div>

      {setup && (
        <div className="flex items-center gap-2 rounded-md border bg-background/60 px-2.5 py-1.5">
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider shrink-0">Setup</span>
          <code className="text-xs sm:text-sm font-mono break-all">{setup}</code>
        </div>
      )}
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
