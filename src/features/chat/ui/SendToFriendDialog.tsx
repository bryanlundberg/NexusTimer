'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Search } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/shared/lib/utils'
import { useFriends } from '@/entities/friendship/model/useFriends'
import { useOpenChat } from '@/features/chat/model/useOpenChat'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  draft: string
  onOpened?: () => void
}

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')

// AlertDialog on purpose: it can open from inside SolveDetails without dismissing it
export function SendToFriendDialog({ open, onOpenChange, draft, onOpened }: Props) {
  const t = useTranslations('Index.ChatPage')
  const { data, isLoading } = useFriends()
  const { openChatWith } = useOpenChat()
  const [query, setQuery] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)

  const friends = data?.friends ?? []
  const needle = normalize(query.trim())
  const matches = needle ? friends.filter(({ user }) => normalize(user.name).includes(needle)) : friends

  const changeOpen = (next: boolean) => {
    if (!next) setQuery('')
    onOpenChange(next)
  }

  const send = async (userId: string) => {
    if (busyId) return
    setBusyId(userId)
    try {
      await openChatWith(userId, draft)
      changeOpen(false)
      onOpened?.()
    } catch {
      toast.error(t('action-failed'))
    } finally {
      setBusyId(null)
    }
  }

  const empty =
    !isLoading && (friends.length === 0 ? t('no-friends') : matches.length === 0 ? t('no-friends-match') : null)

  return (
    <AlertDialog open={open} onOpenChange={changeOpen}>
      <AlertDialogContent className="flex max-h-[min(36rem,85dvh)] flex-col gap-3 sm:max-w-sm">
        <AlertDialogHeader className="shrink-0">
          <AlertDialogTitle>{t('send-to-friend')}</AlertDialogTitle>
          <AlertDialogDescription>{t('send-to-friend-hint')}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="relative shrink-0">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 z-[2] size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('search-friends')}
            aria-label={t('search-friends')}
            className="pl-8"
            data-testid="send-to-friend-search"
          />
        </div>

        <div className="-mx-1 flex min-h-0 flex-col overflow-y-auto overscroll-contain">
          {empty ? (
            <p className="m-auto px-4 py-6 text-center text-sm text-muted-foreground">{empty}</p>
          ) : (
            matches.map(({ user }) => (
              <button
                key={user._id}
                type="button"
                disabled={!!busyId}
                onClick={() => void send(user._id)}
                className={cn(
                  'flex shrink-0 items-center gap-2.5 border-l-2 border-l-transparent px-2 py-2 text-left text-sm transition-colors',
                  'hover:border-l-primary hover:bg-muted/40 focus-visible:border-l-primary focus-visible:bg-muted/40 focus-visible:outline-none',
                  'disabled:opacity-60',
                  busyId === user._id && 'border-l-primary bg-muted/40'
                )}
              >
                <Avatar className="size-8 rounded-md">
                  <AvatarImage className="object-cover" src={user.image} alt="" />
                  <AvatarFallback className="rounded-md text-[10px] font-bold">
                    {user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate font-medium">{user.name}</span>
              </button>
            ))
          )}
        </div>

        <AlertDialogFooter className="shrink-0">
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
