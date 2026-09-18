import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import type { RealtimeTicketResponse } from '@/shared/lib/realtime/events'
import { emitRealtime, setRealtimeSender, type RealtimeClientEvent } from '@/features/realtime/model/realtime-bus'

const MAX_BACKOFF_MS = 30_000

export function useRealtimeConnection() {
  const { data: session } = useSession()
  const userId = session?.user?.id

  useEffect(() => {
    if (!userId) return

    let socket: WebSocket | null = null
    let connecting = false
    let retryTimer: ReturnType<typeof setTimeout> | undefined
    let attempt = 0
    let hasConnected = false
    let stopped = false

    const scheduleReconnect = () => {
      if (stopped || retryTimer) return
      const delay = Math.random() * Math.min(MAX_BACKOFF_MS, 1000 * 2 ** attempt)
      attempt++
      retryTimer = setTimeout(() => {
        retryTimer = undefined
        void connect()
      }, delay)
    }

    const connect = async () => {
      if (stopped || socket || connecting || !navigator.onLine) return
      connecting = true

      try {
        const res = await fetch('/api/v1/realtime/ticket', { method: 'POST' })
        if (res.status === 503) return
        if (!res.ok) return scheduleReconnect()

        const { url, ticket } = (await res.json()) as RealtimeTicketResponse
        if (stopped) return

        const ws = new WebSocket(`${url}?ticket=${encodeURIComponent(ticket)}`)
        socket = ws

        ws.onopen = () => {
          attempt = 0
          setRealtimeSender((data) => ws.send(data))
          emitRealtime({ type: 'realtime:connected' })
          if (hasConnected) emitRealtime({ type: 'realtime:reconnected' })
          hasConnected = true
        }
        ws.onmessage = (message) => {
          try {
            emitRealtime(JSON.parse(message.data) as RealtimeClientEvent)
          } catch {}
        }
        ws.onclose = () => {
          if (socket === ws) {
            socket = null
            setRealtimeSender(null)
          }
          scheduleReconnect()
        }
      } catch {
        scheduleReconnect()
      } finally {
        connecting = false
      }
    }

    const handleOnline = () => {
      attempt = 0
      void connect()
    }

    window.addEventListener('online', handleOnline)
    void connect()

    return () => {
      stopped = true
      window.removeEventListener('online', handleOnline)
      clearTimeout(retryTimer)
      setRealtimeSender(null)
      socket?.close(1000)
    }
  }, [userId])
}
