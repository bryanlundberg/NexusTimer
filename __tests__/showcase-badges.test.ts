import { describe, expect, it } from 'vitest'
import type { BadgeFamily } from '@/entities/achievement/model/resolve-badges'
import { pickShowcaseBadges } from '@/entities/achievement/model/showcase-badges'

function family(id: string, level: number, maxLevel: number, color?: string): BadgeFamily {
  return {
    id,
    title: id,
    description: '',
    icon: `${id}.svg`,
    color,
    type: maxLevel > 1 ? 'tiered' : color ? 'granted' : 'computed',
    unlocked: level > 0,
    level,
    maxLevel,
    tiers: []
  }
}

const ids = (families: BadgeFamily[]) => families.map((f) => f.id)

describe('pickShowcaseBadges', () => {
  it('puts colored badges first in config order, then the highest levels', () => {
    const families = [
      family('sponsor', 1, 1, 'pink'),
      family('speed', 3, 10),
      family('contributor', 1, 1, 'green'),
      family('streak', 7, 7),
      family('collector', 5, 7)
    ]

    expect(ids(pickShowcaseBadges(families, 10))).toEqual(['sponsor', 'contributor', 'streak', 'collector', 'speed'])
  })

  it('breaks level ties by how close the family is to maxed out', () => {
    const families = [family('long', 4, 10), family('short', 4, 4), family('mid', 4, 7)]

    expect(ids(pickShowcaseBadges(families, 10))).toEqual(['short', 'mid', 'long'])
  })

  it('keeps config order when level and completion match', () => {
    const families = [family('a', 2, 4), family('b', 2, 4), family('c', 2, 4)]

    expect(ids(pickShowcaseBadges(families, 10))).toEqual(['a', 'b', 'c'])
  })

  it('skips locked families and respects the limit', () => {
    const families = [
      family('locked-special', 0, 1, 'red'),
      family('locked', 0, 7),
      family('special', 1, 1, 'blue'),
      family('high', 6, 7),
      family('low', 1, 7)
    ]

    expect(ids(pickShowcaseBadges(families, 2))).toEqual(['special', 'high'])
  })

  it('does not reorder the input', () => {
    const families = [family('low', 1, 4), family('high', 4, 4)]

    pickShowcaseBadges(families, 10)

    expect(ids(families)).toEqual(['low', 'high'])
  })
})
