'use client'
import { Button } from '@/components/ui/button'
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
    <Button
      id="compare-float-button"
      type="button"
      size="lg"
      onClick={handleOpen}
      className="fixed bottom-5 right-5 z-40 px-4"
    >
      <GitCompareIcon className="size-4.5" strokeWidth={2} />
      <span>{t('compare')}</span>
      {users.length > 0 && (
        <span className="bg-primary-foreground/20 px-1.5 py-0.5 text-xs font-bold tabular-nums">{users.length}</span>
      )}
    </Button>
  )
}
