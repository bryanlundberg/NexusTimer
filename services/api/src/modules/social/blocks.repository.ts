import type { Types } from 'mongoose'
import { BlockModel } from './blocks.model'

export type BlockState = 'none' | 'blocked' | 'blocked_by'

export type BlocksRepository = {
  blockState(userId: string, otherId: string): Promise<BlockState>
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
  }
}
