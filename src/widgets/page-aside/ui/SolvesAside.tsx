'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowLeftRight, ChartNoAxesColumn } from 'lucide-react'
import { Solve } from '@/entities/solve/model/types'
import { PageAside } from '@/shared/ui/page-aside/PageAside'
import { PageAsideSection } from '@/shared/ui/page-aside/PageAsideSection'
import { summarizeSolves } from '@/widgets/page-aside/lib/asideStats'
import SolvesSummarySection from '@/widgets/page-aside/ui/SolvesSummarySection'
import DistributionSection from '@/widgets/page-aside/ui/DistributionSection'
import AsideAction from '@/widgets/page-aside/ui/AsideAction'

interface SolvesAsideProps {
  solves: Solve[]
  isSession: boolean
}

export default function SolvesAside({ solves, isSession }: SolvesAsideProps) {
  const t = useTranslations('Index.PageAside')
  const visible = useMemo(() => solves.filter((solve) => !solve.isDeleted), [solves])
  const summary = useMemo(() => summarizeSolves(visible), [visible])

  return (
    <PageAside>
      <SolvesSummarySection title={isSession ? t('session-summary') : t('history-summary')} summary={summary} />
      <DistributionSection solves={visible} />
      <PageAsideSection title={t('actions')}>
        <AsideAction icon={<ChartNoAxesColumn />} label={t('view-stats')} href="/stats" />
        <AsideAction icon={<ArrowLeftRight />} label={t('transfer-solves')} href="/transfer-solves" />
      </PageAsideSection>
    </PageAside>
  )
}
