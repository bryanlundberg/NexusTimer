'use client'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { useBackupTipsStore } from '@/features/backup-tips/model/useBackupTipsStore'

export default function BackupTips() {
  const t = useTranslations('Index.BackupTips')
  const seen = useBackupTipsStore((state) => state.seen)
  const markSeen = useBackupTipsStore((state) => state.markSeen)

  if (seen) return null

  return (
    <div className="notch-br flex flex-col items-start gap-2.5 border bg-muted/40 p-3" role="note">
      <p className="text-sm leading-relaxed text-pretty">
        <span className="font-medium">{t('label')}</span> {t('sync-order')}
      </p>
      <Button variant="outline" size="sm" className="h-7 px-2.5 text-xs" onClick={markSeen}>
        {t('cta')}
      </Button>
    </div>
  )
}
