import { useEffect, useState } from 'react'
import { onValue, ref } from '@firebase/database'
import { rtdb } from '@/shared/config/firebase'

export function useServerTimeOffset(): number {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const offsetRef = ref(rtdb, '.info/serverTimeOffset')
    const unsubscribe = onValue(offsetRef, (snapshot) => {
      const value = snapshot.val()
      if (typeof value === 'number') setOffset(value)
    })
    return () => unsubscribe()
  }, [])

  return offset
}

export default useServerTimeOffset
