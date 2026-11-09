import useSWR from 'swr'
import type { CubeCategory, FriendsLeaderboardMetric, FriendsLeaderboardResponse } from '@nexustimer/contracts'

const fetchBoard = async (url: string): Promise<FriendsLeaderboardResponse> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Friends leaderboard failed with status ${res.status}`)
  return res.json()
}

export function useFriendsLeaderboard(category: CubeCategory, metric: FriendsLeaderboardMetric) {
  const params = new URLSearchParams({ category, metric })
  const { data, error, isLoading, mutate } = useSWR(`/api/v1/leaderboards/friends?${params}`, fetchBoard, {
    keepPreviousData: true,
    revalidateOnFocus: false
  })

  return { board: data, isLoading, isError: Boolean(error), mutate }
}
