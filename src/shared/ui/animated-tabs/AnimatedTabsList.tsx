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
      className={cn(
        'relative h-auto gap-0 rounded-lg bg-muted/30 p-0.5',
        fitted ? 'inline-flex w-fit' : 'grid w-full',
        className
      )}
      style={fitted ? undefined : { gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {items.map(({ value, label, icon: Icon, disabled }) => (
        <TabsTrigger
          key={value}
          value={value}
          disabled={disabled}
          className="group relative z-10 rounded-md border-transparent py-2.5 font-display text-[13px] font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:border-transparent md:py-2 dark:text-muted-foreground dark:hover:text-foreground dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-transparent dark:data-[state=active]:text-foreground"
        >
          {activeValue === value && (
            <motion.span
              layoutId={layoutId}
              className="absolute inset-0 rounded-md bg-background shadow-sm ring-1 ring-border/70"
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
