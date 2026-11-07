import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import * as React from 'react'
import { useQueryState } from 'nuqs'

type PageSlot = number | 'gap-start' | 'gap-end'

function pageSlots(current: number, total: number): PageSlot[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  const slots: PageSlot[] = [1]
  if (start > 2) slots.push('gap-start')
  for (let page = start; page <= end; page++) slots.push(page)
  if (end < total - 1) slots.push('gap-end')
  slots.push(total)
  return slots
}

export const TablePagination = ({ totalPages }: { totalPages: number }) => {
  const [page, setPage] = useQueryState('page', { defaultValue: '1' })
  const current = Math.min(totalPages, Math.max(1, Number(page) || 1))

  const goTo = (target: number) => (event: React.MouseEvent) => {
    event.preventDefault()
    if (target === current) return
    setPage(target > 1 ? target.toString() : null)
  }

  return (
    <Pagination className="pb-2">
      <PaginationContent className="flex-wrap justify-center">
        {current > 1 && (
          <PaginationItem>
            <PaginationPrevious href="#" onClick={goTo(current - 1)} />
          </PaginationItem>
        )}
        {pageSlots(current, totalPages).map((slot) =>
          typeof slot === 'number' ? (
            <PaginationItem key={slot}>
              <PaginationLink href="#" isActive={slot === current} onClick={goTo(slot)}>
                {slot}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem key={slot}>
              <PaginationEllipsis />
            </PaginationItem>
          )
        )}
        {current < totalPages && (
          <PaginationItem>
            <PaginationNext href="#" onClick={goTo(current + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}
