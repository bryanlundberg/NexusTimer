import type { ReactNode } from 'react'

export function FieldLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium">
      {children}
    </label>
  )
}
