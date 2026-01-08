import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Cube } from '@/entities/cube/model/types'
import { cubeCollection } from '@/shared/const/cube-collection'
import Image from 'next/image'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { useCubeActions } from '@/features/manage-cubes/model/useCubeActions'

export default function SelectCollection() {
  const close = useOverlayStore((state) => state.close)
  const isOpen = useOverlayStore((state) => state.activeOverlay !== null)
  const cubes = useTimerStore((state) => state.cubes)
  const t = useTranslations('Index')
  const { handleCreate } = useCubeActions(undefined)
  const setSelectedCube = useTimerStore((state) => state.setSelectedCube)
  const setNewScramble = useTimerStore((state) => state.setNewScramble)
  const setLastSolve = useTimerStore((state) => state.setLastSolve)

  const onSelect = (id: string) => {
    const choseCube = cubes?.find((cube) => cube.id === id)
    if (!choseCube) return
    setSelectedCube(choseCube)
    setNewScramble(choseCube)
    setLastSolve(null)
    close()
  }

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) close()
      }}
    >
      <VisuallyHidden>
        <DialogTitle></DialogTitle>
        <DialogDescription></DialogDescription>
      </VisuallyHidden>

      <CommandInput placeholder={t('Inputs.search')} />
      <CommandList>
        <CommandEmpty>
          <p>{t('Inputs.no-results')}</p>
          <Button onClick={handleCreate} variant={'secondary'} size={'sm'} className={'mt-5'}>
            {t('CubesPage.new-collection')}
          </Button>
        </CommandEmpty>

        {cubes && cubes.length > 0 && cubes.some((c: Cube) => c.favorite) && (
          <>
            <CommandGroup heading={t('Inputs.favorites')}>
              {cubes
                .filter((cube: Cube) => cube.favorite)
                .sort((a: Cube, b: Cube) => a.category.localeCompare(b.category))
                .map((cube) => {
                  return <Item cube={cube} key={cube.id} onSelect={onSelect} />
                })}
            </CommandGroup>
          </>
        )}

        <CommandSeparator />
        {cubes && cubes.length > 0 && (
          <CommandGroup heading={t('Inputs.collections')}>
            {cubes &&
              cubes.length > 0 &&
              cubes
                .filter((cube: Cube) => !cube.favorite)
                .sort((a: Cube, b: Cube) => a.category.localeCompare(b.category))
                .map((cube) => {
                  return <Item cube={cube} key={cube.id} onSelect={onSelect} />
                })}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}

function Item({ cube, onSelect }: { cube: Cube; onSelect: (id: string) => void }) {
  return (
    <>
      <CommandItem key={cube.id} value={cube.name} onSelect={() => onSelect(cube.id)} className="w-full">
        <div className="flex flex-row items-center gap-2 w-full min-w-0">
          {(() => {
            const foundCube = cubeCollection.find((i) => i.name === cube.category)
            if (foundCube) {
              return (
                <Image
                  unoptimized
                  src={foundCube.src}
                  alt={foundCube.name}
                  width={24}
                  height={24}
                  className="object-scale-down shrink-0"
                />
              )
            }
            return null
          })()}

          <p className="truncate flex-1">{cube.name}</p>
        </div>
      </CommandItem>
    </>
  )
}
