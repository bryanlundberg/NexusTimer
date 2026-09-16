'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Eraser, MoreVertical, Trash2 } from 'lucide-react'
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
import { useChatActions } from '@/features/chat/model/useChatActions'
import { cn } from '@/shared/lib/utils'

type Pending = 'clear' | 'delete'

interface Props {
  userId: string
  onDeleted?: () => void
  className?: string
}

/** Both entries only affect this side of the conversation. */
export function ChatMenu({ userId, onDeleted, className }: Props) {
  const t = useTranslations('Index.ChatPage')
  const { clearChat, deleteChat } = useChatActions(userId)
  const [pending, setPending] = useState<Pending | null>(null)
  const [busy, setBusy] = useState(false)

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
          <DropdownMenuItem onSelect={() => setPending('clear')}>
            <Eraser className="size-4" />
            {t('clear-chat')}
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onSelect={() => setPending('delete')}>
            <Trash2 className="size-4" />
            {t('delete-chat')}
          </DropdownMenuItem>
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
                // Stay open until the request settles, so a failure can be shown
                event.preventDefault()
                void confirm()
              }}
            >
              {t('confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
