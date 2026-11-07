import { Alg } from '@rednaxela101/cubing/alg'
import type { KPattern, KPuzzle, KTransformation } from '@rednaxela101/cubing/kpuzzle'
import { puzzles } from '@rednaxela101/cubing/puzzles'
import { ALGORITHM_SET_DEFINITIONS } from '@nexustimer/algorithms'
import { formatAlg, invertAlg, parseAlg } from '@nexustimer/cubelet'
import { cube } from '@nexustimer/cubelet/nxn'

const SIZES = [2, 3, 4, 5, 6, 7] as const
const SAMPLED_PAIRS = 3000
const COMMUTATION_PAIRS = 400

const seededRandom = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const candidateTokens = (size: number): string[] => {
  const families: string[] = ['x', 'y', 'z', 'M', 'E', 'S', 'm', 'e', 's']
  for (const face of ['U', 'R', 'F', 'D', 'L', 'B']) {
    families.push(face, `${face}w`, face.toLowerCase())
    for (let layer = 2; layer <= size; layer++)
      families.push(`${layer}${face}`, `${layer}${face}w`, `${layer}${face.toLowerCase()}`)
    for (let outer = 2; outer < size; outer++) {
      for (let inner = outer; inner <= size; inner++) families.push(`${outer}-${inner}${face}w`)
    }
  }
  return families.flatMap((family) => [family, `${family}2`, `${family}'`])
}

const patternKey = (pattern: KPattern): string =>
  JSON.stringify(
    Object.entries(pattern.patternData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([orbit, data]) => [orbit, data.pieces, orbit.includes('CENTER') ? null : data.orientation])
  )

class CubingOracle {
  readonly #transformations = new Map<string, KTransformation | null>()

  constructor(private readonly kpuzzle: KPuzzle) {}

  accepts(token: string): boolean {
    return this.#transformation(token) !== null
  }

  key(word: readonly string[]): string {
    let transformation = this.kpuzzle.identityTransformation()
    for (const token of word) transformation = transformation.applyTransformation(this.#transformation(token)!)
    return patternKey(this.kpuzzle.defaultPattern().applyTransformation(transformation))
  }

  keyOfAlg(alg: string): string | null {
    try {
      return patternKey(this.kpuzzle.defaultPattern().applyAlg(alg))
    } catch {
      return null
    }
  }

  #transformation(token: string): KTransformation | null {
    if (!this.#transformations.has(token)) {
      try {
        this.#transformations.set(token, this.kpuzzle.algToTransformation(token))
      } catch {
        this.#transformations.set(token, null)
      }
    }
    return this.#transformations.get(token)!
  }
}

interface Classified {
  readonly label: string
  readonly ours: string
  readonly theirs: string
}

const expectSamePartition = (entries: readonly Classified[]) => {
  const forward = new Map<string, Classified>()
  const backward = new Map<string, Classified>()
  const conflicts: string[] = []
  for (const entry of entries) {
    const sameOurs = forward.get(entry.ours)
    const sameTheirs = backward.get(entry.theirs)
    if (sameOurs && sameOurs.theirs !== entry.theirs) conflicts.push(`${entry.label} vs ${sameOurs.label}`)
    if (sameTheirs && sameTheirs.ours !== entry.ours) conflicts.push(`${entry.label} vs ${sameTheirs.label}`)
    forward.set(entry.ours, entry)
    backward.set(entry.theirs, entry)
  }
  expect(conflicts).toEqual([])
}

const datasetAlgs = (puzzle: string): string[] =>
  ALGORITHM_SET_DEFINITIONS.filter((set) => set.puzzle === puzzle).flatMap((set) =>
    set.algorithms.flatMap((collection) => [
      ...collection.algs.map((alg) => alg.moves),
      ...(collection.setup ? [collection.setup] : [])
    ])
  )

describe.each(SIZES)('%i-layer cube matches cubing.js', (size) => {
  const id = `${size}x${size}x${size}`
  const definition = cube(size)
  let oracle: CubingOracle
  let tokens: string[]

  beforeAll(async () => {
    oracle = new CubingOracle(await puzzles[id]!.kpuzzle())
    tokens = candidateTokens(size).filter((token) => oracle.accepts(token))
  })

  const colorKey = (alg: string) => {
    const state = definition.solved().apply(definition.compile(alg))
    return Array.from({ length: state.stickerCount }, (_, i) => state.colorAt(i)).join('')
  }
  const oursKey = (word: readonly string[]) => colorKey(word.join(' '))

  it('accepts every move cubing.js accepts', () => {
    expect(tokens.length).toBeGreaterThan(20)
    const rejected = tokens.filter((token) => {
      try {
        definition.compile(token)
        return false
      } catch {
        return true
      }
    })
    expect(rejected).toEqual([])
  })

  it('groups single moves and move pairs into the same states', () => {
    const random = seededRandom(size)
    const pick = () => tokens[Math.floor(random() * tokens.length)]!
    const words: string[][] = tokens.map((token) => [token])
    for (let i = 0; i < SAMPLED_PAIRS; i++) words.push([pick(), pick()])
    for (let i = 0; i < COMMUTATION_PAIRS; i++) {
      const a = [pick(), pick()]
      const b = [pick(), pick()]
      words.push([...a, ...b], [...b, ...a])
    }
    expectSamePartition(words.map((word) => ({ label: word.join(' '), ours: oursKey(word), theirs: oracle.key(word) })))
  })

  it('groups the shipped algorithms into the same states', () => {
    const entries = datasetAlgs(id).flatMap((alg) => {
      const theirs = oracle.keyOfAlg(alg)
      return theirs === null ? [] : [{ label: alg, ours: colorKey(alg), theirs }]
    })
    expectSamePartition(entries)
  })

  it('also applies the shipped algorithms cubing.js rejects', () => {
    const rejectedByCubing = datasetAlgs(id).filter((alg) => oracle.keyOfAlg(alg) === null)
    for (const alg of rejectedByCubing) expect(() => definition.compile(alg)).not.toThrow()
  })
})

describe('notation parity with cubing.js', () => {
  const normalize = (moves: string) =>
    (/\(\s*-?\d+\s*,\s*-?\d+\s*\)/.test(moves) ? moves : moves.replace(/[()]/g, '')).replace(/\s+/g, ' ').trim()

  const allAlgs = [...new Set(ALGORITHM_SET_DEFINITIONS.map((set) => set.puzzle))].flatMap(datasetAlgs)

  it('formats every shipped algorithm the same way', () => {
    const mismatches = allAlgs.filter((alg) => formatAlg(parseAlg(alg)) !== new Alg(alg).toString())
    expect(mismatches).toEqual([])
  })

  it('inverts every shipped algorithm the same way', () => {
    const mismatches = allAlgs
      .map(normalize)
      .filter((alg) => formatAlg(invertAlg(parseAlg(alg))) !== new Alg(alg).invert().toString())
    expect(mismatches).toEqual([])
  })
})
