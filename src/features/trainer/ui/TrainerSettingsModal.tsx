'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'
import { useTrainerStore } from '@/features/trainer/model/useTrainerStore'
import { useTrainerPrefsStore } from '@/features/trainer/model/useTrainerPrefsStore'
import { TRAINER_DEFAULT_TARGET_SECONDS } from '@/features/trainer/lib/constants'
import type { ReactNode } from 'react'

interface TrainerSettingsModalProps {
  onEditTarget: () => void
  onPickCases: () => void
}

export default function TrainerSettingsModal({ onEditTarget, onPickCases }: TrainerSettingsModalProps) {
  const t = useTranslations('Index.TrainerPage')
  const tSettings = useTranslations('Index.SettingsPage')

  const showSolveInfo = useTrainerPrefsStore((s) => s.showSolveInfo)
  const toggleShowSolveInfo = useTrainerPrefsStore((s) => s.toggleShowSolveInfo)

  const methodSlug = useTrainerStore((s) => s.methodSlug)
  const pickedIds = useTrainerStore((s) => s.pickedIds)
  const targetSeconds = useTrainerStore((s) => s.targetByMethod[s.methodSlug] ?? TRAINER_DEFAULT_TARGET_SECONDS)

  const { pickedCount, totalCount } = useMemo(() => {
    const set = ALGORITHM_SETS.find((s) => s.slug === methodSlug) ?? ALGORITHM_SETS[0]
    return {
      pickedCount: set.algorithms.filter((a) => pickedIds.has(a.id)).length,
      totalCount: set.algorithms.length
    }
  }, [methodSlug, pickedIds])

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{tSettings('title')}</DialogTitle>
      </DialogHeader>

      <div className="flex flex-col">
        <Row label={t('actions.showSolveInfo')}>
          <Switch
            checked={showSolveInfo}
            onCheckedChange={toggleShowSolveInfo}
            aria-label={t('actions.showSolveInfo')}
          />
        </Row>

        <Row label={t('stats.target')}>
          <Button variant="outline" size="sm" onClick={onEditTarget} className="h-8 px-3 text-xs">
            <span className="font-mono font-semibold tabular-nums text-primary">&lt;{targetSeconds}s</span>
          </Button>
        </Row>

        <Row label={t('actions.pickCases')}>
          <Button variant="outline" size="sm" onClick={onPickCases} className="h-8 px-3 text-xs">
            <span className="font-mono font-semibold tabular-nums">
              {pickedCount}/{totalCount}
            </span>
          </Button>
        </Row>
      </div>
    </DialogContent>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/60 py-3 last:border-b-0">
      <span className="text-sm leading-tight min-w-0">{label}</span>
      {children}
    </div>
  )
}
