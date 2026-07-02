import useSWR from 'swr'
import { fetcher } from '@/shared/lib/fetcher'

export interface UsersParams {
  name?: string
  country?: string
  page?: number
}

export const useUsers = (params?: UsersParams) => {
  const { name, country, page } = params || {}

  const queryParams = new URLSearchParams()
  if (name) queryParams.append('name', name)
  if (country) queryParams.append('country', country)
  if (page !== undefined && page > 1) queryParams.append('page', page.toString())

  const queryString = queryParams.toString()
  const url = `/api/v1/users${queryString ? `?${queryString}` : ''}`

  const { data, error, isLoading, mutate } = useSWR(url, fetcher)

  return {
    data,
    isLoading,
    isError: error,
    mutate
  }
}
