import { Link } from '@/shared/config/i18n/navigation'
import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/shared/lib/utils'

interface FriendsLeaderboardNoticeProps {
  message: string
  action?: { href: string; label: string }
}

export default function FriendsLeaderboardNotice({ message, action }: FriendsLeaderboardNoticeProps) {
  return (
    <div className="flex flex-col items-center gap-4 border border-border/60 bg-card/40 px-4 py-10 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
      {action && (
        <Link href={action.href} className={cn(buttonVariants({ variant: 'default' }))}>
          {action.label}
        </Link>
      )}
    </div>
  )
}
