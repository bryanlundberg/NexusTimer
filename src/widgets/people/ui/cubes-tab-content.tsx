import * as React from 'react'
import _ from 'lodash'
import EmptyTabContent from '@/widgets/people/ui/empty-tab-content'
import { Cube } from '@/entities/cube/model/types'
import PeopleCubeCard from '@/widgets/people/ui/PeopleCubeCard'
import { useTranslations } from 'next-intl'

interface CubesTabContentProps {
  cubes: Cube[]
}

export default function CubesTabContent({ cubes }: CubesTabContentProps) {
  const t = useTranslations('Index.CubesPage')
  if (_.isEmpty(cubes)) {
    return <EmptyTabContent />
  }

  const sortedCubes = _.orderBy(cubes, (cube) => cube.solves.session.length + cube.solves.all.length, 'desc')

  return (
    <div className={'grid grid-cols-1 @2xl/tab:grid-cols-2 @5xl/tab:grid-cols-3 gap-4'}>
      {sortedCubes?.length ? (
        sortedCubes.map((cube) => {
          return <PeopleCubeCard key={cube.id} cube={cube} />
        })
      ) : (
        <div className="text-center text-gray-500">{t('no-cubes-for-display')}</div>
      )}
    </div>
  )
}
