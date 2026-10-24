import { useMemo } from 'react'
import CubesList from '@/features/manage-cubes/ui/CubesList'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import EmptyCubes from '@/features/manage-cubes/ui/EmptyCubes'
import { getCategoryOrder } from '@/shared/const/cube-categories'
import { useTranslations } from 'next-intl'
import { useCubeCategoryQuery } from '@/features/filter-cube-category/model/useCubeCategoryQuery'

export default function CubesDashboard() {
  const cubes = useTimerStore((store) => store.cubes)
  const [category] = useCubeCategoryQuery()
  const t = useTranslations('Index')

  const sortedCubes = useMemo(() => {
    if (!cubes?.length) return []
    return cubes
      .filter((cube) => category === 'all' || cube.category === category)
      .sort((a, b) => {
        if (a.favorite !== b.favorite) return a.favorite ? -1 : 1
        const aActive = a.solves.session.length > 0
        const bActive = b.solves.session.length > 0
        if (aActive !== bActive) return aActive ? -1 : 1
        const categoryDiff = getCategoryOrder(a.category) - getCategoryOrder(b.category)
        if (categoryDiff !== 0) return categoryDiff
        return a.name.localeCompare(b.name)
      })
  }, [cubes, category])

  if (!cubes?.length) return <EmptyCubes className={'min-h-[70dvh]'} />
  if (!sortedCubes.length) {
    return <p className="py-12 text-center text-sm text-muted-foreground">{t('Inputs.no-results')}</p>
  }
  return <CubesList cubes={sortedCubes} />
}
