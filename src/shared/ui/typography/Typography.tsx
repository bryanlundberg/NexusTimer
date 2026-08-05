export function LegalBody({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-3xl">{children}</div>
}

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display mt-12 mb-4 text-xl md:text-2xl font-bold tracking-[-0.01em] text-gray-900">
      {children}
    </h2>
  )
}

export function Para({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-sm md:text-base leading-relaxed text-gray-600 text-pretty">{children}</p>
}

export function Li({ children }: { children: React.ReactNode }) {
  return <li className="mb-2 text-sm md:text-base leading-relaxed text-gray-600 text-pretty">{children}</li>
}
