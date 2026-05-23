import { ACHIEVEMENTS_CONFIG } from './achievements'

/**
 * Keys of achievements awarded manually (stored in the database), as opposed
 * to `computed` badges derived from solve data. Derived from the config so
 * there's a single source of truth.
 */
export const GRANTED_ACHIEVEMENT_KEYS = ACHIEVEMENTS_CONFIG.filter((a) => a.type === 'granted').map((a) => a.id)

export function isGrantedAchievementKey(key: string): boolean {
  return GRANTED_ACHIEVEMENT_KEYS.includes(key)
}
