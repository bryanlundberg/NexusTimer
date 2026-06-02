import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { tryAnalyzeSolution } from '@/shared/lib/tryAnalyzeSolution'
import { buildCfopPhases } from '@/shared/lib/timer/solveAnalysis'
import { formatTps } from '@/shared/lib/formatTps'
import formatTime from '@/shared/lib/formatTime'
import type { SolveReplay, ReplayMove } from '@/entities/replay/model/types'
import type { ReplayMarker } from '@/features/solve-replay/ui/RealtimeReplayPlayer'

function phaseMarkers(analysis: ReturnType<typeof tryAnalyzeSolution>): ReplayMarker[] {
  const phases = buildCfopPhases(analysis)
  if (!phases) return []

  return phases.flatMap((phase) => {
    const marker: ReplayMarker = {
      key: phase.key,
      label: formatTime(phase.duration, 1),
      moveIndex: phase.moveIndex,
      lineClass: phase.bgClass,
      labelClass: phase.textClass
    }
    if (phase.slots) {
      return phase.slots.map((slot) => ({
        key: slot.key,
        label: formatTime(slot.duration, 1),
        moveIndex: slot.moveIndex,
        lineClass: slot.bgClass,
        labelClass: slot.textClass
      }))
    }
    return [marker]
  })
}

export function useReplaySolveDetails() {
  const { activeOverlay } = useOverlayStore()
  const metadata = activeOverlay?.metadata ?? null

  const replay = (metadata?.replay as SolveReplay | undefined) ?? null
  const hasReplay = Boolean(replay?.moves?.length)
  const analysis = hasReplay ? tryAnalyzeSolution(replay!.moves) : null

  const tps = analysis?.tps != null ? formatTps(analysis.tps) : null
  const moveCount = analysis ? (analysis.moves as ReplayMove[]).length : null
  const simplifiedSolution = analysis
    ? (analysis.moves as ReplayMove[]).map((x) => x.m).join(' ')
    : (metadata?.solution ?? null)
  const markers = phaseMarkers(analysis)

  return { metadata, replay, hasReplay, analysis, tps, moveCount, simplifiedSolution, markers }
}
