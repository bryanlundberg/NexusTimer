import useSWR from 'swr'
import { useSession } from '@/shared/model/useSession'
import { fetcher } from '@/shared/lib/fetcher'
import type { MySharedIds } from '@/entities/shared-solve/model/types'

export const MY_SHARED_IDS_KEY = '/api/v1/shared-solves'

export const useMySharedIds = (enabled = true) => {
  const { data: session } = useSession()
  const { data, isLoading, mutate } = useSWR<{ ids: MySharedIds }>(
    enabled && session?.user?.id ? MY_SHARED_IDS_KEY : null,
    fetcher,
    { revalidateOnFocus: false, revalidateIfStale: false }
  )

  return { ids: data?.ids ?? {}, isLoading, mutate }
}
