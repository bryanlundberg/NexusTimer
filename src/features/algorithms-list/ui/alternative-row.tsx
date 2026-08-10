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
    <div className="notch-bl-tr flex items-start gap-2 border border-border/60 bg-muted/60 px-2 py-1.5 text-foreground dark:bg-black dark:text-white">
      <span className="mt-2 w-10 shrink-0 text-[9px] uppercase tracking-wider text-muted-foreground sm:w-12 dark:text-white/50">
        {alt.label ?? `alt ${index}`}
      </span>
      <code className="block flex-1 min-w-0 break-all font-mono leading-relaxed">{alt.moves}</code>
      <Button
        variant="ghost"
        size="icon"
        className="btn-notch size-6 shrink-0 text-muted-foreground hover:bg-foreground/10 hover:text-foreground dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
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
