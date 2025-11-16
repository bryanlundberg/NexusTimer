'use client'
import { motion } from 'framer-motion'
import { GitCompareIcon } from 'lucide-react'
import { useCompareUsersStore } from '@/store/CompareUsers'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TrashIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistance } from 'date-fns'

export default function FloatButton() {
  const users = useCompareUsersStore((state) => state.users)
  const closeModal = useCompareUsersStore((state) => state.closeModal)
  const isOpenModal = useCompareUsersStore((state) => state.isOpenModal)
  const removeUser = useCompareUsersStore((state) => state.removeUser)
  const openOverlay = useCompareUsersStore((state) => state.openOverlay)
  const setIsOpenModal = useCompareUsersStore((state) => state.setIsOpenModal)

  return (
    <Dialog open={isOpenModal} onOpenChange={setIsOpenModal}>
      <DialogTrigger asChild>
        <motion.div
          className={
            'size-16 bg-primary bottom-5 right-5 rounded-full text-primary-foreground border cursor-pointer fixed'
          }
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          onClick={() => setIsOpenModal}
        >
          <div className={'relative flex items-center justify-center w-full h-full'}>
            <GitCompareIcon className={'size-8'} strokeWidth={1.5} />
            <div
              className={
                'size-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs absolute -top-1 right-0'
              }
            >
              {users.length}
            </div>
          </div>
        </motion.div>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Comparative</DialogTitle>
        </DialogHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="w-[100px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Last Backup?</TableHead>
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
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>
                  {user?.backup?.updatedAt
                    ? formatDistance(new Date(user?.backup?.updatedAt), new Date(), { addSuffix: true })
                    : 'Never'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <Button className={'w-full'} variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button className={'w-full'} onClick={openOverlay}>
            Compare
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
