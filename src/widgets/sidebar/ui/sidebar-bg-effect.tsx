'use client'

export function SidebarBgEffect() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden group-data-[collapsible=icon]:hidden">
      {/* Subtle glass highlight at the top */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/[0.05] to-transparent dark:from-primary/10" />

      {/* Right-edge glow border */}
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-primary/25 to-transparent dark:via-primary/20" />
    </div>
  )
}
