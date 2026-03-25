import { useTranslations } from 'next-intl'
import { BarChart3Icon } from 'lucide-react'

export default function StatisticsEmpty() {
  const t = useTranslations('Index.StatsPage')

  return (
    <div className="flex flex-col items-center justify-center grow py-12">
      <div className="inline-flex items-center justify-center rounded-2xl bg-muted/50 p-4 mb-4">
        <BarChart3Icon className="size-8 text-muted-foreground/50" />
      </div>
      <h2 className="text-xl font-bold mb-2 text-center text-balance">{t('empty-statistics')}</h2>
      <p className="text-sm text-muted-foreground text-center text-balance max-w-xs">
        {t('empty-statistics-description')}
      </p>
    </div>
  )
}
