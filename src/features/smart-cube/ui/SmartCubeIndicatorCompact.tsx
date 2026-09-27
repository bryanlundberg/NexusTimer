'use client'

import { Bluetooth } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useSmartCubeStore } from '@/features/smart-cube/model/useSmartCubeStore'

export function SmartCubeIndicatorCompact() {
  const connected = useSmartCubeStore((s) => s.status === 'connected')
  const deviceName = useSmartCubeStore((s) => s.deviceName)

  if (!connected) return null

  const label = deviceName ?? 'Smart Cube'

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          role="status"
          aria-label={label}
          className="relative mx-auto flex size-8 items-center justify-center text-primary"
        >
          <Bluetooth className="size-4" />
          <span className="absolute top-1 right-1 size-2 rounded-full bg-emerald-500 ring-2 ring-sidebar" />
        </span>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}
