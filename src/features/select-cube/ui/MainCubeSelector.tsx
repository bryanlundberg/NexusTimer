import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { Button } from '@/components/ui/button'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import SelectCollection from '@/features/select-collection/ui/SelectCollection'
import { useEffect } from 'react'

export default function MainCubeSelector() {
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const open = useOverlayStore((state) => state.open)

  const handleOpenSelector = () => {
    open({
      component: <SelectCollection />,
      id: 'Select Collection',
      metadata: {}
    })
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        handleOpenSelector()
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <div className="flex-1 min-w-0">
      <Button variant={'outline'} className={'w-full justify-between overflow-hidden'} onClick={handleOpenSelector}>
        <span className={'truncate mr-2'}>{selectedCube ? selectedCube.name : 'Select Cube'}</span>
        <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none shrink-0">
          <span className="text-xs">⌘</span>J
        </kbd>
      </Button>
    </div>
  )
}
