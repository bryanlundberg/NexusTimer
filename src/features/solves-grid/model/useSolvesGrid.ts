import { useQueryState } from 'nuqs'
import { useMemo } from 'react'
import formatTime from '@/shared/lib/formatTime'
import { sort } from 'fast-sort'
import { Solve } from '@/entities/solve/model/types'
import { STATES } from '@/shared/const/states'
import { Order, Sort } from '@/shared/types/enums'
import { useSolvesFilter } from '@/features/solves-grid/model/useSolvesFilter'
import { useSolvesSort } from '@/features/solves-grid/model/useSolvesSort'

export default function useSolvesGrid(solves: Array<Solve>) {
  const { isVisible } = useSolvesFilter()
  const { sortType, orderType } = useSolvesSort()
  const [query] = useQueryState(STATES.SOLVES_PAGE.QUERY.KEY, { defaultValue: STATES.SOLVES_PAGE.QUERY.DEFAULT_VALUE })

  const normalizedQuery = (query || '').trim()

  const filteredByQuery = useMemo(() => {
    if (!solves) return []
    if (!normalizedQuery) return solves

    return solves.filter((u) => formatTime(u.time).startsWith(normalizedQuery))
  }, [solves, normalizedQuery])

  const filteredByPenalty = useMemo(() => filteredByQuery.filter((u) => isVisible(u)), [filteredByQuery, isVisible])

  const orderedSolves = useMemo(() => {
    const key = sortType === Sort.TIME ? (u: Solve) => u.time : (u: Solve) => u.endTime
    return orderType === Order.ASC ? sort(filteredByPenalty).asc(key) : sort(filteredByPenalty).desc(key)
  }, [filteredByPenalty, sortType, orderType])

  return {
    orderedSolves
  }
}
