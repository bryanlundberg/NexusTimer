import { useMemo, useState } from 'react'
import _ from 'lodash'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import EmptyTabContent from '@/widgets/people/ui/empty-tab-content'
import { Cube } from '@/entities/cube/model/types'
import { LastActivitySolveCard } from '@/widgets/people/ui/last-activity-solve-card'

interface LastActivityTabContentProps {
  cubes: Cube[]
}

export default function LastActivityTabContent({ cubes }: LastActivityTabContentProps) {
  const ITEMS_PER_PAGE = 12
  const [page, setPage] = useState(1)
  const solves = useMemo(() => {
    return _.orderBy(
      [
        ...cubes.flatMap((cube) =>
          cube.solves.session.map((solve) => ({
            ...solve,
            category: cube.category,
            cubeName: cube.name
          }))
        ),
        ...cubes.flatMap((cube) =>
          cube.solves.all.map((solve) => ({
            ...solve,
            category: cube.category,
            cubeName: cube.name
          }))
        )
      ],
      'startTime',
      'desc'
    )
  }, [cubes])

  const solvesLength = useMemo(() => solves.length, [solves])
  const totalPages = useMemo(() => Math.ceil(solvesLength / ITEMS_PER_PAGE), [solvesLength])
  const handlePaginationChange = (newPage: number) => setPage(newPage)
  const currentPageItems = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE
    return solves.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [solves, page])

  if (_.isEmpty(solves)) {
    return <EmptyTabContent />
  }

  return (
    <div className="space-y-6">
      <div className={'grid grid-cols-1 @2xl/tab:grid-cols-2 @5xl/tab:grid-cols-3 gap-4'}>
        {currentPageItems.map((solve, index) => {
          const globalIndex = (page - 1) * ITEMS_PER_PAGE + index
          return <LastActivitySolveCard key={solve.id} solve={solve as any} index={solvesLength - globalIndex} />
        })}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={'#'}
              onClick={(e) => {
                e.preventDefault()
                if (page > 1) handlePaginationChange(page - 1)
              }}
            />
          </PaginationItem>

          {/* First page */}
          {page > 2 && (
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handlePaginationChange(1)
                }}
              >
                1
              </PaginationLink>
            </PaginationItem>
          )}

          {/* Ellipsis if needed */}
          {page > 3 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* Previous page if not on first page */}
          {page > 1 && (
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handlePaginationChange(page - 1)
                }}
              >
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          )}

          {/* Current page */}
          <PaginationItem>
            <PaginationLink href="#" isActive={true} onClick={(e) => e.preventDefault()}>
              {page}
            </PaginationLink>
          </PaginationItem>

          {/* Next page if not on last page */}
          {page < totalPages && (
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handlePaginationChange(page + 1)
                }}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          )}

          {/* Ellipsis if needed */}
          {page < totalPages - 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* Last page if not near it */}
          {page < totalPages - 1 && totalPages > 1 && (
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handlePaginationChange(totalPages)
                }}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (page < totalPages) handlePaginationChange(page + 1)
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
