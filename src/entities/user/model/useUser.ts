import useSWR from 'swr'

const fetchUser = async (url: string) => {
  const res = await fetch(url)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GET ${url} failed (${res.status})`)
  return res.json()
}

export const useUser = (userId: string | undefined) => {
  const { data, error, isLoading, mutate } = useSWR(userId ? `/api/v1/users/${userId}` : null, fetchUser)

  return {
    data,
    isLoading,
    isError: error,
    mutate
  }
}
