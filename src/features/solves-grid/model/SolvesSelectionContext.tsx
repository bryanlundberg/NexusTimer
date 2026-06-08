'use client'
import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react'

interface SolvesSelectionState {
  selectionMode: boolean
  selectedIds: Set<string>
  isSelected: (id: string) => boolean
  enterSelection: (id: string) => void
  toggle: (id: string) => void
  exit: () => void
}

const SolvesSelectionContext = createContext<SolvesSelectionState | null>(null)

export function SolvesSelectionProvider({ children }: { children: ReactNode }) {
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const isSelected = useCallback((id: string) => selectedIds.has(id), [selectedIds])

  const enterSelection = useCallback((id: string) => {
    setSelectionMode(true)
    setSelectedIds(new Set([id]))
  }, [])

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      if (next.size === 0) setSelectionMode(false)
      return next
    })
  }, [])

  const exit = useCallback(() => {
    setSelectionMode(false)
    setSelectedIds(new Set())
  }, [])

  const value = useMemo<SolvesSelectionState>(
    () => ({ selectionMode, selectedIds, isSelected, enterSelection, toggle, exit }),
    [selectionMode, selectedIds, isSelected, enterSelection, toggle, exit]
  )

  return <SolvesSelectionContext.Provider value={value}>{children}</SolvesSelectionContext.Provider>
}

export function useSolvesSelection() {
  const ctx = useContext(SolvesSelectionContext)
  if (!ctx) throw new Error('useSolvesSelection must be used within SolvesSelectionProvider')
  return ctx
}
