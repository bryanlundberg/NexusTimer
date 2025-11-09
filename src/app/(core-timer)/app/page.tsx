'use client'
import HeaderTimer from '@/components/timer/HeaderTimer'
import TimerWidgets from '@/components/timer/TimerWidgets'
import TimerContainer from '@/components/timer/TimerContainer'
import { MainTimer } from '@/components/timer/MainTimer'
import ScrambleModal from '@/components/timer/ScrambleModal'
import FadeIn from '@/shared/ui/fade-in/fade-in'
import { useEffect, useMemo } from 'react'
import { useTimerStore } from '@/store/timerStore'
import { useTranslations } from 'next-intl'
import { FireworksBackground } from '@/components/ui/shadcn-io/fireworks-background'
import DialogFirstRunNoCubes from '@/components/dialogs/dialog-first-run-no-cubes/dialog-first-run-no-cubes'

export default function Home() {
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

        {isRecord && (
          <div className="absolute inset-0 z-1">
            <FireworksBackground
              fireworkSpeed={{ min: 8, max: 16 }}
              fireworkSize={{ min: 4, max: 10 }}
              particleSpeed={{ min: 4, max: 14 }}
              particleSize={{ min: 2, max: 10 }}
            />
          </div>
        )}
      </FadeIn>
      <DialogFirstRunNoCubes />
    </>
  )
}
