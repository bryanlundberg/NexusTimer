import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import { fetcher } from '@/shared/lib/fetcher'
import { apiPatch } from '@/shared/api/client'
import type { PrivacySettings } from '@/entities/privacy/model/types'

export const PRIVACY_KEY = '/api/v1/privacy'

export const usePrivacy = () => {
  const { data: session } = useSession()
  const { data, error, isLoading, mutate } = useSWR<PrivacySettings>(session?.user?.id ? PRIVACY_KEY : null, fetcher)

  const update = (patch: Partial<PrivacySettings>) =>
    mutate(() => apiPatch<PrivacySettings>(PRIVACY_KEY, patch), {
      optimisticData: (current) => ({ ...current!, ...patch }),
      rollbackOnError: true,
      revalidate: false
    })

  return { data, isLoading, isError: error, update }
}
