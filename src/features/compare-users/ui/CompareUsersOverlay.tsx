'use client'
import { useCompareUsersStore } from '@/features/compare-users/model/useCompareUsersStore'
import FloatButton from '@/features/compare-users/ui/FloatButton'
import CompareUsersModal from '@/features/compare-users/ui/compare-users-modal'

export function CompareUsersOverlay() {
  const users = useCompareUsersStore((state) => state.users)
  const isOpenOverlay = useCompareUsersStore((state) => state.isOpenOverlay)

  return (
    <>
      {users.length > 0 && <FloatButton />}
      {isOpenOverlay && <CompareUsersModal />}
    </>
  )
}
