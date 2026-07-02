'use client'
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { GitCompareIcon, Users, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useLocale, useTranslations } from 'next-intl'
import dayjs from '@/shared/lib/dayjs'
import { useCompareUsersStore } from '@/features/compare-users/model/useCompareUsersStore'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'

export default function CompareUsersListModal() {
  const t = useTranslations('Index.LeaderboardsPage.comparative')
  const users = useCompareUsersStore((state) => state.users)
  const removeUser = useCompareUsersStore((state) => state.removeUser)
  const openOverlay = useCompareUsersStore((state) => state.openOverlay)
  const close = useOverlayStore((store) => store.close)
  const locale = useLocale()

  const handleCompare = () => {
    openOverlay()
    close()
  }

  return (
    <DialogContent aria-describedby={undefined} showCloseButton={false} className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          {t('title')}
          <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground tabular-nums">
            {users.length}
          </span>
        </DialogTitle>
      </DialogHeader>

      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
          <Users className="size-9 text-muted-foreground/40" />
        </div>
      ) : (
        <div className="-mx-1 flex max-h-[50vh] flex-col gap-2 overflow-y-auto px-1 py-1">
          {users.map((user) => (
            <div
              key={user._id}
              className="group flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 p-2.5 transition-colors hover:bg-muted/50"
            >
              <Avatar className="size-10 shrink-0 ring-2 ring-background">
                <AvatarImage className="object-cover" src={user.image} />
                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user?.backup?.updatedAt ? dayjs(user.backup.updatedAt).locale(locale).fromNow() : t('never')}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                onClick={() => removeUser(user._id)}
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 mt-2">
        <Button className={'w-full'} variant="ghost" onClick={close}>
          {t('close')}
        </Button>
        <Button className={'w-full gap-1.5'} onClick={handleCompare} disabled={users.length < 2}>
          <GitCompareIcon className="size-4" />
          {t('compare')}
        </Button>
      </div>
    </DialogContent>
  )
}
