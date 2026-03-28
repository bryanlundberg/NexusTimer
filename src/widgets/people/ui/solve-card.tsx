import * as React from 'react'
import { CircleSlash2, RotateCcw, Timer } from 'lucide-react'
import { CubeCategory } from '@/shared/const/cube-categories'
import Image from 'next/image'
import { Solve } from '@/entities/solve/model/types'
import calculateBestAo from '@/shared/lib/statistics/calculateBestAo'
import formatTime from '@/shared/lib/formatTime'
import { defer } from 'es-toolkit/compat'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

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
    <motion.div
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card transition-colors duration-300 hover:border-border"
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/70 rounded-l-2xl" />

      <div className="pl-5 pr-5 pt-5 pb-4">
        {/* Category row */}
        <div className="flex items-center gap-2.5 mb-5">
          <motion.div
            className="relative size-10 rounded-lg bg-muted/60 flex items-center justify-center"
            whileHover={{ rotate: 12 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <Image src={bgImage} alt={event} width={26} height={26} className="object-contain" unoptimized />
          </motion.div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold tracking-tight truncate">{event}</h3>
            <span className="text-[10px] text-muted-foreground">{date}</span>
          </div>
        </div>

        {/* Stats grid — 2x2 */}
        <div className="grid grid-cols-2 gap-3">
          <StatItem label={t('single')} value={time} hero />
          <StatItem icon={CircleSlash2} label={t('ao5')} value={ao5Str} />
          <StatItem icon={Timer} label={t('time-spent')} value={spentStr} />
          <StatItem icon={RotateCcw} label={t('solves')} value={solvesCount.toString()} isCount />
        </div>
      </div>
    </motion.div>
  )
}

interface StatItemProps {
  icon?: any
  label: string
  value: string
  isCount?: boolean
  hero?: boolean
}

function StatItem({ icon: Icon, label, value, isCount, hero }: StatItemProps) {
  const [main, decimal] = value.includes('.') ? value.split('.') : [value, null]

  return (
    <div className={hero ? 'flex flex-col' : 'flex flex-col'}>
      <div className="flex items-center gap-1 mb-1">
        {Icon && <Icon className="size-3 text-muted-foreground/60" />}
        <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-medium">{label}</span>
      </div>
      <div className="flex items-baseline">
        {value === '--' ? (
          <span className={`${hero ? 'text-2xl' : 'text-base'} font-bold text-muted-foreground`}>--</span>
        ) : (
          <>
            <span className={`${hero ? 'text-2xl font-black' : 'text-base font-bold'} tracking-tight tabular-nums`}>
              {main}
            </span>
            {decimal && !isCount && (
              <span className={`${hero ? 'text-sm' : 'text-xs'} text-muted-foreground`}>.{decimal}</span>
            )}
          </>
        )}
      </div>
    </div>
  )
}
