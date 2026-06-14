'use client'
import { useEffect, useState } from 'react'
import { Session } from 'next-auth'
import { useLocale, useTranslations } from 'next-intl'
import { useQueryState } from 'nuqs'
import { toast } from 'sonner'
import Link from 'next/link'
import { SquareArrowOutUpRight, Mail, X } from 'lucide-react'
import { KeyedMutator } from 'swr'
import { Button, buttonVariants } from '@/components/ui/button'
import { AvatarUploader } from '@/features/update-user-avatar/ui/AvatarUploader'
import { WcaBadge } from '@/shared/ui/wca-badge/WcaBadge'
import { CountryFlag } from '@/shared/ui/country-flag/CountryFlag'
import { getCountryName } from '@/shared/lib/getCountryName'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'

interface ProfileHeroProps {
  session: Session
  bio?: string
  wcaId?: string
  country?: string
  mutate?: KeyedMutator<any>
}

export default function ProfileHero({ session, bio, wcaId, country, mutate }: ProfileHeroProps) {
  const tAccount = useTranslations('Index.AccountPage')
  const locale = useLocale()
  const [wcaStatus, setWcaStatus] = useQueryState('wca')
  const [isUnlinking, setIsUnlinking] = useState(false)

  const handleUnlink = async () => {
    setIsUnlinking(true)
    try {
      const response = await fetch('/api/v1/wca', { method: 'DELETE' })
      if (!response.ok) {
        toast.error(tAccount('wca-error'))
        return
      }
      await mutate?.()
      toast.success(tAccount('wca-unlink-success'))
    } catch (error) {
      console.error('Error unlinking WCA account:', error)
      toast.error(tAccount('wca-error'))
    } finally {
      setIsUnlinking(false)
    }
  }

  useEffect(() => {
    if (!wcaStatus) return

    switch (wcaStatus) {
      case 'success':
        toast.success(tAccount('wca-success'))
        mutate?.()
        break
      case 'no-id':
        toast.error(tAccount('wca-no-id'))
        break
      case 'taken':
        toast.error(tAccount('wca-taken'))
        break
      default:
        toast.error(tAccount('wca-error'))
    }

    setWcaStatus(null)
  }, [wcaStatus])

  return (
    <section className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <AvatarUploader />

      <div className="flex flex-col items-center sm:items-start gap-2 min-w-0 flex-1">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 min-w-0">
          <span className="truncate">{session.user?.name}</span>
          {wcaId && (
            <span className="flex items-center gap-1 shrink-0">
              <WcaBadge wcaId={wcaId} showCode />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    aria-label={tAccount('wca-unlink')}
                    className="text-muted-foreground hover:text-destructive transition-colors rounded-sm p-0.5"
                  >
                    <X className="size-3.5" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{tAccount('wca-unlink-title')}</AlertDialogTitle>
                    <AlertDialogDescription>{tAccount('wca-unlink-description')}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{tAccount('wca-cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleUnlink}
                      disabled={isUnlinking}
                      className={buttonVariants({ variant: 'destructive' })}
                    >
                      {tAccount('wca-unlink-confirm')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </span>
          )}
        </h1>

        <div className="flex items-center gap-2 text-muted-foreground text-sm flex-wrap justify-center sm:justify-start">
          <span className="flex items-center gap-2 min-w-0">
            <Mail className="size-3.5 shrink-0" />
            <span className="truncate">{session.user?.email}</span>
          </span>
          {country && (
            <>
              <span className="opacity-50">·</span>
              <span className="flex items-center gap-1.5 shrink-0">
                <CountryFlag code={country} />
                {getCountryName(country, locale)}
              </span>
            </>
          )}
        </div>

        {bio && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{bio}</p>}

        <div className="flex items-center gap-2 mt-3">
          <Link href={`/people/${session.user?.id}`}>
            <Button variant="outline" size="sm" className="gap-2">
              {tAccount('go-to-profile')}
              <SquareArrowOutUpRight className="size-3.5" />
            </Button>
          </Link>

          {!wcaId && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => {
                window.location.href = '/api/v1/wca/authorize'
              }}
            >
              <img src="/timer-logos/wca.svg" alt="" className="size-4" />
              {tAccount('wca-connect')}
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
