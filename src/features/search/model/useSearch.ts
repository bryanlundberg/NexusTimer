'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { fetcher } from '@/shared/lib/fetcher'
import type { SearchIndex, SearchResponse } from './types'

interface UseSearchOptions {
  limit?: number
  debounceMs?: number
}

export function useSearch<T>(index: SearchIndex, query: string, options: UseSearchOptions = {}) {
  const { limit = 8, debounceMs = 100 } = options
  const [debounced, setDebounced] = useState(query)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(query), debounceMs)
    return () => clearTimeout(id)
  }, [query, debounceMs])

  const trimmed = debounced.trim()
  const key = trimmed ? `/api/v1/search?index=${index}&q=${encodeURIComponent(trimmed)}&limit=${limit}` : null

  const { data, error, isLoading } = useSWR<SearchResponse<T>>(key, fetcher, {
    keepPreviousData: true
  })

  return {
    hits: data?.hits ?? [],
    estimatedTotalHits: data?.estimatedTotalHits ?? 0,
    isLoading: Boolean(key) && isLoading,
    isError: Boolean(error)
  }
}
