import { isBigEmoji, parseMessage, toPlainText } from '@/entities/chat/lib/message-content'
import { decodeSolveCard, encodeSolveCard } from '@/entities/chat/lib/solve-card'
import { MAX_MESSAGE_LENGTH } from '@/entities/chat/model/types'

describe('isBigEmoji', () => {
  it.each(['👍', '😂😂', '🔥 🔥 🔥', '👍🏽', '👨‍👩‍👧', '❤️', '🇲🇽'])('accepts %s', (text) => {
    expect(isBigEmoji(text)).toBe(true)
  })

  it.each(['obrigado', '👍 ok', '😂😂😂😂', '', '   ', '123', '#'])('rejects %s', (text) => {
    expect(isBigEmoji(text)).toBe(false)
  })
})

describe('parseMessage links', () => {
  it('returns plain text untouched', () => {
    expect(parseMessage('hola xd')).toEqual([{ type: 'text', value: 'hola xd' }])
  })

  it('extracts links and leaves trailing punctuation out', () => {
    expect(parseMessage('mira https://nexustimer.com/people/1, y luego (https://wca.org).')).toEqual([
      { type: 'text', value: 'mira ' },
      { type: 'link', value: 'https://nexustimer.com/people/1', href: 'https://nexustimer.com/people/1' },
      { type: 'text', value: ', y luego (' },
      { type: 'link', value: 'https://wca.org', href: 'https://wca.org' },
      { type: 'text', value: ').' }
    ])
  })

  it('ignores non-http schemes', () => {
    expect(parseMessage('javascript:alert(1)')).toEqual([{ type: 'text', value: 'javascript:alert(1)' }])
  })
})

const text = (value: string) => ({ type: 'text', value })

describe('parseMessage', () => {
  it('leaves plain text alone', () => {
    expect(parseMessage('hola que tal')).toEqual([text('hola que tal')])
  })

  it('parses bold, italic, strike and code', () => {
    expect(parseMessage('**a** *b* _c_ ~~d~~ ~e~ `f`')).toEqual([
      { type: 'bold', children: [text('a')] },
      text(' '),
      { type: 'italic', children: [text('b')] },
      text(' '),
      { type: 'italic', children: [text('c')] },
      text(' '),
      { type: 'strike', children: [text('d')] },
      text(' '),
      { type: 'strike', children: [text('e')] },
      text(' '),
      { type: 'code', value: 'f' }
    ])
  })

  it('nests styles', () => {
    expect(parseMessage('**muy *bien* hecho**')).toEqual([
      {
        type: 'bold',
        children: [text('muy '), { type: 'italic', children: [text('bien')] }, text(' hecho')]
      }
    ])
  })

  it('keeps code literal', () => {
    expect(parseMessage('`**R U R**`')).toEqual([{ type: 'code', value: '**R U R**' }])
  })

  it('ignores markers inside words and math', () => {
    expect(parseMessage('snake_case_name')).toEqual([text('snake_case_name')])
    expect(parseMessage('2*3*4')).toEqual([text('2*3*4')])
  })

  it('needs text right after the opener and right before the closer', () => {
    expect(parseMessage('a * b * c')).toEqual([text('a * b * c')])
    expect(parseMessage('** a**')).toEqual([text('** a**')])
    expect(parseMessage('****')).toEqual([text('****')])
  })

  it('leaves unclosed markers as typed', () => {
    expect(parseMessage('**hola')).toEqual([text('**hola')])
    expect(parseMessage("R U R' U'")).toEqual([text("R U R' U'")])
  })

  it('does not span line breaks', () => {
    expect(parseMessage('*uno\ndos*')).toEqual([text('*uno\ndos*')])
  })

  it('keeps underscores and tildes inside links', () => {
    expect(parseMessage('_mira https://x.com/a_b~c_')).toEqual([
      {
        type: 'italic',
        children: [text('mira '), { type: 'link', value: 'https://x.com/a_b~c', href: 'https://x.com/a_b~c' }]
      }
    ])
  })

  it('styles a link wrapped in markers', () => {
    expect(parseMessage('**https://x.com**')).toEqual([
      { type: 'bold', children: [{ type: 'link', value: 'https://x.com', href: 'https://x.com' }] }
    ])
  })
})

describe('toPlainText', () => {
  it('drops the markers', () => {
    expect(toPlainText(parseMessage('**hola** _mundo_ `x` ~~y~~'))).toBe('hola mundo x y')
  })
})

describe('solve cards', () => {
  const card = {
    puzzle: '3x3' as const,
    time: 9043,
    scramble: "R U' D F",
    moves: "R U R' U'",
    date: 1789000000000,
    plus2: false,
    dnf: false
  }

  it('round-trips through the message text', () => {
    const text = encodeSolveCard(card)
    expect(text).toBe("[solve;puzzle:3x3;time:9043;scramble:R U' D F;moves:R U R' U';date:1789000000000]")
    expect(parseMessage(text)).toEqual([{ type: 'solve', data: card }])
  })

  it('keeps penalties as flags', () => {
    const text = encodeSolveCard({ ...card, moves: undefined, plus2: true })
    expect(text.endsWith(';plus2]')).toBe(true)
    expect(decodeSolveCard(text.slice(7, -1))).toMatchObject({ plus2: true, dnf: false })
  })

  it('sits among text and styles', () => {
    expect(parseMessage(`**mira** ${encodeSolveCard(card)} _xd_`)).toEqual([
      { type: 'bold', children: [text('mira')] },
      text(' '),
      { type: 'solve', data: card },
      text(' '),
      { type: 'italic', children: [text('xd')] }
    ])
  })

  it('leaves an invalid card as text', () => {
    expect(parseMessage('[solve;puzzle:9x9;time:1;scramble:R]')).toEqual([text('[solve;puzzle:9x9;time:1;scramble:R]')])
    expect(parseMessage('[solve;puzzle:3x3;time:abc;scramble:R]')).toEqual([
      text('[solve;puzzle:3x3;time:abc;scramble:R]')
    ])
    expect(parseMessage('[solve;puzzle:3x3;time:100]')).toEqual([text('[solve;puzzle:3x3;time:100]')])
  })

  it('drops the moves when the card would not fit in a message', () => {
    const text = encodeSolveCard({ ...card, moves: 'R '.repeat(1500) })
    expect(text.includes('moves:')).toBe(false)
    expect(text.length).toBeLessThanOrEqual(MAX_MESSAGE_LENGTH)
  })

  it('previews as plain text', () => {
    expect(toPlainText(parseMessage(encodeSolveCard({ ...card, plus2: true })))).toBe('Solve 3x3 · 9.04+')
    expect(toPlainText(parseMessage(encodeSolveCard({ ...card, dnf: true })))).toBe('Solve 3x3 · DNF')
  })
})
