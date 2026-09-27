'use client'

import { useLayoutEffect, useRef } from 'react'

export default function AuthFieldGroup({ children }: { children: React.ReactNode }) {
  const highlightRef = useRef<HTMLDivElement>(null)
  const focusedRow = useRef<HTMLElement | null>(null)

  const place = () => {
    const row = focusedRow.current
    const highlight = highlightRef.current
    if (!row || !highlight) return
    highlight.style.translate = `0 ${row.offsetTop + 4}px`
    highlight.style.height = `${row.offsetHeight - 8}px`
  }

  useLayoutEffect(place)

  const onFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    const row = (e.target as HTMLElement).closest<HTMLElement>('[data-auth-row]')
    const highlight = highlightRef.current
    if (!row || !highlight) return
    highlight.dataset.instant = String(highlight.dataset.visible !== 'true')
    focusedRow.current = row
    place()
    highlight.dataset.visible = 'true'
  }

  const onBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget) || !highlightRef.current) return
    highlightRef.current.dataset.visible = 'false'
  }

  return (
    <div className="auth-flow" onFocus={onFocus} onBlur={onBlur}>
      <div ref={highlightRef} aria-hidden className="auth-flow-highlight" data-visible="false" />
      {children}
    </div>
  )
}
