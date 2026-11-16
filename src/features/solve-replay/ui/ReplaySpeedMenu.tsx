'use client'

import { Gauge } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/shared/lib/utils'

export const REPLAY_SPEEDS = [0.25, 0.5, 0.75, 1, 1.5, 2] as const

interface ReplaySpeedMenuProps {
  speed: number
  onChange: (speed: number) => void
  className?: string
}

export default function ReplaySpeedMenu({ speed, onChange, className }: ReplaySpeedMenuProps) {
  const t = useTranslations('Index.ReplayPlayer')
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        aria-label={t('speed-value', { speed })}
        className={cn(
          'inline-flex h-8 items-center gap-1 px-2 font-mono text-xs tabular-nums text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-muted data-[state=open]:text-foreground',
          speed !== 1 && 'text-foreground',
          className
        )}
      >
        <Gauge className="size-3.5" />
        {speed}×
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-28">
        <DropdownMenuLabel className="text-xs text-muted-foreground">{t('speed')}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={String(speed)} onValueChange={(value) => onChange(Number(value))}>
          {REPLAY_SPEEDS.map((option) => (
            <DropdownMenuRadioItem key={option} value={String(option)} className="font-mono text-xs tabular-nums">
              {option}×
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
