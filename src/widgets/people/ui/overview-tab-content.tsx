import EmptyTabContent from '@/widgets/people/ui/empty-tab-content'
import PeopleOverviewRow from '@/widgets/people/ui/PeopleOverviewRow'
import { CategoryStatsCard } from '@/widgets/people/ui/category-stats-card'
import type { CategoryStats } from '@/entities/user-stats/model/types'
import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'

const GRID = 'grid-cols-[minmax(9rem,1.2fr)_6rem_6rem_5rem_2rem]'

export { GRID }

const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } }

export default function OverviewTabContent({ categories }: { categories: CategoryStats[] }) {
  const tSolveCard = useTranslations('Index.PeoplePage.solve-card')
  const tCubes = useTranslations('Index.PeoplePage.cubes-tab')
  const tTimeline = useTranslations('Index.PeoplePage.timeline-tab')

  if (categories.length === 0) {
    return <EmptyTabContent />
  }

  const headers = [tTimeline('col-category'), tSolveCard('single'), tCubes('col-ao5'), tCubes('col-solves')]

  return (
    <>
      <motion.div initial="hidden" animate="show" variants={STAGGER} className="flex flex-col gap-2 @xl/tab:hidden">
        {categories.map((stats) => (
          <CategoryStatsCard key={stats.category} stats={stats} />
        ))}
      </motion.div>

      <div className="hidden overflow-x-auto border border-border/60 bg-card/40 @xl/tab:block">
        <div className="min-w-137">
          <div className={`grid ${GRID} items-center gap-x-4 px-3 py-2 border-b border-border/60 bg-muted/30`}>
            {headers.map((label, i) => (
              <span
                key={i}
                className="font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
              >
                {label}
              </span>
            ))}
            <span />
          </div>

          <motion.div initial="hidden" animate="show" variants={STAGGER}>
            {categories.map((stats) => (
              <PeopleOverviewRow key={stats.category} stats={stats} />
            ))}
          </motion.div>
        </div>
      </div>
    </>
  )
}
