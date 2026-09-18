import type { UserDocument, UserProfile } from '@/entities/user/model/user'

export function withoutStats<T extends UserDocument | UserProfile>(user: T): T & { statsHidden: true } {
  const { backup, ...rest } = user
  return {
    ...rest,
    ...(backup && { backup: { updatedAt: backup.updatedAt } }),
    statsHidden: true
  } as T & { statsHidden: true }
}
