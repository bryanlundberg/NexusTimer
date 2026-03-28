import { useMemo } from 'react'
import _ from 'lodash'
import moment from 'moment'
import formatTime from '@/shared/lib/formatTime'
import EmptyTabContent from '@/widgets/people/ui/empty-tab-content'
import SolveCard from '@/widgets/people/ui/solve-card'
import { Cube } from '@/entities/cube/model/types'
import { CubeCategory } from '@/shared/const/cube-categories'
import { cubeCollection } from '@/shared/const/cube-collection'
import { useLocale } from 'next-intl'
import { motion } from 'framer-motion'

export default function OverviewTabContent({ cubes }: { cubes: Cube[] }) {
  const locale = useLocale()
  const solvesByCategory = useMemo(() => {
    return _.mapValues(
      _.groupBy(
        [
          ...cubes.flatMap((cube) => cube.solves.session.map((solve) => ({ ...solve, category: cube.category }))),
          ...cubes.flatMap((cube) => cube.solves.all.map((solve) => ({ ...solve, category: cube.category })))
        ],
        'category'
      ),
      (solves) => _.orderBy(solves, ['time'], ['asc'])
    )
  }, [cubes])

  if (_.isEmpty(solvesByCategory)) {
    return <EmptyTabContent />
  }

  return (
    <motion.div
      className="grid grid-cols-1 @2xl/tab:grid-cols-2 @5xl/tab:grid-cols-3 gap-4"
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.06 } }
      }}
    >
      {Object.entries(solvesByCategory)
        .sort()
        .map(([category, solves]) => (
          <motion.div
            key={solves[0].id}
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1 }
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <SolveCard
              event={category as CubeCategory}
              time={formatTime(solves[0].time)}
              date={moment(solves[0].endTime).locale(locale).format('LL')}
              bgImage={cubeCollection.find((c) => c.name === category)?.src || undefined}
              solves={solves}
            />
          </motion.div>
        ))}
    </motion.div>
  )
}
