import { Link, redirect } from '@/shared/config/i18n/navigation'
import { getLocale, getTranslations } from 'next-intl/server'
import { ArrowRight } from 'lucide-react'
import { getSession } from '@/shared/config/auth/session'
import SignInForm from '@/features/authentication/ui/SignInForm'
import OAuthProviders from '@/features/authentication/ui/OAuthProviders'
import AuthDivider from '@/features/authentication/ui/AuthDivider'
import AuthScreen from '@/features/authentication/ui/AuthScreen'

interface Props {
  searchParams: Promise<{ error?: string }>
}

export default async function SignInPage({ searchParams }: Props) {
  const session = await getSession()
  if (session?.user) redirect({ href: '/app', locale: await getLocale() })

  const t = await getTranslations('Index.Auth')
  const { error } = await searchParams
  const oauthError = error ? t(error === 'account_not_linked' ? 'oauth-account-not-linked' : 'oauth-error') : null

  return (
    <AuthScreen
      variant="signin"
      title={t('welcome-back')}
      subtitle={t('sign-in-subtitle')}
      footer={
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          {t('no-account')}
          <Link
            href="/sign-up"
            className="group inline-flex items-center gap-1 font-semibold text-primary hover:text-primary/80"
          >
            {t('sign-up')}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </Link>
        </p>
      }
    >
      <SignInForm />
      <AuthDivider label={t('or-continue-with')} />
      <OAuthProviders />
      {oauthError && (
        <p role="alert" className="text-sm text-destructive">
          {oauthError}
        </p>
      )}
    </AuthScreen>
  )
}
