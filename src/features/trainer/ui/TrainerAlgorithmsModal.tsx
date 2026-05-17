'use client'

import { useTranslations } from 'next-intl'
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import type { Alg } from '@/features/algorithms-list/model/types'

export default function TrainerAlgorithmsModal() {
  const t = useTranslations('Index.TrainerPage.algorithmsModal')
  const metadata = useOverlayStore((s) => s.activeOverlay?.metadata)
  const caseName = metadata?.caseName as string | undefined
  const algs = (metadata?.algs ?? []) as Alg[]

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>
          {t('title')} — {caseName}
        </DialogTitle>
      </DialogHeader>

      <ol className="flex flex-col gap-2">
        {algs.map((alg, i) => (
          <li key={alg.id} className="flex items-start gap-3 rounded-md border bg-muted/40 px-3 py-2">
            <span className="text-[11px] font-mono tabular-nums text-muted-foreground pt-0.5 shrink-0 w-4">
              {i + 1}.
            </span>
            <div className="flex flex-col gap-0.5 min-w-0">
              {alg.label && (
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{alg.label}</span>
              )}
              <code className="text-sm font-mono break-all">{alg.moves}</code>
            </div>
          </li>
        ))}
      </ol>
    </DialogContent>
  )
}
