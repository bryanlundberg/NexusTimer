import { useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useCubeGridKeyboard } from '@/features/manage-cubes/model/useCubeGridKeyboard'
import { Cube } from '@/entities/cube/model/types'
import { CubeRow } from '@/features/manage-cubes/ui/CubeRow'

interface CubesListProps {
  cubes: Array<Cube>
}

export default function CubesList({ cubes }: CubesListProps) {
  const reduceMotion = useReducedMotion()
  const listRef = useRef<HTMLDivElement>(null)
  const onKeyDown = useCubeGridKeyboard(listRef)

  return (
    <div className="@container">
      <div ref={listRef} onKeyDown={onKeyDown} className="-mx-3 flex flex-col border-y border-border/50">
        {cubes.map((cube) => (
          <motion.div
            key={cube.id}
            layout={reduceMotion ? false : 'position'}
            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
            className="border-b border-border/50 last:border-b-0"
          >
            <CubeRow cube={cube} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
