import * as React from 'react'
import { CubeCategory } from '@/shared/const/cube-categories'
import Image from 'next/image'
import { Solve } from '@/entities/solve/model/types'
import calcBestAo from '@/shared/lib/statistics/calcBestAo'
import formatTime from '@/shared/lib/formatTime'
import { defer } from 'es-toolkit/compat'
import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'

interface SolveCardProps {
  event: CubeCategory
  time: string
  date: string
  bgImage: string
  solves: Array<Solve>
}

export default function SolveCard({ event, time, date, bgImage, solves }: SolveCardProps) {
  const t = useTranslations('Index.PeoplePage.solve-card')

  const [ao5Str, setAo5Str] = React.useState<string>('--')
  const [spentStr, setSpentStr] = React.useState<string>('00:00.00')
  const [solvesCount, setSolvesCount] = React.useState<number>(0)

  React.useEffect(() => {
    setSolvesCount(solves?.length || 0)
    defer(() => {
      try {
        const ao5Ms = calcBestAo(solves || [], 5)
        const safeAo5 = !isFinite(ao5Ms) || ao5Ms <= 0 ? 0 : ao5Ms
        setAo5Str(safeAo5 === 0 ? '--' : formatTime(safeAo5))

        const spent = (solves || []).reduce((acc, s) => acc + (s.time || 0), 0)
        setSpentStr(formatTime(spent))
      } catch (e) {
        setAo5Str('--')
        setSpentStr('00:00.00')
      }
    })
  }, [solves])

  const chartData = React.useMemo(() => {
    const valid = (solves || []).filter((s) => !s.dnf && s.time > 0)
    const last20 = valid.slice(-20)
    return last20.map((s) => ({ v: s.time + (s.plus2 ? 2000 : 0) }))
  }, [solves])

  const [mainTime, decimalTime] = time.includes('.') ? time.split('.') : [time, null]

  return (
    <motion.div
      className="group relative overflow-hidden flex flex-col transition-colors duration-300"
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div className="p-5 pb-4 flex flex-col gap-4">
        {/* Header row */}
        <div className="flex items-center gap-2.5">
          <motion.div
            className="relative size-10 rounded-lg bg-muted/60 flex items-center justify-center shrink-0"
            whileHover={{ rotate: 12 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <Image src={bgImage} alt={event} width={26} height={26} className="object-contain" unoptimized />
          </motion.div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold tracking-tight truncate">{event}</h3>
            </div>
            <span className="text-[10px] text-muted-foreground">{date}</span>
          </div>
        </div>

        {/* Personal Best */}
        <div className="flex flex-col gap-1">
          <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">
            {t('single')}
          </span>
          <div className="flex items-baseline gap-0.5">
            {time === '--' ? (
              <span className="text-3xl font-black text-muted-foreground">--</span>
            ) : (
              <>
                <span className="text-3xl font-black tabular-nums tracking-tight">{mainTime}</span>
                {decimalTime && (
                  <span className="text-lg font-bold text-muted-foreground tabular-nums">.{decimalTime}</span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Stats row — 3 columns */}
        <div className="grid grid-cols-3 divide-x divide-border/40 -mx-5 px-5">
          <StatCol label={t('ao5')} value={ao5Str} />
          <StatCol label={t('solves')} value={solvesCount.toString()} />
          <StatCol label={t('time-spent')} value={spentStr} />
        </div>
      </div>

      {/* Mini sparkline chart */}
      {chartData.length > 1 && (
        <div className="h-16 w-full mt-auto">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <Area
                type="monotone"
                dataKey="v"
                stroke="var(--primary)"
                strokeWidth={1.5}
                fill="var(--primary)"
                fillOpacity={0.05}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  )
}

function StatCol({ label, value }: { label: string; value: string }) {
  const [main, decimal] = value.includes('.') ? value.split('.') : [value, null]

  return (
    <div className="flex flex-col items-start px-3 first:pl-0 last:pr-0 gap-0.5">
      <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">{label}</span>
      <div className="flex items-baseline">
        {value === '--' ? (
          <span className="text-base font-bold text-muted-foreground">--</span>
        ) : (
          <>
            <span className="text-base font-bold tabular-nums">{main}</span>
            {decimal && <span className="text-xs text-muted-foreground tabular-nums">.{decimal}</span>}
          </>
        )}
      </div>
    </div>
  )
}
