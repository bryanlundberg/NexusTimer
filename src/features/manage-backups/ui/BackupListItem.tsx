'use client'
import dayjs from '@/shared/lib/dayjs'
import { useLocale, useTranslations } from 'next-intl'
import { Database, Trash2, Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatBytes } from '@/shared/lib/format-bytes'
import { BackupFile } from '@/entities/backup/model/types'

interface BackupListItemProps {
  backup: BackupFile
  isDeleting: boolean
  isApplying: boolean
  onDelete: () => void
  onApply: () => void
}

export default function BackupListItem({ backup, isDeleting, isApplying, onDelete, onApply }: BackupListItemProps) {
  const t = useTranslations('Index')
  const locale = useLocale()
  const created = dayjs(backup.createdAt).locale(locale)

  return (
    <li className="flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-muted/30">
      <div className="shrink-0 flex items-center justify-center size-10 rounded-lg bg-background border border-border/60">
        <Database className="size-5 text-muted-foreground" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{created.format('LLL')}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {created.fromNow()} · {formatBytes(backup.size)}
        </p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onApply}
        disabled={isApplying || isDeleting}
        aria-label={t('SettingsPage.backup-apply')}
        className="shrink-0 text-muted-foreground hover:text-primary"
      >
        {isApplying ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        disabled={isDeleting || isApplying}
        aria-label={t('Inputs.delete')}
        className="shrink-0 text-muted-foreground hover:text-destructive"
      >
        {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
      </Button>
    </li>
  )
}
