import { useTimerStore } from '@/store/timerStore'
import { Solve } from '@/interfaces/Solve'
import { VirtualizedGrid } from '@mierak/react-virtualized-grid'
import formatTime from '@/shared/lib/formatTime'
import { useLocale, useTranslations } from 'next-intl'
import { Card } from '../ui/card'
import { useDialogSolve } from '@/store/DialogSolve'
import { sort } from 'fast-sort'
import useRemoveGridHeight from '@/hooks/useRemoveGridHeight'
import { BookmarkFilledIcon, ChatBubbleIcon } from '@radix-ui/react-icons'
import EmptySolves from './EmptySolves'
import { useQueryState } from 'nuqs'
import { STATES } from '@/constants/states'
import { Order } from '@/enums/Order'
import { Sort } from '@/enums/Sort'
import { DateTime } from 'luxon'
import { useMemo } from 'react'

interface SolvesArea {
  displaySolves: Solve[] | undefined
}

export function SolvesArea({ displaySolves }: SolvesArea) {
  const locale = useLocale()
  const { handleOpenDialogSolve } = useDialogSolve()
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const t = useTranslations('Index')
  const [query] = useQueryState(STATES.SOLVES_PAGE.QUERY.KEY, { defaultValue: STATES.SOLVES_PAGE.QUERY.DEFAULT_VALUE })
  const [orderType] = useQueryState(STATES.SOLVES_PAGE.ORDER.KEY, {
    defaultValue: STATES.SOLVES_PAGE.ORDER.DEFAULT_VALUE
  })
  const [sortType] = useQueryState(STATES.SOLVES_PAGE.SORT.KEY, { defaultValue: STATES.SOLVES_PAGE.SORT.DEFAULT_VALUE })
  useRemoveGridHeight()

  const normalizedQuery = (query || '').trim()

  const filteredSolves = useMemo(() => {
    if (!displaySolves) return []
    if (!normalizedQuery) return displaySolves

    return displaySolves.filter((u) => formatTime(u.time).startsWith(normalizedQuery))
  }, [displaySolves, normalizedQuery])

  const sortedSolves = useMemo(() => {
    const base = filteredSolves

    if (sortType === Sort.DATE) {
      return orderType === Order.ASC ? sort(base).asc((u) => u.endTime) : sort(base).desc((u) => u.endTime)
    }

    if (sortType === Sort.TIME) {
      return orderType === Order.ASC ? sort(base).asc((u) => u.time) : sort(base).desc((u) => u.time)
    }

    return base
  }, [filteredSolves, sortType, orderType])

  if (!selectedCube)
    return <EmptySolves title={t('SolvesPage.alert.select-cube')} description={t('SolvesPage.alert.empty-cubes')} />

  if (!displaySolves || displaySolves.length === 0) return <EmptySolves />

  return (
    <VirtualizedGrid
      itemCount={sortedSolves.length}
      rowHeight={160}
      cellWidth={220}
      gridGap={8}
      className="h-full pb-56"
    >
      {(index) => (
        <Card
          onClick={() => handleOpenDialogSolve({ solve: sortedSolves[index] })}
          className={
            'relative grow flex flex-col items-center justify-center w-full h-full text-center transition duration-200 rounded-md cursor-pointer p-3 hover:opacity-80'
          }
        >
          {/* Index badge */}
          <div className="absolute top-2 right-2 text-[10px] opacity-60">#{index + 1}</div>

          {/* Time display */}
          <div className="flex items-end gap-1">
            <span className="text-2xl font-semibold">{formatTime(sortedSolves[index].time).split('.')[0]}</span>
            <span className="text-base opacity-80">.{formatTime(sortedSolves[index].time).split('.')[1]}</span>
            {sortedSolves[index].plus2 ? <span className="ms-2 text-lg font-black text-red-600">+2</span> : null}
            {sortedSolves[index].dnf ? <span className="ms-1 text-md font-black text-red-600">DNF</span> : null}
          </div>

          {/* Full date and time */}
          <div className="mt-2 text-xs opacity-80">
            {DateTime.fromMillis(sortedSolves[index].endTime || 0)
              .setLocale(locale)
              .toFormat('MMM dd, yyyy')}
          </div>

          {/* Footer icons */}
          <div className="absolute left-2 bottom-2 flex items-center gap-2 text-xs">
            {sortedSolves[index].comment && (
              <span className="flex items-center gap-1 opacity-80">
                <ChatBubbleIcon />
              </span>
            )}
          </div>

          {sortedSolves[index].bookmark && (
            <div className="absolute left-2 top-2 text-yellow-500">
              <BookmarkFilledIcon className={'size-5'} />
            </div>
          )}
        </Card>
      )}
    </VirtualizedGrid>
  )
}
