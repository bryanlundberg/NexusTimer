'use client'
import React from 'react'
import { useCompareUsersStore } from '@/features/compare-users/model/useCompareUsersStore'
import FloatButton from '@/features/compare-users/ui/FloatButton'
import CompareUsersModal from '@/features/compare-users/ui/compare-users-modal'

export default function Layout({ children }: { children: React.ReactNode }) {
  const users = useCompareUsersStore((state) => state.users)
  const isOpenOverlay = useCompareUsersStore((state) => state.isOpenOverlay)
  return (
    <>
      {children}
      {users.length > 0 && <FloatButton/>}
      {isOpenOverlay && <CompareUsersModal/>}
    </>
  )
}
