'use client'

export function SidebarBgEffect() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden group-data-[collapsible=icon]:hidden">
      <div
        className="absolute -top-16 -left-16 size-56 rounded-full bg-primary/20 blur-2xl dark:bg-primary/10 will-change-transform"
        style={{ animation: 'sidebarOrbPrimary 16s ease-in-out infinite' }}
      />
      <div
        className="absolute -right-12 top-1/3 size-48 rounded-full bg-primary/8 blur-2xl dark:bg-primary/[0.06] will-change-transform"
        style={{ animation: 'sidebarOrbSecondary 20s ease-in-out infinite' }}
      />
      <div
        className="absolute -bottom-10 left-1/4 size-40 rounded-full bg-primary/10 blur-2xl dark:bg-primary/[0.05] will-change-transform"
        style={{ animation: 'sidebarOrbTertiary 24s ease-in-out infinite' }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, transparent 40%, color-mix(in oklch, var(--background) 35%, transparent) 100%)'
        }}
      />

      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent dark:via-primary/20" />

      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/3 to-transparent dark:from-primary/10" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-primary/5 to-transparent dark:from-primary/8" />
    </div>
  )
}
