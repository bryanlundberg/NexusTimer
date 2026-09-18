'use client'
import { useEffect, useRef } from 'react'
import { sendRealtime } from '@/features/realtime/model/realtime-bus'
import { useRealtimeEvent } from '@/features/realtime/model/useRealtimeEvent'
import { applyPresence, resendWatch, selfStatusStore } from '@/features/presence/model/presence-store'
import { isPresenceStatus } from '@/shared/lib/realtime/events'

const IDLE_AFTER_MS = 5 * 60 * 1000

const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const

export function usePresenceRealtime() {
  const isIdle = useRef(false)

  useRealtimeEvent((event) => {
    if (event.type === 'presence') applyPresence(event.users)
    if (event.type === 'presence:self' && isPresenceStatus(event.status)) selfStatusStore.set(event.status)
    if (event.type === 'realtime:connected') {
      resendWatch()
      if (isIdle.current) sendRealtime({ type: 'presence:idle', idle: true })
    }
  })

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined

    const report = (idle: boolean) => {
      if (isIdle.current === idle) return
      isIdle.current = idle
      sendRealtime({ type: 'presence:idle', idle })
    }

    const goActive = () => {
      report(false)
      clearTimeout(timer)
      timer = setTimeout(() => report(true), IDLE_AFTER_MS)
    }

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') goActive()
    }

    for (const name of ACTIVITY_EVENTS) window.addEventListener(name, goActive, { passive: true })
    document.addEventListener('visibilitychange', handleVisibility)
    goActive()

    return () => {
      clearTimeout(timer)
      for (const name of ACTIVITY_EVENTS) window.removeEventListener(name, goActive)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])
}

export default usePresenceRealtime
