import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Cube } from '@/interfaces/Cube'
import { useMemo, useState } from 'react'
import _ from 'lodash'
import formatTime from '@/shared/lib/formatTime'
import { Card } from '@/components/ui/card'
import EmptyTabContent from '@/components/people/empty-tab-content'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import ScrambleDisplay from '@/shared/ui/scramble-display/ui/ScrambleDisplay'

interface LastActivityTabContentProps {
  cubes: Cube[]
}

export default function LastActivityTabContent({ cubes }: LastActivityTabContentProps) {
  const ITEMS_PER_PAGE = 10
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
      'endTime',
      'asc'
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
    <Card className="backdrop-blur-lg h-auto py-0">
      <div className="w-full [&>div]:!overflow-x-visible">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead className="w-full md:w-auto">Cube</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Scramble</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="hidden sm:table-cell">Image</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPageItems.map((solve, index) => {
              const globalIndex = (page - 1) * ITEMS_PER_PAGE + index
              return (
                <TableRow key={solve.id}>
                  <TableCell className="font-medium">{solvesLength - globalIndex}</TableCell>
                  <TableCell className="font-medium overflow-hidden max-w-20 sm:max-w-32 md:max-w-40 lg:max-w-96 whitespace-normal">
                    {solve.cubeName}
                  </TableCell>
                  <TableCell className="font-medium hidden sm:table-cell">{solve.category}</TableCell>
                  <TableCell className="font-medium hidden md:table-cell overflow-hidden max-w-20 sm:max-w-32 md:max-w-40 lg:max-w-96 whitespace-normal">
                    {solve.scramble}
                  </TableCell>
                  <TableCell>{formatTime(solve.time)}</TableCell>
                  <TableCell className="hidden sm:table-cell text-right">
                    <ScrambleDisplay className={'size-20'} show scramble={solve.scramble} event={solve.category} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

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
    </Card>
  )
}
