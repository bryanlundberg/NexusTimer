import { Alg } from '@rednaxela101/cubing/alg'
import { puzzles } from '@rednaxela101/cubing/puzzles'
import { ALGORITHM_SET_DEFINITIONS } from '@nexustimer/algorithms'
import { formatAlg, invertAlg, parseAlg } from '@nexustimer/cubelet'
import { cube } from '@nexustimer/cubelet/nxn'
import { CubingOracle, datasetAlgs, expectSamePartition, seededRandom } from './cubing-oracle-helpers'

const SIZES = [2, 3, 4, 5, 6, 7] as const
const SAMPLED_PAIRS = 3000
const COMMUTATION_PAIRS = 400

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
