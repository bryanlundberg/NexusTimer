'use client'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { CloudUpload } from 'lucide-react'
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { BACKUP_INTERVAL_SOLVES } from '@/shared/model/backup/useBackupSuggestion'

export default function SyncInfoModal() {
  const t = useTranslations('Index.SyncProgress')
  const close = useOverlayStore((state) => state.close)
  const totalSolves = useSettingsStore((state) => state.settings.sync.totalSolves)

  const current = Math.min(BACKUP_INTERVAL_SOLVES, Math.max(0, Number(totalSolves) || 0))
  const remaining = Math.max(0, BACKUP_INTERVAL_SOLVES - current)
  const percent = (current / BACKUP_INTERVAL_SOLVES) * 100
  const isLast = remaining === 1

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="text-center">{t('modal-title')}</DialogTitle>
        <DialogDescription className="text-center">{t('modal-description')}</DialogDescription>
      </DialogHeader>

      <div className="space-y-2 pt-2">
        <Progress value={percent} />
        <p className="text-center text-sm font-medium text-muted-foreground">
          {isLast ? t('modal-remaining-last') : t('modal-remaining', { count: remaining })}
        </p>
      </div>

      <DialogFooter className="gap-2 sm:justify-between">
        <Link href="/account/backups" onClick={close}>
          <Button variant="ghost" className="w-full">
            {t('modal-backups')}
          </Button>
        </Link>
        <Link href="/account/save" onClick={close}>
          <Button className="w-full gap-1.5">
            <CloudUpload className="size-4" />
            {t('modal-save')}
          </Button>
        </Link>
      </DialogFooter>
    </DialogContent>
  )
}
