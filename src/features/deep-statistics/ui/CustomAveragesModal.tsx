'use client'

import { FormEvent, useState } from 'react'
import { useTranslations } from 'next-intl'
import { X } from 'lucide-react'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import {
  DEFAULT_AVERAGES,
  DEFAULT_RAIL_AVERAGES,
  DEFAULT_TIMER_AVERAGES,
  MAX_AVERAGE_SIZE,
  MAX_AVERAGES,
  MAX_TIMER_AVERAGES,
  MIN_AVERAGE_SIZE,
  parseAverageSize,
  resolveAverages,
  toCustomAverages
} from '@/shared/lib/statistics/averageSizes'

const TARGETS = {
  stats: { key: 'customAverages', defaults: DEFAULT_AVERAGES, max: MAX_AVERAGES },
  timer: { key: 'timerAverages', defaults: DEFAULT_TIMER_AVERAGES, max: MAX_TIMER_AVERAGES },
  rail: { key: 'railAverages', defaults: DEFAULT_RAIL_AVERAGES, max: MAX_TIMER_AVERAGES }
} as const

export default function CustomAveragesModal({ target }: { target: keyof typeof TARGETS }) {
  const { key, defaults, max } = TARGETS[target]
  const t = useTranslations('Index.StatsPage')
  const close = useOverlayStore((store) => store.close)
  const stored = useSettingsStore((store) => store.settings.features[key])
  const updateSetting = useSettingsStore((store) => store.updateSetting)
  const [sizes, setSizes] = useState(() => resolveAverages(stored, defaults))
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const isFull = sizes.length >= max

  const handleAdd = (event: FormEvent) => {
    event.preventDefault()
    const size = parseAverageSize(input)
    if (size === null) {
      setError(t('averages-invalid', { min: MIN_AVERAGE_SIZE, max: MAX_AVERAGE_SIZE }))
      return
    }
    setError(null)
    setInput('')
    if (!sizes.includes(size)) setSizes([...sizes, size].sort((a, b) => a - b))
  }

  const handleSave = () => {
    updateSetting(`features.${key}`, toCustomAverages(sizes, defaults))
    close()
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{t('averages-title')}</DialogTitle>
        <DialogDescription>{t('averages-description', { max })}</DialogDescription>
      </DialogHeader>

      <ul className="flex flex-wrap gap-1.5">
        {sizes.map((size) => (
          <li key={size} className="flex h-9 items-center gap-1 bg-foreground/[0.04] pl-3 pr-1">
            <span className="font-mono text-sm font-semibold tabular-nums">Ao{size}</span>
            <button
              type="button"
              onClick={() => setSizes(sizes.filter((other) => other !== size))}
              aria-label={t('averages-remove', { name: `Ao${size}` })}
              className="flex size-7 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <X aria-hidden className="size-3.5" />
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAdd} className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Input
            autoFocus
            value={input}
            onChange={(event) => {
              setInput(event.target.value)
              setError(null)
            }}
            placeholder="500"
            inputMode="numeric"
            autoComplete="off"
            enterKeyHint="done"
            disabled={isFull}
            aria-label={t('averages-size')}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'custom-average-error' : undefined}
            className="font-mono"
          />
          <Button type="submit" variant="outline" disabled={isFull || input.trim() === ''}>
            {t('averages-add')}
          </Button>
        </div>
        {error && (
          <p id="custom-average-error" role="alert" className="text-xs text-destructive">
            {error}
          </p>
        )}
      </form>

      <DialogFooter className="sm:justify-between">
        <Button type="button" variant="ghost" onClick={() => setSizes(defaults)}>
          {t('averages-reset')}
        </Button>
        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={close}>
            {t('averages-cancel')}
          </Button>
          <Button type="button" onClick={handleSave} disabled={sizes.length === 0}>
            {t('averages-save')}
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  )
}
