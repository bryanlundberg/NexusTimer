import { useTranslations } from 'next-intl'
import { ChevronRight } from 'lucide-react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import SyncInfoModal from '@/shared/ui/core-header/ui/SyncInfoModal'
import { BackupRing } from '@/widgets/sidebar/ui/backup-ring'

interface NavUserBackupRowProps {
  percent: number
  remaining: number
  isLast: boolean
}

export function NavUserBackupRow({ percent, remaining, isLast }: NavUserBackupRowProps) {
  const t = useTranslations('Index.SyncProgress')
  const open = useOverlayStore((state) => state.open)

  return (
    <DropdownMenuItem
      onClick={() => open({ id: 'sync-info', component: <SyncInfoModal /> })}
      className="cursor-pointer gap-2.5 border-t px-3 py-2"
      data-testid="header-backup-row"
    >
      <BackupRing percent={percent} isLast={isLast} strokeWidth={3} className="size-7">
        <span className="text-[10px] font-bold tabular-nums">{remaining}</span>
      </BackupRing>
      <span className="grid min-w-0 flex-1 leading-tight">
        <span className="truncate text-[13px] font-medium">{t('row', { count: remaining })}</span>
        <span className="truncate text-[11px] text-muted-foreground">
          {t('modal-title')} · {Math.round(percent)}%
        </span>
      </span>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
    </DropdownMenuItem>
  )
}
