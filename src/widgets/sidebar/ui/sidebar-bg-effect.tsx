'use client'

import type { CSSProperties } from 'react'

const FACE = [0, 1, 2].flatMap((row) => [0, 1, 2].map((col) => ({ x: 1 + col * 10, y: 1 + row * 10 })))

export function SidebarBgEffect({ accent }: { accent: string }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden group-data-[collapsible=icon]:hidden"
      style={{ '--sidebar-ambient': accent } as CSSProperties}
    >
      <div className="sidebar-ambient absolute inset-x-0 top-0 h-64" />
      <svg
        aria-hidden
        viewBox="0 0 30 30"
        className="sidebar-watermark absolute -top-7 -right-8 size-28 rotate-12"
        fill="currentColor"
      >
        {FACE.map(({ x, y }) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="8" height="8" rx="1.6" />
        ))}
      </svg>
    </div>
  )
}
