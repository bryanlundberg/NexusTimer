'use client'

import { useTranslations } from 'next-intl'
import { Pencil } from 'lucide-react'
import { useRouter } from '@/shared/config/i18n/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/shared/lib/utils'

export function EditProfileButton({ className }: { className?: string }) {
  const t = useTranslations('Index.PeoplePage')
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn('gap-1.5 pointer-coarse:h-10', className)}
      onClick={() => router.push('/account')}
    >
      <Pencil className="size-4" />
      {t('edit-profile')}
    </Button>
  )
}
