import { describe, expect, it } from 'vitest'
import { CUBE_CATEGORIES } from '@nexustimer/contracts'
import { loadEngine, PUZZLE_BY_CATEGORY, PUZZLE_KEYS, type PuzzleKey } from '../src/node'

const FACE = "[RUFLDB]['2]?"
const WIDE = "[RUFLDB]w?['2]?"

const RULES: Record<PuzzleKey, { token: RegExp; length: [number, number] }> = {
  '222': { token: /^[RUF]['2]?$/, length: [11, 11] },
  '333': { token: new RegExp(`^${FACE}$`), length: [15, 21] },
  '333ni': { token: new RegExp(`^${WIDE}$`), length: [15, 23] },
  '444': { token: new RegExp(`^${WIDE}$`), length: [35, 50] },
  '444ni': { token: new RegExp(`^(${WIDE}|[xyz]['2]?)$`), length: [35, 52] },
  '555': { token: new RegExp(`^${WIDE}$`), length: [60, 60] },
  '666': { token: new RegExp(`^3?${WIDE}$`), length: [80, 80] },
  '777': { token: new RegExp(`^3?${WIDE}$`), length: [100, 100] },
  pyram: { token: /^[ULRBulrb]'?$/, length: [6, 15] },
  sq1: { token: /^(\(-?\d,-?\d\)|\/)$/, length: [11, 40] },
  minx: { token: /^([RD](\+\+|--)|U'?)$/, length: [77, 77] },
  clock: { token: /^((UR|DR|DL|UL|U|R|D|L|ALL)\d[+-]|y2)$/, length: [15, 15] },
  skewb: { token: /^[ULRB]'?$/, length: [7, 11] },
  fto: { token: /^(BR|BL|[RLBUDF])'?$/, length: [20, 34] }
}

describe('node engine', () => {
  const engine = loadEngine()

  it('maps every category to a puzzle', () => {
    for (const category of CUBE_CATEGORIES) {
      expect(PUZZLE_KEYS).toContain(PUZZLE_BY_CATEGORY[category])
    }
  })

  it.each(PUZZLE_KEYS)('scrambles %s with WCA notation', (key) => {
    const { token, length } = RULES[key]
    for (let i = 0; i < 3; i++) {
      const moves = engine.scramble(key).trim().split(/\s+/)
      for (const move of moves) expect(move).toMatch(token)
      expect(moves.length).toBeGreaterThanOrEqual(length[0])
      expect(moves.length).toBeLessThanOrEqual(length[1])
    }
  })

  it('returns different scrambles', () => {
    expect(engine.scramble('333')).not.toBe(engine.scramble('333'))
  })

  it('rejects unknown puzzles', () => {
    expect(() => engine.scramble('333oh' as PuzzleKey)).toThrow('unknown puzzle')
  })
})
