import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { auth } from '@/shared/config/auth/auth'
import ResetPasswordContent from '@/features/authentication/ui/ResetPasswordContent'
import AuthBackground from '@/features/authentication/ui/AuthBackground'
import CubeGrid from '@/features/authentication/ui/CubeGrid'

interface Props {
  searchParams: Promise<{ oobCode?: string }>
}

export default async function ResetPasswordPage({ searchParams }: Props) {
  const session = await auth()
  if (session?.user) redirect('/app')

  const t = await getTranslations('Index.Auth')
  const { oobCode } = await searchParams

  return (
    <div className="relative flex-1 flex items-center justify-center px-4 py-10">
      <AuthBackground variant="signin" />

      <div className="relative w-full max-w-sm flex flex-col items-center gap-6">
        <CubeGrid className="size-12 drop-shadow-xl" />

        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{t('reset-password-title')}</h1>
          <p className="text-sm text-muted-foreground">{t('reset-password-subtitle')}</p>
        </div>

        <div className="w-full notch-bl-tr [--nblt:16px] border bg-background/80 backdrop-blur-sm p-6 shadow-sm flex flex-col gap-5">
          <ResetPasswordContent oobCode={oobCode ?? null} />
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
