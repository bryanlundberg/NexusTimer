import { motion, useReducedMotion } from 'motion/react'
import { Cube } from '@/entities/cube/model/types'
import { CubeCard } from '@/features/manage-cubes/ui/CubeCard'

interface CubesListProps {
  cubes: Array<Cube>
}

export default function CubesList({ cubes }: CubesListProps) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="@container">
      <div className="grid grid-cols-1 @xl:grid-cols-2 @3xl:grid-cols-3 gap-4">
        {cubes.map((cube) => (
          <motion.div
            key={cube.id}
            layout={reduceMotion ? false : 'position'}
            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
            className="grid"
          >
            <CubeCard cube={cube} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
