import { useEffect, useState } from 'react'
import { onDisconnect, onValue, ref, serverTimestamp, set, update } from '@firebase/database'
import { rtdb } from '@/firebase'
import { useSession } from 'next-auth/react'

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
    await update(solveRef, { [Date.now()]: solveData })
  }

  const useUsersPresence = (roomId: string) => {
    const [users, setUsers] = useState([])

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

  const useRoomPresence = (roomId: string) => {
    const [presence, setPresence] = useState(null)

    useEffect(() => {
      const presenceRef = ref(rtdb, `rooms/${roomId}/presence`)
      onValue(presenceRef, (snapshot) => {
        const data = snapshot.val()
        setPresence(data)
      })
    }, [roomId])

    return presence
  }

  return {
    useRooms,
    useRoom,
    joinRoom,
    useRoomScramble,
    addUserSolve,
    useUsersPresence,
    updateUserPresenceStatus,
    useRoomPresence,
    leaveRoom
  }
}
