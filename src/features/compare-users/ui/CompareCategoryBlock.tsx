import Image from 'next/image'
import formatTime from '@/shared/lib/formatTime'
import CompareTableRow from './CompareTableRow'
import ValueCell from './ValueCell'
import { CompareUser } from '@/features/compare-users/model/compare'
import { CubeCategory } from '@/shared/const/cube-categories'
import { cubeCollection } from '@/shared/const/cube-collection'
import { useTranslations } from 'next-intl'

export default function CompareCategoryBlock({ category, users }: { category: CubeCategory; users: CompareUser[] }) {
  const t = useTranslations('Index.LeaderboardsPage.comparative')
  const src = cubeCollection.find((c) => c.name === category)?.src

  const singles = users
    .map((u) => u[category]?.single)
    .filter((v) => typeof v === 'number' && !isNaN(v) && v > 0) as number[]
  const avgs = users
    .map((u) => u[category]?.average)
    .filter((v) => typeof v === 'number' && !isNaN(v) && v > 0) as number[]
  const counts = users
    .map((u) => u[category]?.count)
    .filter((v) => typeof v === 'number' && !isNaN(v) && v > 0) as number[]
  const bestSingle = singles.length ? Math.min(...singles) : undefined
  const bestAverage = avgs.length ? Math.min(...avgs) : undefined
  const bestCount = counts.length ? Math.max(...counts) : undefined

  return (
    <>
      {/* Category section header */}
      <div className={'flex w-max items-center mt-10 border-t border-border/50 pt-4 pb-1'}>
        <div className={'w-32 sticky left-0 z-40 px-4 bg-background flex items-center gap-2.5'}>
          <div className={'flex items-center justify-center size-8 rounded-lg bg-muted shrink-0'}>
            {src && (
              <Image unoptimized src={src} alt={category} width={20} height={20} className={'object-scale-down'} />
            )}
          </div>
          <span className={'font-bold text-sm tracking-tight'}>{category}</span>
        </div>
        {users.map((user) => (
          <div key={user._id} className={'w-52 shrink-0'} />
        ))}
      </div>

      <CompareTableRow title={t('single')}>
        {users.map((user) => {
          const val = user[category]?.single
          const hasValue = typeof val === 'number' && !isNaN(val) && val > 0
          const isBest = hasValue && bestSingle !== undefined && val === bestSingle
          return <ValueCell key={user._id} value={hasValue ? formatTime(val as number) : '—'} isBest={!!isBest} />
        })}
      </CompareTableRow>

      <CompareTableRow title={t('average')}>
        {users.map((user) => {
          const val = user[category]?.average
          const hasValue = typeof val === 'number' && !isNaN(val) && val > 0
          const isBest = hasValue && bestAverage !== undefined && val === bestAverage
          return <ValueCell key={user._id} value={hasValue ? formatTime(val as number) : '—'} isBest={!!isBest} />
        })}
      </CompareTableRow>

      <CompareTableRow title={t('count')}>
        {users.map((user) => {
          const val = user[category]?.count
          const hasValue = val !== undefined && val !== null && !isNaN(val as number) && (val as number) !== 0
          const isBest = hasValue && bestCount !== undefined && val === bestCount
          return (
            <ValueCell key={user._id} value={hasValue ? (val as number).toLocaleString() : '—'} isBest={!!isBest} />
          )
        })}
      </CompareTableRow>
    </>
  )
}
