import _ from 'lodash'
import type { TwistyPlayer } from 'cubing/twisty'
import type { TrainerPenalty } from '@/entities/trainer-solve/model/constants'

export const formatMs = (ms: number): string => (ms / 1000).toFixed(2)

export const formatTime = (ms: number, penalty: TrainerPenalty): string => {
  if (penalty === 'DNF') return 'DNF'
  const base = (ms / 1000).toFixed(2)
  return penalty === '+2' ? `${base}+` : base
}

export const formatRelative = (iso: string): string => {
  const date = new Date(iso)
  const diff = Date.now() - date.getTime()
  const sec = Math.floor(diff / 1000)
  if (sec < 60) return `${sec}s`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h`
  const days = Math.floor(hr / 24)
  if (days < 7) return `${days}d`
  return date.toLocaleDateString()
}

export const penaltyDotClass = (penalty: TrainerPenalty): string =>
  penalty === 'DNF' ? 'bg-red-500/70' : penalty === '+2' ? 'bg-amber-500/70' : 'bg-emerald-500/70'

export const wcaAverage = (times: number[], n: number): number | null => {
  if (times.length < n) return null
  const window = times.slice(-n)
  const sorted = [...window].sort((a, b) => a - b)
  const trimmed = sorted.slice(1, -1)
  if (trimmed.length === 0) return null
  return trimmed.reduce((acc, v) => acc + v, 0) / trimmed.length
}

// Fisher-Yates shuffle; avoids starting on `exclude` index when possible.
export const shuffledRange = (total: number, exclude: number | null = null): number[] => {
  const arr = Array.from({ length: total }, (_, i) => i)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  if (exclude !== null && arr.length > 1 && arr[0] === exclude) {
    ;[arr[0], arr[1]] = [arr[1], arr[0]]
  }
  return arr
}

const VIZ_BASE = {
  visualization: 'experimental-2D-LL',
  background: 'none',
  controlPanel: 'none',
  experimentalStickering: 'OLL',
  experimentalSetupAnchor: 'end',
  experimentalDragInput: 'none'
}

export const buildVizConfig = (
  puzzle: string,
  algMoves: string,
  overrides?: Record<string, unknown>
): Partial<TwistyPlayer> =>
  _.merge({}, VIZ_BASE, overrides ?? {}, { puzzle, alg: algMoves }) as unknown as Partial<TwistyPlayer>
