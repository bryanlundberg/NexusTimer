'use client'
import { useRef } from 'react'
import type * as React from 'react'
import { cn } from '@/shared/lib/utils'
import { LIGHT_STRETCH, useOverscrollStretch } from '@/shared/model/useOverscrollStretch'

export function StretchScroller({ className, ...props }: Omit<React.ComponentProps<'div'>, 'ref'>) {
  const ref = useRef<HTMLDivElement>(null)
  useOverscrollStretch(ref, ref, { maxStretch: LIGHT_STRETCH })

  return <div ref={ref} className={cn('pointer-coarse:overscroll-y-none', className)} {...props} />
}
