'use client'

import { useEffect, useState } from 'react'
import { useQueryState } from 'nuqs'

const DEBOUNCE_MS = 400

export function usePeopleSearch() {
  const [search, setSearch] = useQueryState('search', { defaultValue: '' })
  const [, setPage] = useQueryState('page')

  const [searchTerm, setSearchTerm] = useState(search)

  useEffect(() => {
    if (searchTerm === search) return

    const timeout = setTimeout(() => {
      setSearch(searchTerm || null)
      setPage('0')
    }, DEBOUNCE_MS)

    return () => clearTimeout(timeout)
  }, [searchTerm, search, setSearch, setPage])

  return { searchTerm, setSearchTerm }
}
