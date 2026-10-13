'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { CopyIcon } from 'lucide-react'
import { toast } from 'sonner'
import type { CubeCategory } from '@/shared/const/cube-categories'
import type { RecordSolve } from '@/entities/user-stats/model/types'
import { RecordSolveCard } from '@/widgets/people/ui/record-solve-card'

interface RecordSolvesStripProps {
  single?: RecordSolve
  ao5?: RecordSolve[]
  ao5Edges: { bestId: string; worstId: string } | null
  category: CubeCategory
}

export function RecordSolvesStrip({ single, ao5 = [], ao5Edges, category }: RecordSolvesStripProps) {
  const t = useTranslations('Index.SharedSolves')
  const tSolveCard = useTranslations('Index.PeoplePage.solve-card')

  const cards = [
    ...(single
      ? [{ key: 'single', solve: single, label: tSolveCard('single'), isRecord: true, isTrimmed: false }]
      : []),
    ...ao5.map((solve, index) => ({
      key: `ao5-${index}`,
      solve,
      label: String(index + 1),
      isRecord: false,
      isTrimmed: solve.id === ao5Edges?.bestId || solve.id === ao5Edges?.worstId
    }))
  ]

  const [selectedKey, setSelectedKey] = useState(cards[0]?.key)
  const selected = cards.find((card) => card.key === selectedKey) ?? cards[0]
  if (!selected) return null

  const handleCopyScramble = async () => {
    try {
      await navigator.clipboard.writeText(selected.solve.scramble)
      toast.success(t('scramble-copied'))
    } catch {
      toast.error(t('errors.generic'))
    }
  }

  return (
    <div className="flex w-full max-w-[calc(100cqw-1.5rem)] min-w-0 flex-col gap-2">
      <div className="grid grid-cols-3 gap-2 @xl/tab:grid-cols-6">
        {cards.map(({ key, ...card }) => (
          <RecordSolveCard
            key={key}
            {...card}
            category={category}
            selected={key === selected.key}
            onSelect={() => setSelectedKey(key)}
          />
        ))}
      </div>

      <div className="flex items-start gap-2 border-t border-border/40 pt-2">
        <p className="min-w-0 flex-1 font-mono text-[11px] leading-relaxed break-words text-muted-foreground">
          <span className="mr-1.5 font-sans font-medium text-foreground/70">{selected.label}</span>
          <span className="select-all">{selected.solve.scramble}</span>
        </p>
        <button
          type="button"
          aria-label={t('copy-scramble')}
          onClick={handleCopyScramble}
          className="shrink-0 border p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground pointer-coarse:p-2"
        >
          <CopyIcon className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
