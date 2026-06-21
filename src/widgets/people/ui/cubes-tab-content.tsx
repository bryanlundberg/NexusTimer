import * as React from 'react'
import _ from 'lodash'
import EmptyTabContent from '@/widgets/people/ui/empty-tab-content'
import { Cube } from '@/entities/cube/model/types'
import PeopleCubeCard from '@/widgets/people/ui/PeopleCubeCard'
import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'

interface CubesTabContentProps {
  cubes: Cube[]
}

const GRID = 'grid-cols-[3rem_minmax(10rem,1fr)_5.5rem_5.5rem_4rem_7rem_9rem]'

export { GRID }

export default function CubesTabContent({ cubes }: CubesTabContentProps) {
  const t = useTranslations('Index.CubesPage')
  const tPeople = useTranslations('Index.PeoplePage.cubes-tab')

  if (_.isEmpty(cubes)) {
    return <EmptyTabContent />
  }

  const sortedCubes = _.orderBy(cubes, (cube) => cube.solves.session.length + cube.solves.all.length, 'desc')

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[720px]">
        {/* Table header */}
        <div className={`grid ${GRID} items-center gap-x-4 px-3 py-2 border-b border-border/60`}>
          <span />
          {(['col-name', 'col-best', 'col-ao5', 'col-solves', 'col-time', 'col-distribution'] as const).map((key) => (
            <span key={key} className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {tPeople(key)}
            </span>
          ))}
        </div>

        {/* Rows */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
        >
          {sortedCubes.length ? (
            sortedCubes.map((cube, i) => <PeopleCubeCard key={cube.id} cube={cube} index={i} />)
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">{t('no-cubes-for-display')}</div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
