import { useCallback, useEffect, useRef } from 'react'
import { TimerMode } from '@/features/timer/model/enums'

type HandleHoldFunction = (isReleased: boolean) => void
type HandleReleaseFunction = () => void
type ResetTimerFunction = () => void

interface UseEventHandlersProps {
  timerMode: TimerMode
  handleHold: HandleHoldFunction
  handleRelease: HandleReleaseFunction
  resetTimer: ResetTimerFunction
  isSolving: boolean
}

export default function useEventHandlers({
  timerMode,
  handleHold,
  handleRelease,
  resetTimer,
  isSolving
}: UseEventHandlersProps) {
  const releasedKey = useRef<boolean>(true)

  const handleHoldWithReleasedState = useCallback(() => {
    handleHold(releasedKey.current)
    releasedKey.current = false
  }, [handleHold])

  const handleReleaseWithReleasedState = useCallback(() => {
    releasedKey.current = true
    handleRelease()
  }, [handleRelease])

  const resetAndRelease = useCallback(() => {
    releasedKey.current = true
    resetTimer()
  }, [resetTimer])

  useEffect(() => {
    if (timerMode === TimerMode.STACKMAT || timerMode === TimerMode.MANUAL || timerMode === TimerMode.NEXUS_CONNECT)
      return

    const isExcludedTouchTarget = (target: EventTarget | null): boolean => {
      const el = target as HTMLElement | null
      if (!el) return false
      const quickActionButtons = document.querySelector('#quick-action-buttons')
      if (quickActionButtons?.contains(el)) return true
      return !!el.closest('button, a, input, textarea, select, [role="button"]')
    }

    const handleTouchStart = (event: TouchEvent): void => {
      if (isExcludedTouchTarget(event.target)) return
      event.preventDefault()
      handleHoldWithReleasedState()
    }

    const handleTouchEnd = (event: TouchEvent): void => {
      if (isExcludedTouchTarget(event.target)) return
      event.preventDefault()
      handleReleaseWithReleasedState()
    }

    const isTypingTarget = (): boolean => {
      const ae = document.activeElement as HTMLElement | null
      if (!ae) return false
      const tag = ae.tagName?.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || ae.isContentEditable) return true
      // Also consider elements with role="textbox"
      const role = ae.getAttribute?.('role')
      return role === 'textbox'
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        resetAndRelease()
        return
      }
      if (isTypingTarget()) {
        return
      }
      if (event.code === 'Space') {
        handleHoldWithReleasedState()
        return
      }
      // For any other key: if the timer is running, stop it (treat as hold) without altering released state
      if (isSolving) {
        handleHold(true)
        releasedKey.current = true
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        resetAndRelease()
        return
      }
      if (event.code !== 'Space') {
        return
      }
      if (isTypingTarget()) {
        return
      }
      handleReleaseWithReleasedState()
    }

    const touchElements = document.querySelectorAll('#touch')

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    touchElements.forEach((element: any) => {
      element.addEventListener('touchstart', handleTouchStart)
      element.addEventListener('touchend', handleTouchEnd)
    })

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      touchElements.forEach((element: any) => {
        element.removeEventListener('touchstart', handleTouchStart)
        element.removeEventListener('touchend', handleTouchEnd)
      })
    }
  }, [handleHoldWithReleasedState, handleReleaseWithReleasedState, resetAndRelease, handleHold, isSolving, timerMode])

  return {
    isReleased: () => releasedKey.current
  }
}
