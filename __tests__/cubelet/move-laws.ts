import { formatAlg, invertAlg, parseAlg, type PuzzleDefinition, type PuzzleState } from '@nexustimer/cubelet'
import { randomWord, seededRandom } from './test-random'

interface MoveLaws<TState> {
  readonly tokens: readonly string[]
  readonly seed: number
  readonly sameAxis?: readonly (readonly [string, string])[]
  readonly orders?: readonly (readonly [string, number])[]
  readonly colorsOf?: (state: TState) => readonly number[]
}

const WORDS = 200
const MAX_WORD_LENGTH = 20
const MAX_ORDER = 2000

const colorCounts = (colors: readonly number[]) => {
  const counts = new Map<number, number>()
  for (const color of colors) counts.set(color, (counts.get(color) ?? 0) + 1)
  return [...counts.entries()].sort(([a], [b]) => a - b)
}

export function describeMoveLaws<TMove, TState extends PuzzleState<TMove>>(
  definition: PuzzleDefinition<TMove, TState>,
  { tokens, seed, sameAxis = [], orders = [], colorsOf }: MoveLaws<TState>
) {
  const after = (alg: string) => definition.solved().apply(definition.compile(alg)) as TState
  const isIdentity = (state: TState) => state.equals(definition.solved())
  const inverse = (alg: string) => formatAlg(invertAlg(parseAlg(alg)))
  const words = () => {
    const random = seededRandom(seed)
    return Array.from({ length: WORDS }, () => randomWord(tokens, random, 1 + Math.floor(random() * MAX_WORD_LENGTH)))
  }

  describe(`${definition.id} move laws`, () => {
    it('undoes every move with its inverse', () => {
      const broken = tokens.filter((token) => !isIdentity(after(`${token} ${inverse(token)}`)))
      expect(broken).toEqual([])
    })

    it('returns to solved after random sequences and their inverses', () => {
      const broken = words().filter(
        (word) => !isIdentity(after(word).apply(definition.compile(inverse(word))) as TState)
      )
      expect(broken).toEqual([])
    })

    it('gives the same state for the same sequence written as one or as two algs', () => {
      for (const word of words().slice(0, 50)) {
        const tokensOfWord = word.split(' ')
        const half = Math.floor(tokensOfWord.length / 2)
        const split = after(tokensOfWord.slice(0, half).join(' ')).apply(
          definition.compile(tokensOfWord.slice(half).join(' '))
        )
        expect([word, split.key()]).toEqual([word, after(word).key()])
      }
    })

    if (sameAxis.length > 0) {
      it.each(sameAxis)('commutes %s with %s, which turn around the same axis', (a, b) => {
        expect(after(`${a} ${b}`).key()).toBe(after(`${b} ${a}`).key())
      })
    }

    if (orders.length > 0) {
      it.each(orders)('repeats %s %i times before it is solved again', (alg, expected) => {
        const moves = definition.compile(alg)
        let state = definition.solved().apply(moves) as TState
        let count = 1
        while (!isIdentity(state) && count < MAX_ORDER) {
          state = state.apply(moves) as TState
          count++
        }
        expect(count).toBe(expected)
      })
    }

    if (colorsOf) {
      it('keeps the number of stickers of each color', () => {
        const solved = colorCounts(colorsOf(definition.solved() as TState))
        for (const word of words()) expect([word, colorCounts(colorsOf(after(word)))]).toEqual([word, solved])
      })
    }
  })
}

export const faceletColors = (state: { readonly stickerCount: number; colorAt(position: number): number }) =>
  Array.from({ length: state.stickerCount }, (_, position) => state.colorAt(position))
