'use client'

import { Bluetooth, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useSmartCubeStore } from '@/features/smart-cube/model/useSmartCubeStore'

export function SmartCubeIndicator() {
  const t = useTranslations('Index.HomePage')
  const connected = useSmartCubeStore((s) => s.status === 'connected')
  const deviceName = useSmartCubeStore((s) => s.deviceName)
  const disconnect = useSmartCubeStore((s) => s.disconnect)

  if (!connected) return null

  return (
    <div className="flex items-center gap-2 rounded-md border bg-black px-3 py-2 text-xs font-medium">
      <span className="relative flex size-2 shrink-0">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
      </span>
      <Bluetooth className="size-4 shrink-0 text-primary" />
      <span className="min-w-0 flex-1 truncate text-white">{deviceName ?? 'Smart Cube'}</span>
      <button
        type="button"
        onClick={disconnect}
        aria-label={t('disconnect')}
        title={t('disconnect')}
        className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <X className="size-3.5" />
      </button>
    </div>
  )
}
