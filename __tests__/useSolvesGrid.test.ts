import type { Mock } from 'vitest'
import { renderHook } from '@testing-library/react'
import { Order, Sort } from '@/shared/types/enums'

vi.mock('nuqs', () => ({
  useQueryState: () => ['']
}))

vi.mock('@/features/solves-grid/model/useSolvesFilter', () => ({
  useSolvesFilter: () => ({ isVisible: () => true })
}))

vi.mock('@/features/solves-grid/model/useSolvesSort', () => ({
  useSolvesSort: vi.fn()
}))

import useSolvesGrid from '@/features/solves-grid/model/useSolvesGrid'
import { useSolvesSort } from '@/features/solves-grid/model/useSolvesSort'
import { makeSolve } from './fixtures/solve'

const setSort = (sortType: Sort, orderType: Order) => (useSolvesSort as Mock).mockReturnValue({ sortType, orderType })

const solves = [
  makeSolve({ id: 'a', time: 3000, endTime: 100 }),
  makeSolve({ id: 'b', time: 1000, endTime: 300 }),
  makeSolve({ id: 'c', time: 2000, endTime: 200 }),
  makeSolve({ id: 'd', time: 1000, endTime: 400 })
]

const orderedIds = () => renderHook(() => useSolvesGrid(solves)).result.current.orderedSolves.map((solve) => solve.id)

describe('useSolvesGrid ordering', () => {
  it('sorts by time ascending, keeping ties in input order', () => {
    setSort(Sort.TIME, Order.ASC)
    expect(orderedIds()).toEqual(['b', 'd', 'c', 'a'])
  })

  it('sorts by time descending, keeping ties in input order', () => {
    setSort(Sort.TIME, Order.DESC)
    expect(orderedIds()).toEqual(['a', 'c', 'b', 'd'])
  })

  it('sorts by date ascending', () => {
    setSort(Sort.DATE, Order.ASC)
    expect(orderedIds()).toEqual(['a', 'c', 'b', 'd'])
  })

  it('sorts by date descending', () => {
    setSort(Sort.DATE, Order.DESC)
    expect(orderedIds()).toEqual(['d', 'b', 'c', 'a'])
  })

  it('does not mutate the input array', () => {
    setSort(Sort.TIME, Order.ASC)
    const before = solves.map((solve) => solve.id)

    orderedIds()

    expect(solves.map((solve) => solve.id)).toEqual(before)
  })
})
