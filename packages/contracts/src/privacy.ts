import * as z from 'zod'

export const FRIEND_REQUEST_POLICIES = ['everyone', 'friends_of_friends', 'nobody'] as const

export type FriendRequestPolicy = (typeof FRIEND_REQUEST_POLICIES)[number]

export const STATS_VISIBILITIES = ['everyone', 'friends', 'nobody'] as const

export type StatsVisibility = (typeof STATS_VISIBILITIES)[number]

export interface PrivacySettings {
  friendRequests: FriendRequestPolicy
  statsVisibility: StatsVisibility
  friendRequestEmails: boolean
  readReceipts: boolean
  typingIndicator: boolean
}

export const DEFAULT_PRIVACY: PrivacySettings = {
  friendRequests: 'everyone',
  statsVisibility: 'everyone',
  friendRequestEmails: true,
  readReceipts: true,
  typingIndicator: true
}

export const updatePrivacySchema = z
  .object({
    friendRequests: z.enum(FRIEND_REQUEST_POLICIES),
    statsVisibility: z.enum(STATS_VISIBILITIES),
    friendRequestEmails: z.boolean(),
    readReceipts: z.boolean(),
    typingIndicator: z.boolean()
  })
  .partial()
  .strict()

export type UpdatePrivacyInput = z.infer<typeof updatePrivacySchema>

export const resolvePrivacy = (stored?: Partial<PrivacySettings> | null): PrivacySettings => ({
  friendRequests: stored?.friendRequests ?? DEFAULT_PRIVACY.friendRequests,
  statsVisibility: stored?.statsVisibility ?? DEFAULT_PRIVACY.statsVisibility,
  friendRequestEmails: stored?.friendRequestEmails ?? DEFAULT_PRIVACY.friendRequestEmails,
  readReceipts: stored?.readReceipts ?? DEFAULT_PRIVACY.readReceipts,
  typingIndicator: stored?.typingIndicator ?? DEFAULT_PRIVACY.typingIndicator
})

export function canViewStats(
  visibility: StatsVisibility,
  ownerId: string,
  viewerId: string | null | undefined,
  isFriend: boolean
): boolean {
  if (viewerId === ownerId || visibility === 'everyone') return true
  return visibility === 'friends' && !!viewerId && isFriend
}
