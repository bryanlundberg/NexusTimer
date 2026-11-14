'use client'

import { useEffect, useEffectEvent, useState } from 'react'

import { registerBackDismiss } from '@/shared/lib/backDismiss'

type BackDismissOptions = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  enabled?: boolean
}

export function useBackDismiss({ open, defaultOpen = false, onOpenChange, enabled = true }: BackDismissOptions) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isOpen = open ?? internalOpen

  const handleOpenChange = (next: boolean) => {
    if (open === undefined) setInternalOpen(next)
    onOpenChange?.(next)
  }

  const close = useEffectEvent(() => handleOpenChange(false))

  useEffect(() => {
    if (!isOpen || !enabled) return
    return registerBackDismiss(() => close())
  }, [isOpen, enabled])

  return { open: isOpen, onOpenChange: handleOpenChange }
}
