import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import { fetcher } from '@/shared/lib/fetcher'
import type { MySharedIds } from '@/entities/shared-solve/model/types'

export const MY_SHARED_IDS_KEY = '/api/v1/shared-solves'

export const useMySharedIds = () => {
  const { data: session } = useSession()
  const { data, isLoading, mutate } = useSWR<{ ids: MySharedIds }>(
    session?.user?.id ? MY_SHARED_IDS_KEY : null,
    fetcher,
    { revalidateOnFocus: false }
  )

  return { ids: data?.ids ?? {}, isLoading, mutate }
}
