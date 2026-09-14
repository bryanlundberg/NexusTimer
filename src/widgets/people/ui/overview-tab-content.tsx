import { useMemo } from 'react'
import { groupBy, orderBy } from 'es-toolkit'
import EmptyTabContent from '@/widgets/people/ui/empty-tab-content'
import PeopleOverviewRow, { type CategorySolve } from '@/widgets/people/ui/PeopleOverviewRow'
import { Cube } from '@/entities/cube/model/types'
import { getCategoryOrder } from '@/shared/const/cube-categories'
import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'

const GRID = 'grid-cols-[minmax(9rem,1.2fr)_6rem_6rem_5rem_2rem]'

export { GRID }

export default function OverviewTabContent({ cubes }: { cubes: Cube[] }) {
  const tSolveCard = useTranslations('Index.PeoplePage.solve-card')
  const tCubes = useTranslations('Index.PeoplePage.cubes-tab')
  const tTimeline = useTranslations('Index.PeoplePage.timeline-tab')

  const solvesByCategory = useMemo(() => {
    const flat: CategorySolve[] = [
      ...cubes.flatMap((cube) =>
        cube.solves.session.map((solve) => ({ ...solve, category: cube.category, cubeName: cube.name }))
      ),
      ...cubes.flatMap((cube) =>
        cube.solves.all.map((solve) => ({ ...solve, category: cube.category, cubeName: cube.name }))
      )
    ].filter((s) => !s.isDeleted)

    return groupBy(flat, (solve) => solve.category)
  }, [cubes])

  const rows = useMemo(
    () => orderBy(Object.entries(solvesByCategory), [([category]) => getCategoryOrder(category)], ['asc']),
    [solvesByCategory]
  )

  if (Object.keys(solvesByCategory).length === 0) {
    return <EmptyTabContent />
  }

  const headers = [tTimeline('col-category'), tSolveCard('single'), tCubes('col-ao5'), tCubes('col-solves')]

  return (
    <div className="overflow-x-auto border border-border/60 bg-card/40">
      <div className="min-w-137">
        {/* Table header */}
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

        {/* Rows */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
        >
          {rows.map(([category, solves]) => (
            <PeopleOverviewRow key={category} category={category} solves={solves} />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
