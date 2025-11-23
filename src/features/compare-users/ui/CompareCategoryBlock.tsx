import React from 'react'
import { Badge } from '@/components/ui/badge'
import formatTime from '@/shared/lib/formatTime'
import CompareTableRow from './CompareTableRow'
import { CompareUser } from '@/features/compare-users/model/compare'
import { CubeCategory } from '@/shared/const/cube-categories'

export default function CompareCategoryBlock({ category, users }: { category: CubeCategory; users: CompareUser[] }) {
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
      <CompareTableRow className={'mt-5'} title={`${category} Single`}>
        {users.map((user) => {
          const val = user[category]?.single
          const hasValue = typeof val === 'number' && !isNaN(val) && val > 0
          const isBest = hasValue && bestSingle !== undefined && val === bestSingle
          return (
            <div key={user._id} className={'w-52 text-center shrink-0 px-2 py-2'}>
              <Badge variant={isBest ? 'default' : hasValue ? 'outline' : 'outline'} className={'mx-auto'}>
                {isBest && '🏆'} {hasValue ? formatTime(val) : '—'}
              </Badge>
            </div>
          )
        })}
      </CompareTableRow>

      <CompareTableRow title={`${category} Average`}>
        {users.map((user) => {
          const val = user[category]?.average
          const hasValue = typeof val === 'number' && !isNaN(val) && val > 0
          const isBest = hasValue && bestAverage !== undefined && val === bestAverage
          return (
            <div key={user._id} className={'w-52 text-center shrink-0 px-2 py-2'}>
              <Badge variant={isBest ? 'default' : hasValue ? 'outline' : 'outline'} className={'mx-auto'}>
                {isBest && '🏆'} {hasValue ? formatTime(val) : '—'}
              </Badge>
            </div>
          )
        })}
      </CompareTableRow>

      <CompareTableRow title={`${category} Count`}>
        {users.map((user) => {
          const val = user[category]?.count
          const hasValue = val !== undefined && val !== null && !isNaN(val as number) && (val as number) !== 0
          const isBest = hasValue && bestCount !== undefined && val === bestCount
          return (
            <div key={user._id} className={'w-52 text-center shrink-0 px-2 py-2'}>
              <Badge variant={isBest ? 'default' : hasValue ? 'outline' : 'outline'} className={'mx-auto'}>
                {isBest && '🏆'} {hasValue ? (val as number).toLocaleString() : '—'}
              </Badge>
            </div>
          )
        })}
      </CompareTableRow>
    </>
  )
}
