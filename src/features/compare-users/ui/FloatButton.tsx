'use client'
import { motion } from 'motion/react'
import { GitCompareIcon } from 'lucide-react'
import { useCompareUsersStore } from '@/features/compare-users/model/useCompareUsersStore'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import CompareUsersListModal from '@/features/compare-users/ui/compare-users-list-modal'

export default function FloatButton() {
  const users = useCompareUsersStore((state) => state.users)
  const open = useOverlayStore((store) => store.open)

  const handleOpen = () => {
    open({ id: 'compare-users-list', component: <CompareUsersListModal /> })
  }

  return (
    <motion.div
      id="compare-float-button"
      className={'size-16 bg-primary bottom-5 right-5 rounded-full text-primary-foreground border cursor-pointer fixed'}
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.3 }}
      onClick={handleOpen}
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
  )
}
