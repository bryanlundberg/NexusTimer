import { useMemo } from 'react'
import { aggregateByCube } from '@/shared/lib/aggregateByCube'
import { COLORS } from '@/shared/const/graph-colors'
import { BarsGraphCategoryProps } from '@/features/bars-chart-categories/model/types'

export default function useGraphCategories({ cubes, category }: BarsGraphCategoryProps) {
  const cubesResume = useMemo(() => {
    if (!category) return [] as ReturnType<typeof aggregateByCube>
    const safeCubes = cubes ?? []
    return aggregateByCube(safeCubes, category).filter((e) => e.solvesCount > 0 || e.totalTimeMs > 0)
  }, [cubes, category])

  const data = useMemo(() => {
    return [...cubesResume]
      .sort((a, b) => b.solvesCount - a.solvesCount)
      .map((d, i) => ({
        name: d.name,
        solves: d.solvesCount,
        fill: COLORS[i % COLORS.length]
      }))
  }, [cubesResume])

  return { data }
}
