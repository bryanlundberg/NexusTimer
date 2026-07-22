'use client'
import { motion } from 'motion/react'
import { GitCompareIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCompareUsersStore } from '@/features/compare-users/model/useCompareUsersStore'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import CompareUsersListModal from '@/features/compare-users/ui/compare-users-list-modal'

export default function FloatButton() {
  const users = useCompareUsersStore((state) => state.users)
  const open = useOverlayStore((store) => store.open)
  const t = useTranslations('Index.LeaderboardsPage.comparative')

  const handleOpen = () => {
    open({ id: 'compare-users-list', component: <CompareUsersListModal /> })
  }

  return (
    <motion.button
      id="compare-float-button"
      type="button"
      onClick={handleOpen}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className="notch-bl-tr [--nblt:12px] fixed bottom-5 right-5 z-40 inline-flex h-11 items-center gap-2 bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-lg cursor-pointer"
    >
      <GitCompareIcon className="size-4.5" strokeWidth={2} />
      <span>{t('compare')}</span>
      {users.length > 0 && (
        <span className="badge-notch bg-primary-foreground/20 px-1.5 py-0.5 text-xs font-bold tabular-nums">
          {users.length}
        </span>
      )}
    </motion.button>
  )
}
