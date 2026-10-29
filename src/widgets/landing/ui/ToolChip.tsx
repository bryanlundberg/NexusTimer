import type { ElementType } from 'react'

export type StreamTool = { icon: ElementType; name: string; role: string }

export default function ToolChip({ icon: Icon, name, role }: StreamTool) {
  return (
    <div className="flex w-52 shrink-0 items-center gap-3 rounded-[10px] border border-border bg-card px-3.5 py-3 md:w-full">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-foreground/8">
        <Icon className="size-4 text-muted-foreground" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-foreground">{name}</span>
        <span className="block truncate text-xs text-muted-foreground">{role}</span>
      </span>
    </div>
  )
}
