import type { BlocksRepository, BlockState } from './blocks.repository'

export type SocialService = {
  blockState(userId: string, otherId: string): Promise<BlockState>
}

export function createSocialService(blocks: BlocksRepository): SocialService {
  return {
    blockState: (userId, otherId) => blocks.blockState(userId, otherId)
  }
}
