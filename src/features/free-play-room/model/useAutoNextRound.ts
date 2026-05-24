import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import useFreeMode from '@/features/free-play-room/model/useFreeMode'
import genScramble from '@/shared/lib/timer/genScramble'
import { CubeCategory } from '@/shared/const/cube-categories'

interface UseAutoNextRoundArgs {
  roomId: string | null
  event: string
  maxRoundTime: number | null
  scramble: string
  currentRound: number
  alreadySolvedInFirebase: boolean
  onlineUsers: any[]
  solves: Record<string, Record<string, any>>
}

export function useAutoNextRound({
  roomId,
  event,
  maxRoundTime,
  scramble,
  currentRound,
  alreadySolvedInFirebase,
  onlineUsers,
  solves
}: UseAutoNextRoundArgs) {
  const { updateRoomScramble, updateRoomRoundLimit, incrementRoomRound } = useFreeMode()
  const { data: session } = useSession()

  useEffect(() => {
    if (!session?.user?.id || !roomId || !event || !maxRoundTime || !scramble) return

    const onlineUserIds = Array.isArray(onlineUsers)
      ? onlineUsers.map((user) => user.id)
      : Object.values(onlineUsers || {}).map((user: any) => user.id)

    if (onlineUserIds.length === 0) return

    const usersThatSolved = onlineUserIds.filter((userId) => {
      const userSolves = solves[userId]
      return userSolves && Object.values(userSolves).some((solve: any) => solve.roundIndex === currentRound)
    })

    if (
      usersThatSolved.length === onlineUserIds.length &&
      usersThatSolved.includes(session.user.id) &&
      alreadySolvedInFirebase
    ) {
      const durationMs = maxRoundTime * 1000
      const newScramble = genScramble(event as CubeCategory)
      updateRoomScramble(roomId, newScramble)
      updateRoomRoundLimit(roomId, durationMs)
      incrementRoomRound(roomId, currentRound + 1)
    }
    // useFreeMode functions intentionally omitted — see useFreePlayPresence note.
  }, [
    solves,
    scramble,
    onlineUsers,
    session?.user?.id,
    roomId,
    event,
    maxRoundTime,
    currentRound,
    alreadySolvedInFirebase
  ])
}
