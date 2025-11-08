'use client'
import Navigation from '@/components/navigation/navigation'
import EmptyCubes from '@/components/cubes/EmptyCubes'
import FadeIn from '@/components/fade-in/fade-in'
import { useTimerStore } from '@/store/timerStore'
import { ScrollArea } from '@/components/ui/scroll-area'
import CubesList from '@/features/manage-cubes/ui/CubesList'

export default function Page() {
  const cubes = useTimerStore((store) => store.cubes)
  return (
    <ScrollArea className={'max-h-dvh overflow-auto'}>
      <FadeIn>
        <div className=" px-2 pt-2 flex flex-col w-full min-h-full">
          <Navigation showButtonCreateCollection showMainCubeSelector />
          {cubes?.length ? <CubesList cubes={cubes} /> : <EmptyCubes />}
        </div>
      </FadeIn>
    </ScrollArea>
  )
}
