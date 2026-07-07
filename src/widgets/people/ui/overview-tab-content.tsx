import { useMemo } from 'react'
import _ from 'lodash'
import EmptyTabContent from '@/widgets/people/ui/empty-tab-content'
import PeopleOverviewRow, { type CategorySolve } from '@/widgets/people/ui/PeopleOverviewRow'
import { Cube } from '@/entities/cube/model/types'
import { getCategoryOrder } from '@/shared/const/cube-categories'
import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'

const GRID = 'grid-cols-[minmax(9rem,1.2fr)_6rem_6rem_minmax(6rem,1fr)_8.5rem_5rem_3.5rem_3.5rem_7rem]'

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

    return _.groupBy(flat, 'category')
  }, [cubes])

  const rows = useMemo(
    () => _.orderBy(Object.entries(solvesByCategory), ([category]) => getCategoryOrder(category), 'asc'),
    [solvesByCategory]
  )

  if (_.isEmpty(solvesByCategory)) {
    return <EmptyTabContent />
  }

  const headers = [
    tTimeline('col-category'),
    tSolveCard('single'),
    tCubes('col-ao5'),
    tTimeline('col-cube-record'),
    tTimeline('col-date'),
    tCubes('col-solves'),
    '+2',
    'DNF',
    tCubes('col-distribution')
  ]

  return (
    <div className="overflow-x-auto">
      <div className="min-w-205">
        {/* Table header */}
        <div className={`grid ${GRID} items-center gap-x-4 px-3 py-2 border-b border-border/60`}>
          {headers.map((label, i) => (
            <span key={i} className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {label}
            </span>
          ))}
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
