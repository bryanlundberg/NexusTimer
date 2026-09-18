export const FRIEND_REQUEST_POLICIES = ['everyone', 'friends_of_friends', 'nobody'] as const

export type FriendRequestPolicy = (typeof FRIEND_REQUEST_POLICIES)[number]

export const STATS_VISIBILITIES = ['everyone', 'friends', 'nobody'] as const

export type StatsVisibility = (typeof STATS_VISIBILITIES)[number]

export interface PrivacySettings {
  friendRequests: FriendRequestPolicy
  statsVisibility: StatsVisibility
  readReceipts: boolean
  typingIndicator: boolean
}

export const DEFAULT_PRIVACY: PrivacySettings = {
  friendRequests: 'everyone',
  statsVisibility: 'everyone',
  readReceipts: true,
  typingIndicator: true
}

export const resolvePrivacy = (stored?: Partial<PrivacySettings> | null): PrivacySettings => ({
  friendRequests: stored?.friendRequests ?? DEFAULT_PRIVACY.friendRequests,
  statsVisibility: stored?.statsVisibility ?? DEFAULT_PRIVACY.statsVisibility,
  readReceipts: stored?.readReceipts ?? DEFAULT_PRIVACY.readReceipts,
  typingIndicator: stored?.typingIndicator ?? DEFAULT_PRIVACY.typingIndicator
})
