'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import TrainerMethodSelect from './TrainerMethodSelect'

interface TrainerHistoryHeaderProps {
  title: string
  select: React.ComponentProps<typeof TrainerMethodSelect>
}

export default function TrainerHistoryHeader({ title, select }: TrainerHistoryHeaderProps) {
  const t = useTranslations('Index.TrainerHistoryPage')

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Link href="/algorithms/trainer">
        <Button variant="outline" size="sm" className="h-8">
          <ArrowLeft className="h-3.5 w-3.5" />
          {t('backToPractice')}
        </Button>
      </Link>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      <div className="ml-auto min-w-0 max-w-48">
        <TrainerMethodSelect {...select} />
      </div>
    </div>
  )
}
