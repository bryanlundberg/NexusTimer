'use client'

import { useTranslations } from 'next-intl'
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

export type FriendAction = 'remove-friend' | 'cancel-request' | 'decline' | 'block'

interface Props {
  friend: { _id: string; name: string } | null
  action: FriendAction
  onOpenChange: (open: boolean) => void
  onConfirm: (userId: string) => void
}

export function FriendActionDialog({ friend, action, onOpenChange, onConfirm }: Props) {
  const t = useTranslations('Index.FriendsPage')

  return (
    <AlertDialog open={friend !== null} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t(action)}</AlertDialogTitle>
          <AlertDialogDescription>{t(`${action}-hint`, { name: friend?.name ?? '' })}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: 'destructive' })}
            onClick={() => friend && onConfirm(friend._id)}
          >
            {t(action)}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
