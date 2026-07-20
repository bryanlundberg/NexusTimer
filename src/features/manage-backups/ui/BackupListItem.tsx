'use client'
import dayjs from '@/shared/lib/dayjs'
import { useLocale, useTranslations } from 'next-intl'
import { Trash2, Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { formatBytes } from '@/shared/lib/format-bytes'
import { BackupFile } from '@/entities/backup/model/types'
import { cn } from '@/shared/lib/utils'

interface BackupListItemProps {
  backup: BackupFile
  isLatest: boolean
  isLast: boolean
  isDeleting: boolean
  isApplying: boolean
  onDelete: () => void
  onApply: () => void
}

export default function BackupListItem({
  backup,
  isLatest,
  isLast,
  isDeleting,
  isApplying,
  onDelete,
  onApply
}: BackupListItemProps) {
  const t = useTranslations('Index')
  const locale = useLocale()
  const created = dayjs(backup.createdAt).locale(locale)

  return (
    <li className="flex gap-4">
      {/* Timeline rail */}
      <div className="flex flex-col items-center">
        <span
          className={cn(
            'mt-2 size-2.5 shrink-0 rounded-full',
            isLatest ? 'bg-primary' : 'border-[1.5px] border-muted-foreground/40'
          )}
        />
        {!isLast && <span className="mt-1 w-px flex-1 bg-border" />}
      </div>

      <div className={cn('min-w-0 flex-1', !isLast && 'pb-4')}>
        <div className="-mx-2 flex items-center gap-1 rounded-lg px-2 py-1 transition-colors has-[button:hover]:bg-accent/50">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{created.format('LLL')}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {created.fromNow()} · {formatBytes(backup.size)}
            </p>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
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
              </TooltipTrigger>
              <TooltipContent>{t('SettingsPage.backup-apply')}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
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
              </TooltipTrigger>
              <TooltipContent>{t('Inputs.delete')}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </li>
  )
}
