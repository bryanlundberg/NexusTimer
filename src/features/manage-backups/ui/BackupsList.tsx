'use client'
import { useTranslations } from 'next-intl'
import { Database } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { useBackups } from '@/entities/backup/model/useBackups'
import { useDeleteBackup } from '../model/useDeleteBackup'
import { useApplyBackup } from '../model/useApplyBackup'
import BackupListItem from './BackupListItem'

export default function BackupsList() {
  const t = useTranslations('Index')
  const { backups, isLoading } = useBackups()
  const { deleteBackup, deletingId } = useDeleteBackup()
  const { applyBackup, applyingId } = useApplyBackup()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
        <Spinner />
        {t('SettingsPage.fetching-last-backup')}
      </div>
    )
  }

  if (backups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12 px-6 rounded-xl border border-dashed border-border/60 text-center">
        <Database className="size-8 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">{t('SettingsPage.no-backups')}</p>
      </div>
    )
  }

  return (
    <ul className="px-1">
      {backups.map((backup, i) => (
        <BackupListItem
          key={backup.id}
          backup={backup}
          isLatest={i === 0}
          isLast={i === backups.length - 1}
          isDeleting={deletingId === backup.id}
          isApplying={applyingId === backup.id}
          onDelete={() => deleteBackup(backup.id)}
          onApply={() => applyBackup(backup)}
        />
      ))}
    </ul>
  )
}
