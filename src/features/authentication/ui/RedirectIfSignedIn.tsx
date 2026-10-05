'use client'

import { type ReactNode, useEffect, useState } from 'react'
import { useRouter } from '@/shared/config/i18n/navigation'
import { useSession } from '@/shared/model/useSession'

export default function RedirectIfSignedIn({ children }: { children: ReactNode }) {
  const { status } = useSession()
  const router = useRouter()
  // Only the status on arrival counts, so signing in here leaves the navigation to the form.
  const [arrival, setArrival] = useState(status)
  if (arrival === 'loading' && status !== 'loading') setArrival(status)
  const signedIn = arrival === 'authenticated'

  useEffect(() => {
    if (signedIn) router.replace('/app')
  }, [signedIn, router])

  return signedIn ? null : children
}
