'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Globe } from 'lucide-react'
import { languages } from '@/shared/const/languages'
import { useSwitchLocale } from '@/shared/config/i18n/useSwitchLocale'

export default function LandingLanguageSelect({ label }: { label: string }) {
  const { locale, switchLocale, isPending } = useSwitchLocale()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const current = languages.find((item) => item.code === locale) ?? languages[0]

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const handleSelect = (code: string) => {
    setOpen(false)
    switchLocale(code)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        disabled={isPending}
        onClick={() => setOpen((value) => !value)}
        className="field field-hover inline-flex h-9 items-center gap-2 px-3 text-xs text-muted-foreground hover:text-foreground disabled:opacity-60 pointer-coarse:h-10"
      >
        <Globe className="size-3.5" aria-hidden />
        <span>{current.name}</span>
        <ChevronDown className={`size-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className="menu-panel absolute bottom-full left-0 z-50 mb-2 max-h-64 w-52 overflow-y-auto p-1"
        >
          {languages.map((item) => (
            <li key={item.code}>
              <button
                type="button"
                role="option"
                aria-selected={item.code === locale}
                onClick={() => handleSelect(item.code)}
                className={`flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-xs transition-colors duration-200 ${
                  item.code === locale
                    ? 'bg-primary/15 text-foreground'
                    : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                }`}
              >
                {item.flag}
                <span className="flex-1 truncate">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
