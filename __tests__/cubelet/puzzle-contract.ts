import { invertAlg, parseAlg, type PuzzleDefinition, type PuzzleState } from '@nexustimer/cubelet'

export function describePuzzleContract<TMove>(
  definition: PuzzleDefinition<TMove, PuzzleState<TMove>>,
  sampleAlgs: readonly string[]
) {
  describe(`${definition.id} puzzle contract`, () => {
    it('starts solved', () => {
      expect(definition.solved().isSolved()).toBe(true)
    })

    it('compiles an empty alg to no moves', () => {
      expect(definition.compile('')).toEqual([])
    })

    it.each(sampleAlgs)('returns to solved after %s and its inverse', (alg) => {
      const solved = definition.solved()
      const scrambled = solved.apply(definition.compile(alg))
      const restored = scrambled.apply(definition.compile(invertAlg(parseAlg(alg))))
      expect(restored.equals(solved)).toBe(true)
      expect(restored.key()).toBe(solved.key())
    })

    it('never mutates the state it applies to', () => {
      const solved = definition.solved()
      const before = solved.key()
      solved.apply(definition.compile(sampleAlgs[0] ?? ''))
      expect(solved.key()).toBe(before)
    })

    it('gives equal states equal keys and different states different keys', () => {
      const [first, second] = sampleAlgs
      if (!first || !second) return
      const a = definition.solved().apply(definition.compile(first))
      const b = definition.solved().apply(definition.compile(first))
      const c = definition.solved().apply(definition.compile(second))
      expect(a.equals(b)).toBe(true)
      expect(a.key()).toBe(b.key())
      expect(a.equals(c)).toBe(a.key() === c.key())
    })
  })
}
