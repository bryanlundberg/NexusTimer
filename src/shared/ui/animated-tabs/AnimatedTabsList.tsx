'use client'
import { ReactNode } from 'react'
import { motion } from 'motion/react'
import type { LucideIcon } from 'lucide-react'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/shared/lib/utils'
import { INDICATOR_SPRING } from '@/shared/lib/motion'

export interface AnimatedTabItem {
  value: string
  label: ReactNode
  icon?: LucideIcon
  disabled?: boolean
}

interface AnimatedTabsListProps {
  items: AnimatedTabItem[]
  activeValue: string
  layoutId: string
  fitted?: boolean
  className?: string
}

export default function AnimatedTabsList({
  items,
  activeValue,
  layoutId,
  fitted = false,
  className
}: AnimatedTabsListProps) {
  return (
    <TabsList
      className={cn('relative', fitted ? 'inline-flex w-fit' : 'grid w-full', className)}
      style={fitted ? undefined : { gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {items.map(({ value, label, icon: Icon, disabled }) => (
        <TabsTrigger
          key={value}
          value={value}
          disabled={disabled}
          className="relative z-10 data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:bg-transparent"
        >
          {activeValue === value && (
            <motion.span
              layoutId={layoutId}
              className="absolute inset-0 rounded-md bg-background shadow-sm dark:border dark:border-input dark:bg-input/30"
              transition={INDICATOR_SPRING}
            />
          )}
          <span className="relative z-10 inline-flex items-center gap-1.5">
            {Icon && <Icon className="size-4" />}
            {label}
          </span>
        </TabsTrigger>
      ))}
    </TabsList>
  )
}
