import { useTranslations } from 'next-intl'

export default function EmptySolves() {
  const t = useTranslations('Index.TransferSolvesPage')
  return (
    <div className="flex flex-col items-center justify-center grow mt-10" data-testid="empty-solves">
      <h2 className="text-2xl font-bold mb-4 text-center text-balance">{t('no-solves')}</h2>
      <p className="text-gray-600 text-center text-balance">{t('empty-vault')}</p>
    </div>
  )
}
