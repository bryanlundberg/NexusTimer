'use client'
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TrashIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useLocale, useTranslations } from 'next-intl'
import moment from 'moment'
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
    <DialogContent aria-describedby={undefined}>
      <DialogHeader>
        <DialogTitle>{t('title')}</DialogTitle>
      </DialogHeader>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead className="w-[100px]"></TableHead>
            <TableHead>{t('name')}</TableHead>
            <TableHead>{t('last-backup')}</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell className="font-medium">
                <Button variant={'ghost'} size={'icon'} onClick={() => removeUser(user._id)}>
                  <TrashIcon />
                </Button>
              </TableCell>
              <TableCell>
                <Avatar>
                  <AvatarImage className={'object-cover'} src={user.image} />
                  <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>
                {user?.backup?.updatedAt ? moment(user.backup.updatedAt).locale(locale).fromNow() : t('never')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="grid grid-cols-2 gap-2 mt-4">
        <Button className={'w-full'} variant="secondary" onClick={close}>
          {t('close')}
        </Button>
        <Button className={'w-full'} onClick={handleCompare}>
          {t('compare')}
        </Button>
      </div>
    </DialogContent>
  )
}
