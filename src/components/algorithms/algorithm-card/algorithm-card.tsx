import AlgorithmRender from '@/components/twisty/AlgorithmRender';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import * as React from 'react';
import { AlgorithmCollection } from '@/interfaces/AlgorithmCollection';
import { cn } from '@/lib/utils';
import { TwistyPlayer } from 'cubing/twisty';
import _ from 'lodash';

interface AlgorithmCardProps extends React.HTMLAttributes<HTMLDivElement> {
  onAlgorithmClick?: () => void
  algorithm: AlgorithmCollection
  virtualization?: TwistyPlayer
}

export default function AlgorithmCard({
  algorithm,
  onAlgorithmClick,
  virtualization,
  ...rest
}: AlgorithmCardProps) {

  const defaults = _.merge({
    visualization: 'experimental-2D-LL',
    background: 'none',
    controlPanel: 'none',
    alg: algorithm.alg[0],
    experimentalStickering: 'OLL',
    experimentalSetupAnchor: 'end',
  }, virtualization)

  return (
    <Card className={cn('p-3 mb-3 h-auto bg-background break-inside-avoid-column', rest.className)} {...rest}>
      <h1>{`OLL-${algorithm.group}-${algorithm.name}`}</h1>
      <div className={'flex flex-col md:flex-row items-start gap-3'}>
        <AlgorithmRender
          config={defaults}
          width={120}
          height={120}
        />
        <div className={'flex flex-col gap-2 justify-between text-sm grow w-full'}>
          {algorithm.alg.map((alg, index) => (
            <Card
              className={'p-3 flex items-center justify-center flex-row bg-card/50'} onClick={onAlgorithmClick}
              key={`OLL-${algorithm.group}-${algorithm.name}-alg-${index}`}
            >
              <div className={'grow space-y-2'}>
                <Label className={'ml-2'}>Alternative #{index + 1}:</Label>
                <span className={'text-lg lg:text-xl xl:text-2xl'}>{alg}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  )
}
