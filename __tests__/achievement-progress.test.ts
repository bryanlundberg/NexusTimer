import { describe, expect, it } from 'vitest'
import { Cube } from '@/entities/cube/model/types'
import { resolveBadges, BadgeFamily } from '@/entities/achievement/model/resolve-badges'
import { toRoman } from '@/entities/achievement/lib/roman'
import { makeCube } from './fixtures/cube'
import { makeSolve } from './fixtures/solve'
import { makeUser } from './fixtures/user'

function familyFor(id: string, cubes: Cube[]): BadgeFamily {
  const family = resolveBadges({ user: makeUser(), cubes }).families.find((f) => f.id === id)
  if (!family) throw new Error(`no family ${id}`)
  return family
}

const emptyCubes = (n: number) => Array.from({ length: n }, () => makeCube())
const cubeAt = (ms: number) => [makeCube({ allSolves: [makeSolve({ time: ms, startTime: Date.now() })] })]

const bulkSolves = (count: number) =>
  Array.from({ length: count }, (_, i) => makeSolve({ id: `s-${i}`, time: 15_000, startTime: Date.now() }))

describe('toRoman', () => {
  it('converts the tier levels a ladder will realistically reach', () => {
    expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(toRoman)).toEqual([
      'I',
      'II',
      'III',
      'IV',
      'V',
      'VI',
      'VII',
      'VIII',
      'IX',
      'X'
    ])
  })

  it('handles subtractive notation past ten', () => {
    expect(toRoman(14)).toBe('XIV')
    expect(toRoman(40)).toBe('XL')
    expect(toRoman(90)).toBe('XC')
  })

  it('returns an empty string rather than throwing on non-levels', () => {
    expect(toRoman(0)).toBe('')
    expect(toRoman(-3)).toBe('')
    expect(toRoman(Infinity)).toBe('')
    expect(toRoman(NaN)).toBe('')
  })
})

describe('badge progress', () => {
  describe('counting metrics', () => {
    it('measures from zero on the first rung', () => {
      expect(familyFor('cube-collection', []).progress).toEqual({ ratio: 0, label: '0 / 1 cubes' })
      expect(familyFor('cube-collection', emptyCubes(4)).progress).toEqual({ ratio: 0.5, label: '4 / 5 cubes' })
    })

    it('restarts at zero on each new rung instead of tracking the whole ladder', () => {
      // 25 of 50 cubes is well up the ladder but the very start of tier VI.
      expect(familyFor('cube-collection', emptyCubes(25)).progress).toEqual({ ratio: 0, label: '25 / 50 cubes' })
      expect(familyFor('cube-collection', emptyCubes(30)).progress).toEqual({ ratio: 0.2, label: '30 / 50 cubes' })
    })

    it('stops reporting progress once the ladder is topped out', () => {
      expect(familyFor('cube-collection', emptyCubes(120)).progress).toBeUndefined()
    })

    it('groups digits with a fixed locale so SSR and hydration agree', () => {
      const cubes = [makeCube({ allSolves: bulkSolves(1_200) })]
      expect(familyFor('career-solves', cubes).progress?.label).toBe('1,200 / 5,000 solves')
    })
  })

  describe('time metrics', () => {
    it('reads as a target rather than a bar, having no honest origin', () => {
      const family = familyFor('speed-3x3', cubeAt(9_500))
      expect(family.progress?.ratio).toBeUndefined()
      expect(family.progress?.label).toBe('9.50s -> 8.00s')
    })

    it('renders an absent best time without printing Infinity', () => {
      expect(familyFor('speed-3x3', []).progress?.label).toBe('-- -> 120.00s')
    })

    it('stops reporting progress at the top of the ladder', () => {
      expect(familyFor('speed-3x3', cubeAt(5_500)).progress).toBeUndefined()
    })
  })

  describe('non-tiered families', () => {
    it('never reports progress', () => {
      expect(familyFor('new-year-solve', []).progress).toBeUndefined()
      expect(familyFor('bug-hunter', []).progress).toBeUndefined()
    })
  })
})
