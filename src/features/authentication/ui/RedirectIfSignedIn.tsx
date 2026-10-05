'use client'

import { useEffect } from 'react'
import { useRouter } from '@/shared/config/i18n/navigation'
import { useSession } from '@/shared/model/useSession'

export default function RedirectIfSignedIn() {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') router.replace('/app')
  }, [status, router])

  return null
}
