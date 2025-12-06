import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import * as React from 'react'
import { AlarmClock, Boxes, CalendarDaysIcon } from 'lucide-react'
import { CubeCategory } from '@/shared/const/cube-categories'
import Image from 'next/image'
import { Solve } from '@/entities/solve/model/types'
import calculateBestAo from '@/shared/lib/statistics/calculateBestAo'
import formatTime from '@/shared/lib/formatTime'
import { defer } from 'es-toolkit/compat'

interface SolveCardProps {
  event: CubeCategory
  time: string
  date: string
  bgImage: string
  solves: Array<Solve>
}

export default function SolveCard({ event, time, date, bgImage, solves }: SolveCardProps) {
  const [mainTime, decimals] = time.split('.')
  const [ao5Str, setAo5Str] = React.useState<string>('--')
  const [spentStr, setSpentStr] = React.useState<string>('00:00.00')
  const [solvesCount, setSolvesCount] = React.useState<number>(0)

  React.useEffect(() => {
    setSolvesCount(solves?.length || 0)
    defer(() => {
      try {
        const ao5Ms = calculateBestAo(solves || [], 5)
        const safeAo5 = !isFinite(ao5Ms) || ao5Ms <= 0 ? 0 : Math.round(ao5Ms)
        setAo5Str(safeAo5 === 0 ? '--' : formatTime(safeAo5))

        const spent = (solves || []).reduce((acc, s) => acc + (s.time || 0), 0)
        setSpentStr(formatTime(spent))
      } catch (e) {
        setAo5Str('--')
        setSpentStr('00:00.00')
      }
    })
  }, [solves])

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md relative">
      <div className="flex flex-row h-full">
        <div className="flex flex-col flex-1">
          <CardHeader className="pb-2 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Boxes className="size-4 text-amber-500" />
                <CardTitle className="text-lg font-bold text-amber-500">{event}</CardTitle>
              </div>
              <CardDescription className="flex items-center gap-1.5">
                <CalendarDaysIcon className="size-3.5" />
                <span>{date}</span>
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="pb-4 pt-0 @container">
            <div className="grid @grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-4 gap-3">
              <div className="flex gap-2 bg-background p-4 rounded-xl flex-col">
                <h2 className={'font-semibold tracking-tight'}>Single</h2>
                <div className="flex flex-row items-end justify-end gap-2">
                  <AlarmClock className="size-4 mb-1" />
                  <div className="flex flex-row">
                    <span className="text-xl font-bold tracking-tighter">{mainTime}</span>
                    <span className="text-lg font-medium text-muted-foreground">.{decimals}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mb-1 bg-background p-4 rounded-xl flex-col">
                <h2 className={'font-semibold tracking-tight'}>Ao5 (Best)</h2>
                <div className="flex flex-row items-end justify-end gap-2">
                  <AlarmClock className="size-5 mb-1" />
                  <div className="flex items-baseline">
                    {ao5Str === '--' ? (
                      <span className="text-2xl font-semibold text-muted-foreground">--</span>
                    ) : (
                      <>
                        <span className="text-xl font-bold tracking-tighter">{ao5Str.split('.')[0]}</span>
                        <span className="text-lg font-medium text-muted-foreground">.{ao5Str.split('.')[1]}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mb-1 bg-background p-4 rounded-xl flex-col">
                <h2 className={'font-semibold tracking-tight'}>Time Spent</h2>
                <div className="flex flex-row items-end justify-end gap-2">
                  <AlarmClock className="size-5 mb-1" />
                  <div className="flex items-baseline">
                    <span className="text-xl font-bold tracking-tighter">{spentStr.split('.')[0]}</span>
                    <span className="text-lg font-medium text-muted-foreground">.{spentStr.split('.')[1]}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mb-1 bg-background p-4 rounded-xl flex-col">
                <h2 className={'font-semibold tracking-tight'}>Solves</h2>
                <div className="flex flex-row items-end justify-end gap-2">
                  <AlarmClock className="size-5 mb-1" />
                  <div className="flex items-baseline">
                    <span className="text-xl font-bold tracking-tighter">{solvesCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </div>
      <div className="pointer-events-none select-none absolute bottom-5 right-10 text-foreground/10 rotate-25 opacity-5">
        <Image src={bgImage} alt={`icon`} width={200} height={200} unoptimized />
      </div>
    </Card>
  )
}
