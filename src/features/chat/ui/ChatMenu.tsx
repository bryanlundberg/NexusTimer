'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Ban, Bell, BellOff, Eraser, MoreVertical, Trash2 } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useChat } from '@/entities/chat/model/useChat'
import { useChatActions } from '@/features/chat/model/useChatActions'
import { useFriendActions } from '@/features/friends/model/useFriendActions'
import { FriendActionDialog } from '@/features/friends/ui/FriendActionDialog'
import { cn } from '@/shared/lib/utils'

type Pending = 'clear' | 'delete'

interface Props {
  chatId: string
  onDeleted?: () => void
  className?: string
}

export function ChatMenu({ chatId, onDeleted, className }: Props) {
  const t = useTranslations('Index.ChatPage')
  const { chat, peer } = useChat(chatId)
  const { clearChat, deleteChat, setMuted } = useChatActions(chatId)
  const { block } = useFriendActions()
  const [pending, setPending] = useState<Pending | null>(null)
  const [blocking, setBlocking] = useState(false)
  const [busy, setBusy] = useState(false)

  const toggleMuted = () => {
    if (!chat) return
    setMuted(!chat.muted).catch(() => toast.error(t('action-failed')))
  }

  const confirm = async () => {
    if (!pending || busy) return
    setBusy(true)
    try {
      if (pending === 'clear') {
        await clearChat()
      } else {
        await deleteChat()
        onDeleted?.()
      }
      setPending(null)
    } catch {
      toast.error(t('action-failed'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={t('chat-actions')}
          className={cn(
            'flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground',
            className
          )}
        >
          <MoreVertical className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-44">
          <DropdownMenuItem disabled={!chat} onSelect={toggleMuted}>
            {chat?.muted ? <Bell className="size-4" /> : <BellOff className="size-4" />}
            {t(chat?.muted ? 'unmute-chat' : 'mute-chat')}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setPending('clear')}>
            <Eraser className="size-4" />
            {t('clear-chat')}
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onSelect={() => setPending('delete')}>
            <Trash2 className="size-4" />
            {t('delete-chat')}
          </DropdownMenuItem>
          {peer && (
            <DropdownMenuItem variant="destructive" onSelect={() => setBlocking(true)}>
              <Ban className="size-4" />
              {t('block-user')}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={pending !== null} onOpenChange={(open) => !open && !busy && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t(pending === 'delete' ? 'delete-chat' : 'clear-chat')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t(pending === 'delete' ? 'delete-chat-hint' : 'clear-chat-hint')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              disabled={busy}
              className={cn(buttonVariants({ variant: 'destructive' }), 'btn-notch')}
              onClick={(event) => {
                event.preventDefault()
                void confirm()
              }}
            >
              {t('confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <FriendActionDialog
        friend={blocking && peer ? peer : null}
        action="block"
        onOpenChange={setBlocking}
        onConfirm={block}
      />
    </>
  )
}
