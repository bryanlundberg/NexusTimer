'use client'

import { useTranslations } from 'next-intl'
import { Palette } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Link } from '@/shared/config/i18n/navigation'

export function EditNexiLink() {
  const t = useTranslations('Index.AvatarBuilder')

  return (
    <Link href="/account/avatar" className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'gap-2' })}>
      <Palette className="size-3.5" />
      {t('edit')}
    </Link>
  )
}
