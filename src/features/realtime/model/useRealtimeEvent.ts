import { useEffect, useRef } from 'react'
import { subscribeRealtime, type RealtimeClientEvent } from '@/features/realtime/model/realtime-bus'

export function useRealtimeEvent(listener: (event: RealtimeClientEvent) => void) {
  const listenerRef = useRef(listener)

  useEffect(() => {
    listenerRef.current = listener
  })

  useEffect(() => subscribeRealtime((event) => listenerRef.current(event)), [])
}
