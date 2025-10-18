import { useEffect, useState } from 'react'
import { onDisconnect, onValue, ref, serverTimestamp, set } from '@firebase/database'
import { rtdb } from '@/firebase'

export default function useFreeMode() {
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

  return { useRooms, useRoom }
}
