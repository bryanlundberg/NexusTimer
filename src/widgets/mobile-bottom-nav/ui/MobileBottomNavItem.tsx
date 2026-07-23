'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { type ElementType } from 'react'
import { cn } from '@/shared/lib/utils'
import { triggerHaptic } from '@/shared/model/useHaptics'

type Props = {
  url: string
  icon: ElementType
  label: string
  active: boolean
}

export function MobileBottomNavItem({ url, icon: Icon, label, active }: Props) {
  return (
    <Link
      href={url}
      onClick={() => triggerHaptic()}
      aria-current={active ? 'page' : undefined}
      className="relative flex h-full w-full items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-ring/60 rounded-md"
    >
      <motion.div
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 500, damping: 22 }}
        className="flex w-full flex-col items-center justify-center gap-1 py-2 px-1"
      >
        <Icon
          className={cn('size-5 transition-colors', active ? 'text-foreground' : 'text-muted-foreground')}
          aria-hidden="true"
        />
        <span
          className={cn(
            'text-[10px] font-medium transition-colors',
            active ? 'text-foreground' : 'text-muted-foreground'
          )}
        >
          {label}
        </span>
        {active && (
          <motion.span
            layoutId="mobile-bottom-nav-indicator"
            className="absolute -top-px h-0.5 w-8 rounded-full bg-foreground"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </motion.div>
    </Link>
  )
}
