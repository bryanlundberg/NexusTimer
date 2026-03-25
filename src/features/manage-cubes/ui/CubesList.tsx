import { Cube } from '@/entities/cube/model/types'
import { CubeCard } from '@/features/manage-cubes/ui/CubeCard'
import { motion } from 'motion/react'

interface CubesListProps {
  cubes: Array<Cube>
}

export default function CubesList({ cubes }: CubesListProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
      {cubes.map((cube, index) => (
        <motion.div
          key={cube.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: Math.min(index * 0.05, 0.4),
            ease: 'easeOut'
          }}
        >
          <CubeCard cube={cube} />
        </motion.div>
      ))}
    </div>
  )
}
