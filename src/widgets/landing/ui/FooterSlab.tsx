import type { ReactNode } from 'react'

export default function FooterSlab({ children }: { children: ReactNode }) {
  return (
    <div className="px-2 pb-2 sm:px-3 sm:pb-3">
      <div className="notch-bl-tr relative overflow-hidden bg-[var(--lp-hero-dark)]">{children}</div>
    </div>
  )
}
