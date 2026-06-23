'use client'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { Dialog } from '@/components/ui/dialog'
import { useEffect } from 'react'

const CLOSE_ANIMATION_MS = 250

export const Overlay = () => {
  const activeOverlay = useOverlayStore((state) => state.activeOverlay)
  const isOpen = useOverlayStore((state) => state.isOpen)
  const close = useOverlayStore((state) => state.close)
  const clear = useOverlayStore((state) => state.clear)

  useEffect(() => {
    if (isOpen || !activeOverlay) return
    const timeout = setTimeout(() => clear(), CLOSE_ANIMATION_MS)
    return () => clearTimeout(timeout)
  }, [isOpen, activeOverlay, clear])

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) close()
      }}
    >
      {activeOverlay?.component}
    </Dialog>
  )
}
