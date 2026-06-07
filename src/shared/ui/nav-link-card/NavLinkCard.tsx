import Link from 'next/link'
import { ChevronRight, type LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface NavLinkCardProps {
  href: string
  icon: LucideIcon
  title: string
  description: string
  className?: string
}

export default function NavLinkCard({ href, icon: Icon, title, description, className }: NavLinkCardProps) {
  return (
    <Link href={href} className={cn('group', className)}>
      <div className="flex items-center gap-4 p-4 rounded-xl border border-border/60 hover:border-primary/30 hover:bg-accent/50 transition-all">
        <div className="shrink-0 flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground truncate">{description}</p>
        </div>
        <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </Link>
  )
}
