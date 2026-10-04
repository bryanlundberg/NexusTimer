import type {
  FriendEntry,
  FriendRequestError,
  FriendsResponse,
  RelationshipResponse,
  RelationshipStatus
} from '@nexustimer/contracts'
import type { Mailer } from '../../infra/mail'
import type { RealtimePublisher } from '../../infra/realtime'
import type { RunInBackground } from '../../platform/background'
import type { UsersService } from '../users/users.service'
import type { FriendsCache } from './friends.cache'
import type { FriendRequestLimits } from './friend-requests.limits'
import type { FriendsRepository, StoredFriendship } from './friends.repository'
import type { SocialService } from './social.service'
import { friendRequestEmail } from './social.emails'

const MUTUAL_SAMPLE_SIZE = 3

export type FriendRequestResult =
  { status: RelationshipStatus } | { error: 'not-found' | 'blocked' | FriendRequestError }

export type FriendsService = {
  list(userId: string): Promise<FriendsResponse>
  relationship(userId: string, otherId: string): Promise<RelationshipResponse>
  request(userId: string, otherId: string): Promise<FriendRequestResult>
  remove(userId: string, otherId: string): Promise<void>
}

type FriendsDeps = {
  repository: FriendsRepository
  cache: Pick<FriendsCache, 'invalidate'>
  limits: FriendRequestLimits
  social: Pick<SocialService, 'mutualFriendIds' | 'blockState'>
  users: Pick<UsersService, 'exists' | 'friendUsers' | 'privacy' | 'mailContact'>
  realtime: Pick<RealtimePublisher, 'toUser' | 'toPair'>
  mail: Mailer
  appUrl: string
  background: RunInBackground
}

export function relationshipOf(doc: StoredFriendship | null, userId: string): RelationshipStatus {
  if (!doc) return 'none'
  if (doc.status === 'accepted') return 'friends'
  const isRequester = doc.requesterId === userId
  if (doc.status === 'declined') return isRequester && !doc.withdrawnAt ? 'pending_out' : 'none'
  return isRequester ? 'pending_out' : 'pending_in'
}

const otherUserId = (doc: StoredFriendship, userId: string) => doc.users.find((id) => id !== userId) ?? doc.users[0]!

export function createFriendsService({
  repository,
  cache,
  limits,
  social,
  users,
  realtime,
  mail,
  appUrl,
  background
}: FriendsDeps): FriendsService {
  async function acceptsRequestsFrom(targetId: string, userId: string, mutualCount?: number) {
    const { friendRequests } = await users.privacy(targetId)
    if (friendRequests === 'everyone') return true
    if (friendRequests === 'nobody') return false
    return (mutualCount ?? (await social.mutualFriendIds(userId, targetId)).length) > 0
  }

  async function refusalOf(userId: string, otherId: string): Promise<FriendRequestError | null> {
    if (!(await acceptsRequestsFrom(otherId, userId))) return 'requests-closed'
    if (await limits.onCooldown(userId, otherId)) return 'request-cooldown'
    if (!(await limits.consumeDaily(userId))) return 'request-limit'
    return null
  }

  async function currentStatus(userId: string, otherId: string) {
    return { status: relationshipOf(await repository.findPair(userId, otherId), userId) }
  }

  async function sendRequestEmail(senderId: string, recipientId: string) {
    const [senders, recipient, mutualIds] = await Promise.all([
      users.friendUsers([senderId]),
      users.mailContact(recipientId),
      social.mutualFriendIds(senderId, recipientId)
    ])
    const sender = senders.get(senderId)
    if (!sender || !recipient?.email || !recipient.privacy.friendRequestEmails) return
    if (!(await repository.claimRequestEmail(senderId, recipientId))) return

    const { name, image, wcaId } = sender
    await mail({
      to: recipient.email,
      ...friendRequestEmail({ sender: { id: senderId, name, image, wcaId }, mutualCount: mutualIds.length, appUrl })
    })
  }

  return {
    async list(userId) {
      const docs = await repository.listForUser(userId)
      const profiles = await users.friendUsers(
        docs.map((doc) => otherUserId(doc, userId)),
        true
      )

      const response: FriendsResponse = { friends: [], incoming: [], outgoing: [] }
      for (const doc of docs) {
        const user = profiles.get(otherUserId(doc, userId))
        if (!user) continue

        const status = relationshipOf(doc, userId)
        if (status === 'none') continue
        if (status === 'friends') {
          response.friends.push({ user, since: (doc.acceptedAt ?? doc.createdAt).toISOString() })
        } else {
          const entry: FriendEntry = { user, since: doc.createdAt.toISOString() }
          response[status === 'pending_in' ? 'incoming' : 'outgoing'].push(entry)
        }
      }
      return response
    },

    async relationship(userId, otherId) {
      const [friendship, mutualIds, block] = await Promise.all([
        repository.findPair(userId, otherId),
        social.mutualFriendIds(userId, otherId),
        social.blockState(userId, otherId)
      ])
      const sampleIds = mutualIds.slice(0, MUTUAL_SAMPLE_SIZE)
      const sample = await users.friendUsers(sampleIds)

      const status = block === 'blocked' ? 'blocked' : relationshipOf(friendship, userId)
      const canRequest =
        status === 'none' && block === 'none' && (await acceptsRequestsFrom(otherId, userId, mutualIds.length))

      return {
        status,
        canRequest,
        mutual: { count: mutualIds.length, users: sampleIds.flatMap((id) => sample.get(id) ?? []) }
      }
    },

    async request(userId, otherId) {
      if (!(await users.exists(otherId))) return { error: 'not-found' }

      const [existing, block] = await Promise.all([
        repository.findPair(userId, otherId),
        social.blockState(userId, otherId)
      ])
      if (block === 'blocked') return { error: 'blocked' }
      if (block === 'blocked_by') return { error: 'requests-closed' }

      const status = relationshipOf(existing, userId)
      const isRequester = existing?.requesterId === userId

      if (
        existing &&
        (status === 'pending_in' || (existing.status === 'declined' && !isRequester && !existing.withdrawnAt))
      ) {
        if (!(await repository.accept(existing.id, existing.status))) return currentStatus(userId, otherId)
        await cache.invalidate(userId, otherId)
        await realtime.toPair(userId, otherId, 'friend:accepted')
        return { status: 'friends' }
      }

      if (existing?.status === 'declined' && isRequester) {
        await repository.clearWithdrawn(existing.id)
        return { status: 'pending_out' }
      }

      if (status !== 'none') return { status }

      const refusal = await refusalOf(userId, otherId)
      if (refusal) return { error: refusal }

      if (existing?.status === 'declined') await repository.deleteById(existing.id, 'declined')

      if ((await repository.createRequest(userId, otherId)) === 'duplicate') return currentStatus(userId, otherId)
      await realtime.toPair(userId, otherId, 'friend:request')
      background('friend-request-email', () => sendRequestEmail(userId, otherId))
      return { status: 'pending_out' }
    },

    async remove(userId, otherId) {
      const existing = await repository.findPair(userId, otherId)
      if (!existing) return

      const isRequester = existing.requesterId === userId

      if (existing.status === 'accepted') {
        await repository.deleteById(existing.id)
        await cache.invalidate(userId, otherId)
        await realtime.toPair(userId, otherId, 'friend:removed')
      } else if (existing.status === 'pending' && isRequester) {
        await repository.deleteById(existing.id, 'pending')
        await limits.startCooldown(userId, otherId)
        await realtime.toPair(userId, otherId, 'friend:removed')
      } else if (existing.status === 'pending') {
        await repository.decline(existing.id)
        await realtime.toUser(userId, { type: 'friend:removed', userId: otherId })
      } else if (isRequester) {
        await repository.withdraw(existing.id)
      }
    }
  }
}
