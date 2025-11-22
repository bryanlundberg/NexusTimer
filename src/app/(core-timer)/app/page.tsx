'use client'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo } from 'react'
import FadeIn from '@/shared/ui/fade-in/fade-in'
import TimerContainer from '@/features/timer/ui/TimerContainer'
import BackgroundAnimate from '@/shared/ui/background-animate/BackgroundAnimate'
import DialogFirstRunNoCubes from '@/components/dialogs/dialog-first-run-no-cubes/dialog-first-run-no-cubes'
import HeaderTimer from '@/features/timer/ui/HeaderTimer'
import { MainTimer } from '@/features/timer/ui/MainTimer'
import TimerWidgets from '@/features/timer/ui/TimerWidgets'
import ScrambleModal from '@/features/timer/ui/ScrambleModal'

export default function TimerPage() {
  const resetTimerStore = useTimerStore((state) => state.reset)
  const t = useTranslations('Metadata')
  const timerStatistics = useTimerStore((store) => store.timerStatistics)
  const lastSolve = useTimerStore((store) => store.lastSolve)
  const isSolving = useTimerStore((store) => store.isSolving)

  const isRecord = useMemo(() => {
    return timerStatistics.global.best === lastSolve?.time && !isSolving
  }, [isSolving, lastSolve, timerStatistics.global.best])

  useEffect(() => {
    resetTimerStore()
  }, [resetTimerStore])

  return (
    <>
      <FadeIn className={'flex flex-col grow relative'}>
        <h1 className="sr-only">{t('description')}</h1>
        <TimerContainer>
          <HeaderTimer />
          <MainTimer />
          <TimerWidgets />
        </TimerContainer>
        <ScrambleModal />

        {isRecord && <BackgroundAnimate />}
      </FadeIn>
      <DialogFirstRunNoCubes />
    </>
  )
}
