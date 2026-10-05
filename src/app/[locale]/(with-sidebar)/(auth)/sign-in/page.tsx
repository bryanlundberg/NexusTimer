import { Suspense } from 'react'
import { Link } from '@/shared/config/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { ArrowRight } from 'lucide-react'
import SignInForm from '@/features/authentication/ui/SignInForm'
import OAuthProviders from '@/features/authentication/ui/OAuthProviders'
import AuthDivider from '@/features/authentication/ui/AuthDivider'
import AuthScreen from '@/features/authentication/ui/AuthScreen'
import OAuthErrorMessage from '@/features/authentication/ui/OAuthErrorMessage'
import RedirectIfSignedIn from '@/features/authentication/ui/RedirectIfSignedIn'

export default async function SignInPage() {
  const t = await getTranslations('Index.Auth')

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
      <RedirectIfSignedIn />
      <SignInForm />
      <AuthDivider label={t('or-continue-with')} />
      <OAuthProviders />
      <Suspense fallback={null}>
        <OAuthErrorMessage />
      </Suspense>
    </AuthScreen>
  )
}
