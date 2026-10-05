import { Suspense } from 'react'
import { Link } from '@/shared/config/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import ResetPasswordContent from '@/features/authentication/ui/ResetPasswordContent'
import AuthBackground from '@/features/authentication/ui/AuthBackground'
import CubeGrid from '@/features/authentication/ui/CubeGrid'

export default async function ResetPasswordPage() {
  const t = await getTranslations('Index.Auth')

  return (
    <div className="relative flex-1 flex items-center justify-center px-4 py-10">
      <AuthBackground variant="signin" />

      <div className="relative w-full max-w-sm flex flex-col items-center gap-6">
        <CubeGrid className="size-12 drop-shadow-xl" />

        <div className="text-center space-y-1">
          <h1 className="font-display text-3xl font-bold tracking-tight">{t('reset-password-title')}</h1>
          <p className="text-sm text-muted-foreground">{t('reset-password-subtitle')}</p>
        </div>

        <div className="w-full notch-bl-tr [--nblt:16px] border bg-background/80 backdrop-blur-sm p-6 shadow-sm flex flex-col gap-5">
          <Suspense fallback={<p className="text-sm text-muted-foreground text-center">{t('loading')}</p>}>
            <ResetPasswordContent />
          </Suspense>
        </div>

        <p className="text-sm text-muted-foreground">
          <Link href="/sign-in" className="font-medium text-foreground hover:underline">
            {t('back-to-sign-in')}
          </Link>
        </p>
      </div>
    </div>
  )
}
