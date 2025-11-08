import { Cube } from '@/entities/cube/model/types'
import { CubeCard } from '@/features/manage-cubes/ui/CubeCard'

interface CubesListProps {
  cubes: Array<Cube>
}

export default function CubesList({ cubes }: CubesListProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {cubes.map((cube) => (
        <CubeCard cube={cube} key={cube.id} />
      ))}
    </div>
  )
}
