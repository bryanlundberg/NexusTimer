import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RotateCcw, Eye, Plus, X, Clock, BookmarkCheck, Bookmark } from 'lucide-react'
import AlgorithmRender from '@/shared/ui/twisty/AlgorithmRender'
import { TwistyPlayer } from 'cubing/twisty'
import { cn } from '@/shared/lib/utils'

interface TrainerCurrentCaseProps {
  caseGroup: string
  caseName: string
  lastDrilled: string
  totalSolves: number
  setup: string
  currentTime: string
  timeColorClass?: string
  vizConfig?: Partial<TwistyPlayer>
  isLearned?: boolean
  onSkip?: () => void
  onReveal?: () => void
  onPlusTwo?: () => void
  onFail?: () => void
  onToggleLearned?: () => void
}

export default function TrainerCurrentCase({
  caseGroup,
  caseName,
  lastDrilled,
  totalSolves,
  setup,
  currentTime,
  timeColorClass,
  vizConfig,
  isLearned,
  onSkip,
  onReveal,
  onPlusTwo,
  onFail,
  onToggleLearned
}: TrainerCurrentCaseProps) {
  return (
    <Card className="w-full flex-1 p-4 gap-4 bg-card/50">
      {/* Case header */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-col gap-1.5 min-w-0">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Now training</span>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-[10px] font-normal">
              {caseGroup}
            </Badge>
            <h2 className="text-lg font-bold tracking-tight">{caseName}</h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>last drilled {lastDrilled}</span>
            <span className="opacity-50">·</span>
            <span>{totalSolves} solves total</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant={isLearned ? 'default' : 'outline'}
            size="sm"
            onClick={onToggleLearned}
            disabled={!onToggleLearned}
          >
            {isLearned ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
            {isLearned ? 'Learned' : 'Mark learned'}
          </Button>
          <Button variant="outline" size="sm" onClick={onSkip}>
            <RotateCcw className="h-3.5 w-3.5" />
            Skip
          </Button>
        </div>
      </div>

      {/* Setup row */}
      <div className="rounded-lg border bg-background/80 p-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider shrink-0">Setup</span>
          <code className="text-sm font-mono leading-relaxed break-all">{setup}</code>
        </div>
      </div>

      {/* Visualization + actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch">
        <div className="shrink-0 rounded-lg bg-muted/50 border p-3 flex items-center justify-center">
          {vizConfig ? (
            <AlgorithmRender config={vizConfig} width={128} height={128} />
          ) : (
            <div className="size-32 rounded-md bg-muted" />
          )}
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <div
            className={cn(
              'flex items-end justify-center sm:justify-start font-mono text-5xl font-bold tabular-nums py-2 transition-colors',
              timeColorClass
            )}
          >
            {currentTime}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={onReveal}>
              <Eye className="h-3.5 w-3.5" />
              Reveal
            </Button>
            <Button variant="outline" size="sm" onClick={onPlusTwo}>
              <Plus className="h-3.5 w-3.5" />2
            </Button>
            <Button variant="destructive" size="sm" onClick={onFail}>
              <X className="h-3.5 w-3.5" />
              Fail
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
