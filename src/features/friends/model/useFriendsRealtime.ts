import { useSWRConfig } from 'swr'
import { FRIENDS_KEY, relationshipKey } from '@/entities/friendship/model/useFriends'
import { useRealtimeEvent } from '@/features/realtime/model/useRealtimeEvent'
import { FRIENDS_RANKING_KEY } from '@/features/friends/model/useFriendsRanking'

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
        void mutate(FRIENDS_RANKING_KEY)
        break
      case 'realtime:reconnected':
        void mutate(FRIENDS_KEY)
        void mutate(isRelationshipKey)
        break
    }
  })
}
