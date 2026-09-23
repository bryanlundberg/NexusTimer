import { useTranslations } from 'next-intl'
import { Progress } from '@/components/ui/progress'
import { useBackupUploadStore } from '@/shared/model/backup/useBackupUploadStore'

export default function BackupUploadToast() {
  const t = useTranslations('Index.SettingsPage')
  const progress = useBackupUploadStore((state) => state.progress)

  return (
    <div className="mt-1 flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Progress value={progress} className="h-1.5 rounded-none" />
        <span className="w-8 shrink-0 text-right font-mono text-[11px] tabular-nums">{progress}%</span>
      </div>
      <p>{t('backup-uploading-hint')}</p>
    </div>
  )
}
