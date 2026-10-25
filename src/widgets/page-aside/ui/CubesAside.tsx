'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowLeftRight, Plus } from 'lucide-react'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import CreateCollectionForm from '@/features/manage-cubes/ui/CreateCollectionForm'
import { PageAside } from '@/shared/ui/page-aside/PageAside'
import { PageAsideSection } from '@/shared/ui/page-aside/PageAsideSection'
import { categoryBreakdown, liveSolves, solveTimestamp } from '@/widgets/page-aside/lib/asideStats'
import CubesCategorySection from '@/widgets/page-aside/ui/CubesCategorySection'
import CubesUsageSection, { CubeUsage } from '@/widgets/page-aside/ui/CubesUsageSection'
import AsideAction from '@/widgets/page-aside/ui/AsideAction'

export default function CubesAside() {
  const t = useTranslations('Index.PageAside')
  const cubes = useTimerStore((state) => state.cubes)
  const open = useOverlayStore((state) => state.open)

  const overview = useMemo(() => {
    const live = (cubes ?? []).filter((cube) => !cube.isDeleted)
    const recent: CubeUsage[] = live
      .map((cube) => {
        const solves = liveSolves(cube)
        return {
          cube,
          count: solves.length,
          lastAt: solves.length > 0 ? solveTimestamp(solves[0]) : null
        }
      })
      .filter((item) => item.lastAt !== null)
      .sort((a, b) => (b.lastAt ?? 0) - (a.lastAt ?? 0))
      .slice(0, 2)

    return {
      shares: categoryBreakdown(live),
      recent
    }
  }, [cubes])

  const handleCreate = () => {
    open({ id: 'create-cube', component: <CreateCollectionForm /> })
  }

  return (
    <PageAside>
      <CubesCategorySection shares={overview.shares} />
      <CubesUsageSection recent={overview.recent} />
      <PageAsideSection title={t('actions')}>
        <AsideAction icon={<Plus />} label={t('new-cube')} onClick={handleCreate} />
        <AsideAction icon={<ArrowLeftRight />} label={t('transfer-solves')} href="/transfer-solves" />
      </PageAsideSection>
    </PageAside>
  )
}
