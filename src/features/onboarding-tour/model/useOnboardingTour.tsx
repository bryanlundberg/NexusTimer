'use client'
import { useEffect, useState } from 'react'
import { ACTIONS, EVENTS, STATUS, type EventData, type Step } from 'react-joyride'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { useOnboardingStore } from '@/features/onboarding-tour/model/useOnboardingStore'

const SELECT_OVERLAY_ID = 'Select Collection'
const CREATE_OVERLAY_ID = 'create-cube'

const STEP = {
  WELCOME: 0,
  OPEN_SELECTOR: 1,
  CREATE_COLLECTION: 2
} as const

export function useOnboardingTour() {
  const t = useTranslations('Index.OnboardingTour')
  const { status } = useSession()
  const cubes = useTimerStore((state) => state.cubes)
  const activeOverlay = useOverlayStore((state) => state.activeOverlay)
  const hasCompletedTour = useOnboardingStore((state) => state.hasCompletedTour)
  const markCompleted = useOnboardingStore((state) => state.markCompleted)
  const setLockSelectClose = useOnboardingStore((state) => state.setLockSelectClose)

  const [run, setRun] = useState(false)
  const [stepIndex, setStepIndex] = useState<number>(STEP.WELCOME)

  const totalSolves = cubes?.reduce((acc, cube) => acc + cube.solves.all.length, 0) ?? 0

  const finish = () => {
    setRun(false)
    setStepIndex(STEP.WELCOME)
    markCompleted()
  }

  useEffect(() => {
    if (hasCompletedTour || status !== 'unauthenticated' || cubes == null || totalSolves > 0) return
    const id = setTimeout(() => setRun(true), 500)
    return () => clearTimeout(id)
  }, [cubes, totalSolves, hasCompletedTour, status])

  useEffect(() => {
    if (!run) return
    const overlayId = activeOverlay?.id ?? null

    if (stepIndex === STEP.OPEN_SELECTOR && overlayId === SELECT_OVERLAY_ID) {
      setStepIndex(STEP.CREATE_COLLECTION)
    } else if (stepIndex === STEP.CREATE_COLLECTION && overlayId === CREATE_OVERLAY_ID) {
      finish()
    }
  }, [run, stepIndex, activeOverlay])

  // While pointing at the "create collection" button (inside the selector
  // dialog), lock that dialog so an outside click/ESC won't close it — the user
  // must click the button to proceed.
  useEffect(() => {
    setLockSelectClose(run && stepIndex === STEP.CREATE_COLLECTION)
    return () => setLockSelectClose(false)
  }, [run, stepIndex, setLockSelectClose])

  // Pulse the actual element the user must click. The target can mount slightly
  // after the step changes (dialogs), so poll briefly until it appears.
  useEffect(() => {
    if (!run) return
    const selectorByStep: Record<number, string> = {
      [STEP.OPEN_SELECTOR]: '[data-tour="onboarding-cube-selector"]',
      [STEP.CREATE_COLLECTION]: '[data-tour="onboarding-create-collection"]'
    }
    const selector = selectorByStep[stepIndex]
    if (!selector) return

    let current: HTMLElement | null = null
    const id = window.setInterval(() => {
      const found = document.querySelector<HTMLElement>(selector)
      if (found && found !== current) {
        current?.classList.remove('onboarding-pulse')
        found.classList.add('onboarding-pulse')
        current = found
      }
    }, 100)

    return () => {
      window.clearInterval(id)
      current?.classList.remove('onboarding-pulse')
    }
  }, [run, stepIndex])

  const steps: Step[] = [
    {
      target: 'body',
      placement: 'center',
      title: t('welcome.title'),
      content: t('welcome.content'),
      buttons: ['primary', 'skip'],
      data: { nexi: 'hello' },
      locale: { next: t('welcome.cta'), skip: t('welcome.dismiss') }
    },
    {
      target: '[data-tour="onboarding-cube-selector"]',
      placement: 'bottom',
      title: t('select.title'),
      content: t('select.content'),
      buttons: ['skip'],
      data: { nexi: 'think' },
      locale: { skip: t('skip') },
      spotlightPadding: 10
    },
    {
      target: '[data-tour="onboarding-create-collection"]',
      placement: 'bottom',
      title: t('create.title'),
      content: t('create.content'),
      buttons: ['skip'],
      data: { nexi: 'wink' },
      locale: { skip: t('skip') },
      isFixed: true,
      spotlightPadding: 10
    }
  ]

  const onEvent = (data: EventData) => {
    const { action, index, status, type } = data

    if (status === STATUS.SKIPPED || status === STATUS.FINISHED) {
      finish()
      return
    }

    if (type === EVENTS.STEP_AFTER && action === ACTIONS.NEXT && index === STEP.WELCOME) {
      setStepIndex(STEP.OPEN_SELECTOR)
    }
  }

  return { run, stepIndex, steps, onEvent }
}
