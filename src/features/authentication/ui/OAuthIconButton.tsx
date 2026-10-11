'use client'

interface Props {
  label: string
  brand?: string
  onClick: () => void
  children: React.ReactNode
}

export default function OAuthIconButton({ label, brand = 'var(--primary)', onClick, children }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      data-brand
      style={{ '--brand': brand } as React.CSSProperties}
      className="relative flex h-11 flex-1 border bg-background hover:border-(--brand) hover:bg-[color-mix(in_oklab,var(--brand)_10%,var(--background))] focus-visible:border-(--brand) focus-visible:bg-[color-mix(in_oklab,var(--brand)_10%,var(--background))] items-center justify-center outline-none transition-transform duration-150 active:scale-[0.97] [&_img]:transition-transform hover:[&_img]:scale-110 focus-visible:[&_img]:scale-110 motion-reduce:transition-none"
    >
      {children}
    </button>
  )
}
