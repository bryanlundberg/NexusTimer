'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/shared/lib/utils'
import { useSearch } from '../model/useSearch'
import type { ProductHit } from '../model/types'

interface ProductSearchInputProps {
  value: string
  onValueChange: (value: string) => void
  onSelect: (hit: ProductHit) => void
  placeholder?: string
  id?: string
  'data-testid'?: string
}

export function ProductSearchInput({
  value,
  onValueChange,
  onSelect,
  placeholder,
  id,
  'data-testid': dataTestId
}: ProductSearchInputProps) {
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()

  const { hits, isLoading } = useSearch<ProductHit>('products', open ? value : '')

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  useEffect(() => {
    setHighlight(-1)
  }, [hits])

  const showDropdown = open && value.trim().length > 0 && (hits.length > 0 || isLoading)

  function choose(hit: ProductHit) {
    onSelect(hit)
    setOpen(false)
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlight((h) => Math.min(h + 1, hits.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlight((h) => Math.max(h - 1, 0))
    } else if (event.key === 'Enter') {
      if (highlight >= 0 && hits[highlight]) {
        event.preventDefault()
        choose(hits[highlight])
      }
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <Input
        id={id}
        data-testid={dataTestId}
        autoComplete="off"
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls={listboxId}
        aria-autocomplete="list"
        value={value}
        placeholder={placeholder}
        onChange={(event) => {
          onValueChange(event.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
      />

      {showDropdown && (
        <ul
          id={listboxId}
          role="listbox"
          className="bg-popover text-popover-foreground absolute z-50 mt-1 max-h-72 w-full overflow-y-auto rounded-md border p-1 shadow-md"
        >
          {isLoading && hits.length === 0 && (
            <li className="text-muted-foreground flex items-center gap-2 px-2 py-2 text-sm">
              <Spinner className="size-4" />
              Searching…
            </li>
          )}

          {hits.map((hit, index) => (
            <li
              key={hit.id}
              role="option"
              aria-selected={index === highlight}
              onMouseEnter={() => setHighlight(index)}
              onMouseDown={(event) => {
                event.preventDefault()
                choose(hit)
              }}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-sm px-2 py-2',
                index === highlight ? 'bg-accent' : 'hover:bg-accent/50'
              )}
            >
              <div className="bg-muted relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded">
                {hit.image ? (
                  <img src={hit.image} alt={hit.name} loading="lazy" className="size-full object-contain" />
                ) : null}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{hit.name}</p>
                {hit.brand && hit.brand.length > 0 && (
                  <p className="text-muted-foreground truncate text-xs">{hit.brand.join(', ')}</p>
                )}
              </div>

              {hit.category && (
                <Badge variant="secondary" className="shrink-0">
                  {hit.category}
                </Badge>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
