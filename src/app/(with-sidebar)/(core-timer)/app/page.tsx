'use client'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useTranslations } from 'next-intl'
import * as React from 'react'
import { useEffect, useRef } from 'react'
import FadeIn from '@/shared/ui/fade-in/fade-in'
import TimerContainer from '@/features/timer/ui/TimerContainer'
import DialogFirstRunNoCubes from '@/features/timer/ui/dialog-first-run-no-cubes'
import HeaderTimer from '@/features/timer/ui/HeaderTimer'
import { MainTimer } from '@/features/timer/ui/MainTimer'
import TimerWidgets from '@/features/timer/ui/TimerWidgets'
import ScrambleModal from '@/features/timer/ui/ScrambleModal'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { fireConfetti } from '@/shared/lib/fireConfetti'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'

export default function TimerPage() {
  const resetTimerStore = useTimerStore((state) => state.reset)
  const t = useTranslations('Metadata')
  const timerStatistics = useTimerStore((store) => store.timerStatistics)
  const lastSolve = useTimerStore((store) => store.lastSolve)
  const isSolving = useTimerStore((store) => store.isSolving)
  const cubes = useTimerStore((store) => store.cubes)
  const open = useOverlayStore((store) => store.open)
  const lastRecordRef = useRef<number | null | undefined>(null)
  const tHomePage = useTranslations('Index.HomePage')

  useEffect(() => {
    resetTimerStore()
  }, [])

  useEffect(() => {
    if (!Array.isArray(cubes) || cubes.length === 0) {
      return open({
        id: 'no-cubes',
        component: <DialogFirstRunNoCubes />,
        metadata: {}
      })
    }
  }, [cubes, open])

  useEffect(() => {
    const isRecord = timerStatistics.global.best === lastSolve?.time && !isSolving
    if (!isRecord) return
    if (lastRecordRef.current === lastSolve?.time) return

    lastRecordRef.current = lastSolve?.time
    fireConfetti()
  }, [lastSolve?.time, timerStatistics.global.best, isSolving])

  return (
    <>
      <FadeIn className={'flex flex-col grow relative'}>
        <h1 className="sr-only">{t('description')}</h1>
        <CoreHeader breadcrumbPath={'/app'} breadcrumb={tHomePage('title')} />
        <TimerContainer>
          <HeaderTimer />
          <MainTimer />
          <TimerWidgets />
        </TimerContainer>
        <ScrambleModal />
      </FadeIn>
    </>
  )
}
