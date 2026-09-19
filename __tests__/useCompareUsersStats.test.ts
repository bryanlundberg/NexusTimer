import { renderHook } from '@testing-library/react'
import { useCompareUsersStats } from '@/features/compare-users/model/useCompareUsersStats'
import type { UserStatsSummary } from '@/entities/user-stats/model/types'

const summary = {
  categories: [
    {
      category: '3x3',
      count: 40,
      best: { time: 8000, cubeName: 'A', endTime: 1 },
      bestAo5: { time: 9500, cubeName: 'A', endTime: 1, window: [] }
    },
    { category: '4x4', count: 3, best: { time: 40000, cubeName: 'B', endTime: 1 }, bestAo5: null }
  ]
} as unknown as UserStatsSummary

describe('useCompareUsersStats', () => {
  it('maps each category to single, average and count from the stored summary', () => {
    const users = [{ _id: 'u1' }]
    const { result } = renderHook(() => useCompareUsersStats(users, { u1: summary }))
    const [user] = result.current

    expect(user._id).toBe('u1')
    expect(user['3x3']).toEqual({ single: 8000, average: 9500, count: 40 })
    expect(user['4x4']).toEqual({ single: 40000, average: 0, count: 3 })
    expect(user['2x2']).toEqual({ single: 0, average: 0, count: 0 })
  })

  it('fills zeros for users without a summary', () => {
    const users = [{ _id: 'u2' }]
    const { result } = renderHook(() => useCompareUsersStats(users, { u2: null }))

    expect(result.current[0]['3x3']).toEqual({ single: 0, average: 0, count: 0 })
  })
})
