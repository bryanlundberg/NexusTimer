import { useEffect, useState } from 'react'
import useSWR from 'swr'
import type { RoomSummary } from '@nexustimer/contracts'
import { fetcher } from '@/shared/lib/fetcher'
import { useSession } from '@/shared/model/useSession'
import { sendRealtime } from '@/features/realtime/model/realtime-bus'
import { useRealtimeEvent } from '@/features/realtime/model/useRealtimeEvent'
import { nextRid } from '@/features/free-play-room/model/room-requests'

// Everyone gets the list over HTTP first; signed-in players then follow it live over the socket.
export function useRoomLobby(): RoomSummary[] {
  const { data: session } = useSession()
  const signedIn = Boolean(session?.user?.id)
  const { data } = useSWR<RoomSummary[]>('/api/v1/rooms', fetcher)
  const [live, setLive] = useState<RoomSummary[] | null>(null)

  useEffect(() => {
    if (!signedIn) return
    sendRealtime({ type: 'rooms:watch', rid: nextRid() })
    return () => {
      sendRealtime({ type: 'rooms:unwatch' })
      setLive(null)
    }
  }, [signedIn])

  useRealtimeEvent((event) => {
    if (!signedIn) return
    if (event.type === 'realtime:connected') sendRealtime({ type: 'rooms:watch', rid: nextRid() })
    if (event.type === 'rooms:lobby') setLive(event.rooms)
  })

  return live ?? (Array.isArray(data) ? data : [])
}
