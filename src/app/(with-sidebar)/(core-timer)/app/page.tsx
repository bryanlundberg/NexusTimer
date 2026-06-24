'use client'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useTranslations } from 'next-intl'
import * as React from 'react'
import { useEffect } from 'react'
import TimerContainer from '@/features/timer/ui/TimerContainer'
import HeaderTimer from '@/features/timer/ui/HeaderTimer'
import { MainTimer } from '@/features/timer/ui/MainTimer'
import TimerWidgets from '@/features/timer/ui/TimerWidgets'
import ScrambleModal from '@/features/timer/ui/ScrambleModal'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { PageBody } from '@/shared/ui/page-body/PageBody'
import OnboardingTour from '@/features/onboarding-tour/ui/OnboardingTour'
import TimerSolvesRail from '@/features/timer-solves-rail/ui/TimerSolvesRail'

export default function TimerPage() {
  const resetTimerStore = useTimerStore((state) => state.reset)
  const t = useTranslations('Metadata')
  const tHomePage = useTranslations('Index.HomePage')

  useEffect(() => {
    resetTimerStore()
  }, [])

  return (
    <div className="flex flex-col grow min-h-0 relative">
      <h1 className="sr-only">{t('description')}</h1>
      <CoreHeader breadcrumbs={[{ label: tHomePage('title'), href: '/app' }]} />
      <div className="flex grow min-h-0">
        <PageBody variant="data" className="flex flex-col grow min-w-0">
          <TimerContainer>
            <HeaderTimer />
            <MainTimer />
            <TimerWidgets />
          </TimerContainer>
        </PageBody>
        <TimerSolvesRail />
      </div>
      <ScrambleModal />
      <OnboardingTour />
    </div>
  )
}
