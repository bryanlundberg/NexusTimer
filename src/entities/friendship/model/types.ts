export type RelationshipStatus = 'none' | 'pending_out' | 'pending_in' | 'friends'

export interface FriendUser {
  _id: string
  name: string
  image: string
  country?: string
  wcaId?: string
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
  mutual: {
    count: number
    users: FriendUser[]
  }
}
