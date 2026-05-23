'use client'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { Dialog } from '@/components/ui/dialog'
import { useEffect, useState, type ReactNode } from 'react'

export const Overlay = () => {
  const overlayStore = useOverlayStore((state) => ({
    activeOverlay: state.activeOverlay,
    close: state.close
  }))

  const isOpen = !!overlayStore.activeOverlay
  const component = overlayStore.activeOverlay?.component
  const [renderedComponent, setRenderedComponent] = useState<ReactNode | null>(null)

  useEffect(() => {
    if (component) {
      setRenderedComponent(component)
      return
    }
    const timeout = setTimeout(() => setRenderedComponent(null), 250)
    return () => clearTimeout(timeout)
  }, [component])

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) overlayStore.close()
      }}
    >
      {renderedComponent}
    </Dialog>
  )
}
