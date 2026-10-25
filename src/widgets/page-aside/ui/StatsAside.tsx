'use client'

import { useMemo, useState } from 'react'
import { useNow, useTranslations } from 'next-intl'
import { ListOrdered } from 'lucide-react'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { PageAside } from '@/shared/ui/page-aside/PageAside'
import { PageAsideSection } from '@/shared/ui/page-aside/PageAsideSection'
import { categorySolves, findRecords, liveSolves, monthlySeries } from '@/widgets/page-aside/lib/asideStats'
import RecordsSection, { RecordScope } from '@/widgets/page-aside/ui/RecordsSection'
import ProgressSection from '@/widgets/page-aside/ui/ProgressSection'
import AsideAction from '@/widgets/page-aside/ui/AsideAction'

export default function StatsAside() {
  const t = useTranslations('Index.PageAside')
  const now = useNow({ updateInterval: 3_600_000 })
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const cubes = useTimerStore((state) => state.cubes)
  const [scope, setScope] = useState<RecordScope>('cube')

  const solves = useMemo(() => {
    if (!selectedCube) return []
    return scope === 'category' ? categorySolves(cubes ?? [], selectedCube.category) : liveSolves(selectedCube)
  }, [cubes, selectedCube, scope])
  const records = useMemo(() => findRecords(solves), [solves])
  const months = useMemo(() => monthlySeries(solves, now.getTime()), [solves, now])
  const lastRecordAt = records.length > 0 ? Math.max(...records.map((record) => record.at)) : null

  return (
    <PageAside>
      <RecordsSection records={records} scope={scope} onScopeChange={setScope} />
      <ProgressSection months={months} lastRecordAt={lastRecordAt} />
      <PageAsideSection title={t('actions')}>
        <AsideAction icon={<ListOrdered />} label={t('view-solves')} href="/solves" />
      </PageAsideSection>
    </PageAside>
  )
}
