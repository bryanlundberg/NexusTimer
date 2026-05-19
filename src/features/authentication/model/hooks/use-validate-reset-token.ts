'use client'

import { useEffect, useState } from 'react'

type State = { status: 'loading' } | { status: 'valid'; email: string } | { status: 'invalid'; message: string }

export function useValidateResetToken(oobCode: string | null) {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    if (!oobCode) {
      setState({ status: 'invalid', message: 'Missing token' })
      return
    }

    let cancelled = false
    setState({ status: 'loading' })

    fetch(`/api/v1/auth/reset-password?oobCode=${encodeURIComponent(oobCode)}`)
      .then(async (res) => {
        const data = (await res.json().catch(() => ({}))) as { email?: string; message?: string }
        if (cancelled) return
        if (!res.ok) {
          setState({ status: 'invalid', message: data.message ?? 'Invalid token' })
          return
        }
        setState({ status: 'valid', email: data.email ?? '' })
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'invalid', message: 'Network error' })
      })

    return () => {
      cancelled = true
    }
  }, [oobCode])

  return state
}
