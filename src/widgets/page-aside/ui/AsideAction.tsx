import * as React from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/shared/config/i18n/navigation'

interface AsideActionProps {
  icon: React.ReactNode
  label: string
  href?: string
  onClick?: () => void
}

const className =
  'group -mx-2 flex w-[calc(100%+1rem)] cursor-pointer items-center gap-2.5 px-2 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent/50 [&>svg:first-child]:size-4 [&>svg:first-child]:text-muted-foreground'

export default function AsideAction({ icon, label, href, onClick }: AsideActionProps) {
  const content = (
    <>
      {icon}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
    </>
  )

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  )
}
