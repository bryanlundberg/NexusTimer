'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { HardwareAdapter, TimerState } from '../types'
import { DEFAULT_TIMER_STATE } from '../types'

interface UseHardwareTimerOptions<TOptions> {
  adapter: HardwareAdapter<TOptions> | null
  connectOptions?: TOptions
  /** Automatically connect on mount */
  autoConnect?: boolean
}

interface UseHardwareTimerReturn {
  state: TimerState
  isConnecting: boolean
  isConnected: boolean
  error: Error | null
  connect: () => Promise<void>
  disconnect: () => void
}

export function useHardwareTimer<TOptions>({
  adapter,
  connectOptions,
  autoConnect = false
}: UseHardwareTimerOptions<TOptions>): UseHardwareTimerReturn {
  const [state, setState] = useState<TimerState>(DEFAULT_TIMER_STATE)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const connectedRef = useRef(false)

  const connect = useCallback(async () => {
    if (!adapter || connectedRef.current) return
    setIsConnecting(true)
    setError(null)
    try {
      adapter.onState(setState)
      await adapter.connect(connectOptions)
      connectedRef.current = true
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setIsConnecting(false)
    }
  }, [adapter, connectOptions])

  const disconnect = useCallback(() => {
    adapter?.disconnect()
    connectedRef.current = false
    setState(DEFAULT_TIMER_STATE)
    setError(null)
  }, [adapter])

  useEffect(() => {
    if (autoConnect) connect()
    return () => {
      if (connectedRef.current) adapter?.disconnect()
      connectedRef.current = false
    }
  }, [])

  return {
    state,
    isConnecting,
    isConnected: connectedRef.current,
    error,
    connect,
    disconnect
  }
}
