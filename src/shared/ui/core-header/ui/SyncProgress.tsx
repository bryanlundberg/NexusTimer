'use client'
import * as React from 'react'
import { useTranslations } from 'next-intl'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { BACKUP_INTERVAL_SOLVES } from '@/shared/model/backup/useBackupSuggestion'
import SyncInfoModal from '@/shared/ui/core-header/ui/SyncInfoModal'

const RADIUS = 15
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function SyncProgress() {
  const t = useTranslations('Index.SyncProgress')
  const open = useOverlayStore((state) => state.open)
  const totalSolves = useSettingsStore((state) => state.settings.sync.totalSolves)

  const current = Math.min(BACKUP_INTERVAL_SOLVES, Math.max(0, Number(totalSolves) || 0))
  const remaining = Math.max(0, BACKUP_INTERVAL_SOLVES - current)
  const percent = (current / BACKUP_INTERVAL_SOLVES) * 100
  const isLast = remaining === 1

  const tooltip = isLast ? t('tooltip-last') : t('tooltip', { count: remaining })

  const handleOpen = () => {
    open({ id: 'sync-info', component: <SyncInfoModal /> })
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={handleOpen}
          aria-label={tooltip}
          data-testid="header-sync-progress"
          className="flex items-center justify-center size-9 rounded-lg hover:bg-muted/60 transition-colors cursor-pointer"
        >
          <svg width="22" height="22" viewBox="0 0 36 36" className="shrink-0 text-muted-foreground" aria-hidden="true">
            <circle cx="18" cy="18" r={RADIUS} fill="none" className="stroke-muted" strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r={RADIUS}
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              className={isLast ? 'stroke-cube-green' : 'stroke-primary'}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - percent / 100)}
              transform="rotate(-90 18 18)"
              style={{ transition: 'stroke-dashoffset 0.35s ease' }}
            />
            <text
              x="18"
              y="18"
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-current font-medium"
              fontSize={remaining >= 10 ? 15 : 17}
            >
              {remaining}
            </text>
          </svg>
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{tooltip}</TooltipContent>
    </Tooltip>
  )
}
