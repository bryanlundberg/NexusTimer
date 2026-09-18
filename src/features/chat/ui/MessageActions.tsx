'use client'

import { useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { MoreHorizontal, Pencil, Plus, SmilePlus, Trash2 } from 'lucide-react'
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
import { EmojiPicker } from '@/shared/ui/emoji-picker/EmojiPicker'
import { QUICK_REACTIONS } from '@/entities/chat/lib/reactions'
import type { DeleteScope } from '@/entities/chat/model/types'
import { cn } from '@/shared/lib/utils'

interface Props {
  isOwn: boolean
  canEdit: boolean
  canReact: boolean
  canDeleteForEveryone: boolean
  onReact: (emoji: string) => void
  onEdit: () => void
  onDelete: (scope: DeleteScope) => void
}

const triggerClass =
  'flex size-7 items-center justify-center rounded-full border border-border/60 bg-background/90 text-muted-foreground transition-colors hover:text-foreground data-[state=open]:text-foreground'

const PICKER_HEIGHT = 300

export function MessageActions({ isOwn, canEdit, canReact, canDeleteForEveryone, onReact, onEdit, onDelete }: Props) {
  const t = useTranslations('Index.ChatPage')
  const [reactOpen, setReactOpen] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [pickerSide, setPickerSide] = useState<'top' | 'bottom'>('bottom')
  const [confirming, setConfirming] = useState(false)
  const reactTriggerRef = useRef<HTMLButtonElement>(null)

  const align = isOwn ? 'end' : 'start'

  const openPicker = () => {
    const trigger = reactTriggerRef.current?.getBoundingClientRect()
    if (trigger) {
      const below = window.innerHeight - trigger.bottom
      setPickerSide(below < PICKER_HEIGHT && trigger.top > below ? 'top' : 'bottom')
    }
    setShowPicker(true)
  }

  const react = (emoji: string) => {
    onReact(emoji)
    setReactOpen(false)
  }

  const remove = (scope: DeleteScope) => {
    setConfirming(false)
    onDelete(scope)
  }

  return (
    <div className="flex items-center gap-0.5">
      {canReact && (
        <DropdownMenu
          open={reactOpen}
          onOpenChange={(next) => {
            setReactOpen(next)
            if (!next) setShowPicker(false)
          }}
        >
          <DropdownMenuTrigger ref={reactTriggerRef} aria-label={t('react')} className={triggerClass}>
            <SmilePlus className="size-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align={align}
            side={showPicker ? pickerSide : undefined}
            className={showPicker ? 'w-72' : undefined}
            innerClassName={showPicker ? 'p-0' : 'p-1'}
          >
            {showPicker ? (
              <EmojiPicker onSelect={react} />
            ) : (
              <div className="flex items-center gap-0.5">
                {QUICK_REACTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    aria-label={t('reaction-add', { emoji })}
                    onClick={() => react(emoji)}
                    className="flex size-8 items-center justify-center rounded-md text-xl transition-transform hover:scale-115 hover:bg-muted"
                  >
                    {emoji}
                  </button>
                ))}
                <span className="mx-0.5 h-5 w-px bg-border/60" />
                <button
                  type="button"
                  aria-label={t('emoji-more')}
                  onClick={openPicker}
                  className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger aria-label={t('message-actions')} className={triggerClass}>
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align={align} className="min-w-40">
          {canEdit && (
            <DropdownMenuItem onSelect={onEdit}>
              <Pencil className="size-4" />
              {t('edit')}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem variant="destructive" onSelect={() => setConfirming(true)}>
            <Trash2 className="size-4" />
            {t('delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('delete-message')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t(canDeleteForEveryone ? 'delete-message-hint' : 'delete-message-hint-mine')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className={cn(buttonVariants({ variant: 'secondary' }), 'btn-notch')}
              onClick={() => remove('me')}
            >
              {t('delete-for-me')}
            </AlertDialogAction>
            {canDeleteForEveryone && (
              <AlertDialogAction
                className={cn(buttonVariants({ variant: 'destructive' }), 'btn-notch')}
                onClick={() => remove('all')}
              >
                {t('delete-for-everyone')}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
