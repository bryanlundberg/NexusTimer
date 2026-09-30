'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/shared/config/i18n/navigation'
import { ArrowLeftIcon, ReloadIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { Nexi } from '@/shared/ui/nexi'

export function OfflineView() {
  const t = useTranslations('Index.Offline')

  return (
    <div className="relative grow min-h-dvh flex items-center justify-center overflow-hidden bg-background px-6 py-16">
      <main className="relative z-10 flex flex-col items-center text-center max-w-xl">
        <Nexi state="sleep" size={150} />

        <h1 className="mt-6 text-2xl sm:text-3xl font-bold text-foreground text-balance">{t('title')}</h1>
        <p className="mt-3 text-base text-muted-foreground leading-relaxed text-pretty">{t('description')}</p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <Button size="lg" onClick={() => window.location.reload()}>
            <ReloadIcon className="size-4" /> {t('retry')}
          </Button>
          <Link href="/app">
            <Button variant="ghost" size="lg">
              <ArrowLeftIcon className="size-4" /> {t('back')}
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
