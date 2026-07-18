import type { Solve } from '@/entities/solve/model/types'
import type { ReplayMove } from '@/entities/replay/model/types'
import { tryAnalyzeSolution } from '@/shared/lib/tryAnalyzeSolution'
import { buildPhases, type PhaseInfo } from '@/shared/lib/timer/solveAnalysis'

/** A gap between two consecutive moves longer than this counts as a pause. */
export const PAUSE_THRESHOLD_MS = 500

/** Analytics are bounded to the most recent N smart solves to cap analysis cost. */
export const SMART_SOLVES_WINDOW = 30

export interface SmartSolvePoint {
  id: string
  index: number
  total: number
  tps: number
  moveCount: number
  pausedMs: number
  method: string
  phaseDurations: Record<string, number>
}

export interface PhaseMeta {
  key: string
  label: string
  bgClass: string
  textClass: string
  color: string
}

const PHASE_COLORS: Record<string, string> = {
  cross: '#0ea5e9', // sky-500
  f2l: '#10b981', // emerald-500
  oll: '#fbbf24', // amber-400
  pll: '#f43f5e', // rose-500
  firstBlock: '#0ea5e9',
  secondBlock: '#6366f1', // indigo-500
  cmll: '#fbbf24',
  lse: '#f43f5e'
}

const FALLBACK_PHASE_COLOR = '#64748b' // slate-500

export interface SmartCubeStats {
  count: number
  avgTps: number
  avgMoves: number
  avgPauses: number
  avgPausedMs: number
  method: string | null
  phases: PhaseMeta[]
  phaseAverages: Array<PhaseMeta & { avg: number }>
  series: SmartSolvePoint[]
}

const EMPTY_STATS: SmartCubeStats = {
  count: 0,
  avgTps: 0,
  avgMoves: 0,
  avgPauses: 0,
  avgPausedMs: 0,
  method: null,
  phases: [],
  phaseAverages: [],
  series: []
}

/** Sum and count of inter-move gaps longer than the pause threshold. */
function pauseStats(moves: ReplayMove[]): { ms: number; count: number } {
  let ms = 0
  let count = 0
  for (let i = 1; i < moves.length; i++) {
    const gap = moves[i].t - moves[i - 1].t
    if (gap > PAUSE_THRESHOLD_MS) {
      ms += gap
      count += 1
    }
  }
  return { ms, count }
}

function isSmartSolve(solve: Solve): boolean {
  return !solve.isDeleted && !solve.dnf && (solve.replay?.moves?.length ?? 0) > 1
}

function chronological(a: Solve, b: Solve): number {
  return (a.endTime ?? a.startTime) - (b.endTime ?? b.startTime)
}

function mean(values: number[]): number {
  if (!values.length) return 0
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

/**
 * Builds the smart-cube analytics from a cube's raw solves.
 * Only solves carrying replay move data are considered, bounded to the most
 * recent `SMART_SOLVES_WINDOW` solves. Phase-based figures use the dominant
 * method so averages/series stay comparable across solves.
 */
export function computeSmartCubeStats(solves: Solve[] | undefined): SmartCubeStats {
  if (!solves?.length) return EMPTY_STATS

  // Dedup by id (session and all can overlap), keep smart solves, most recent window.
  const unique = new Map<string, Solve>()
  for (const solve of solves) {
    if (isSmartSolve(solve)) unique.set(solve.id, solve)
  }
  const smart = Array.from(unique.values()).sort(chronological).slice(-SMART_SOLVES_WINDOW)
  if (!smart.length) return EMPTY_STATS

  interface Analyzed {
    solve: Solve
    method: string
    total: number
    tps: number
    moveCount: number
    pausedMs: number
    pauseCount: number
    phases: PhaseInfo[] | null
  }

  const analyzed: Analyzed[] = []
  const methodCounts = new Map<string, number>()

  for (const solve of smart) {
    const moves = solve.replay!.moves
    const analysis = tryAnalyzeSolution(moves)
    if (!analysis) continue
    const method = analysis.method ?? 'unknown'
    methodCounts.set(method, (methodCounts.get(method) ?? 0) + 1)
    const pauses = pauseStats(moves)
    analyzed.push({
      solve,
      method,
      total: analysis.total ?? solve.time,
      tps: analysis.tps ?? 0,
      moveCount: (analysis.moves as ReplayMove[] | undefined)?.length ?? moves.length,
      pausedMs: pauses.ms,
      pauseCount: pauses.count,
      phases: buildPhases(analysis)
    })
  }

  if (!analyzed.length) return EMPTY_STATS

  // Dominant method = most frequent (ties resolved toward a known method).
  let method: string | null = null
  let best = -1
  for (const [name, count] of Array.from(methodCounts.entries())) {
    if (count > best || (count === best && method === 'unknown')) {
      best = count
      method = name
    }
  }

  const avgTps = mean(analyzed.filter((a) => a.tps > 0).map((a) => a.tps))
  const avgMoves = mean(analyzed.map((a) => a.moveCount))
  const avgPauses = mean(analyzed.map((a) => a.pauseCount))
  const avgPausedMs = mean(analyzed.map((a) => a.pausedMs))

  // Phase-based figures use only the dominant-method solves that resolved phases.
  const withPhases = analyzed.filter((a) => a.method === method && a.phases)
  const template = withPhases[0]?.phases ?? []
  const phases: PhaseMeta[] = template.map((p) => ({
    key: p.key,
    label: p.label,
    bgClass: p.bgClass,
    textClass: p.textClass,
    color: PHASE_COLORS[p.key] ?? FALLBACK_PHASE_COLOR
  }))

  const phaseAverages = phases.map((meta) => {
    const durations = withPhases
      .map((a) => a.phases!.find((p) => p.key === meta.key)?.duration)
      .filter((d): d is number => typeof d === 'number')
    return { ...meta, avg: mean(durations) }
  })

  const series: SmartSolvePoint[] = withPhases.map((a, i) => {
    const phaseDurations: Record<string, number> = {}
    for (const p of a.phases!) phaseDurations[p.key] = p.duration
    return {
      id: a.solve.id,
      index: i + 1,
      total: a.total,
      tps: a.tps,
      moveCount: a.moveCount,
      pausedMs: a.pausedMs,
      method: a.method,
      phaseDurations
    }
  })

  return {
    count: analyzed.length,
    avgTps,
    avgMoves,
    avgPauses,
    avgPausedMs,
    method,
    phases,
    phaseAverages,
    series
  }
}
