import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { auth } from '@/shared/config/auth/auth'
import ForgotPasswordForm from '@/features/authentication/ui/ForgotPasswordForm'
import AuthBackground from '@/features/authentication/ui/AuthBackground'
import CubeGrid from '@/features/authentication/ui/CubeGrid'

export default async function ForgotPasswordPage() {
  const session = await auth()
  if (session?.user) redirect('/app')

  const t = await getTranslations('Index.Auth')

  return (
    <div className="relative flex-1 flex items-center justify-center px-4 py-10">
      <AuthBackground variant="signin" />

      <div className="relative w-full max-w-sm flex flex-col items-center gap-6">
        <CubeGrid className="size-12 drop-shadow-xl" />

        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{t('forgot-password-title')}</h1>
          <p className="text-sm text-muted-foreground">{t('forgot-password-subtitle')}</p>
        </div>

        <div className="w-full notch-bl-tr [--nblt:16px] border bg-background/80 backdrop-blur-sm p-6 shadow-sm flex flex-col gap-5">
          <ForgotPasswordForm />
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
