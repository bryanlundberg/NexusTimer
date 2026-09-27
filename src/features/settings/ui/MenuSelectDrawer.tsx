'use client'
import { useState } from 'react'
import { CheckIcon, ChevronRightIcon } from 'lucide-react'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { cn } from '@/shared/lib/utils'
import { MenuRowText } from './MenuRowText'

interface MenuSelectDrawerProps {
  label: string
  description?: string
  value: string
  onValueChange: (value: string) => void
  options: Array<{ value: string; label: React.ReactNode }>
  disabled?: boolean
  className?: string
}

export default function MenuSelectDrawer({
  label,
  description,
  value,
  onValueChange,
  options,
  disabled,
  className
}: MenuSelectDrawerProps) {
  const [open, setOpen] = useState(false)
  const current = options.find((option) => option.value === value)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left transition-colors [-webkit-tap-highlight-color:transparent] active:bg-muted/50 disabled:opacity-50',
            className
          )}
        >
          <MenuRowText label={label} description={description} />
          <span className="flex max-w-[45%] shrink-0 items-center gap-1 text-sm text-muted-foreground">
            <span className="flex min-w-0 items-center gap-2 truncate">{current?.label}</span>
            <ChevronRightIcon className="size-4 shrink-0" />
          </span>
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{label}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <div
          role="radiogroup"
          aria-label={label}
          className="min-h-0 overflow-y-auto border-t border-border/40 pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          {options.map((option) => {
            const selected = option.value === value
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  onValueChange(option.value)
                  setOpen(false)
                }}
                className={cn(
                  'flex min-h-13 w-full items-center justify-between gap-3 border-b border-border/40 px-5 text-left text-base transition-colors [-webkit-tap-highlight-color:transparent] active:bg-muted/50',
                  selected && 'bg-primary/10 font-medium shadow-[inset_2px_0_0_var(--primary)]'
                )}
              >
                <span className="flex min-w-0 items-center gap-3">{option.label}</span>
                {selected && <CheckIcon className="size-5 shrink-0 text-primary" />}
              </button>
            )
          })}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
