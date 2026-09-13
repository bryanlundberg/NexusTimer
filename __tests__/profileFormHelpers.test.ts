import { findMove, splitPastedTokens } from '@/shared/lib/find-move'
import { getProfileCompleteness } from '@/entities/user/model/profile-completeness'
import { toProfilePreview } from '@/features/account-form/model/types'

describe('findMove', () => {
  it.each([
    [
      ['a', 'b', 'c'],
      ['b', 'a', 'c'],
      [0, 1]
    ],
    [
      ['a', 'b', 'c'],
      ['b', 'c', 'a'],
      [0, 2]
    ],
    [
      ['a', 'b', 'c'],
      ['c', 'a', 'b'],
      [2, 0]
    ],
    [
      ['a', 'b', 'c', 'd'],
      ['a', 'c', 'b', 'd'],
      [1, 2]
    ]
  ])('%j -> %j moves %j', (before, after, expected) => {
    expect(findMove(before, after)).toEqual(expected)
  })

  it('returns null when the order is unchanged', () => {
    expect(findMove(['a', 'b'], ['a', 'b'])).toBeNull()
  })

  it('replays to the target order through a real array move', () => {
    const before = ['a', 'b', 'c', 'd', 'e']
    const after = ['a', 'd', 'b', 'c', 'e']
    const [from, to] = findMove(before, after)!
    const moved = [...before]
    moved.splice(to, 0, ...moved.splice(from, 1))
    expect(moved).toEqual(after)
  })
})

describe('splitPastedTokens', () => {
  it('splits on newlines, spaces and commas', () => {
    expect(splitPastedTokens('instagram.com/a\ntwitch.tv/b, youtube.com/@c  ')).toEqual([
      'instagram.com/a',
      'twitch.tv/b',
      'youtube.com/@c'
    ])
  })
})

describe('getProfileCompleteness', () => {
  it('counts filled fields and lists what is missing, ignoring pronoun and WCA ID', () => {
    const result = getProfileCompleteness({ bio: 'hi', pronoun: 'He', mainColors: [], links: ['https://a.com/'] })
    expect(result.done).toBe(2)
    expect(result.total).toBe(6)
    expect(result.percent).toBe(33)
    expect(result.missing.map((m) => m.key)).toEqual(['country', 'goal', 'method', 'mainColors'])
  })

  it('reaches 100 with every field set and no WCA ID', () => {
    const result = getProfileCompleteness({
      bio: 'hi',
      country: 'MX',
      goal: 'Sub-10',
      method: 'cfop',
      mainColors: ['white'] as never,
      links: ['https://a.com/']
    })
    expect(result.percent).toBe(100)
    expect(result.missing).toEqual([])
  })
})

describe('toProfilePreview', () => {
  it('drops blank and invalid links and empty strings', () => {
    expect(
      toProfilePreview({
        name: ' Mateo ',
        bio: '   ',
        country: '',
        method: 'roux',
        mainColors: ['yellow', 'white'] as never,
        links: [{ url: '' }, { url: 'twitch.tv/me' }, { url: 'nope' }]
      })
    ).toEqual({
      name: 'Mateo',
      bio: undefined,
      country: undefined,
      method: 'roux',
      mainColors: ['white', 'yellow'],
      links: ['https://twitch.tv/me']
    })
  })
})
