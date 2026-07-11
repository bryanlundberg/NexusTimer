import _ from 'lodash'
import dayjs from '@/shared/lib/dayjs'
import { Alg } from 'cubing/alg'
import type { TwistyPlayer } from 'cubing/twisty'
import type { TrainerPenalty } from '@/entities/trainer-solve/model/constants'
import { applyYellowOrientation } from '@/shared/lib/algorithms/vizConfig'

export const formatMs = (ms: number): string => (ms / 1000).toFixed(2)

export const formatTime = (ms: number, penalty: TrainerPenalty): string => {
  if (penalty === 'DNF') return 'DNF'
  const base = (ms / 1000).toFixed(2)
  return penalty === '+2' ? `${base}+` : base
}

export const formatRelative = (iso: string): string => {
  const date = dayjs(iso)
  const sec = dayjs().diff(date, 'second')
  if (sec < 60) return `${sec}s`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h`
  const days = Math.floor(hr / 24)
  if (days < 7) return `${days}d`
  return date.format('L')
}

export const penaltyDotClass = (penalty: TrainerPenalty, timeMs?: number, targetMs?: number): string => {
  if (penalty === 'DNF') return 'bg-cube-red/40'
  if (timeMs != null && targetMs != null) {
    return timeMs <= targetMs ? 'bg-cube-green/80' : timeMs <= targetMs * 1.25 ? 'bg-cube-orange/80' : 'bg-cube-red/80'
  }
  return penalty === '+2' ? 'bg-cube-orange/80' : 'bg-cube-green/80'
}

export const averageOfLastN = (times: number[], n: number): number | null => {
  if (times.length < n) return null
  const window = times.slice(-n)
  return window.reduce((acc, v) => acc + v, 0) / n
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

export const invertAlgorithm = (moves: string): string =>
  new Alg(moves.replace(/[()]/g, '').replace(/\s+/g, ' ').trim()).invert().toString()

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
  applyYellowOrientation(
    _.merge({}, VIZ_BASE, overrides ?? {}, { puzzle, alg: algMoves })
  ) as unknown as Partial<TwistyPlayer>
