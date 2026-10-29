import type { ReactNode } from 'react'
import { frameColumns } from '../lib/rails'

export default function RailFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative my-2">
      <div aria-hidden className="lp-rail-x-long absolute left-1/2 top-0 hidden w-[100dvw] -translate-x-1/2 md:block" />

      <div className={frameColumns}>
        <div aria-hidden className="lp-dots relative hidden md:block">
          <div className="lp-rail-y absolute inset-y-0 left-0" />
        </div>

        <div className="relative min-w-0 md:pb-16">
          <div aria-hidden className="lp-rail-y pointer-events-none absolute inset-y-0 left-0 z-[1] hidden md:block" />
          <div aria-hidden className="lp-rail-y pointer-events-none absolute inset-y-0 right-0 z-[1] hidden md:block" />
          {children}
        </div>

        <div aria-hidden className="lp-dots relative hidden md:block">
          <div className="lp-rail-y absolute inset-y-0 right-0" />
        </div>
      </div>

      <div
        aria-hidden
        className="lp-rail-x-long absolute bottom-0 left-1/2 hidden w-[100dvw] -translate-x-1/2 md:block"
      />
    </div>
  )
}
