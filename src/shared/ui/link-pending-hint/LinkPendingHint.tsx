'use client'

import { useLinkStatus } from 'next/link'
import { cn } from '@/shared/lib/utils'

export function LinkPendingHint({ className }: { className?: string }) {
  const { pending } = useLinkStatus()

  return (
    <span aria-hidden data-pending={pending || undefined} className={cn('link-pending-hint absolute', className)} />
  )
}
