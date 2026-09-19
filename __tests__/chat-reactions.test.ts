import { groupReactions, QUICK_REACTIONS } from '@/entities/chat/lib/reactions'
import { isSingleEmoji } from '@/entities/chat/lib/message-content'

const ME = 'me'
const THEM = 'them'

describe('groupReactions', () => {
  it('returns nothing for an empty or missing list', () => {
    expect(groupReactions(undefined, ME)).toEqual([])
    expect(groupReactions([], ME)).toEqual([])
  })

  it('collapses the same emoji from both members into one chip', () => {
    const groups = groupReactions(
      [
        { userId: ME, emoji: '👍' },
        { userId: THEM, emoji: '👍' }
      ],
      ME
    )

    expect(groups).toEqual([{ emoji: '👍', count: 2, mine: true }])
  })

  it('marks a chip as not mine when only the other member reacted', () => {
    expect(groupReactions([{ userId: THEM, emoji: '❤️' }], ME)).toEqual([{ emoji: '❤️', count: 1, mine: false }])
  })

  it('keeps one chip per emoji, in the order they first appeared', () => {
    const groups = groupReactions(
      [
        { userId: THEM, emoji: '😂' },
        { userId: ME, emoji: '👍' },
        { userId: ME, emoji: '😂' }
      ],
      ME
    )

    expect(groups.map((group) => group.emoji)).toEqual(['😂', '👍'])
    expect(groups[0]).toEqual({ emoji: '😂', count: 2, mine: true })
  })

  it('treats every reaction as someone else when there is no signed-in id', () => {
    expect(groupReactions([{ userId: ME, emoji: '👍' }], undefined)).toEqual([{ emoji: '👍', count: 1, mine: false }])
  })
})

describe('isSingleEmoji', () => {
  it('accepts the quick reaction row', () => {
    for (const emoji of QUICK_REACTIONS) expect(isSingleEmoji(emoji)).toBe(true)
  })

  it('accepts a skin tone modifier and a ZWJ sequence as one emoji', () => {
    expect(isSingleEmoji('👍🏽')).toBe(true)
    expect(isSingleEmoji('👩‍💻')).toBe(true)
  })

  it('accepts a flag, which is a pair of regional indicators', () => {
    expect(isSingleEmoji('🇦🇷')).toBe(true)
  })

  it('rejects more than one emoji', () => {
    expect(isSingleEmoji('👍👍')).toBe(false)
    expect(isSingleEmoji('👍❤️')).toBe(false)
  })

  it('rejects text, whitespace and empty input', () => {
    expect(isSingleEmoji('')).toBe(false)
    expect(isSingleEmoji('hola')).toBe(false)
    expect(isSingleEmoji('👍 ')).toBe(false)
    expect(isSingleEmoji('a👍')).toBe(false)
  })
})
