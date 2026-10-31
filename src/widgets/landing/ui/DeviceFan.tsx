'use client'

import { useTranslations } from 'next-intl'
import { Check, Monitor, Smartphone, Tablet } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { useCycle } from '../model/useCycle'
import FlowLines from './FlowLines'

const TARGETS = [1 / 6, 1 / 2, 5 / 6]

export default function DeviceFan({ running }: { running: boolean }) {
  const t = useTranslations('LandingPage.unified')

  const devices = [
    { icon: Monitor, label: t('computer') },
    { icon: Tablet, label: t('tablet') },
    { icon: Smartphone, label: t('phone') }
  ]

  const active = useCycle(devices.length, 1200, running)

  return (
    <div className="bg-background px-6 pb-8 md:px-8 md:pb-10">
      <div className="mx-auto max-w-2xl">
        <FlowLines points={TARGETS} direction="out" height={72} />
        <ul className="grid grid-cols-3">
          {devices.map(({ icon: Icon, label }, i) => (
            <li key={label} className="px-1.5">
              <div
                className={cn(
                  'flex flex-col items-center gap-2 rounded-[10px] border border-border bg-card px-2 py-4 transition-colors duration-300',
                  i === active && 'bg-foreground/12'
                )}
              >
                <Icon className="size-5" aria-hidden />
                <span className="max-w-full truncate text-sm font-medium">{label}</span>
                <span className="flex max-w-full items-center gap-1 text-xs text-muted-foreground">
                  <Check className="size-3 shrink-0" strokeWidth={3} aria-hidden />
                  <span className="truncate">{t('synced')}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-6 text-balance text-center font-[family-name:var(--font-space-grotesk)] text-2xl font-medium tracking-[-0.02em] md:text-3xl">
        {t('devices')}
      </p>
    </div>
  )
}
