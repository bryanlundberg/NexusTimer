export type RelationshipStatus = 'none' | 'pending_out' | 'pending_in' | 'friends' | 'blocked'

export interface FriendUser {
  _id: string
  name: string
  image: string
  country?: string
  wcaId?: string
  pronoun?: string
  method?: string
  bio?: string
}

export interface FriendEntry {
  user: FriendUser
  since: string
}

export interface FriendsResponse {
  friends: FriendEntry[]
  incoming: FriendEntry[]
  outgoing: FriendEntry[]
}

export interface RelationshipResponse {
  status: RelationshipStatus
  canRequest: boolean
  mutual: {
    count: number
    users: FriendUser[]
  }
}

export const FRIEND_REQUEST_ERRORS = ['requests-closed', 'request-cooldown', 'request-limit'] as const

export type FriendRequestError = (typeof FRIEND_REQUEST_ERRORS)[number]
