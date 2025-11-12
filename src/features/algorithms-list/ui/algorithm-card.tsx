import AlgorithmRender from '@/components/twisty/AlgorithmRender'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import * as React from 'react'
import { AlgorithmCollection } from '@/interfaces/AlgorithmCollection'
import { cn } from '@/lib/utils'
import { PuzzleID, TwistyPlayer } from 'cubing/twisty'
import _ from 'lodash'
import { Button } from '@/components/ui/button'
import { EyeIcon } from 'lucide-react'
import { useAlgorithmTrainer } from '@/store/AlgorithmTrainer'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import AlgorithmModal from '@/features/algorithms-list/ui/algorithm-modal'

interface AlgorithmCardProps extends React.HTMLAttributes<HTMLDivElement> {
  onAlgorithmClick?: () => void
  algorithm: AlgorithmCollection
  virtualization?: TwistyPlayer
  puzzle: PuzzleID
}

export default function AlgorithmCard({
  algorithm,
  onAlgorithmClick,
  virtualization,
  puzzle,
  ...rest
}: AlgorithmCardProps) {
  const { open } = useOverlayStore()
  const algs = algorithm?.algs || algorithm?.alg || []

  const defaults = _.merge(
    {
      visualization: 'experimental-2D-LL',
      background: 'none',
      controlPanel: 'none',
      alg: algs[0],
      experimentalStickering: 'OLL',
      experimentalSetupAnchor: 'end'
    },
    virtualization
  )

  const handleOpenAlgorithmPreview = (alg: string) => {
    open({
      id: 'algorithm-preview',
      component: <AlgorithmModal />,
      metadata: {
        name: `${algorithm.group}-${algorithm.name}`,
        cube: puzzle,
        alg
      }
    })
  }

  return (
    <Card className={cn('p-3 mb-3 h-auto bg-card/50 break-inside-avoid-column', rest.className)} {...rest}>
      <h1>{`${algorithm.name}`}</h1>
      <div className={'flex flex-col md:flex-row items-start gap-3'}>
        <AlgorithmRender config={defaults} width={120} height={120} />
        <div className={'flex flex-col gap-2 justify-between text-sm grow w-full'}>
          {algs.map((alg, index) => (
            <Card
              className={'p-3 flex items-center justify-center flex-row bg-background'}
              onClick={onAlgorithmClick}
              key={`${algorithm.group}-${algorithm.name}-alg-${index}`}
            >
              <div className={'grow space-y-2'}>
                <Label className={'ml-2'}>Alternative #{index + 1}:</Label>
                <span className={'text-lg lg:text-xl xl:text-2xl flex justify-between'}>
                  {alg}
                  <Button
                    className={'ms-3'}
                    variant={'secondary'}
                    onClick={() => handleOpenAlgorithmPreview(alg)}
                    size={'icon'}
                  >
                    <EyeIcon />
                  </Button>{' '}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  )
}
