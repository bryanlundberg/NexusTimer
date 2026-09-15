import { isBigEmoji, splitLinks } from '@/entities/chat/lib/message-content'

describe('isBigEmoji', () => {
  it.each(['👍', '😂😂', '🔥 🔥 🔥', '👍🏽', '👨‍👩‍👧', '❤️', '🇲🇽'])('accepts %s', (text) => {
    expect(isBigEmoji(text)).toBe(true)
  })

  it.each(['obrigado', '👍 ok', '😂😂😂😂', '', '   ', '123', '#'])('rejects %s', (text) => {
    expect(isBigEmoji(text)).toBe(false)
  })
})

describe('splitLinks', () => {
  it('returns plain text untouched', () => {
    expect(splitLinks('hola xd')).toEqual([{ type: 'text', value: 'hola xd' }])
  })

  it('extracts links and leaves trailing punctuation out', () => {
    expect(splitLinks('mira https://nexustimer.com/people/1, y luego (https://wca.org).')).toEqual([
      { type: 'text', value: 'mira ' },
      { type: 'link', value: 'https://nexustimer.com/people/1', href: 'https://nexustimer.com/people/1' },
      { type: 'text', value: ', y luego (' },
      { type: 'link', value: 'https://wca.org', href: 'https://wca.org' },
      { type: 'text', value: ').' }
    ])
  })

  it('ignores non-http schemes', () => {
    expect(splitLinks('javascript:alert(1)')).toEqual([{ type: 'text', value: 'javascript:alert(1)' }])
  })
})
