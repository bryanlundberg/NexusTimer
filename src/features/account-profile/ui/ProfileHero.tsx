'use client'
import { Session } from 'next-auth'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { SquareArrowOutUpRight, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AvatarUploader } from '@/features/update-user-avatar/ui/AvatarUploader'

interface ProfileHeroProps {
  session: Session
  bio?: string
}

export default function ProfileHero({ session, bio }: ProfileHeroProps) {
  const tAccount = useTranslations('Index.AccountPage')

  return (
    <section className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <AvatarUploader />

      <div className="flex flex-col items-center sm:items-start gap-2 min-w-0 flex-1">
        <h1 className="text-2xl font-bold tracking-tight truncate">{session.user?.name}</h1>

        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Mail className="size-3.5" />
          <span className="truncate">{session.user?.email}</span>
        </div>

        {bio && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{bio}</p>}

        <div className="flex items-center gap-2 mt-3">
          <Link href={`/people/${session.user?.id}`}>
            <Button variant="outline" size="sm" className="gap-2">
              {tAccount('go-to-profile')}
              <SquareArrowOutUpRight className="size-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
