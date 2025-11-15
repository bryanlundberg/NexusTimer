import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import * as React from 'react'
import { AlarmClock, CalendarDaysIcon, CombineIcon, Trophy } from 'lucide-react'
import { Categories } from '@/interfaces/Categories'
import ScrambleDisplay from '@/shared/ui/scramble-display/ui/ScrambleDisplay'

interface SolveCardProps {
  scramble: string
  event: Categories
  time: string
  date: string
}

export default function SolveCard({ scramble, event, time, date }: SolveCardProps) {
  const [mainTime, decimals] = time.split('.')

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="flex flex-row h-full">
        <div className="flex items-center justify-center bg-muted/60 ms-4 px-4">
          <ScrambleDisplay show scramble={scramble} event={event} className="size-28" visualization="2D" />
        </div>

        <div className="flex flex-col flex-1">
          <CardHeader className="pb-2 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Trophy className="size-4 text-amber-500" />
                <CardTitle className="text-lg font-bold text-amber-500">{event}</CardTitle>
              </div>
              <CardDescription className="flex items-center gap-1.5">
                <CalendarDaysIcon className="size-3.5" />
                <span>{date}</span>
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="pb-4 pt-0">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-1">
                <AlarmClock className="size-5" />
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold tracking-tighter">{mainTime}</span>
                  <span className="text-xl font-medium text-muted-foreground">.{decimals}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <CombineIcon className="size-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground break-all">{scramble}</p>
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  )
}
