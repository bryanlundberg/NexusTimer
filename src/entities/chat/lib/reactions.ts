import type { MessageReaction } from '@/shared/lib/realtime/events'

export const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'] as const

export interface ReactionGroup {
  emoji: string
  count: number
  mine: boolean
}

export function groupReactions(reactions: MessageReaction[] | undefined, myId?: string): ReactionGroup[] {
  const groups = new Map<string, ReactionGroup>()

  for (const { emoji, userId } of reactions ?? []) {
    const group = groups.get(emoji) ?? { emoji, count: 0, mine: false }
    group.count += 1
    if (userId === myId) group.mine = true
    groups.set(emoji, group)
  }

  return [...groups.values()]
}
