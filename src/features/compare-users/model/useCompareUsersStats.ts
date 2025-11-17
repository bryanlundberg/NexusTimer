import { useMemo } from 'react'
import _ from 'lodash'
import { Categories } from '@/interfaces/Categories'
import { Cube } from '@/interfaces/Cube'
import calcBestTime from '@/lib/calcBestTime'
import calcTotalSolvesStatistics from '@/lib/calcTotalSolvesStatistics'
import calculateBestAo from '@/lib/calculateBestAo'
import { CompareUser } from '@/features/compare-users/model/compare'

interface User {
  _id: string
}

export function useCompareUsersStats(users: User[], userCubes: Record<string, any>): CompareUser[] {
  return useMemo(() => {
    return users.map((user) => {
      const cubesDB = userCubes[user._id] || {}
      const byCategory = Object.create(null) as CompareUser
      ;(CATEGORIES as Categories[]).forEach((category) => {
        const cubeData = cubesDB[category] ?? []
        const cubeName = ''

        const single = calcBestTime({ cubesDB: cubeData, category, cubeName }).global
        const average = calculateBestAo(
          _.flatMap(cubeData, (cube: Cube) => [...(cube.solves.all || []), ...(cube.solves.session || [])]),
          5
        )
        const count = calcTotalSolvesStatistics({ cubesDB: cubeData, category, cubeName }).global

        ;(byCategory as any)[category] = { single, average, count }
      })
      return { _id: user._id, ...(byCategory as any) } as CompareUser
    })
  }, [users, userCubes])
}

const CATEGORIES: Categories[] = [
  '2x2',
  '3x3',
  '3x3 OH',
  '4x4',
  '5x5',
  '6x6',
  '7x7',
  'SQ1',
  'Skewb',
  'Pyraminx',
  'Megaminx',
  'Clock'
]
