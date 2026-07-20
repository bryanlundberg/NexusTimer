import Link from 'next/link'
import { cn } from '@/shared/lib/utils'

interface NavLinkCardProps {
  href: string
  title: string
  description: string
  className?: string
}

export default function NavLinkCard({ href, title, description, className }: NavLinkCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative block overflow-hidden rounded-xl border border-border/40 bg-background p-5',
        className
      )}
    >
      {/* Speed lines */}
      <span className="absolute right-[18px] top-0 h-[26px] w-[3px] -translate-y-full -skew-x-[20deg] bg-primary opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100" />
      <span className="absolute right-[28px] top-0 h-[18px] w-[3px] -translate-y-full -skew-x-[20deg] bg-primary/50 opacity-0 transition-all delay-75 duration-200 group-hover:translate-y-0 group-hover:opacity-100" />
      <span className="absolute right-[38px] top-0 h-[10px] w-[3px] -translate-y-full -skew-x-[20deg] bg-primary/25 opacity-0 transition-all delay-150 duration-200 group-hover:translate-y-0 group-hover:opacity-100" />

      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{description}</p>
    </Link>
  )
}
