import * as React from 'react'
import { CalendarDaysIcon, CircleSlash2, RotateCcw, Timer } from 'lucide-react'
import { CubeCategory } from '@/shared/const/cube-categories'
import Image from 'next/image'
import { Solve } from '@/entities/solve/model/types'
import calculateBestAo from '@/shared/lib/statistics/calculateBestAo'
import formatTime from '@/shared/lib/formatTime'
import { defer } from 'es-toolkit/compat'
import { cn } from '@/shared/lib/utils'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'

interface SolveCardProps {
  event: CubeCategory
  time: string
  date: string
  bgImage: string
  solves: Array<Solve>
}

export default function SolveCard({ event, time, date, bgImage, solves }: SolveCardProps) {
  const t = useTranslations('Index.PeoplePage.solve-card')
  const [mainTime, decimals] = time.split('.')
  const [ao5Str, setAo5Str] = React.useState<string>('--')
  const [spentStr, setSpentStr] = React.useState<string>('00:00.00')
  const [solvesCount, setSolvesCount] = React.useState<number>(0)
  const { resolvedTheme } = useTheme()

  React.useEffect(() => {
    setSolvesCount(solves?.length || 0)
    defer(() => {
      try {
        const ao5Ms = calculateBestAo(solves || [], 5)
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

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30">
      {/* Animated gradient border effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Glow effect */}
      <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

      {/* Content container */}
      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative size-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shadow-sm border border-neutral-200/50 dark:border-neutral-700/50">
              <Image src={bgImage} alt={event} width={32} height={32} className="object-contain" unoptimized />
            </div>
            <div>
              <h3 className="text-xl font-bold">{event}</h3>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                <CalendarDaysIcon className="size-3" />
                <span>{date}</span>
              </div>
            </div>
          </div>

          {/* Best time highlight */}
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-1">
              {t('single')}
            </div>
            <div className="flex items-baseline justify-end">
              <span className="text-3xl font-black tracking-tighter bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                {mainTime}
              </span>
              <span className="text-xl font-bold text-muted-foreground/60">.{decimals}</span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={CircleSlash2} label={t('ao5')} value={ao5Str} />
          <StatCard icon={Timer} label={t('time-spent')} value={spentStr} />
          <StatCard icon={RotateCcw} label={t('solves')} value={solvesCount.toString()} isCount />
        </div>
      </div>

      {/* Background image */}
      <div className="pointer-events-none select-none absolute -bottom-8 -right-8 opacity-[0.04] dark:opacity-[0.03] rotate-12 group-hover:rotate-6 group-hover:scale-110 transition-all duration-700">
        <Image
          src={bgImage}
          alt="icon"
          width={180}
          height={180}
          className={resolvedTheme === 'light' ? 'invert-100' : ''}
          unoptimized
        />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/5 to-transparent rounded-tr-full" />
    </div>
  )
}

interface StatCardProps {
  icon: any
  label: string
  value: string
  isCount?: boolean
}

function StatCard({ icon: Icon, label, value, isCount }: StatCardProps) {
  const [main, decimal] = value.includes('.') ? value.split('.') : [value, null]

  return (
    <div className="group/stat relative overflow-hidden rounded-xl bg-neutral-100/50 dark:bg-neutral-800/50 p-3 transition-all duration-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:cursor-default hover:shadow-md">
      <div className="relative z-10">
        <div className="flex items-center gap-1.5 mb-1">
          <div className={cn('size-5 rounded-md bg-gradient-to-br flex items-center justify-center shrink-0 bg-black')}>
            <Icon className="size-3 text-white" />
          </div>
        </div>

        <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold block mb-1">
          {label}
        </span>

        <div className="flex items-baseline">
          {value === '--' ? (
            <span className="text-base font-bold text-muted-foreground">--</span>
          ) : (
            <>
              <span className="text-base font-bold tracking-tight">{main}</span>
              {decimal && !isCount && <span className="text-xs font-medium text-muted-foreground">.{decimal}</span>}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
