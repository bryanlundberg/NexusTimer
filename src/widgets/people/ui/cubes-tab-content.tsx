import { orderBy } from 'es-toolkit'
import { motion } from 'motion/react'
import EmptyTabContent from '@/widgets/people/ui/empty-tab-content'
import type { CubeStats } from '@/entities/user-stats/model/types'
import { CubeStatsCard } from '@/widgets/people/ui/cube-stats-card'

interface CubesTabContentProps {
  cubes: CubeStats[]
}

export default function CubesTabContent({ cubes }: CubesTabContentProps) {
  if (cubes.length === 0) {
    return <EmptyTabContent />
  }

  const sortedCubes = orderBy(cubes, [({ counts }) => counts.ok + counts.plus2 + counts.dnf], ['desc'])

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
      className="grid grid-cols-1 gap-2 @xl/tab:grid-cols-2"
    >
      {sortedCubes.map((cube) => (
        <CubeStatsCard key={cube.id} cube={cube} />
      ))}
    </motion.div>
  )
}
