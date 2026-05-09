import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Target, Layers, TrendingUp } from 'lucide-react'

interface TrainerSessionHeaderProps {
  targetTime: string
  progressValue: number
  progressLabel?: string
  sessionCurrent: number
  sessionTotal: number
}

export default function TrainerSessionHeader({
  targetTime,
  progressValue,
  progressLabel = 'Cases meeting target',
  sessionCurrent,
  sessionTotal
}: TrainerSessionHeaderProps) {
  return (
    <Card className="grid grid-cols-12 gap-3 p-4 bg-card/50">
      <div className="col-span-12 md:col-span-3 flex flex-col gap-1 justify-center items-start md:items-center md:border-r border-border/60 pr-3">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Target className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium uppercase tracking-wider">Target time</span>
        </div>
        <span className="text-2xl font-bold font-mono tabular-nums">{targetTime}</span>
      </div>

      <div className="col-span-12 md:col-span-6 flex flex-col gap-2 justify-center">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium uppercase tracking-wider">{progressLabel}</span>
          </div>
          <span className="text-xs font-mono text-muted-foreground tabular-nums">{progressValue}%</span>
        </div>
        <Progress value={progressValue} />
      </div>

      <div className="col-span-12 md:col-span-3 flex flex-col gap-1 justify-center items-start md:items-center md:border-l border-border/60 pl-3">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Layers className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium uppercase tracking-wider">Session</span>
        </div>
        <span className="text-2xl font-bold font-mono tabular-nums">
          {sessionCurrent}
          <span className="text-muted-foreground text-base">/{sessionTotal}</span>
        </span>
      </div>
    </Card>
  )
}
