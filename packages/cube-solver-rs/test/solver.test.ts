import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { CubeEngine, isCrossComplete, matchesGoal, type GoalName } from 'cube-state-engine'
import { ALGORITHM_SET_DEFINITIONS } from '@nexustimer/algorithms'
import { crossHints, initSync, solveTransition } from '../pkg/cube_solver_rs.js'
import { CROSS_FACES, toCrossHints } from '../src/index'

initSync({ module: readFileSync(new URL('../pkg/cube_solver_rs_bg.wasm', import.meta.url)) })

const FACE_TURN = /^[URFDLB]['2]?$/
const CASES_PER_SET = 6
const CENTER_COLOR = { U: 'W', D: 'Y', F: 'G', B: 'B', R: 'R', L: 'O' } as const

const tokens = (alg: string) => alg.replace(/[()]/g, ' ').split(/\s+/).filter(Boolean)

const invertToken = (token: string) =>
  token.endsWith("'") ? token.slice(0, -1) : token.includes('2') ? token.replace("'", '') : `${token}'`

const invert = (alg: string) => tokens(alg).reverse().map(invertToken).join(' ')

const WIDE: Record<string, [string, string, boolean]> = {
  r: ['L', 'x', false],
  l: ['R', 'x', true],
  u: ['D', 'y', false],
  d: ['U', 'y', true],
  f: ['B', 'z', false],
  b: ['F', 'z', true]
}

const inverseSuffix = (suffix: string) => (suffix === '' ? "'" : suffix === "'" ? '' : suffix)

const toEngine = (alg: string) =>
  tokens(alg)
    .map((token) => {
      const match = /^([rludfb]|Bw)(.*)$/.exec(token)
      if (!match) return token
      const [face, rotation, inverse] = WIDE[match[1]!.charAt(0).toLowerCase()]!
      const suffix = match[2] ?? ''
      return `${face}${suffix} ${rotation}${inverse ? inverseSuffix(suffix) : suffix}`
    })
    .join(' ')

const relativeToCenters = (engine: CubeEngine) => {
  const faces = Object.entries(engine.state()) as [string, string[][]][]
  const faceOf = new Map(faces.map(([face, stickers]) => [stickers[1]![1]!, face]))
  return JSON.stringify(faces.map(([face, stickers]) => [face, stickers.map((row) => row.map((c) => faceOf.get(c)))]))
}

const engineAfter = (...algs: string[]) => {
  const engine = new CubeEngine('', { size: 3 })
  for (const alg of algs) if (alg.trim()) engine.applyMoves(alg)
  return engine
}

const isFaceTurns = (moves: string) => tokens(moves).every((token) => FACE_TURN.test(token))

describe('cross hints', () => {
  const scrambles = [
    "L2 U2 L2 D L2 F2 R2 B2 U2 L2 U' L2 F' R D2 F2 L D F L' D'",
    "D2 R B U D R L U2 F' U2 R F2 R2 B2 R' L2 D2 F2 R' F2 U2",
    "B2 U' R2 U' F2 D2 L2 D B2 R2 U L' B' R F' U2 L' D' B L2"
  ]

  it.each(scrambles)('solves the cross of every color for %s', (scramble) => {
    const hints = toCrossHints(crossHints(scramble))
    expect(hints.map((hint) => hint.face)).toEqual([...CROSS_FACES])
    for (const hint of hints) {
      const color = CENTER_COLOR[hint.face]
      expect(isFaceTurns(hint.cross)).toBe(true)
      expect(isCrossComplete(engineAfter(scramble, hint.rotation, hint.cross), { color })).toBe(true)
      for (const xcross of hint.xcross) {
        expect(tokens(xcross).length).toBeGreaterThanOrEqual(tokens(hint.cross).length)
        expect(isCrossComplete(engineAfter(scramble, hint.rotation, xcross), { color })).toBe(true)
      }
    }
  })

  it('rejects notation it does not know', () => {
    expect(() => crossHints('R U Q')).toThrow('unknown move')
  })
})

describe('trainer transitions', () => {
  const sets = ALGORITHM_SET_DEFINITIONS.filter((set) => set.puzzle === '3x3x3')

  it.each(sets.map((set) => [set.slug, set] as const))('lead %s cases to a state their algorithm solves', (_, set) => {
    const goal = set.goal as GoalName
    const step = Math.max(1, Math.floor(set.algorithms.length / CASES_PER_SET))
    const cases = set.algorithms.filter((_, index) => index % step === 0).slice(0, CASES_PER_SET)
    let previous = ''
    let checked = 0
    for (const algorithmCase of cases) {
      const alg = algorithmCase.algs[0]!.moves
      const setup = algorithmCase.setup?.trim() || invert(alg)
      if (!matchesGoal(engineAfter(toEngine(setup), toEngine(alg)), goal)) continue
      for (const history of ['', previous]) {
        const moves = solveTransition(history, setup, goal)
        expect(isFaceTurns(moves)).toBe(true)
        expect(matchesGoal(engineAfter(history, moves, toEngine(alg)), goal)).toBe(true)
      }
      previous = solveTransition('', `${setup} ${alg}`, 'full')
      checked++
    }
    expect(checked).toBeGreaterThan(0)
  })

  it('reaches the exact case for full goals, rotations included', () => {
    const setups = ["R U R' U' y", "x R' U R' D2 R U' R' D2 R2 x'", "r U R' U' M", "f R U R' U' f' z", "S R2 E' b"]
    for (const setup of setups) {
      const moves = solveTransition('', setup, 'full')
      expect(relativeToCenters(engineAfter(moves)), setup).toBe(relativeToCenters(engineAfter(toEngine(setup))))
    }
  })

  it('returns no moves when the cube already shows the case', () => {
    expect(solveTransition("R U R'", "R U R'", 'full')).toBe('')
  })
})
