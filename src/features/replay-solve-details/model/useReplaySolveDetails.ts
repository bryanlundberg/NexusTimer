import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { tryAnalyzeSolution } from '@/shared/lib/tryAnalyzeSolution'
import { formatTps } from '@/shared/lib/formatTps'
import formatTime from '@/shared/lib/formatTime'
import type { SolveReplay, ReplayMove } from '@/entities/replay/model/types'
import type { ReplayMarker } from '@/features/solve-replay/ui/RealtimeReplayPlayer'

type F2lSlot = { moveIndex: number; at: number; duration: number }

function buildMarkers(analysis: ReturnType<typeof tryAnalyzeSolution>): ReplayMarker[] {
  if (!analysis || analysis.method !== 'CFOP') return []
  const { cross, f2l, oll, pll } = analysis
  if (!cross || !oll || !pll) return []

  const f2lSlots = f2l as F2lSlot[]

  return [
    {
      key: 'cross',
      label: formatTime(cross.duration, 1),
      moveIndex: cross.moveIndex,
      lineClass: 'bg-sky-500',
      labelClass: 'text-sky-500'
    },
    ...f2lSlots.map((slot, i) => ({
      key: `f2l-${i}`,
      label: formatTime(slot.duration, 1),
      moveIndex: slot.moveIndex,
      lineClass: 'bg-emerald-500',
      labelClass: 'text-emerald-500'
    })),
    {
      key: 'oll',
      label: formatTime(oll.duration, 1),
      moveIndex: oll.moveIndex,
      lineClass: 'bg-amber-400',
      labelClass: 'text-amber-400'
    },
    {
      key: 'pll',
      label: formatTime(pll.duration, 1),
      moveIndex: pll.moveIndex,
      lineClass: 'bg-rose-500',
      labelClass: 'text-rose-500'
    }
  ]
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
  const markers = buildMarkers(analysis)

  return { metadata, replay, hasReplay, analysis, tps, moveCount, simplifiedSolution, markers }
}
