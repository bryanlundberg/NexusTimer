import useSWR from 'swr'
import type { AchievementRarityResponse } from '@nexustimer/contracts'
import { fetcher } from '@/shared/lib/fetcher'

export const ACHIEVEMENT_RARITY_KEY = '/api/v1/achievements/rarity'

export function useAchievementRarity() {
  const { data } = useSWR<AchievementRarityResponse>(ACHIEVEMENT_RARITY_KEY, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false
  })

  return data?.badges ?? null
}
