import { afterEach, describe, expect, it, vi } from 'vitest'
import { UserAchievementModel } from '../src/modules/achievements/achievements.model'
import { achievementsUserData } from '../src/modules/achievements/achievements.repository'
import { conversationsUserData } from '../src/modules/chats/chats.repository'
import { ConversationModel } from '../src/modules/chats/conversation.model'
import { MessageModel } from '../src/modules/chats/message.model'
import { BlockModel } from '../src/modules/social/blocks.model'
import { blocksUserData } from '../src/modules/social/blocks.repository'
import { FriendRequestEmailLogModel } from '../src/modules/social/friend-request-email-log.model'
import { friendRequestEmailsUserData, friendshipsUserData } from '../src/modules/social/friends.repository'
import { FriendshipModel } from '../src/modules/social/friendship.model'

const USER = '64b7f0c2a1b2c3d4e5f60718'
const OTHER = '64b7f0c2a1b2c3d4e5f60719'
const ref = { id: USER, email: 'ana@test.dev' }

const deleted = (deletedCount: number) => ({ deletedCount }) as never
const foundConversations = (...ids: string[]) => ({ lean: async () => ids.map((_id) => ({ _id })) }) as never

afterEach(() => {
  vi.restoreAllMocks()
})

describe('social and chat user data', () => {
  it('purges achievements by owner', async () => {
    const deleteMany = vi.spyOn(UserAchievementModel, 'deleteMany').mockResolvedValue(deleted(4))

    expect(await achievementsUserData.purge(ref)).toBe(4)
    expect(deleteMany).toHaveBeenCalledWith({ userId: USER })
  })

  it('purges friendships of any status the user is part of', async () => {
    const deleteMany = vi.spyOn(FriendshipModel, 'deleteMany').mockResolvedValue(deleted(2))

    expect(await friendshipsUserData.purge(ref)).toBe(2)
    expect(deleteMany).toHaveBeenCalledWith({ users: USER })
  })

  it('purges blocks made and received', async () => {
    const deleteMany = vi.spyOn(BlockModel, 'deleteMany').mockResolvedValue(deleted(3))

    expect(await blocksUserData.purge(ref)).toBe(3)
    expect(deleteMany).toHaveBeenCalledWith({ $or: [{ blockerId: USER }, { blockedId: USER }] })
  })

  it('purges friend request email logs on either side of the pair key', async () => {
    const deleteMany = vi.spyOn(FriendRequestEmailLogModel, 'deleteMany').mockResolvedValue(deleted(2))

    expect(await friendRequestEmailsUserData.purge(ref)).toBe(2)

    const { pairKey } = deleteMany.mock.calls[0]?.[0] as unknown as { pairKey: RegExp }
    expect(pairKey.test(`${USER}:${OTHER}`)).toBe(true)
    expect(pairKey.test(`${OTHER}:${USER}`)).toBe(true)
    expect(pairKey.test(`${OTHER}:${OTHER}`)).toBe(false)
  })

  it('purges every conversation of the user with all of its messages', async () => {
    const find = vi.spyOn(ConversationModel, 'find').mockReturnValue(foundConversations('c1', 'c2'))
    const deleteMessages = vi.spyOn(MessageModel, 'deleteMany').mockResolvedValue(deleted(7))
    const deleteConversations = vi.spyOn(ConversationModel, 'deleteMany').mockResolvedValue(deleted(2))

    expect(await conversationsUserData.purge(ref)).toBe(2)
    expect(find).toHaveBeenCalledWith({ members: USER }, { _id: 1 })
    expect(deleteMessages).toHaveBeenCalledWith({ conversationId: { $in: ['c1', 'c2'] } })
    expect(deleteConversations).toHaveBeenCalledWith({ _id: { $in: ['c1', 'c2'] } })
  })

  it('skips the deletes when the user has no conversations', async () => {
    vi.spyOn(ConversationModel, 'find').mockReturnValue(foundConversations())
    const deleteMessages = vi.spyOn(MessageModel, 'deleteMany')

    expect(await conversationsUserData.purge(ref)).toBe(0)
    expect(deleteMessages).not.toHaveBeenCalled()
  })
})
