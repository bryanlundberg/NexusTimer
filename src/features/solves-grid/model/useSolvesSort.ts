import { useQueryState } from 'nuqs'
import { useCallback } from 'react'
import { STATES } from '@/shared/const/states'
import { Order, Sort } from '@/shared/types/enums'

const DEFAULT_SORT = STATES.SOLVES_PAGE.SORT.DEFAULT_VALUE
const DEFAULT_ORDER = STATES.SOLVES_PAGE.ORDER.DEFAULT_VALUE

export function useSolvesSort() {
  const [rawSort, setRawSort] = useQueryState(STATES.SOLVES_PAGE.SORT.KEY, { defaultValue: DEFAULT_SORT })
  const [rawOrder, setRawOrder] = useQueryState(STATES.SOLVES_PAGE.ORDER.KEY, { defaultValue: DEFAULT_ORDER })

  const sortType = rawSort === Sort.TIME ? Sort.TIME : Sort.DATE
  const orderType = rawOrder === Order.ASC ? Order.ASC : Order.DESC

  const setSort = useCallback((next: Sort) => setRawSort(next === DEFAULT_SORT ? null : next), [setRawSort])

  const setOrder = useCallback((next: Order) => setRawOrder(next === DEFAULT_ORDER ? null : next), [setRawOrder])

  const reset = useCallback(() => {
    setRawSort(null)
    setRawOrder(null)
  }, [setRawSort, setRawOrder])

  const isDefault = sortType === DEFAULT_SORT && orderType === DEFAULT_ORDER

  return { sortType, orderType, setSort, setOrder, reset, isDefault }
}
