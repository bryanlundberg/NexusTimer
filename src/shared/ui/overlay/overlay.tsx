'use client'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { Dialog } from '@/components/ui/dialog'

export const Overlay = () => {
  const overlayStore = useOverlayStore((state) => ({
    activeOverlay: state.activeOverlay,
    close: state.close
  }))

  if (!overlayStore.activeOverlay) return null
  const { component } = overlayStore.activeOverlay

  return (
    <Dialog open={!!overlayStore.activeOverlay} onOpenChange={overlayStore.close}>
      {component}
    </Dialog>
  )
}
