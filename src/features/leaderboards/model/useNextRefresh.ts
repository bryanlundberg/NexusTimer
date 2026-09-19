'use client'

import { useEffect, useRef, useState } from 'react'
import { HOUR_MS } from '@/shared/lib/hourly-window'

const JITTER_MS = 30_000

const RETRY_MS = 15_000

export function useNextRefresh(nextRefreshAt: string | undefined, refresh: () => void) {
  const [remainingMs, setRemainingMs] = useState<number | null>(null)
  const [deadlineIso, setDeadlineIso] = useState<string>()
  const refreshRef = useRef(refresh)

  useEffect(() => {
    refreshRef.current = refresh
  })

  useEffect(() => {
    if (nextRefreshAt) setDeadlineIso(nextRefreshAt)
  }, [nextRefreshAt])

  useEffect(() => {
    const deadline = deadlineIso ? Date.parse(deadlineIso) : Number.NaN

    if (Number.isNaN(deadline)) {
      setRemainingMs(null)
      return
    }

    let askAt: number | null = null

    const tick = () => {
      const now = Date.now()
      setRemainingMs(Math.min(HOUR_MS, Math.max(0, deadline - now)))

      if (now < deadline) return

      if (askAt === null) {
        askAt = now + Math.random() * JITTER_MS
        return
      }

      if (now >= askAt) {
        askAt = now + RETRY_MS
        refreshRef.current()
      }
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [deadlineIso])

  return remainingMs
}
