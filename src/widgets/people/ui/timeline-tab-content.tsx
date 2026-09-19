import { motion } from 'motion/react'
import EmptyTabContent from '@/widgets/people/ui/empty-tab-content'
import type { RecentSolve } from '@/entities/user-stats/model/types'
import { CubeCategoryTile } from '@/shared/ui/cube-category-icon/CubeCategoryIcon'
import formatTime from '@/shared/lib/formatTime'
import dayjs from '@/shared/lib/dayjs'
import { useLocale, useTranslations } from 'next-intl'

interface TimelineTabContentProps {
  solves: RecentSolve[]
  totalSolves: number
}

const GRID = 'grid-cols-[min-content_minmax(0,13rem)_7rem_minmax(16rem,1.5fr)_8rem]'

export default function TimelineTabContent({ solves, totalSolves }: TimelineTabContentProps) {
  const locale = useLocale()
  const t = useTranslations('Index.PeoplePage.timeline-tab')

  if (solves.length === 0) return <EmptyTabContent />

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border border-border/60 bg-card/40">
        <div className="min-w-[780px]">
          {/* Header */}
          <div className={`grid ${GRID} items-center gap-x-4 px-3 py-2 border-b border-border/60 bg-muted/30`}>
            {(['#', t('col-cube'), t('col-time'), t('col-scramble'), t('col-date')] as const).map((label) => (
              <span
                key={label}
                className="font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
              >
                {label}
              </span>
            ))}
          </div>

          {/* Rows */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03 } } }}
          >
            {solves.map((solve, i) => {
              const globalIndex = totalSolves - i

              return (
                <motion.div
                  key={solve.id}
                  className={`grid ${GRID} items-center gap-x-4 px-3 py-2.5 border-b border-border/40 last:border-b-0 hover:bg-muted/20 border-l-2 border-l-transparent hover:border-l-primary transition-colors duration-150`}
                  variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  {/* # */}
                  <span className="text-xs font-mono text-muted-foreground tabular-nums text-left select-none">
                    {String(globalIndex).padStart(2, '0')}
                  </span>

                  <div className="flex items-center gap-3 min-w-0">
                    <CubeCategoryTile category={solve.category} />
                    <span className="text-xs font-medium text-foreground/80 truncate" title={solve.cubeName}>
                      {solve.cubeName}
                    </span>
                  </div>

                  {/* Time */}
                  <div className="flex items-baseline gap-1">
                    {solve.dnf ? (
                      <span className="text-sm font-bold text-destructive">DNF</span>
                    ) : (
                      <>
                        <TimeDisplay value={formatTime(solve.time)} />
                        {solve.plus2 && <span className="text-[10px] font-bold text-destructive">+2</span>}
                      </>
                    )}
                  </div>

                  <span className="text-[10px] font-mono text-muted-foreground/70 break-all leading-relaxed">
                    {solve.scramble}
                  </span>

                  {/* Date */}
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {dayjs(solve.startTime).locale(locale).format('ll · HH:mm')}
                  </span>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function TimeDisplay({ value }: { value: string }) {
  const [main, decimal] = value.includes('.') ? value.split('.') : [value, null]
  return (
    <div className="flex items-baseline gap-0.5">
      <span className="text-sm font-bold tabular-nums">{main}</span>
      {decimal && <span className="text-xs text-muted-foreground tabular-nums">.{decimal}</span>}
    </div>
  )
}
