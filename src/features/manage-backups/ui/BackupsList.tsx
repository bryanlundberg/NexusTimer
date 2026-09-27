'use client'
import { useTranslations } from 'next-intl'
import { Skeleton } from '@/components/ui/skeleton'
import { useBackups } from '@/entities/backup/model/useBackups'
import { MenuSection } from '@/features/settings/ui/MenuSection'
import { useDeleteBackup } from '../model/useDeleteBackup'
import { useApplyBackup } from '../model/useApplyBackup'
import BackupListItem from './BackupListItem'

export default function BackupsList() {
  const t = useTranslations('Index')
  const { backups, isLoading } = useBackups()
  const { deleteBackup, deletingId } = useDeleteBackup()
  const { applyBackup, applyingId } = useApplyBackup()

  return (
    <MenuSection
      id="backup-history"
      title={t('SettingsPage.backup-history')}
      footer={t('SettingsPage.manage-backups-description')}
      aria-busy={isLoading}
    >
      {isLoading ? (
        [0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-1.5 px-4 py-3.5">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))
      ) : backups.length === 0 ? (
        <p className="px-4 py-6 text-center text-[15px] text-muted-foreground sm:text-sm">
          {t('SettingsPage.no-backups')}
        </p>
      ) : (
        backups.map((backup, i) => (
          <BackupListItem
            key={backup.id}
            backup={backup}
            isLatest={i === 0}
            isDeleting={deletingId === backup.id}
            isApplying={applyingId === backup.id}
            onDelete={() => deleteBackup(backup.id)}
            onApply={() => applyBackup(backup)}
          />
        ))
      )}
    </MenuSection>
  )
}
