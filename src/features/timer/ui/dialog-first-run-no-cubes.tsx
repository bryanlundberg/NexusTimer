'use client'

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import EmptyCubes from '@/features/manage-cubes/ui/EmptyCubes'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { useCubeActions } from '@/features/manage-cubes/model/useCubeActions'
import { useTranslations } from 'next-intl'

export default function DialogFirstRunNoCubes() {
  const router = useRouter()
  const t = useTranslations('Index.DialogFirstRunNoCubes')
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
        <DialogTitle>{t('title')}</DialogTitle>
        <DialogDescription>{t('description')}</DialogDescription>
      </DialogHeader>

      <EmptyCubes hideDescription hideTitle onCreate={handleCreateCollection} />
    </DialogContent>
  )
}
