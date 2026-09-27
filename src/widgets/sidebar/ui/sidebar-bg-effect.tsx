'use client'

import type { CSSProperties } from 'react'

export function SidebarBgEffect({ accent }: { accent: string }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden group-data-[collapsible=icon]:hidden"
      style={{ '--sidebar-ambient': accent } as CSSProperties}
    >
      <div className="sidebar-ambient absolute inset-x-0 top-0 h-64" />
    </div>
  )
}
