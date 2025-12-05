'use client'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo } from 'react'
import FadeIn from '@/shared/ui/fade-in/fade-in'
import TimerContainer from '@/features/timer/ui/TimerContainer'
import BackgroundAnimate from '@/shared/ui/background-animate/BackgroundAnimate'
import DialogFirstRunNoCubes from '@/features/timer/ui/dialog-first-run-no-cubes'
import HeaderTimer from '@/features/timer/ui/HeaderTimer'
import { MainTimer } from '@/features/timer/ui/MainTimer'
import TimerWidgets from '@/features/timer/ui/TimerWidgets'
import ScrambleModal from '@/features/timer/ui/ScrambleModal'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'

export default function TimerPage() {
  const resetTimerStore = useTimerStore((state) => state.reset)
  const t = useTranslations('Metadata')
  const timerStatistics = useTimerStore((store) => store.timerStatistics)
  const lastSolve = useTimerStore((store) => store.lastSolve)
  const isSolving = useTimerStore((store) => store.isSolving)
  const cubes = useTimerStore((store) => store.cubes)
  const open = useOverlayStore((store) => store.open)

  const isRecord = useMemo(() => {
    return timerStatistics.global.best === lastSolve?.time && !isSolving
  }, [isSolving, lastSolve, timerStatistics.global.best])

  useEffect(() => {
    resetTimerStore()
  }, [resetTimerStore])

  useEffect(() => {
    if (!Array.isArray(cubes) || cubes.length === 0) {
      return open({
        id: 'no-cubes',
        component: <DialogFirstRunNoCubes />,
        metadata: {}
      })
    }
  }, [cubes, open])

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
    </>
  )
}
