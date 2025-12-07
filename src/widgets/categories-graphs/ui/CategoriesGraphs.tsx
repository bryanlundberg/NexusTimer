import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import PieGraphCategory from '@/features/pie-chart-categories/ui/PieGraphCategory'
import BarsGraphCategories from '@/features/bars-chart-categories/ui/BarsChartCategories'

export default function CategoriesGraphs() {
  const selectedCube = useTimerStore((s) => s.selectedCube)
  const cubes = useTimerStore((s) => s.cubes)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <PieGraphCategory category={selectedCube?.category} cubes={cubes || []} />
      <BarsGraphCategories category={selectedCube?.category} cubes={cubes || []} />
    </div>
  )
}
