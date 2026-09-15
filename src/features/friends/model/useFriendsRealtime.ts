import { useSWRConfig } from 'swr'
import { FRIENDS_KEY, relationshipKey } from '@/entities/friendship/model/useFriends'
import { useRealtimeEvent } from '@/features/realtime/model/useRealtimeEvent'

const isRelationshipKey = (key: unknown) => typeof key === 'string' && key.startsWith(`${FRIENDS_KEY}/`)

export function useFriendsRealtime() {
  const { mutate } = useSWRConfig()

  useRealtimeEvent((event) => {
    switch (event.type) {
      case 'friend:request':
      case 'friend:accepted':
      case 'friend:removed':
        void mutate(FRIENDS_KEY)
        void mutate(relationshipKey(event.userId))
        break
      case 'realtime:reconnected':
        // Events sent while disconnected are lost, so refetch everything friends-related
        void mutate(FRIENDS_KEY)
        void mutate(isRelationshipKey)
        break
    }
  })
}
