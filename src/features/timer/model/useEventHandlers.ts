import { useEffect, useRef } from 'react'
import { TimerMode } from '@/features/timer/model/enums'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { eventTime } from '@/features/timer/lib/eventTime'

type HandleHoldFunction = (isReleased: boolean, at?: number) => void
type HandleReleaseFunction = (at?: number) => void
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
  const pendingTouchEnds = useRef(new Set<() => void>())
  const activationKey = useSettingsStore((state) => state.settings.timer.activationKey) || 'Space'

  const handleHoldWithReleasedState = (at?: number) => {
    handleHold(releasedKey.current, at)
    releasedKey.current = false
  }

  const handleReleaseWithReleasedState = (at?: number) => {
    releasedKey.current = true
    handleRelease(at)
  }

  const resetAndRelease = () => {
    releasedKey.current = true
    resetTimer()
  }

  useEffect(() => {
    if (
      timerMode === TimerMode.STACKMAT ||
      timerMode === TimerMode.MANUAL ||
      timerMode === TimerMode.NEXUS_CONNECT ||
      timerMode === TimerMode.KEYBOARD_STACKMAT
    )
      return

    const isExcludedTouchTarget = (target: EventTarget | null): boolean => {
      const el = target as HTMLElement | null
      if (!el) return false
      const quickActionButtons = document.querySelector('#quick-action-buttons')
      if (quickActionButtons?.contains(el)) return true
      return !!el.closest('button, a, input, textarea, select, [role="button"], [data-no-timer-touch]')
    }

    // touchend goes to the element where the touch started, even after a re-render removed it,
    // so the release is listened for on that element instead of on the #touch containers.
    const handleTouchStart = (event: TouchEvent): void => {
      if (isExcludedTouchTarget(event.target)) return
      event.preventDefault()
      const target = event.target
      const touch = event.changedTouches?.[0]
      if (target && touch) {
        const finish = (end: Event) => {
          const changed = Array.from((end as TouchEvent).changedTouches ?? [])
          if (!changed.some((ended) => ended.identifier === touch.identifier)) return
          detach()
          if (end.type !== 'touchend') return
          end.preventDefault()
          latest.current.handleReleaseWithReleasedState(eventTime(end))
        }
        const detach = () => {
          target.removeEventListener('touchend', finish)
          target.removeEventListener('touchcancel', finish)
          pendingTouchEnds.current.delete(detach)
        }
        target.addEventListener('touchend', finish)
        target.addEventListener('touchcancel', finish)
        pendingTouchEnds.current.add(detach)
      }
      handleHoldWithReleasedState(eventTime(event))
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
      if (event.repeat || isTypingTarget()) {
        return
      }
      if (event.code === activationKey) {
        handleHoldWithReleasedState(eventTime(event))
        return
      }
      // For any other key: if the timer is running, stop it (treat as hold) without altering released state
      if (isSolving) {
        handleHold(true, eventTime(event))
        releasedKey.current = true
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        resetAndRelease()
        return
      }
      if (event.code !== activationKey) {
        return
      }
      if (isTypingTarget()) {
        return
      }
      handleReleaseWithReleasedState(eventTime(event))
    }

    const touchElements = Array.from(document.querySelectorAll('#touch')).filter(
      (element) => !element.parentElement?.closest('#touch')
    )

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    touchElements.forEach((element) => {
      element.addEventListener('touchstart', handleTouchStart as EventListener, { passive: false })
    })

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      touchElements.forEach((element) => {
        element.removeEventListener('touchstart', handleTouchStart as EventListener)
      })
    }
  }, [
    handleHoldWithReleasedState,
    handleReleaseWithReleasedState,
    resetAndRelease,
    handleHold,
    isSolving,
    timerMode,
    activationKey
  ])

  useEffect(() => {
    const pending = pendingTouchEnds.current
    return () => pending.forEach((detach) => detach())
  }, [])

  // KEYBOARD STACKMAT MODE
  // Simulates a Stackmat with the keyboard: both Ctrl keys (left + right) must be
  // held together to count as preparation. Releasing either one triggers the release
  // (starts inspection/hold or the solve, same state machine as Normal mode).
  // Any key stops a running solve (same behaviour as Normal mode).
  const leftCtrlDown = useRef<boolean>(false)
  const rightCtrlDown = useRef<boolean>(false)
  const bothEngaged = useRef<boolean>(false)

  // Keep the latest callbacks/state in a ref so the keyboard-stackmat listeners can
  // be attached ONCE per mode (below) without being torn down on every re-render.
  // Re-subscribing on a re-render and resetting the Ctrl-held flags would drop an
  // in-progress gesture and prevent the timer from starting. The touch release
  // listeners also read the latest callbacks from here.
  const latest = useRef({
    handleHold,
    handleHoldWithReleasedState,
    handleReleaseWithReleasedState,
    resetAndRelease,
    isSolving
  })
  latest.current = {
    handleHold,
    handleHoldWithReleasedState,
    handleReleaseWithReleasedState,
    resetAndRelease,
    isSolving
  }

  useEffect(() => {
    if (timerMode !== TimerMode.KEYBOARD_STACKMAT) return

    const isTypingTarget = (): boolean => {
      const ae = document.activeElement as HTMLElement | null
      if (!ae) return false
      const tag = ae.tagName?.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || ae.isContentEditable) return true
      const role = ae.getAttribute?.('role')
      return role === 'textbox'
    }

    const clearCtrlState = () => {
      leftCtrlDown.current = false
      rightCtrlDown.current = false
      bothEngaged.current = false
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        clearCtrlState()
        latest.current.resetAndRelease()
        return
      }
      if (event.repeat || isTypingTarget()) return

      // While solving, any key stops the timer (matches Normal mode).
      if (latest.current.isSolving) {
        latest.current.handleHold(true, eventTime(event))
        releasedKey.current = true
        clearCtrlState()
        return
      }

      if (event.code === 'ControlLeft') leftCtrlDown.current = true
      else if (event.code === 'ControlRight') rightCtrlDown.current = true
      else return

      // Engage preparation only once both Ctrl keys are held together.
      if (leftCtrlDown.current && rightCtrlDown.current && !bothEngaged.current) {
        bothEngaged.current = true
        latest.current.handleHoldWithReleasedState(eventTime(event))
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        clearCtrlState()
        latest.current.resetAndRelease()
        return
      }
      if (event.code !== 'ControlLeft' && event.code !== 'ControlRight') return
      if (isTypingTarget()) return

      if (event.code === 'ControlLeft') leftCtrlDown.current = false
      if (event.code === 'ControlRight') rightCtrlDown.current = false

      // Releasing either Ctrl while both were engaged triggers the release.
      if (bothEngaged.current) {
        bothEngaged.current = false
        latest.current.handleReleaseWithReleasedState(eventTime(event))
      }
    }

    const handleBlur = () => clearCtrlState()

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleBlur)
      clearCtrlState()
    }
  }, [timerMode])

  return {
    isReleased: () => releasedKey.current
  }
}
