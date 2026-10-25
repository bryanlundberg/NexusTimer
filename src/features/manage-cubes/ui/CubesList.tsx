import { Cube } from '@/entities/cube/model/types'
import { CubeCard } from '@/features/manage-cubes/ui/CubeCard'

interface CubesListProps {
  cubes: Array<Cube>
}

export default function CubesList({ cubes }: CubesListProps) {
  return (
    <div className="@container">
      <div className="grid grid-cols-1 @xl:grid-cols-2 @3xl:grid-cols-3 gap-4">
        {cubes.map((cube) => (
          <CubeCard key={cube.id} cube={cube} />
        ))}
      </div>
    </div>
  )
}
