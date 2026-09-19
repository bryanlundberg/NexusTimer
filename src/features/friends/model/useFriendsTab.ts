'use client'
import { useQueryState } from 'nuqs'
import { FRIENDS_TAB_DEFAULT, FRIENDS_TAB_QS_KEY, FriendsTabs } from '@/widgets/friends/model/types'

export function useFriendsTab() {
  const [value, set] = useQueryState(FRIENDS_TAB_QS_KEY, {
    defaultValue: FRIENDS_TAB_DEFAULT
  })
  return { value: value as FriendsTabs, set: (v: FriendsTabs) => set(v) }
}

export { FriendsTabs }
