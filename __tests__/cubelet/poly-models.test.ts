import type { PuzzleState } from '@nexustimer/cubelet'
import {
  BODY_COLOR,
  megaminxModel3d,
  pyraminxModel3d,
  square1Model3d,
  type PuzzleModel3d
} from '@nexustimer/cubelet/webgl/poly'
import type { GlCubePalette } from '@nexustimer/cubelet/webgl'
import { seededRandom } from './cubing-oracle-helpers'

const PALETTE: GlCubePalette = {
  colors: Array.from({ length: 12 }, (_, i) => [i, 0, 0] as const),
  dimColors: [],
  ignored: [0, 0, 0],
  body: [-1, 0, 0]
}

type Vector = [number, number, number]

const rotate = (p: Vector, k: readonly number[], angle: number): Vector => {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  const d = p[0] * k[0]! + p[1] * k[1]! + p[2] * k[2]!
  const cross: Vector = [k[1]! * p[2] - k[2]! * p[1], k[2]! * p[0] - k[0]! * p[2], k[0]! * p[1] - k[1]! * p[0]]
  return [0, 1, 2].map((i) => p[i]! * c + cross[i]! * s + k[i]! * d * (1 - c)) as Vector
}

const TOLERANCE = 1e-6

interface Placed {
  readonly point: Vector
  readonly color: number
}

const placedVertices = <TMove, TState extends PuzzleState<TMove>>(
  model: PuzzleModel3d<TMove, TState>,
  state: TState,
  move?: TMove
): Placed[] => {
  const mesh = model.mesh(state)
  const motions = move === undefined ? [] : model.motions(move)
  const placed: Placed[] = []
  for (let v = 0; v < mesh.vertexCount; v++) {
    let p: Vector = [mesh.positions[v * 3]!, mesh.positions[v * 3 + 1]!, mesh.positions[v * 3 + 2]!]
    const center = [mesh.centers[v * 3]!, mesh.centers[v * 3 + 1]!, mesh.centers[v * 3 + 2]!]
    for (const { axis, above, angle } of motions) {
      if (center[0]! * axis[0]! + center[1]! * axis[1]! + center[2]! * axis[2]! > above) p = rotate(p, axis, angle)
    }
    const ref = mesh.colorRefs[v]!
    placed.push({ point: p, color: ref === BODY_COLOR ? -1 : model.colorOf(state, ref, PALETTE)[0] })
  }
  return placed
}

const cellOf = (point: Vector, offset: readonly number[]) =>
  point.map((value, axis) => Math.floor(value / (TOLERANCE * 10)) + offset[axis]!).join(',')

const unmatched = (actual: readonly Placed[], expected: readonly Placed[]): number => {
  const buckets = new Map<string, Placed[]>()
  for (const vertex of expected) {
    const key = cellOf(vertex.point, [0, 0, 0])
    const bucket = buckets.get(key)
    if (bucket) bucket.push(vertex)
    else buckets.set(key, [vertex])
  }
  const offsets = [-1, 0, 1].flatMap((x) => [-1, 0, 1].flatMap((y) => [-1, 0, 1].map((z) => [x, y, z])))
  let missing = 0
  for (const vertex of actual) {
    const bucket = offsets
      .map((offset) => buckets.get(cellOf(vertex.point, offset)))
      .find((candidates) =>
        candidates?.some(
          (candidate) =>
            candidate.color === vertex.color &&
            Math.hypot(...candidate.point.map((value, axis) => value - vertex.point[axis]!)) < TOLERANCE
        )
      )
    if (!bucket) {
      missing++
      continue
    }
    const index = bucket.findIndex(
      (candidate) =>
        candidate.color === vertex.color &&
        Math.hypot(...candidate.point.map((value, axis) => value - vertex.point[axis]!)) < TOLERANCE
    )
    bucket.splice(index, 1)
  }
  return missing
}

const expectAnimationLandsOnNextState = <TMove, TState extends PuzzleState<TMove>>(
  model: PuzzleModel3d<TMove, TState>,
  algs: readonly string[]
) => {
  for (const alg of algs) {
    let state = model.definition.solved()
    for (const move of model.definition.compile(alg)) {
      const next = state.apply([move]) as TState
      const actual = placedVertices(model, state, move)
      const expected = placedVertices(model, next)
      expect(actual).toHaveLength(expected.length)
      expect(unmatched(actual, expected)).toBe(0)
      state = next
    }
  }
}

const randomLegalSquare1 = (random: () => number, slashes: number) => {
  const { definition } = square1Model3d
  let state = definition.solved()
  const steps: string[] = []
  for (let i = 0; i < slashes; i++) {
    const options: string[] = []
    for (let top = -5; top <= 6; top++) {
      for (let bottom = -5; bottom <= 6; bottom++) {
        if (state.apply(definition.compile(`(${top},${bottom})`)).canSlash()) options.push(`(${top},${bottom}) /`)
      }
    }
    const step = options[Math.floor(random() * options.length)]!
    steps.push(step)
    state = state.apply(definition.compile(step))
  }
  return steps.join(' ')
}

const randomAlg = (tokens: readonly string[], length: number, seed: number) => {
  const random = seededRandom(seed)
  return Array.from({ length }, () => tokens[Math.floor(random() * tokens.length)]!).join(' ')
}

describe('3D puzzle models', () => {
  it('give every pyraminx and megaminx sticker exactly one piece face', () => {
    for (const [model, stickers] of [
      [pyraminxModel3d, 36],
      [megaminxModel3d, 132]
    ] as const) {
      const mesh = model.mesh(model.definition.solved())
      const refs = new Set(Array.from(mesh.colorRefs).filter((ref) => ref !== BODY_COLOR))
      expect(refs.size).toBe(stickers)
    }
  })

  it('animate pyraminx turns onto the state they produce', () => {
    const tokens = ['U', "U'", 'L', 'R', "B'", 'u', "r'", 'Lv', "Bv'"]
    expectAnimationLandsOnNextState(pyraminxModel3d, [randomAlg(tokens, 12, 1)])
  })

  it('animate megaminx turns, rotations and Pochmann moves onto the state they produce', () => {
    const tokens = ['U', "R'", 'F2', 'BL', "DR2'", 'D', 'y', "Fv'", 'R++', 'D--']
    expectAnimationLandsOnNextState(megaminxModel3d, [randomAlg(tokens, 10, 2)])
  }, 60_000)

  it('animate square-1 turns and slashes onto the state they produce', () => {
    const random = seededRandom(3)
    expectAnimationLandsOnNextState(
      square1Model3d,
      Array.from({ length: 6 }, () => randomLegalSquare1(random, 6))
    )
  }, 120_000)
})
