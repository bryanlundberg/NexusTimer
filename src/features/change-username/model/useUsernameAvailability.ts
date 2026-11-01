import { useEffect, useState } from 'react'
import useSWR from 'swr'
import type { UsernameAvailability } from '@nexustimer/contracts'
import { useDebouncedCallback } from '@/shared/model/useDebouncedCallback'

const CHECK_DELAY_MS = 400

const availabilityUrl = (username: string) => `/api/v1/users/username-availability?u=${encodeURIComponent(username)}`

async function fetchAvailability(url: string): Promise<UsernameAvailability> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`GET ${url} failed (${res.status})`)
  return res.json()
}

export function useUsernameAvailability(username: string | null) {
  const [query, setQuery] = useState<string | null>(null)
  const schedule = useDebouncedCallback(setQuery, CHECK_DELAY_MS)

  useEffect(() => {
    schedule(username)
  }, [username, schedule])

  const settled = query === username
  const { data, error, isLoading } = useSWR(settled && username ? availabilityUrl(username) : null, fetchAvailability, {
    revalidateOnFocus: false,
    shouldRetryOnError: false
  })

  return {
    availability: settled ? data : undefined,
    isChecking: !!username && (!settled || isLoading),
    failed: settled && !!error
  }
}
