import { Link } from '@/shared/config/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { ArrowRight } from 'lucide-react'
import SignUpForm from '@/features/authentication/ui/SignUpForm'
import OAuthProviders from '@/features/authentication/ui/OAuthProviders'
import AuthDivider from '@/features/authentication/ui/AuthDivider'
import AuthScreen from '@/features/authentication/ui/AuthScreen'

export default async function SignUpPage() {
  const t = await getTranslations('Index.Auth')

  return (
    <AuthScreen
      variant="signup"
      title={t('create-account')}
      subtitle={t('sign-up-subtitle')}
      footer={
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          {t('have-account')}
          <Link
            href="/sign-in"
            className="group inline-flex items-center gap-1 font-semibold text-primary hover:text-primary/80"
          >
            {t('sign-in')}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </Link>
        </p>
      }
    >
      <SignUpForm />
      <AuthDivider label={t('or-continue-with')} />
      <OAuthProviders />
    </AuthScreen>
  )
}
