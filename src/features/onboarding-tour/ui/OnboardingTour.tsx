'use client'
import { useJoyride } from 'react-joyride'
import { useOnboardingTour } from '@/features/onboarding-tour/model/useOnboardingTour'
import OnboardingTooltip from '@/features/onboarding-tour/ui/OnboardingTooltip'

export default function OnboardingTour() {
  const { run, stepIndex, steps, onEvent } = useOnboardingTour()

  const { Tour } = useJoyride({
    steps,
    run,
    stepIndex,
    continuous: true,
    onEvent,
    tooltipComponent: OnboardingTooltip,
    options: {
      zIndex: 10000,
      arrowColor: 'var(--popover)',
      arrowSize: 12,
      arrowBase: 26,
      offset: 14,
      overlayColor: 'color-mix(in oklab, var(--background) 78%, transparent)',
      spotlightRadius: 0,
      overlayClickAction: false,
      dismissKeyAction: false
    }
  })

  return Tour
}
