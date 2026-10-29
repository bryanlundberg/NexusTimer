import { Link } from '@/shared/config/i18n/navigation'

export type FooterLink = { href: string; label: string; external?: boolean; locale?: string }

export default function FooterAnchor({ link, className }: { link: FooterLink; className: string }) {
  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noreferrer" className={className}>
        {link.label}
      </a>
    )
  }

  return (
    <Link href={link.href} locale={link.locale} hrefLang={link.locale} className={className}>
      {link.label}
    </Link>
  )
}
