import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import * as React from 'react'
import { useQueryState } from 'nuqs'

export const TablePagination = ({ totalPages }: { totalPages: number }) => {
  const [page, setPage] = useQueryState('page', { defaultValue: '1' })
  const current = Math.max(1, Number(page) || 1)

  return (
    <Pagination className={'pb-2'}>
      <PaginationContent>
        <PaginationItem>
          {current > 1 && (
            <PaginationPrevious
              href={'#'}
              onClick={async (e) => {
                e.preventDefault()
                await setPage(current - 1 > 1 ? (current - 1).toString() : null)
              }}
            />
          )}
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive onClick={(e) => e.preventDefault()}>
            {current}
          </PaginationLink>
        </PaginationItem>
        {current < totalPages && (
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={async (e) => {
                e.preventDefault()
                await setPage((current + 1).toString())
              }}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}
