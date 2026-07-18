'use client'

import { Nexi, NexiGridBackdrop } from '@/shared/ui/nexi'

interface StatisticsMessageProps {
  title: string
  description: string
}

/**
 * Centered Nexi message used for the stats empty states
 * (no cube selected, or a selected cube without solves).
 */
export default function StatisticsMessage({ title, description }: StatisticsMessageProps) {
  return (
    <div className="flex grow flex-col items-center justify-center px-2 py-12 text-center">
      <div className="relative grid size-36 shrink-0 place-items-center" aria-hidden="true">
        <NexiGridBackdrop />
        <div className="absolute inset-7 rounded-full bg-primary/10 blur-2xl" />
        <div className="absolute inset-11 rounded-full bg-primary/15 blur-xl" />
        <Nexi state="think" size={120} aria-label={title} />
      </div>

      <h2 className="mt-1 text-lg font-semibold tracking-tight text-balance text-foreground">{title}</h2>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-pretty text-muted-foreground">{description}</p>
    </div>
  )
}
