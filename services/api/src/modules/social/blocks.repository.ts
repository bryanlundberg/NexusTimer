import type { Types } from 'mongoose'
import { BlockModel } from './blocks.model'

export type BlockState = 'none' | 'blocked' | 'blocked_by'

const BLOCKED_EITHER_WAY_LIMIT = 1000

export type BlocksRepository = {
  blockState(userId: string, otherId: string): Promise<BlockState>
  blockedEitherWay(userId: string): Promise<string[]>
}

type BlockPair = { blockerId: Types.ObjectId; blockedId: Types.ObjectId }

export const blocksRepository: BlocksRepository = {
  async blockState(userId, otherId) {
    const docs = await BlockModel.find(
      {
        $or: [
          { blockerId: userId, blockedId: otherId },
          { blockerId: otherId, blockedId: userId }
        ]
      },
      { blockerId: 1, blockedId: 1 }
    ).lean<BlockPair[]>()

    if (docs.some((doc) => doc.blockerId.toString() === userId)) return 'blocked'
    return docs.length > 0 ? 'blocked_by' : 'none'
  },

  async blockedEitherWay(userId) {
    const docs = await BlockModel.find(
      { $or: [{ blockerId: userId }, { blockedId: userId }] },
      { blockerId: 1, blockedId: 1 }
    )
      .limit(BLOCKED_EITHER_WAY_LIMIT)
      .lean<BlockPair[]>()
    return docs.map((doc) => (doc.blockerId.toString() === userId ? doc.blockedId : doc.blockerId).toString())
  }
}
