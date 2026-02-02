import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { cubeCollection } from '@/shared/const/cube-collection'
import moment from 'moment'
import formatTime from '@/shared/lib/formatTime'
import { Badge } from '@/components/ui/badge'
import { CalendarDaysIcon, Hash, Timer } from 'lucide-react'
import ScrambleDisplay from '@/shared/ui/scramble-display/ui/ScrambleDisplay'
import { CubeCategory } from '@/shared/const/cube-categories'

interface LastActivitySolveCardProps {
  solve: {
    id: string
    time: number
    startTime: number
    endTime: number
    scramble: string
    dnf?: boolean
    plus2?: boolean
    category: CubeCategory
    cubeName: string
  }
  index: number
}

export function LastActivitySolveCard({ solve, index }: LastActivitySolveCardProps) {
  const cubeInfo = cubeCollection.find((item) => item.name === solve.category)

  return (
    <Card className="group relative overflow-hidden flex flex-col p-4 transition-all duration-300 hover:shadow-lg border-muted/40 bg-card/50 backdrop-blur-sm">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 rounded-lg blur-[2px] group-hover:blur-sm transition-all" />
            <Image
              unoptimized
              src={cubeInfo?.src || ''}
              alt={solve.category}
              className="relative object-scale-down rounded-lg p-1.5 bg-background border border-muted/50"
              draggable={false}
              width={40}
              height={40}
            />
          </div>
          <div className="flex flex-col">
            <div className="text-sm font-bold tracking-tight line-clamp-1">{solve.cubeName}</div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              <CalendarDaysIcon className="size-2.5" />
              {moment(solve.startTime).format('DD MMM YYYY, HH:mm')}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge variant="outline" className="text-[9px] font-mono px-1.5 py-0 h-4 bg-muted/30">
            {solve.category}
          </Badge>
          <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/50">
            <Hash className="size-2.5" />
            {index}
          </div>
        </div>
      </div>

      <div className="flex flex-1 gap-3 items-center">
        <div className="flex flex-col justify-center flex-1">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
            <Timer className="size-3.5 text-primary" />
            <span className="text-[11px] font-bold uppercase tracking-tight">Time</span>
          </div>
          <div className="flex items-baseline gap-1">
            <div className="text-2xl font-black font-mono tracking-tighter">{formatTime(solve.time)}</div>
            {solve.dnf && <span className="text-xs font-bold text-red-500">DNF</span>}
            {solve.plus2 && <span className="text-xs font-bold text-yellow-500">+2</span>}
          </div>
        </div>

        <div className="relative size-20 shrink-0 bg-muted/20 rounded-lg border border-muted/30 flex items-center justify-center overflow-hidden">
          <ScrambleDisplay className="size-full p-1" show scramble={solve.scramble} event={solve.category} />
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-muted/20">
        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1 opacity-70">
          Scramble
        </div>
        <div className="text-[11px] font-medium font-mono leading-relaxed break-all line-clamp-2 bg-muted/30 p-2 rounded border border-muted/10 group-hover:bg-muted/50 transition-colors">
          {solve.scramble}
        </div>
      </div>
    </Card>
  )
}
