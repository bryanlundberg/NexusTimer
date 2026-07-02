'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useQueryState } from 'nuqs'

const DEBOUNCE_MS = 600

export function usePeopleSearch() {
  const [search, setSearch] = useQueryState('search', { defaultValue: '' })
  const [, setPage] = useQueryState('page')

  const [searchTerm, setSearchTerm] = useState(search)
  const lastCommitted = useRef(search)

  useEffect(() => {
    if (searchTerm === search) return

    const timeout = setTimeout(() => {
      lastCommitted.current = searchTerm
      setSearch(searchTerm || null)
      setPage(null)
    }, DEBOUNCE_MS)

    return () => clearTimeout(timeout)
  }, [searchTerm, search, setSearch, setPage])

  useEffect(() => {
    if (search !== lastCommitted.current) {
      lastCommitted.current = search
      setSearchTerm(search)
    }
  }, [search])

  const clearSearch = useCallback(() => {
    setSearch(null)
    setPage(null)
  }, [setSearch, setPage])

  return { search, searchTerm, setSearchTerm, clearSearch }
}
