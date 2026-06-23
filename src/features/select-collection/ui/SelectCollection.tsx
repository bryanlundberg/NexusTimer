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
import { useOnboardingStore } from '@/features/onboarding-tour/model/useOnboardingStore'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Cube } from '@/entities/cube/model/types'
import { cubeCollection } from '@/shared/const/cube-collection'
import Image from 'next/image'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { useCubeActions } from '@/features/manage-cubes/model/useCubeActions'
import { Check, PlusIcon, Star } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { Nexi } from '@/shared/ui/nexi'

export default function SelectCollection() {
  const close = useOverlayStore((state) => state.close)
  const isOpen = useOverlayStore((state) => state.isOpen)
  const lockSelectClose = useOnboardingStore((state) => state.lockSelectClose)
  const cubes = useTimerStore((state) => state.cubes)
  const selectedCube = useTimerStore((state) => state.selectedCube)
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
        // During the onboarding tour, force the user to click the "create
        // collection" button — ignore outside-click/ESC dismissals.
        if (!open && lockSelectClose) return
        if (!open) close()
      }}
    >
      <VisuallyHidden>
        <DialogTitle></DialogTitle>
        <DialogDescription></DialogDescription>
      </VisuallyHidden>

      <CommandInput placeholder={t('Inputs.search')} />
      <CommandList className="max-h-100">
        <CommandEmpty>
          <div className="flex flex-col items-center gap-3 py-4">
            <Nexi state="solving" size={72} aria-label={t('Inputs.no-results')} />
            <p className="text-muted-foreground text-sm">{t('Inputs.no-results')}</p>
            <Button onClick={handleCreate} variant={'secondary'} size={'sm'} data-tour="onboarding-create-collection">
              <PlusIcon className="size-4" />
              {t('CubesPage.new-collection')}
            </Button>
          </div>
        </CommandEmpty>

        {cubes && cubes.length > 0 && cubes.some((c: Cube) => c.favorite) && (
          <>
            <CommandGroup heading={t('Inputs.favorites')}>
              {cubes
                .filter((cube: Cube) => cube.favorite)
                .sort((a: Cube, b: Cube) => a.category.localeCompare(b.category))
                .map((cube) => (
                  <Item cube={cube} key={cube.id} onSelect={onSelect} isSelected={selectedCube?.id === cube.id} />
                ))}
            </CommandGroup>
          </>
        )}

        <CommandSeparator />
        {cubes && cubes.length > 0 && (
          <CommandGroup heading={t('Inputs.collections')}>
            {cubes
              .filter((cube: Cube) => !cube.favorite)
              .sort((a: Cube, b: Cube) => a.category.localeCompare(b.category))
              .map((cube) => (
                <Item cube={cube} key={cube.id} onSelect={onSelect} isSelected={selectedCube?.id === cube.id} />
              ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}

function Item({ cube, onSelect, isSelected }: { cube: Cube; onSelect: (id: string) => void; isSelected: boolean }) {
  const foundCube = cubeCollection.find((i) => i.name === cube.category)

  return (
    <CommandItem
      key={cube.id}
      value={cube.name}
      onSelect={() => onSelect(cube.id)}
      className={cn(
        'w-full py-2.5 px-3 rounded-lg transition-colors',
        isSelected && 'bg-primary/10 border border-primary/20'
      )}
    >
      <div className="flex flex-row items-center gap-3 w-full min-w-0">
        <div
          className={cn(
            'flex items-center justify-center size-9 rounded-lg shrink-0',
            isSelected ? 'bg-primary/15' : 'bg-muted'
          )}
        >
          {foundCube ? (
            <Image
              unoptimized
              src={foundCube.src}
              alt={foundCube.name}
              width={22}
              height={22}
              className="object-scale-down"
            />
          ) : null}
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <p className={cn('truncate text-sm', isSelected && 'font-medium')}>{cube.name}</p>
          <p className="text-xs text-muted-foreground truncate">{cube.category}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {cube.favorite && <Star className="size-3.5 text-yellow-500 fill-yellow-500" />}
          {isSelected && <Check className="size-4 text-primary" />}
        </div>
      </div>
    </CommandItem>
  )
}
