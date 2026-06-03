import { tryAnalyzeSolution } from '@/shared/lib/tryAnalyzeSolution'

type Analysis = ReturnType<typeof tryAnalyzeSolution>
type F2lSlot = { moveIndex: number; at: number; duration: number }

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

/** Builds the phase breakdown for any supported method, or null if unsupported. */
export function buildPhases(analysis: Analysis): PhaseInfo[] | null {
  return buildCfopPhases(analysis) ?? buildRouxPhases(analysis)
}

/** Returns null if the analysis is not Roux or is missing required phases. */
export function buildRouxPhases(analysis: Analysis): PhaseInfo[] | null {
  if (!analysis || analysis.method !== 'Roux') return null
  const { firstBlock, secondBlock, cmll, lse } = analysis
  if (!firstBlock || !secondBlock || !cmll || !lse) return null

  return [
    {
      key: 'firstBlock',
      label: 'FB',
      duration: firstBlock.duration,
      moveIndex: firstBlock.moveIndex,
      bgClass: 'bg-sky-500',
      textClass: 'text-sky-500'
    },
    {
      key: 'secondBlock',
      label: 'SB',
      duration: secondBlock.duration,
      moveIndex: secondBlock.moveIndex,
      bgClass: 'bg-indigo-500',
      textClass: 'text-indigo-500'
    },
    {
      key: 'cmll',
      label: 'CMLL',
      duration: cmll.duration,
      moveIndex: cmll.moveIndex,
      bgClass: 'bg-amber-400',
      textClass: 'text-amber-400'
    },
    {
      key: 'lse',
      label: 'LSE',
      duration: lse.duration,
      moveIndex: lse.moveIndex,
      bgClass: 'bg-rose-500',
      textClass: 'text-rose-500'
    }
  ]
}

/** Returns null if the analysis is not CFOP or is missing required phases. */
export function buildCfopPhases(analysis: Analysis): PhaseInfo[] | null {
  if (!analysis || analysis.method !== 'CFOP') return null
  const { cross, f2l, oll, pll } = analysis
  if (!cross || !oll || !pll) return null

  const f2lSlots = f2l as F2lSlot[]

  return [
    {
      key: 'cross',
      label: 'Cross',
      duration: cross.duration,
      moveIndex: cross.moveIndex,
      bgClass: 'bg-sky-500',
      textClass: 'text-sky-500'
    },
    {
      key: 'f2l',
      label: 'F2L',
      duration: f2lSlots.reduce((sum, s) => sum + s.duration, 0),
      moveIndex: f2lSlots[f2lSlots.length - 1]?.moveIndex ?? 0,
      bgClass: 'bg-emerald-500',
      textClass: 'text-emerald-500',
      slots: f2lSlots.map((s, i) => ({
        key: `f2l-${i}`,
        label: `Slot ${i + 1}`,
        duration: s.duration,
        moveIndex: s.moveIndex,
        bgClass: 'bg-emerald-500',
        textClass: 'text-emerald-500'
      }))
    },
    {
      key: 'oll',
      label: 'OLL',
      duration: oll.duration,
      moveIndex: oll.moveIndex,
      bgClass: 'bg-amber-400',
      textClass: 'text-amber-400'
    },
    {
      key: 'pll',
      label: 'PLL',
      duration: pll.duration,
      moveIndex: pll.moveIndex,
      bgClass: 'bg-rose-500',
      textClass: 'text-rose-500'
    }
  ]
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
