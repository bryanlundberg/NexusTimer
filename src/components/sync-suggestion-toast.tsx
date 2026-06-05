import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'

const CUBE_STICKERS = [
  '#C41E3A',
  '#003EA8',
  '#FFD500',
  '#FF5800',
  '#009B48',
  '#C41E3A',
  '#FFD500',
  '#FF5800',
  '#003EA8'
]

type SyncSuggestionToastProps = {
  onConfirm: () => void
  onDismiss: () => void
}

export default function SyncSuggestionToast({ onConfirm, onDismiss }: SyncSuggestionToastProps) {
  const t = useTranslations('Index.SettingsPage.sync-toast')

  return (
    <div className="w-full rounded-xl bg-card border border-border shadow-lg overflow-hidden">
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start gap-3">
          <div className="grid grid-cols-3 gap-0.75 shrink-0 mt-0.5 p-1 rounded-md bg-muted">
            {CUBE_STICKERS.map((color, i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-[2px]" style={{ background: color }} />
            ))}
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="text-sm font-bold tracking-tight leading-tight">{t('title')}</div>
            <p className="text-xs text-muted-foreground leading-relaxed">{t('description')}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" variant="outline" className="w-full" onClick={onDismiss}>
            {t('cancel')}
          </Button>
          <Button className="w-full" size="sm" onClick={onConfirm}>
            {t('merge')}
          </Button>
        </div>
      </div>
    </div>
  )
}
