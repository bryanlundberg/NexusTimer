import Block, { type BlockDocument } from '@/entities/block/model/block'

type BlockPair = Pick<BlockDocument, 'blockerId' | 'blockedId'>

export type BlockState = 'none' | 'blocked' | 'blocked_by'

export async function blockStateOf(userId: string, otherId: string): Promise<BlockState> {
  const docs = await Block.find(
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
