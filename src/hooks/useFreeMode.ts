import { useEffect, useState } from 'react'
import { onDisconnect, onValue, ref, serverTimestamp, set, update } from '@firebase/database'
import { rtdb } from '@/firebase'
import { useSession } from 'next-auth/react'
import { TimerStatus } from '@/enums/TimerStatus'

interface UserPresence {
  id: string
  name: string
  image: string | null
  joinedAt: number
  status?: TimerStatus
}

interface UserSolves {
  time: number
  plus2: boolean
  dnf: boolean
  createdAt: number
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

  const useRoom = (roomId: string) => {
    const [room, setRoom] = useState(null)

    useEffect(() => {
      const roomRef = ref(rtdb, `rooms/${roomId}`)
      onValue(roomRef, (snapshot) => {
        const data = snapshot.val()
        setRoom(data)
      })
    }, [roomId])

    return room
  }

  const joinRoom = async (roomId: string, userId: string) => {
    const userRef = ref(rtdb, `rooms/${roomId}/presence/${userId}`)
    await onDisconnect(userRef).remove()
    await set(userRef, {
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
    const newSolveData = { ...solveData, createdAt: now }
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

  return {
    useRooms,
    useRoom,
    joinRoom,
    useRoomScramble,
    addUserSolve,
    useUsersPresence,
    updateUserPresenceStatus,
    leaveRoom
  }
}
