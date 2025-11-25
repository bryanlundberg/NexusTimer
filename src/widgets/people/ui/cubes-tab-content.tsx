import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { cubeCollection } from '@/shared/const/cube-collection'
import * as React from 'react'
import moment from 'moment'
import _ from 'lodash'
import EmptyTabContent from '@/widgets/people/ui/empty-tab-content'
import { Cube } from '@/entities/cube/model/types'

interface CubesTabContentProps {
  cubes: Cube[]
}

export default function CubesTabContent({ cubes }: CubesTabContentProps) {
  if (_.isEmpty(cubes)) {
    return <EmptyTabContent />
  }

  return (
    <div className={'grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4'}>
      {cubes?.length ? (
        cubes.map((cube) => (
          <Card key={cube.id} className={'flex flex-1 h-auto gap-2 flex-row items-center px-3'}>
            <Image
              unoptimized
              src={cubeCollection.find((item) => item.name === cube.category)?.src || ''}
              alt={cube.name}
              className={'size-14 object-scale-down rounded p-1'}
              draggable={false}
              width={64}
              height={64}
            />
            <div className={'flex flex-col space-y-2 grow'}>
              <div className={'text-lg font-semibold'}>{cube.name}</div>
              <div className={'text-sm text-muted-foreground'}>
                Created at: {moment(cube.createdAt).format('DD/MM/YYYY')}
              </div>
              <div className={'text-sm text-muted-foreground'}>Solves: {cube.solves.session.length}</div>
            </div>
          </Card>
        ))
      ) : (
        <div className="text-center text-gray-500">No cubes found.</div>
      )}
    </div>
  )
}
