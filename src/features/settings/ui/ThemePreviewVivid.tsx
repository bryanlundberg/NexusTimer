import { useMemo } from 'react'
import { Colors } from '@/shared/types/colors'
import { buildVividColorScheme } from '@/shared/lib/vividColorScheme'

export default function ThemePreviewVivid({ color, selected }: { color: Colors; selected: boolean }) {
  const scheme = useMemo(() => buildVividColorScheme(color), [color])
  const block = { background: scheme.card }
  const line = { background: scheme['muted-foreground'] }

  return (
    <div
      className={`relative w-28 h-20 sm:w-36 sm:h-24 notch-br overflow-hidden cursor-pointer transition-all duration-200 ${
        selected ? 'border-2 border-primary scale-[1.02]' : 'border border-border hover:border-muted-foreground'
      }`}
    >
      <div className="h-full w-full flex" style={{ background: scheme.background }}>
        <div
          className="w-6 sm:w-8 h-full flex flex-col items-center gap-1 sm:gap-1.5 pt-2"
          style={{ background: scheme['sidebar-accent'] }}
        >
          <div className="w-3 sm:w-4 h-3 sm:h-4" style={{ background: scheme.primary }} />
          <div className="w-3 sm:w-4 h-1 rounded-full" style={line} />
          <div className="w-3 sm:w-4 h-1 rounded-full" style={line} />
          <div className="w-3 sm:w-4 h-1 rounded-full" style={line} />
        </div>
        <div className="flex-1 p-1.5 sm:p-2 flex flex-col gap-1 sm:gap-1.5">
          <div className="flex items-center gap-1">
            <div className="w-8 sm:w-10 h-1.5 rounded-full" style={{ background: scheme.foreground }} />
            <div className="ml-auto w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full" style={block} />
          </div>
          <div className="flex gap-1 flex-1">
            <div className="flex-1" style={block} />
            <div className="flex-1" style={block} />
          </div>
          <div className="h-2.5 sm:h-3" style={{ background: scheme.muted }} />
        </div>
      </div>
    </div>
  )
}
