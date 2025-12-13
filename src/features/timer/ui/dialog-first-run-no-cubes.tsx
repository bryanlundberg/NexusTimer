'use client'

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import EmptyCubes from '@/features/manage-cubes/ui/EmptyCubes'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { useCubeActions } from '@/features/manage-cubes/model/useCubeActions'

export default function DialogFirstRunNoCubes() {
  const router = useRouter()
  const close = useOverlayStore((state) => state.close)
  const { handleCreate } = useCubeActions(undefined)

  const handleCreateCollection = () => {
    router.push('/cubes')
    close()
    handleCreate()
  }

  return (
    <DialogContent className="max-w-[450px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Welcome to NexusTimer</DialogTitle>
        <DialogDescription>
          You do not have any collections yet. You can create your first collection or import a backup to get started.
        </DialogDescription>
      </DialogHeader>

      <EmptyCubes
        hideDescription
        hideTitle
        onCreate={handleCreateCollection}
      />
    </DialogContent>
  )
}
