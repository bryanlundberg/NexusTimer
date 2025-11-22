import { useQueryState } from 'nuqs'
import { useMemo } from 'react'
import formatTime from '@/shared/lib/formatTime'
import { sort } from 'fast-sort'
import { Solve } from '@/entities/solve/model/types'
import { STATES } from '@/shared/const/states'
import useRemoveGridHeight from '@/shared/model/solves-grid/useRemoveGridHeight'
import { Order, Sort } from '@/shared/types/enums'

export default function useSolvesGrid(solves: Array<Solve>) {
  const [query] = useQueryState(STATES.SOLVES_PAGE.QUERY.KEY, { defaultValue: STATES.SOLVES_PAGE.QUERY.DEFAULT_VALUE })
  const [sortType] = useQueryState(STATES.SOLVES_PAGE.SORT.KEY, { defaultValue: STATES.SOLVES_PAGE.SORT.DEFAULT_VALUE })
  const [orderType] = useQueryState(STATES.SOLVES_PAGE.ORDER.KEY, {
    defaultValue: STATES.SOLVES_PAGE.ORDER.DEFAULT_VALUE
  })
  useRemoveGridHeight()

  const normalizedQuery = (query || '').trim()

  const filteredByQuery = useMemo(() => {
    if (!solves) return []
    if (!normalizedQuery) return solves

    return solves.filter((u) => formatTime(u.time).startsWith(normalizedQuery))
  }, [solves, normalizedQuery])

  const orderedSolves = useMemo(() => {
    const base = filteredByQuery

    if (sortType === Sort.DATE) {
      return orderType === Order.ASC ? sort(base).asc((u) => u.endTime) : sort(base).desc((u) => u.endTime)
    }

    if (sortType === Sort.TIME) {
      return orderType === Order.ASC ? sort(base).asc((u) => u.time) : sort(base).desc((u) => u.time)
    }

    return base
  }, [filteredByQuery, sortType, orderType])

  return {
    orderedSolves
  }
}
