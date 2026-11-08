import type { MoveNode } from '../notation/ast'
import type { FaceletTurnSystem } from '../puzzle/facelet-move-compiler'
import { rotationPermutation, type StickerCentroids } from './rotation-permutation'
import type { Point } from './triangle-grid'

export interface AxisMove {
  readonly axis: Point
  readonly period: number
  readonly above: number
  readonly step?: number
}

export interface AxisTurn {
  readonly family: string
  readonly turns: number
}

export interface TurnMotion {
  readonly axis: Point
  readonly above: number
  readonly angle: number
}

export interface AxisTurnSystem extends FaceletTurnSystem<AxisTurn> {
  motion(turn: AxisTurn): TurnMotion
}

const normalize = (vector: Point): Point => {
  const length = Math.hypot(...vector)
  return vector.map((value) => value / length)
}

export function axisTurnSystem(
  families: Readonly<Record<string, AxisMove>>,
  centroids: () => StickerCentroids
): AxisTurnSystem {
  const moves = new Map(
    Object.entries(families).map(([family, move]) => [family, { ...move, axis: normalize(move.axis) }])
  )

  const motionOf = (turn: AxisTurn): TurnMotion => {
    const { axis, above, period } = moves.get(turn.family)!
    return { axis, above, angle: (-turn.turns * 2 * Math.PI) / period }
  }

  return {
    resolve: (node: MoveNode) => {
      if (node.innerLayer !== undefined || node.outerLayer !== undefined) return null
      const move = moves.get(node.family)
      if (!move) return null
      const turns = (((node.amount * (move.step ?? 1)) % move.period) + move.period) % move.period
      return { family: node.family, turns: turns > move.period / 2 ? turns - move.period : turns }
    },
    key: ({ family, turns }) => `${family}:${turns}`,
    motion: (turn) => motionOf(turn),
    permutation: (turn) => ({ turn, ...rotationPermutation(centroids(), motionOf(turn)) })
  }
}
