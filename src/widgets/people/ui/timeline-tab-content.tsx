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
import Image from 'next/image'
import { cubeCollection } from '@/shared/const/cube-collection'
import formatTime from '@/shared/lib/formatTime'
import moment from 'moment'
import { useLocale, useTranslations } from 'next-intl'
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
const GRID = 'grid-cols-[min-content_minmax(0,13rem)_7rem_minmax(16rem,1.5fr)_8rem]'

export default function TimelineTabContent({ cubes }: TimelineTabContentProps) {
  const locale = useLocale()
  const t = useTranslations('Index.PeoplePage.timeline-tab')
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
        <div className="min-w-[780px]">
          {/* Header */}
          <div className={`grid ${GRID} items-center gap-x-4 px-3 py-2 border-b border-border/60`}>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">#</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t('col-cube')}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t('col-time')}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t('col-scramble')}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t('col-date')}
            </span>
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
              const categorySrc = cubeCollection.find((c) => c.name === solve.category)?.src

              return (
                <motion.div
                  key={solve.id}
                  className={`grid ${GRID} items-center gap-x-4 px-3 py-2.5 border-b border-border/40 last:border-b-0 hover:bg-muted/20 border-l-2 border-l-transparent hover:border-l-primary transition-colors duration-150`}
                  variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  {/* # */}
                  <span className="text-xs font-mono text-muted-foreground tabular-nums text-left select-none">
                    {String(globalIndex).padStart(2, '0')}
                  </span>

                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center justify-center size-9 rounded-lg bg-muted shrink-0">
                      {categorySrc && (
                        <Image
                          unoptimized
                          src={categorySrc}
                          alt={solve.category}
                          title={solve.category}
                          width={22}
                          height={22}
                          className="object-scale-down"
                        />
                      )}
                    </div>
                    <span className="text-xs font-medium text-foreground/80 truncate" title={solve.cubeName}>
                      {solve.cubeName}
                    </span>
                  </div>

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

                  <span className="text-[10px] font-mono text-muted-foreground/70 break-all leading-relaxed">
                    {solve.scramble}
                  </span>

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
