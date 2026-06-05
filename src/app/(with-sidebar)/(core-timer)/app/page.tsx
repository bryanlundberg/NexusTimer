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

export default function TimerPage() {
  const resetTimerStore = useTimerStore((state) => state.reset)
  const t = useTranslations('Metadata')
  const tHomePage = useTranslations('Index.HomePage')

  useEffect(() => {
    resetTimerStore()
  }, [])

  return (
    <div className="flex flex-col grow relative">
      <h1 className="sr-only">{t('description')}</h1>
      <CoreHeader breadcrumbs={[{ label: tHomePage('title'), href: '/app' }]} />
      <PageBody variant="data" className="flex flex-col grow">
        <TimerContainer>
          <HeaderTimer />
          <MainTimer />
          <TimerWidgets />
        </TimerContainer>
      </PageBody>
      <ScrambleModal />
    </div>
  )
}
