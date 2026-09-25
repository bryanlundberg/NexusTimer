import type { ReactNode } from 'react'
import { CompareUsersOverlay } from '@/features/compare-users/ui/CompareUsersOverlay'

// Must stay a server layout: client layouts get wrapped in ClientSegmentRoot, which logs a "unique key" warning in dev.
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <CompareUsersOverlay />
    </>
  )
}
