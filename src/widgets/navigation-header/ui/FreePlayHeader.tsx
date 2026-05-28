import * as React from 'react'
import { useTranslations } from 'next-intl'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'

export default function FreePlayHeader() {
  const t = useTranslations('Multiplayer')
  return <CoreHeader breadcrumbs={[{ label: t('title'), href: '/free-play' }]} />
}
