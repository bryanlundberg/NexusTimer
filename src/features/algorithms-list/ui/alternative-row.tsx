import { Play } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Alg } from '@/features/algorithms-list/model/types'

interface AlternativeRowProps {
  alt: Alg
  index: number
  onPreview: () => void
}

export default function AlternativeRow({ alt, index, onPreview }: AlternativeRowProps) {
  const t = useTranslations('Index.AlgorithmsPage')

  return (
    <div className="notch-bl-tr flex items-start gap-2 border border-border/60 bg-muted/60 px-2 py-1.5 text-foreground">
      <span className="mt-1.5 w-10 shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground sm:w-12">
        {alt.label ?? t('alt', { index })}
      </span>
      <code className="block flex-1 min-w-0 break-all font-mono leading-relaxed">{alt.moves}</code>
      <Button
        variant="ghost"
        size="icon"
        className="btn-notch size-7 shrink-0 text-muted-foreground hover:bg-foreground/10 hover:text-foreground pointer-coarse:size-10"
        onClick={(e) => {
          e.stopPropagation()
          onPreview()
        }}
        aria-label={t('play')}
        title={t('play')}
      >
        <Play className="size-3.5" />
      </Button>
    </div>
  )
}
