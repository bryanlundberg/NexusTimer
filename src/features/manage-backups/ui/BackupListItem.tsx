'use client'
import dayjs from '@/shared/lib/dayjs'
import { useLocale, useTranslations } from 'next-intl'
import { ArchiveRestore, Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatBytes } from '@/shared/lib/format-bytes'
import { BackupFile } from '@/entities/backup/model/types'

interface BackupListItemProps {
  backup: BackupFile
  isLatest: boolean
  isDeleting: boolean
  isApplying: boolean
  onDelete: () => void
  onApply: () => void
}

export default function BackupListItem({
  backup,
  isLatest,
  isDeleting,
  isApplying,
  onDelete,
  onApply
}: BackupListItemProps) {
  const t = useTranslations('Index')
  const locale = useLocale()
  const created = dayjs(backup.createdAt).locale(locale)
  const busy = isDeleting || isApplying

  return (
    <div className="flex items-center gap-1 py-2 pr-2 pl-4 transition-colors hover:bg-muted/30">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 py-1.5">
        <span className="flex min-w-0 items-center gap-2">
          <span className="truncate text-[15px] leading-snug sm:text-sm">{created.format('LLL')}</span>
          {isLatest && (
            <span className="badge-notch shrink-0 bg-primary/15 px-1.5 py-0.5 text-[11px] font-medium leading-none">
              {t('SettingsPage.backup-current')}
            </span>
          )}
        </span>
        <span className="text-[13px] leading-snug text-muted-foreground sm:text-xs">
          {created.fromNow()} · {formatBytes(backup.size)}
        </span>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onApply}
        disabled={busy}
        aria-label={t('SettingsPage.backup-apply')}
        title={t('SettingsPage.backup-apply')}
        className="size-11 shrink-0 text-muted-foreground hover:text-foreground sm:size-9"
      >
        {isApplying ? <Loader2 className="size-4 animate-spin" /> : <ArchiveRestore className="size-4" />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        disabled={busy}
        aria-label={t('Inputs.delete')}
        title={t('Inputs.delete')}
        className="size-11 shrink-0 text-muted-foreground hover:text-destructive sm:size-9"
      >
        {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
      </Button>
    </div>
  )
}
