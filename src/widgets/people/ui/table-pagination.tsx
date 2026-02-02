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
  const [page, setPage] = useQueryState('page', { defaultValue: '0' })

  return (
    <Pagination className={'pb-2'}>
      <PaginationContent>
        <PaginationItem>
          {+page > 0 && (
            <PaginationPrevious
              href={'#'}
              onClick={async (e) => {
                e.preventDefault()
                await setPage((Number(page) - 1).toString())
              }}
            />
          )}
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive onClick={(e) => e.preventDefault()}>
            {Number(page)}
          </PaginationLink>
        </PaginationItem>
        {totalPages > 0 && +page < totalPages && (
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={async (e) => {
                e.preventDefault()
                await setPage((Number(page) + 1).toString())
              }}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}
