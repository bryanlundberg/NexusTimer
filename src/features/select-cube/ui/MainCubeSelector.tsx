import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import Link from 'next/link'
import { cubeCollection } from '@/lib/const/cubeCollection'
import { useTimerStore } from '@/store/timerStore'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { PlusIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { Cube } from '@/entities/cube/model/types'

export default function MainCubeSelector() {
  const t = useTranslations('Index')
  const cubes = useTimerStore((state) => state.cubes)
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const setSelectedCube = useTimerStore((state) => state.setSelectedCube)
  const setNewScramble = useTimerStore((state) => state.setNewScramble)
  const setLastSolve = useTimerStore((state) => state.setLastSolve)
  const setIsOpenDrawerNewCollection = useTimerStore((state) => state.setIsOpenDrawerNewCollection)
  const handleChangeValue = (e: any) => {
    const choseCube = cubes?.find((cube) => cube.id === e)
    if (!choseCube) return
    setSelectedCube(choseCube)
    setNewScramble(choseCube)
    setLastSolve(null)
  }
  return (
    <>
      <Select defaultValue={selectedCube?.id} value={selectedCube?.id} onValueChange={handleChangeValue}>
        <SelectTrigger className="w-full" data-testid="main-cube-selector">
          <SelectValue placeholder={t('Inputs.select')} />
        </SelectTrigger>
        <SelectContent>
          {cubes && cubes.length > 0 && cubes.some((c: Cube) => c.favorite) && (
            <>
              <SelectGroup>
                <SelectLabel>{t('Inputs.favorites')}</SelectLabel>
                {cubes
                  .filter((cube: Cube) => cube.favorite)
                  .sort((a: Cube, b: Cube) => a.category.localeCompare(b.category))
                  .map((cube) => {
                    return <SelectCubeItemWidthImage cube={cube} key={cube.id} />
                  })}
              </SelectGroup>
            </>
          )}
          <SelectGroup>
            <SelectLabel>
              {t('Inputs.collections')} {cubes && cubes.length <= 0 && '(' + t('Inputs.empty') + ')'}
            </SelectLabel>
            {cubes &&
              cubes.length > 0 &&
              cubes
                .filter((cube: Cube) => !cube.favorite)
                .sort((a: Cube, b: Cube) => a.category.localeCompare(b.category))
                .map((cube) => {
                  return <SelectCubeItemWidthImage cube={cube} key={cube.id} />
                })}
            <Link href={'/cubes'} onClick={() => setIsOpenDrawerNewCollection(true)}>
              <Button variant={'outline'} className="w-full">
                <div className="flex items-center justify-center gap-1">
                  <PlusIcon />
                  {t('CubesPage.new-collection')}
                </div>
              </Button>
            </Link>
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  )
}

function SelectCubeItemWidthImage({ cube }: { cube: Cube }) {
  return (
    <>
      <SelectItem key={cube.id} value={cube.id}>
        <div className="flex flex-row items-center justify-between gap-2">
          {(() => {
            const foundCube = cubeCollection.find((i) => i.name === cube.category)
            if (foundCube) {
              return (
                <Image src={foundCube.src} alt={foundCube.name} width={24} height={24} className="object-scale-down" />
              )
            }
            return null
          })()}

          <p className="">{cube.name}</p>
        </div>
      </SelectItem>
    </>
  )
}
