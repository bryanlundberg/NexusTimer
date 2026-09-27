import { ChevronRight } from 'lucide-react'
import { Link } from '@/shared/config/i18n/navigation'
import { MenuRowText } from './MenuRowText'

interface MenuLinkRowProps {
  href: string
  label: string
  description?: string
}

export function MenuLinkRow({ href, label, description }: MenuLinkRowProps) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-4 px-4 py-3.5 transition-colors [-webkit-tap-highlight-color:transparent] hover:bg-muted/30 active:bg-muted/50"
    >
      <MenuRowText label={label} description={description} />
      <ChevronRight aria-hidden className="size-4 shrink-0 text-muted-foreground" />
    </Link>
  )
}
