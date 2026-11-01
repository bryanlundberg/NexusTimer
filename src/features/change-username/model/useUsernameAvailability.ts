import { useState } from 'react'
import type { UsernameAvailability } from '@nexustimer/contracts'

const availabilityUrl = (username: string) => `/api/v1/users/username-availability?u=${encodeURIComponent(username)}`

export type AvailabilityCheck = { username: string; availability: UsernameAvailability | null }

export function useUsernameAvailability() {
  const [result, setResult] = useState<AvailabilityCheck | null>(null)
  const [checking, setChecking] = useState(false)

  const check = async (username: string) => {
    setChecking(true)
    try {
      const res = await fetch(availabilityUrl(username))
      setResult({ username, availability: res.ok ? ((await res.json()) as UsernameAvailability) : null })
    } catch {
      setResult({ username, availability: null })
    } finally {
      setChecking(false)
    }
  }

  return { result, checking, check }
}
