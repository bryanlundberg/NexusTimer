import { useMemo } from 'react'
import { orderBy } from 'es-toolkit'
import { Solve } from '@/entities/solve/model/types'
import { Order, Sort } from '@/shared/types/enums'
import { useSolvesFilter } from '@/features/solves-grid/model/useSolvesFilter'
import { useSolvesSort } from '@/features/solves-grid/model/useSolvesSort'

export default function useSolvesGrid(solves: Array<Solve>) {
  const { isVisible } = useSolvesFilter()
  const { sortType, orderType } = useSolvesSort()

  const filteredByPenalty = useMemo(() => (solves ?? []).filter((u) => isVisible(u)), [solves, isVisible])

  const orderedSolves = useMemo(() => {
    const key = sortType === Sort.TIME ? 'time' : 'endTime'
    return orderBy(filteredByPenalty, [key], [orderType === Order.ASC ? 'asc' : 'desc'])
  }, [filteredByPenalty, sortType, orderType])

  return {
    orderedSolves
  }
}
