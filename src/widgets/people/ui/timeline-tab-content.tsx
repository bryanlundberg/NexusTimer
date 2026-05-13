import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
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
import { Badge } from '@/components/ui/badge'
import formatTime from '@/shared/lib/formatTime'
import moment from 'moment'
import { useLocale } from 'next-intl'
import { CubeCategory } from '@/shared/const/cube-categories'

interface TimelineSolve {
  id: string
  time: number
  startTime: number
  scramble: string
  dnf?: boolean
  plus2?: boolean
  category: CubeCategory
  cubeName: string
}

interface TimelineTabContentProps {
  cubes: Cube[]
}

const ITEMS_PER_PAGE = 20
const GRID = 'grid-cols-[2.5rem_8rem_minmax(0,1fr)_7rem_8rem]'

export default function TimelineTabContent({ cubes }: TimelineTabContentProps) {
  const locale = useLocale()
  const [page, setPage] = useState(1)

  const solves = useMemo<TimelineSolve[]>(() => {
    return _.orderBy(
      [
        ...cubes.flatMap((cube) =>
          cube.solves.session.map((solve) => ({ ...solve, category: cube.category, cubeName: cube.name }))
        ),
        ...cubes.flatMap((cube) =>
          cube.solves.all.map((solve) => ({ ...solve, category: cube.category, cubeName: cube.name }))
        )
      ].filter((s) => !s.isDeleted),
      'startTime',
      'desc'
    )
  }, [cubes])

  const totalPages = Math.ceil(solves.length / ITEMS_PER_PAGE)
  const currentItems = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    return solves.slice(start, start + ITEMS_PER_PAGE)
  }, [solves, page])

  if (_.isEmpty(solves)) return <EmptyTabContent />

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <div className="min-w-[580px]">
          {/* Header */}
          <div className={`grid ${GRID} items-center gap-x-4 px-3 py-2 border-b border-border/60`}>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">#</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Category</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Scramble</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Time</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Date</span>
          </div>

          {/* Rows */}
          <motion.div
            key={page}
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03 } } }}
          >
            {currentItems.map((solve, i) => {
              const globalIndex = solves.length - ((page - 1) * ITEMS_PER_PAGE + i)
              const displayTime = solve.time + (solve.plus2 ? 2000 : 0)

              return (
                <motion.div
                  key={solve.id}
                  className={`grid ${GRID} items-center gap-x-4 px-3 py-2.5 border-b border-border/40 last:border-b-0 hover:bg-muted/20 border-l-2 border-l-transparent hover:border-l-primary transition-colors duration-150`}
                  variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  {/* # */}
                  <span className="text-xs font-mono text-muted-foreground tabular-nums text-right select-none">
                    {String(globalIndex).padStart(2, '0')}
                  </span>

                  {/* Category badge */}
                  <div className="min-w-0 flex flex-col gap-0.5">
                    <Badge variant="outline" className="font-mono text-[10px] px-1.5 py-0 h-4 w-fit shrink-0">
                      {solve.category}
                    </Badge>
                  </div>

                  {/* Scramble text only */}
                  <span className="text-[10px] font-mono text-muted-foreground/70 break-all leading-relaxed">
                    {solve.scramble}
                  </span>

                  {/* Time */}
                  <div className="flex items-baseline gap-1">
                    {solve.dnf ? (
                      <span className="text-sm font-bold text-red-500">DNF</span>
                    ) : (
                      <>
                        <TimeDisplay value={formatTime(displayTime)} />
                        {solve.plus2 && <span className="text-[10px] font-bold text-yellow-500">+2</span>}
                      </>
                    )}
                  </div>

                  {/* Date */}
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {moment(solve.startTime).locale(locale).format('ll · HH:mm')}
                  </span>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (page > 1) setPage(page - 1)
                }}
              />
            </PaginationItem>

            {page > 2 && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setPage(1)
                  }}
                >
                  1
                </PaginationLink>
              </PaginationItem>
            )}
            {page > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {page > 1 && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setPage(page - 1)
                  }}
                >
                  {page - 1}
                </PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationLink href="#" isActive onClick={(e) => e.preventDefault()}>
                {page}
              </PaginationLink>
            </PaginationItem>

            {page < totalPages && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setPage(page + 1)
                  }}
                >
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            )}
            {page < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {page < totalPages - 1 && totalPages > 1 && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setPage(totalPages)
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
                  if (page < totalPages) setPage(page + 1)
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

function TimeDisplay({ value }: { value: string }) {
  const [main, decimal] = value.includes('.') ? value.split('.') : [value, null]
  return (
    <div className="flex items-baseline gap-0.5">
      <span className="text-sm font-bold tabular-nums">{main}</span>
      {decimal && <span className="text-xs text-muted-foreground tabular-nums">.{decimal}</span>}
    </div>
  )
}
