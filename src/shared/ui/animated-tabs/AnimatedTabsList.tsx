'use client'
import { ReactNode } from 'react'
import { motion } from 'motion/react'
import type { LucideIcon } from 'lucide-react'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/shared/lib/utils'

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
  className?: string
}

export default function AnimatedTabsList({ items, activeValue, layoutId, className }: AnimatedTabsListProps) {
  return (
    <TabsList
      className={cn('relative grid w-full', className)}
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
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
              transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
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
