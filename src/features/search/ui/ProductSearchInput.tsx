'use client'

import { Fragment, useEffect, useId, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/shared/lib/utils'
import { cubeColorClass } from '@/shared/const/cube-colors'
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

function highlightMatch(text: string | null | undefined, query: string) {
  if (!text) return text ?? ''
  const q = query.trim()
  if (!q) return text
  const index = text.toLowerCase().indexOf(q.toLowerCase())
  if (index === -1) return text
  return (
    <Fragment>
      {text.slice(0, index)}
      <span className="text-primary font-semibold">{text.slice(index, index + q.length)}</span>
      {text.slice(index + q.length)}
    </Fragment>
  )
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
  const [focused, setFocused] = useState(false)
  const [highlight, setHighlight] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listboxId = useId()

  const trimmed = value.trim()
  const { hits: rawHits, isLoading } = useSearch<ProductHit>('products', open ? value : '')
  const hits = rawHits.filter((hit) => Boolean(hit.name && hit.name.trim()))

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

  const showDropdown = open && trimmed.length > 0 && (hits.length > 0 || isLoading)

  function choose(hit: ProductHit) {
    onSelect(hit)
    setOpen(false)
  }

  function clear() {
    onValueChange('')
    setOpen(false)
    inputRef.current?.focus()
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setOpen(false)
      return
    }
    if (!showDropdown || hits.length === 0) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlight((h) => (h + 1) % hits.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlight((h) => (h <= 0 ? hits.length - 1 : h - 1))
    } else if (event.key === 'Enter') {
      if (highlight >= 0 && hits[highlight]) {
        event.preventDefault()
        choose(hits[highlight])
      }
    }
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Field */}
      <div className={cn('field-notch flex items-center gap-2 px-2.5 transition-colors duration-150')}>
        <Search
          className={cn('size-4 shrink-0 transition-colors', focused ? 'text-primary' : 'text-muted-foreground')}
        />
        <input
          ref={inputRef}
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
          onFocus={() => {
            setFocused(true)
            setOpen(true)
          }}
          onBlur={() => setFocused(false)}
          onKeyDown={onKeyDown}
          className="placeholder:text-muted-foreground h-9 w-full bg-transparent text-sm outline-none"
        />
        {isLoading && <Spinner className="text-muted-foreground size-4 shrink-0" />}
        {!isLoading && value.length > 0 && (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear"
            className="text-muted-foreground hover:text-foreground shrink-0 rounded p-0.5 transition-colors"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="gaming-panel absolute z-50 mt-1.5 w-full">
          <ul id={listboxId} role="listbox" className="max-h-72 w-full overflow-y-auto overflow-x-hidden p-1">
            {isLoading && hits.length === 0 && (
              <li className="text-muted-foreground flex items-center gap-2 px-2 py-1.5 text-xs">
                <Spinner className="size-3.5" />
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
                  'flex cursor-pointer items-center gap-2.5 rounded-none px-2 py-1.5 transition-colors',
                  index === highlight
                    ? 'bg-primary/15 text-foreground shadow-[inset_2px_0_0_var(--primary)]'
                    : 'hover:bg-primary/10'
                )}
              >
                <div className="bg-muted/40 flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md border">
                  {hit.image ? (
                    <img
                      src={hit.image}
                      alt={hit.name ?? ''}
                      loading="lazy"
                      className="size-full object-contain p-0.5"
                    />
                  ) : (
                    <Search className="text-muted-foreground/50 size-3.5" />
                  )}
                </div>

                <p className="min-w-0 flex-1 truncate text-sm">{highlightMatch(hit.name, value)}</p>

                {hit.category && (
                  <span className="text-muted-foreground flex shrink-0 items-center gap-1 text-[11px] font-medium">
                    <span className={cn('size-1.5 rounded-full', cubeColorClass(hit.category))} />
                    {hit.category}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
