'use client'

import * as React from 'react'
import { useMemo, useState } from 'react'
import { Check, ChevronDown, Globe } from 'lucide-react'
import { useLocale } from 'next-intl'
import { countries } from 'country-flag-icons'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { CountryFlag } from '@/shared/ui/country-flag/CountryFlag'
import { CountryVirtualList } from '@/shared/ui/country-combobox/CountryVirtualList'
import { getCountryName } from '@/shared/lib/getCountryName'
import { cn } from '@/shared/lib/utils'

interface CountryComboboxProps {
  value: string | null
  onChange: (code: string | null) => void
  placeholder: string
  searchPlaceholder: string
  emptyText: string
  clearLabel?: string
  className?: string
  id?: string
  reserveClearSlot?: boolean
}

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')

export function CountryCombobox({
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  emptyText,
  clearLabel,
  className,
  id,
  reserveClearSlot = false
}: CountryComboboxProps) {
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const items = useMemo(
    () =>
      countries
        .filter((code) => /^[A-Z]{2}$/.test(code))
        .map((code) => ({ code, name: getCountryName(code, locale) }))
        .filter(({ code, name }) => name && name !== code)
        .sort((a, b) => a.name.localeCompare(b.name, locale)),
    [locale]
  )

  const filtered = useMemo(() => {
    const q = normalize(query.trim())
    if (!q) return items
    return items.filter(({ code, name }) => normalize(name).includes(q) || code.toLowerCase().includes(q))
  }, [items, query])

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) setQuery('')
  }

  const handleSelect = (code: string | null) => {
    onChange(code)
    handleOpenChange(false)
  }

  const selected = value ? items.find((item) => item.code === value) : undefined

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('justify-between font-normal', !selected && 'text-muted-foreground', className)}
        >
          <span className="flex flex-1 items-center gap-2 truncate">
            {selected ? (
              <>
                <CountryFlag code={selected.code} />
                <span className="truncate">{selected.name}</span>
              </>
            ) : (
              <>
                <Globe className="size-4 opacity-50" />
                {placeholder}
              </>
            )}
          </span>
          {reserveClearSlot && <span aria-hidden className="w-6 shrink-0" />}
          <ChevronDown className="size-4 shrink-0 opacity-50" />
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden p-0 sm:max-w-sm top-[30%] translate-y-0">
        <DialogTitle className="sr-only">{searchPlaceholder}</DialogTitle>
        <Command shouldFilter={false}>
          <CommandInput placeholder={searchPlaceholder} value={query} onValueChange={setQuery} />
          <CommandList className="max-h-none overflow-visible">
            {filtered.length === 0 && <CommandEmpty>{emptyText}</CommandEmpty>}
            {clearLabel && !query && (
              <CommandItem value="__all__" onSelect={() => handleSelect(null)} className="mx-1 mt-1">
                <Globe className="size-4 opacity-60" />
                {clearLabel}
                {!value && <Check className="ml-auto size-4" />}
              </CommandItem>
            )}
            <CountryVirtualList items={filtered} value={value} onSelect={handleSelect} />
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
