'use client'

import { useEffect, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Check } from 'lucide-react'
import { CommandItem } from '@/components/ui/command'
import { CountryFlag } from '@/shared/ui/country-flag/CountryFlag'

export interface CountryItem {
  code: string
  name: string
}

const ROW_HEIGHT = 32

/**
 * Virtualized rows. Lives in its own component so `useVirtualizer` mounts
 * together with its scroll container (the dialog content) — initializing it
 * in the parent leaves the list empty until the next re-render.
 */
export function CountryVirtualList({
  items,
  value,
  onSelect
}: {
  items: CountryItem[]
  value: string | null
  onSelect: (code: string) => void
}) {
  const listRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8
  })

  useEffect(() => {
    if (!value) return
    const index = items.findIndex((item) => item.code === value)
    if (index >= 0) rowVirtualizer.scrollToIndex(index, { align: 'center' })
  }, [])

  return (
    <div ref={listRef} className="max-h-72 overflow-y-auto overflow-x-hidden">
      <div className="relative w-full" style={{ height: rowVirtualizer.getTotalSize() }}>
        {rowVirtualizer.getVirtualItems().map((row) => {
          const { code, name } = items[row.index]
          return (
            <CommandItem
              key={code}
              value={code}
              onSelect={() => onSelect(code)}
              className="absolute left-1 right-1 top-0"
              style={{ height: row.size, transform: `translateY(${row.start}px)` }}
            >
              <CountryFlag code={code} />
              <span className="truncate">{name}</span>
              {value === code && <Check className="ml-auto size-4" />}
            </CommandItem>
          )
        })}
      </div>
    </div>
  )
}
