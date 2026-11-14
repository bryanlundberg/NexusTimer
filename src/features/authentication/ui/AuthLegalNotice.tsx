import { getTranslations } from 'next-intl/server'
import { Link } from '@/shared/config/i18n/navigation'

const linkClass = 'underline underline-offset-2 hover:text-foreground'

export default async function AuthLegalNotice() {
  const t = await getTranslations('Index.Auth')

  return (
    <p className="text-center text-xs leading-relaxed text-muted-foreground text-pretty">
      {t.rich('legal-notice', {
        terms: (chunks) => (
          <Link href="/terms-of-service" target="_blank" className={linkClass}>
            {chunks}
          </Link>
        ),
        privacy: (chunks) => (
          <Link href="/privacy-policy" target="_blank" className={linkClass}>
            {chunks}
          </Link>
        )
      })}
    </p>
  )
}
