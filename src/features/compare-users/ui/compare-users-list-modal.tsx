'use client'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { GitCompareIcon, Plus, Users, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useLocale, useTranslations } from 'next-intl'
import dayjs from '@/shared/lib/dayjs'
import { Link, useRouter } from '@/shared/config/i18n/navigation'
import { CountryFlag } from '@/shared/ui/country-flag/CountryFlag'
import { useCompareUsersStore } from '@/features/compare-users/model/useCompareUsersStore'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'

export default function CompareUsersListModal() {
  const t = useTranslations('Index.LeaderboardsPage.comparative')
  const users = useCompareUsersStore((state) => state.users)
  const removeUser = useCompareUsersStore((state) => state.removeUser)
  const clearUsers = useCompareUsersStore((state) => state.clearUsers)
  const openOverlay = useCompareUsersStore((state) => state.openOverlay)
  const close = useOverlayStore((store) => store.close)
  const router = useRouter()
  const locale = useLocale()
  const canCompare = users.length >= 2

  const handleCompare = () => {
    openOverlay()
    close()
  }

  const handleAddMore = () => {
    close()
    router.push('/people')
  }

  return (
    <DialogContent showCloseButton={false} className="gap-0 p-0 sm:max-w-md">
      <DialogHeader className="px-5 pt-5 pb-4 text-left">
        <DialogTitle className="flex items-center gap-2">
          {t('title')}
          {users.length > 0 && (
            <span className="badge-notch bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground tabular-nums">
              {users.length}
            </span>
          )}
        </DialogTitle>
        <DialogDescription className={users.length > 0 && !canCompare ? 'text-amber-600 dark:text-amber-400' : ''}>
          {users.length === 0 ? t('empty-hint') : canCompare ? t('ready') : t('need-two')}
        </DialogDescription>
      </DialogHeader>

      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 border-y border-border/50 px-5 py-10 text-center">
          <Users className="size-9 text-muted-foreground/40" aria-hidden />
          <p className="text-[15px] text-muted-foreground sm:text-sm">{t('empty')}</p>
        </div>
      ) : (
        <ul className="max-h-[50dvh] overflow-y-auto border-y border-border/50">
          {users.map((user) => (
            <li
              key={user._id}
              className="relative flex items-center gap-3 py-2.5 pr-2 pl-5 transition-colors hover:bg-muted/30 not-first:before:absolute not-first:before:top-0 not-first:before:right-0 not-first:before:left-18 not-first:before:h-px not-first:before:bg-border/50 not-first:before:content-['']"
            >
              <Avatar className="size-10 shrink-0">
                <AvatarImage className="object-cover" src={user.image} />
                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Link href={`/people/${user._id}`} onClick={close} className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="flex min-w-0 items-center gap-1.5">
                  <span className="truncate text-[15px] font-medium sm:text-sm">{user.name}</span>
                  {user.country && <CountryFlag code={user.country} className="w-3.5 shrink-0" />}
                </span>
                <span className="truncate text-[13px] text-muted-foreground sm:text-xs">
                  {user.backup?.updatedAt
                    ? t('data-from', { date: dayjs(user.backup.updatedAt).locale(locale).fromNow() })
                    : t('no-data')}
                </span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                aria-label={t('remove', { name: user.name })}
                title={t('remove', { name: user.name })}
                className="size-9 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive pointer-coarse:size-11"
                onClick={() => removeUser(user._id)}
              >
                <X className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <Button variant="ghost" size="sm" className="gap-1.5 pointer-coarse:h-10" onClick={handleAddMore}>
          <Plus className="size-4" />
          {t('add-more')}
        </Button>
        {users.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive pointer-coarse:h-10"
            onClick={clearUsers}
          >
            {t('clear-all')}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 px-5 pt-1 pb-5">
        <Button className="w-full pointer-coarse:h-11" variant="secondary" onClick={close}>
          {t('close')}
        </Button>
        <Button className="w-full gap-1.5 pointer-coarse:h-11" onClick={handleCompare} disabled={!canCompare}>
          <GitCompareIcon className="size-4" />
          {t('compare')}
        </Button>
      </div>
    </DialogContent>
  )
}
