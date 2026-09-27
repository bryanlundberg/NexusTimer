import formatTime from '@/shared/lib/formatTime'
import CompareTableRow from './CompareTableRow'
import ValueCell from './ValueCell'
import { CompareUser } from '@/features/compare-users/model/compare'
import { EMPTY_VALUE, LABEL_COLUMN, VALUE_COLUMN } from '@/features/compare-users/model/columns'
import { CubeCategory } from '@/shared/const/cube-categories'
import { CubeCategoryIcon } from '@/shared/ui/cube-category-icon/CubeCategoryIcon'
import { cn } from '@/shared/lib/utils'
import { useLocale, useTranslations } from 'next-intl'

const isPositive = (value: unknown): value is number => typeof value === 'number' && !isNaN(value) && value > 0

export default function CompareCategoryBlock({ category, users }: { category: CubeCategory; users: CompareUser[] }) {
  const t = useTranslations('Index.LeaderboardsPage.comparative')
  const locale = useLocale()

  const pick = (key: 'single' | 'average' | 'count') => users.map((u) => u[category]?.[key]).filter(isPositive)
  const winner = (values: number[], best: (...v: number[]) => number) =>
    values.length > 1 ? best(...values) : undefined

  const bestSingle = winner(pick('single'), Math.min)
  const bestAverage = winner(pick('average'), Math.min)
  const bestCount = winner(pick('count'), Math.max)

  return (
    <>
      <div className="mt-8 w-max border-t border-border/50 pt-4 pb-2">
        <div className="sticky left-0 z-40 inline-flex items-center gap-2.5 px-3 sm:px-4">
          <span className="size-7 shrink-0 text-foreground sm:size-8">
            <CubeCategoryIcon category={category} />
          </span>
          <span className="whitespace-nowrap text-sm font-bold tracking-tight sm:text-base">{category}</span>
        </div>
        <div aria-hidden className="flex h-0 gap-3">
          <div className={cn(LABEL_COLUMN, 'shrink-0')} />
          {users.map((user) => (
            <div key={user._id} className={VALUE_COLUMN} />
          ))}
        </div>
      </div>

      <CompareTableRow title={t('single')}>
        {users.map((user) => {
          const val = user[category]?.single
          return (
            <ValueCell
              key={user._id}
              value={isPositive(val) ? formatTime(val) : EMPTY_VALUE}
              isBest={isPositive(val) && val === bestSingle}
            />
          )
        })}
      </CompareTableRow>

      <CompareTableRow title={t('average')}>
        {users.map((user) => {
          const val = user[category]?.average
          return (
            <ValueCell
              key={user._id}
              value={isPositive(val) ? formatTime(val) : EMPTY_VALUE}
              isBest={isPositive(val) && val === bestAverage}
            />
          )
        })}
      </CompareTableRow>

      <CompareTableRow title={t('count')}>
        {users.map((user) => {
          const val = user[category]?.count
          return (
            <ValueCell
              key={user._id}
              value={isPositive(val) ? val.toLocaleString(locale) : EMPTY_VALUE}
              isBest={isPositive(val) && val === bestCount}
            />
          )
        })}
      </CompareTableRow>
    </>
  )
}
