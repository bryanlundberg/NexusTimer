import * as React from 'react'
import _ from 'lodash'
import EmptyTabContent from '@/widgets/people/ui/empty-tab-content'
import { Cube } from '@/entities/cube/model/types'
import PeopleCubeCard from '@/widgets/people/ui/PeopleCubeCard'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

interface CubesTabContentProps {
  cubes: Cube[]
}

const GRID = 'grid-cols-[3rem_minmax(0,1fr)_5.5rem_5.5rem_4rem_7rem_9rem]'

const COL_LABELS = ['NAME', 'BEST', 'AO5', 'SOLVES', 'TIME', 'DISTRIBUTION']

export { GRID }

export default function CubesTabContent({ cubes }: CubesTabContentProps) {
  const t = useTranslations('Index.CubesPage')

  if (_.isEmpty(cubes)) {
    return <EmptyTabContent />
  }

  const sortedCubes = _.orderBy(cubes, (cube) => cube.solves.session.length + cube.solves.all.length, 'desc')

  return (
    <div className="rounded-xl border border-border/60 overflow-hidden">
      {/* Table header */}
      <div className={`grid ${GRID} items-center gap-x-4 px-3 py-2 border-b border-border/60 bg-muted/30`}>
        <span />
        {COL_LABELS.map((label) => (
          <span key={label} className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
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
        {sortedCubes.length ? (
          sortedCubes.map((cube, i) => <PeopleCubeCard key={cube.id} cube={cube} index={i} />)
        ) : (
          <div className="py-8 text-center text-sm text-muted-foreground">{t('no-cubes-for-display')}</div>
        )}
      </motion.div>
    </div>
  )
}
