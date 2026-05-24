import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { TimerStatus } from '@/features/timer/model/enums'
import useFreeMode from '@/features/free-play-room/model/useFreeMode'

interface UseFreePlayPresenceArgs {
  roomId: string | null
  timerStatus: TimerStatus
  disableTimer: boolean
  isSolving: boolean
}

export function useFreePlayPresence({ roomId, timerStatus, disableTimer, isSolving }: UseFreePlayPresenceArgs) {
  const { updateUserPresenceStatus } = useFreeMode()
  const { data: session } = useSession()

  useEffect(() => {
    if (!session?.user?.id || !roomId) return

    const status = disableTimer && !isSolving ? TimerStatus.WAITING_NEXT_ROUND : timerStatus
    updateUserPresenceStatus(roomId, session.user.id, { status })
    // updateUserPresenceStatus intentionally omitted: useFreeMode() returns a new
    // function reference on every render and including it would cause a render loop
    // via onValue → setUsers → re-render → new fn → effect refires.
  }, [timerStatus, disableTimer, isSolving, session?.user?.id, roomId])
}
