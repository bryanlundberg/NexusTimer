import { useEffect, useState } from 'react'
import { onDisconnect, onValue, ref, serverTimestamp, set, update } from '@firebase/database'
import { rtdb } from '@/shared/config/firebase'
import { useSession } from 'next-auth/react'
import { TimerStatus } from '@/features/timer/model/enums'

interface UserPresence {
  id: string
  name: string
  image: string | null
  joinedAt: number
  status?: TimerStatus
}

export interface UserSolves {
  time: number
  plus2: boolean
  dnf: boolean
  createdAt: number
  scramble: string
  roundIndex: number
  userName?: string
  userImage?: string | null
}

export default function useFreeMode() {
  const { data: session } = useSession()

  const useRooms = () => {
    const [rooms, setRooms] = useState([])

    useEffect(() => {
      const usersRef = ref(rtdb, 'rooms')
      onValue(usersRef, (snapshot) => {
        const data = snapshot.val()
        setRooms(data ? Object.values(data) : [])
      })
    }, [])

    return rooms
  }

  const joinRoom = async (roomId: string, userId: string) => {
    const userRef = ref(rtdb, `rooms/${roomId}/presence/${userId}`)
    await onDisconnect(userRef).remove()
    await update(userRef, {
      joinedAt: serverTimestamp(),
      name: session?.user?.name || 'Anonymous',
      id: userId,
      image: session?.user?.image || null
    })
  }

  const leaveRoom = async (roomId: string, userId: string) => {
    const userRef = ref(rtdb, `rooms/${roomId}/presence/${userId}`)
    await set(userRef, null)
  }

  const useRoomScramble = (roomId: string) => {
    const [scramble, setScramble] = useState('')

    useEffect(() => {
      const scrambleRef = ref(rtdb, `rooms/${roomId}/scramble`)
      onValue(scrambleRef, (snapshot) => {
        const data = snapshot.val()
        setScramble(data)
      })
    }, [roomId])

    return scramble
  }

  const addUserSolve = async (roomId: string, userId: string, solveData: any) => {
    const solveRef = ref(rtdb, `rooms/${roomId}/solves/${userId}`)
    const now = serverTimestamp()
    const newSolveData = {
      ...solveData,
      createdAt: now,
      userName: session?.user?.name || 'Anonymous',
      userImage: session?.user?.image || null
    }
    await update(solveRef, { [Date.now()]: newSolveData })
  }

  const useUsersPresence = (roomId: string) => {
    const [users, setUsers] = useState<UserPresence[]>([])

    useEffect(() => {
      const presenceRef = ref(rtdb, `rooms/${roomId}/presence`)
      onValue(presenceRef, (snapshot) => {
        const data = snapshot.val()
        setUsers(data ? Object.values(data) : [])
      })
    }, [roomId])

    return users
  }

  const updateUserPresenceStatus = async (roomId: string, userId: string, data = {}) => {
    const userRef = ref(rtdb, `rooms/${roomId}/presence/${userId}`)
    await update(userRef, {
      ...data
    })
  }

  const useRoomAuthority = (roomId: string) => {
    const [authorityId, setAuthorityId] = useState<string | null>(null)

    useEffect(() => {
      const authorityRef = ref(rtdb, `rooms/${roomId}/authority`)
      onValue(authorityRef, (snapshot) => {
        const data = snapshot.val()
        setAuthorityId(data)
      })
    }, [roomId])

    return authorityId
  }

  const updateRoomAuthority = async (roomId: string, userId: string) => {
    const authorityRef = ref(rtdb, `rooms/${roomId}/authority`)
    await set(authorityRef, userId)
  }

  const useRoomSolves = (roomId: string) => {
    const [solves, setSolves] = useState<{ [userId: string]: { [solveId: string]: UserSolves } }>({})

    useEffect(() => {
      const solvesRef = ref(rtdb, `rooms/${roomId}/solves`)
      onValue(solvesRef, (snapshot) => {
        const data = snapshot.val()
        setSolves(data || {})
      })
    }, [roomId])

    return solves
  }

  const useRoomRoundLimit = (roomId: string) => {
    const [timeLimit, setTimeLimit] = useState<number | null>(null)

    useEffect(() => {
      const timeLimitRef = ref(rtdb, `rooms/${roomId}/currentRoundTimeLimit`)
      onValue(timeLimitRef, (snapshot) => {
        const data = snapshot.val()
        setTimeLimit(data)
      })
    }, [roomId])

    return timeLimit
  }

  const updateRoomRoundLimit = async (roomId: string, roundDurationMs: number) => {
    const timeLimitRef = ref(rtdb, `rooms/${roomId}/currentRoundTimeLimit`)

    const currentRoundTimeLimit = Date.now() + roundDurationMs
    await set(timeLimitRef, currentRoundTimeLimit)
  }

  const updateRoomScramble = async (roomId: string, scramble: string) => {
    const scrambleRef = ref(rtdb, `rooms/${roomId}/scramble`)
    await set(scrambleRef, scramble)
  }

  const useRoomEvent = (roomId: string) => {
    const [event, setEvent] = useState<string>('3x3')

    useEffect(() => {
      const eventRef = ref(rtdb, `rooms/${roomId}/event`)
      onValue(eventRef, (snapshot) => {
        const data = snapshot.val()
        setEvent(data || '3x3')
      })
    }, [roomId])

    return event
  }

  const useMaxRoundTime = (roomId: string) => {
    const [maxRoundTime, setMaxRoundTime] = useState<number | null>(null)

    useEffect(() => {
      const maxRoundTimeRef = ref(rtdb, `rooms/${roomId}/maxRoundTime`)
      onValue(maxRoundTimeRef, (snapshot) => {
        const data = snapshot.val()
        setMaxRoundTime(data)
      })
    }, [roomId])

    return maxRoundTime
  }

  const useRoomIsPrivate = (roomId: string) => {
    const [isPrivate, setIsPrivate] = useState<boolean | null>(null)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
      const hashRef = ref(rtdb, `rooms/${roomId}/passwordHash`)
      onValue(hashRef, (snapshot) => {
        setIsPrivate(snapshot.val() !== null)
        setLoaded(true)
      })
    }, [roomId])

    return { isPrivate, loaded }
  }

  const useRoomCreatedBy = (roomId: string) => {
    const [createdBy, setCreatedBy] = useState<string | null>(null)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
      const createdByRef = ref(rtdb, `rooms/${roomId}/createdBy`)
      onValue(createdByRef, (snapshot) => {
        setCreatedBy(snapshot.val())
        setLoaded(true)
      })
    }, [roomId])

    return { createdBy, loaded }
  }

  const useRoomCurrentRound = (roomId: string) => {
    const [currentRound, setCurrentRound] = useState<number>(1)

    useEffect(() => {
      const roundRef = ref(rtdb, `rooms/${roomId}/currentRound`)
      onValue(roundRef, (snapshot) => {
        const data = snapshot.val()
        setCurrentRound(data ?? 1)
      })
    }, [roomId])

    return currentRound
  }

  const incrementRoomRound = async (roomId: string, nextRound: number) => {
    const roundRef = ref(rtdb, `rooms/${roomId}/currentRound`)
    await set(roundRef, nextRound)
  }

  return {
    useRooms,
    joinRoom,
    useRoomScramble,
    addUserSolve,
    useUsersPresence,
    updateUserPresenceStatus,
    leaveRoom,
    useRoomAuthority,
    updateRoomAuthority,
    useRoomSolves,
    useRoomRoundLimit,
    updateRoomRoundLimit,
    updateRoomScramble,
    useRoomEvent,
    useMaxRoundTime,
    useRoomCurrentRound,
    incrementRoomRound,
    useRoomIsPrivate,
    useRoomCreatedBy
  }
}
