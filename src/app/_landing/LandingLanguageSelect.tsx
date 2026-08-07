'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Check, ChevronDown, Globe } from 'lucide-react'
import { languages } from '@/shared/const/languages'
import { syncTranslations } from '@/shared/lib/language'

export default function LandingLanguageSelect({ label }: { label: string }) {
  const locale = useLocale()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
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
    if (code === locale) return
    startTransition(async () => {
      await syncTranslations(code)
      router.refresh()
    })
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
        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-gray-300 transition-colors duration-300 hover:border-white/30 hover:text-white disabled:opacity-60"
      >
        <Globe className="size-3.5" aria-hidden />
        <span>{current.name}</span>
        <ChevronDown className={`size-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className="absolute bottom-full left-0 z-50 mb-2 max-h-64 w-52 overflow-y-auto rounded-xl border border-white/15 bg-neutral-900/95 p-1 shadow-2xl backdrop-blur-md"
        >
          {languages.map((item) => (
            <li key={item.code}>
              <button
                type="button"
                role="option"
                aria-selected={item.code === locale}
                onClick={() => handleSelect(item.code)}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs text-gray-300 transition-colors duration-200 hover:bg-white/10 hover:text-white"
              >
                {item.flag}
                <span className="flex-1 truncate">{item.name}</span>
                {item.code === locale && <Check className="size-3.5 shrink-0" aria-hidden />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
