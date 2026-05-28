import { Cube } from '@/entities/cube/model/types'
import { CubeCard } from '@/features/manage-cubes/ui/CubeCard'

interface CubesListProps {
  cubes: Array<Cube>
}

export default function CubesList({ cubes }: CubesListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
      {cubes.map((cube) => (
        <CubeCard key={cube.id} cube={cube} />
      ))}
    </div>
  )
}
