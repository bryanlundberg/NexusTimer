import { useTimerStore } from '@/store/timerStore';
import { Solve } from '@/interfaces/Solve';
import { VirtualizedGrid } from '@mierak/react-virtualized-grid';
import formatTime from '@/lib/formatTime';
import { useLocale, useTranslations } from 'next-intl';
import { Card } from '../ui/card';
import { useDialogSolve } from '@/store/DialogSolve';
import { sort } from 'fast-sort';
import { filterData, SearchType } from 'filter-data';
import useRemoveGridHeight from '@/hooks/useRemoveGridHeight';
import { BookmarkFilledIcon, ChatBubbleIcon, } from '@radix-ui/react-icons';
import EmptySolves from './EmptySolves';
import { useQueryState } from 'nuqs';
import { STATES } from '@/constants/states';
import { Order } from '@/enums/Order';
import { Sort } from '@/enums/Sort';
import { DateTime } from 'luxon';

interface SolvesArea {
  displaySolves: Solve[] | undefined;
}

export function SolvesArea({ displaySolves }: SolvesArea) {
  const locale = useLocale()
  const { handleOpenDialogSolve } = useDialogSolve();
  const selectedCube = useTimerStore((state) => state.selectedCube);
  const t = useTranslations('Index');
  const [query,] = useQueryState(STATES.SOLVES_PAGE.QUERY.KEY, { defaultValue: STATES.SOLVES_PAGE.QUERY.DEFAULT_VALUE });
  const [orderType,] = useQueryState(STATES.SOLVES_PAGE.ORDER.KEY, { defaultValue: STATES.SOLVES_PAGE.ORDER.DEFAULT_VALUE });
  const [sortType,] = useQueryState(STATES.SOLVES_PAGE.SORT.KEY, { defaultValue: STATES.SOLVES_PAGE.SORT.DEFAULT_VALUE });
  useRemoveGridHeight();

  if (!selectedCube) return <EmptySolves
    title={t('SolvesPage.alert.select-cube')}
    description={t('SolvesPage.alert.empty-cubes')}
  />;
  if (!displaySolves || displaySolves.length === 0) return <EmptySolves/>;

  const filterSolves = filterData(displaySolves, [
    {
      key: 'time',
      value: query,
      type: SearchType.LTE
    }
  ]);

  let sortedSolves: Solve[] = [];

  if (sortType === Sort.DATE) {
    if (orderType === Order.ASC) sortedSolves = sort(filterSolves).asc((u) => u.endTime);
    if (orderType === Order.DESC) sortedSolves = sort(filterSolves).desc((u) => u.endTime);
  }

  if (sortType === Sort.TIME) {
    if (orderType === Order.ASC) sortedSolves = sort(filterSolves).asc((u) => u.time);
    if (orderType === Order.DESC) sortedSolves = sort(filterSolves).desc((u) => u.time);
  }

  return (
    <VirtualizedGrid
      itemCount={sortedSolves.length}
      rowHeight={160}
      cellWidth={220}
      gridGap={8}
      className="h-full pb-5"
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
                <span className="text-2xl font-semibold">
                  {formatTime(sortedSolves[index].time).split('.')[0]}
                </span>
            <span className="text-base opacity-80">
                  .{formatTime(sortedSolves[index].time).split('.')[1]}
                </span>
            {sortedSolves[index].plus2 ? (
              <span className="ms-2 text-xs font-black text-red-600">+2</span>
            ) : null}
            {sortedSolves[index].dnf ? (
              <span className="ms-1 text-xs font-black text-red-600">DNF</span>
            ) : null}
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
              <span className="flex items-center gap-1 opacity-80"><ChatBubbleIcon/></span>
            )}
          </div>

          {sortedSolves[index].bookmark && (
            <div className="absolute right-2 top-2 text-yellow-500">
              <BookmarkFilledIcon/>
            </div>
          )}
        </Card>
      )}
    </VirtualizedGrid>
  );
}
