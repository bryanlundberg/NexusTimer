import { useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { ROOM_PROTOCOL_VERSION } from '@nexustimer/contracts'
import { sendRealtime } from '@/features/realtime/model/realtime-bus'
import { useRealtimeEvent } from '@/features/realtime/model/useRealtimeEvent'
import { isRoomEvent, nextRid } from '@/features/free-play-room/model/room-requests'
import { forgetReportedStatus } from '@/features/free-play-room/model/room-actions'
import { useRoomStore } from '@/features/free-play-room/model/useRoomStore'

let pendingLeave: { roomId: string; timer: ReturnType<typeof setTimeout> } | null = null

// Deferred so a remount of the same room (React strict mode, layout changes) does not leave and lose the seat.
function leaveSoon(roomId: string) {
  pendingLeave = {
    roomId,
    timer: setTimeout(() => {
      pendingLeave = null
      sendRealtime({ type: 'room:leave', roomId })
      if (useRoomStore.getState().roomId === roomId) useRoomStore.getState().reset()
    }, 0)
  }
}

function cancelLeave(roomId: string) {
  if (pendingLeave?.roomId !== roomId) return
  clearTimeout(pendingLeave.timer)
  pendingLeave = null
}

export function useRoomSession(roomId: string | null, enabled: boolean) {
  const t = useTranslations('Multiplayer')

  const join = useCallback(
    (code?: string) => {
      if (!roomId) return
      const rid = nextRid()
      useRoomStore.getState().begin(roomId, rid, Boolean(code))
      forgetReportedStatus()
      sendRealtime({ type: 'room:join', rid, roomId, protocol: ROOM_PROTOCOL_VERSION, ...(code ? { code } : {}) })
    },
    [roomId]
  )

  useEffect(() => {
    if (!enabled || !roomId) return
    cancelLeave(roomId)
    join()
    return () => leaveSoon(roomId)
  }, [enabled, roomId, join])

  useRealtimeEvent((event) => {
    if (!enabled || !roomId) return
    if (event.type === 'realtime:connected') {
      const { phase } = useRoomStore.getState()
      if (phase === 'joining' || phase === 'joined') join()
      return
    }
    if (!isRoomEvent(event)) return

    const state = useRoomStore.getState()
    if (event.type === 'room:error' && event.roomId === roomId && event.rid !== state.joinRid) {
      toast.error(t('action-failed'))
      return
    }
    state.apply(event)
  })

  return { join }
}
