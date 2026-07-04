'use client'

import { useTranslations } from 'next-intl'
import { Shuffle, Dice5, ArrowRight } from 'lucide-react'
import { Tabs } from '@/components/ui/tabs'
import AnimatedTabsList, { type AnimatedTabItem } from '@/shared/ui/animated-tabs/AnimatedTabsList'
import type { TrainerRotationMode } from '@/features/trainer/model/types'

interface TrainerRotationModeChipsProps {
  value: TrainerRotationMode
  onChange: (mode: TrainerRotationMode) => void
}

const OPTIONS = [
  { id: 'shuffle' as const, icon: Shuffle },
  { id: 'random' as const, icon: Dice5 },
  { id: 'sequential' as const, icon: ArrowRight }
]

export default function TrainerRotationModeChips({ value, onChange }: TrainerRotationModeChipsProps) {
  const t = useTranslations('Index.TrainerPage.rotation')

  const items: AnimatedTabItem[] = OPTIONS.map(({ id, icon }) => ({
    value: id,
    icon,
    label: <span className="hidden lg:inline">{t(id)}</span>
  }))

  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as TrainerRotationMode)} className="ms-auto">
      <AnimatedTabsList items={items} activeValue={value} layoutId="trainer-rotation-mode-indicator" fitted />
    </Tabs>
  )
}
