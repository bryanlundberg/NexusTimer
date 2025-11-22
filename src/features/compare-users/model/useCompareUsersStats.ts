import { useMemo } from 'react'
import _ from 'lodash'
import calcBestTime from '@/shared/lib/statistics/calcBestTime'
import calcTotalSolvesStatistics from '@/shared/lib/statistics/calcTotalSolvesStatistics'
import calculateBestAo from '@/shared/lib/statistics/calculateBestAo'
import { CompareUser } from '@/features/compare-users/model/compare'
import { Cube } from '@/entities/cube/model/types'
import { CUBE_CATEGORIES } from '@/shared/config/cube-categories'

interface User {
  _id: string
}

export function useCompareUsersStats(users: User[], userCubes: Record<string, any>): CompareUser[] {
  return useMemo(() => {
    return users.map((user) => {
      const cubesDB = userCubes[user._id] || {}
      const byCategory = Object.create(null) as CompareUser
      CUBE_CATEGORIES.forEach((category) => {
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
