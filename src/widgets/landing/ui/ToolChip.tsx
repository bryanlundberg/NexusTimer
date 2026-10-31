import Image from 'next/image'

export type StreamTool = { logo: string; name: string; role: string }

export default function ToolChip({ logo, name, role }: StreamTool) {
  return (
    <div className="flex w-52 shrink-0 items-center gap-3 rounded-[10px] border border-border bg-card px-3.5 py-3">
      <Image
        src={logo}
        alt=""
        width={32}
        height={32}
        unoptimized
        className="size-8 shrink-0 rounded-[8px] object-contain"
      />
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-foreground">{name}</span>
        <span className="block truncate text-xs text-muted-foreground">{role}</span>
      </span>
    </div>
  )
}
