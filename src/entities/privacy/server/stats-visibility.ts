import type { StatsVisibility } from '@/entities/privacy/model/types'
import { getPrivacy } from '@/entities/privacy/server/privacy'
import { areFriends } from '@/entities/friendship/server/friends'

export function canViewStats(
  visibility: StatsVisibility,
  ownerId: string,
  viewerId: string | undefined,
  isFriend: boolean
): boolean {
  if (viewerId === ownerId || visibility === 'everyone') return true
  return visibility === 'friends' && !!viewerId && isFriend
}

export async function statsVisibleTo(ownerId: string, viewerId?: string): Promise<boolean> {
  if (viewerId === ownerId) return true
  const { statsVisibility } = await getPrivacy(ownerId)
  if (statsVisibility === 'everyone') return true
  if (statsVisibility === 'nobody' || !viewerId) return false
  return areFriends(viewerId, ownerId)
}
