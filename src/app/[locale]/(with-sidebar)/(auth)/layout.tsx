import type { Metadata } from 'next'
import RedirectIfSignedIn from '@/features/authentication/ui/RedirectIfSignedIn'
import { StretchScroller } from '@/shared/ui/stretch-scroller/StretchScroller'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <StretchScroller className="flex h-full min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="flex-1 flex">
        <RedirectIfSignedIn>{children}</RedirectIfSignedIn>
      </div>
    </StretchScroller>
  )
}
