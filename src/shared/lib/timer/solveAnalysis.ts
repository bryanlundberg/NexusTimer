import type { SolveAnalysis, Stage } from 'cube-state-engine'

export type PhaseInfo = {
  key: string
  label: string
  duration: number
  moveIndex: number
  bgClass: string
  textClass: string
  slots?: PhaseInfo[]
}

export type BarSegment = {
  key: string
  bgClass: string
  pct: number
}

type PhaseSpec = {
  key: string
  label: string
  bgClass: string
  textClass: string
  /** Reported as several stages (one per F2L slot), summed into one phase with sub-slots. */
  grouped?: boolean
}

const METHOD_PHASES: Record<string, PhaseSpec[]> = {
  CFOP: [
    { key: 'cross', label: 'Cross', bgClass: 'bg-sky-500', textClass: 'text-sky-500' },
    { key: 'f2l', label: 'F2L', bgClass: 'bg-emerald-500', textClass: 'text-emerald-500', grouped: true },
    { key: 'oll', label: 'OLL', bgClass: 'bg-amber-400', textClass: 'text-amber-400' },
    { key: 'pll', label: 'PLL', bgClass: 'bg-rose-500', textClass: 'text-rose-500' }
  ],
  Roux: [
    { key: 'firstBlock', label: 'FB', bgClass: 'bg-sky-500', textClass: 'text-sky-500' },
    { key: 'secondBlock', label: 'SB', bgClass: 'bg-indigo-500', textClass: 'text-indigo-500' },
    { key: 'cmll', label: 'CMLL', bgClass: 'bg-amber-400', textClass: 'text-amber-400' },
    { key: 'lse', label: 'LSE', bgClass: 'bg-rose-500', textClass: 'text-rose-500' }
  ]
}

/** Builds the phase breakdown for any supported method, or null if unsupported. */
export function buildPhases(analysis: SolveAnalysis | null): PhaseInfo[] | null {
  if (!analysis) return null
  const specs = METHOD_PHASES[analysis.method]
  if (!specs) return null

  const byKey = new Map<string, Stage[]>()
  for (const stage of analysis.stages) {
    const group = byKey.get(stage.key)
    if (group) group.push(stage)
    else byKey.set(stage.key, [stage])
  }
  if (specs.some((spec) => !spec.grouped && !byKey.has(spec.key))) return null

  return specs.map(({ key, label, bgClass, textClass, grouped }) => {
    const stages = byKey.get(key) ?? []
    if (!grouped) {
      const [stage] = stages
      return { key, label, duration: stage.duration, moveIndex: stage.moveIndex, bgClass, textClass }
    }
    return {
      key,
      label,
      duration: stages.reduce((sum, s) => sum + s.duration, 0),
      moveIndex: stages[stages.length - 1]?.moveIndex ?? 0,
      bgClass,
      textClass,
      slots: stages.map((s, i) => ({
        key: `${key}-${i}`,
        label: `Slot ${i + 1}`,
        duration: s.duration,
        moveIndex: s.moveIndex,
        bgClass,
        textClass
      }))
    }
  })
}

export function buildBarSegments(phases: PhaseInfo[], totalMs: number): BarSegment[] {
  if (!phases.length || totalMs <= 0) return []

  const segments: Array<{ key: string; bgClass: string; duration: number }> = []
  for (const phase of phases) {
    if (phase.slots) {
      for (const slot of phase.slots) segments.push(slot)
    } else {
      segments.push(phase)
    }
  }

  const covered = segments.reduce((sum, s) => sum + s.duration, 0)
  if (totalMs - covered > 0)
    segments.push({ key: 'rest', bgClass: 'bg-muted-foreground/20', duration: totalMs - covered })

  return segments.map((s) => ({ key: s.key, bgClass: s.bgClass, pct: (s.duration / totalMs) * 100 }))
}
