import { Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alg } from '@/features/algorithms-list/model/types'

interface AlternativeRowProps {
  alt: Alg
  index: number
  onPreview: () => void
}

export default function AlternativeRow({ alt, index, onPreview }: AlternativeRowProps) {
  return (
    <div className="flex items-start gap-2 rounded-md border bg-background/40 px-2 py-1.5">
      <span className="mt-2 w-10 shrink-0 text-[9px] uppercase tracking-wider text-muted-foreground sm:w-12">
        {alt.label ?? `alt ${index}`}
      </span>
      <code className="block flex-1 min-w-0 break-all font-mono leading-relaxed">{alt.moves}</code>
      <Button
        variant="ghost"
        size="icon"
        className="size-6 shrink-0 text-muted-foreground hover:text-foreground"
        onClick={(e) => {
          e.stopPropagation()
          onPreview()
        }}
        aria-label="Play"
        title="Play"
      >
        <Play className="size-3" />
      </Button>
    </div>
  )
}
