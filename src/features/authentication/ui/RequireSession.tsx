'use client'

import { type ReactNode, useEffect } from 'react'
import { useRouter } from '@/shared/config/i18n/navigation'
import { useSession } from '@/shared/model/useSession'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

export default function RequireSession({ children, fallback }: Props) {
  const { status } = useSession()
  const router = useRouter()
  const redirects = fallback === undefined

  useEffect(() => {
    if (redirects && status === 'unauthenticated') router.replace('/sign-in')
  }, [redirects, status, router])

  if (status === 'authenticated') return children
  if (status === 'unauthenticated' && !redirects) return fallback
  return null
}
