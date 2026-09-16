const MAX_BIG_EMOJI = 3

const EMOJI_ONLY =
  /^(?:\p{Extended_Pictographic}(?:\p{Emoji_Modifier}|️|‍\p{Extended_Pictographic}️?)*|\p{Regional_Indicator}{2})+$/u

const EMOJI_UNIT =
  /\p{Extended_Pictographic}(?:\p{Emoji_Modifier}|️|‍\p{Extended_Pictographic}️?)*|\p{Regional_Indicator}{2}/gu

export function isBigEmoji(text: string): boolean {
  const compact = text.replace(/\s+/g, '')
  if (!compact || !EMOJI_ONLY.test(compact)) return false
  return (compact.match(EMOJI_UNIT)?.length ?? 0) <= MAX_BIG_EMOJI
}

export function isSingleEmoji(text: string): boolean {
  if (!EMOJI_ONLY.test(text)) return false
  return (text.match(EMOJI_UNIT)?.length ?? 0) === 1
}

export type MessagePart = { type: 'text'; value: string } | { type: 'link'; value: string; href: string }

const URL_PATTERN = /\bhttps?:\/\/[^\s<>"']+[^\s<>"'.,;:!?)\]}]/gi

export function splitLinks(text: string): MessagePart[] {
  const parts: MessagePart[] = []
  let cursor = 0

  for (const match of text.matchAll(URL_PATTERN)) {
    const start = match.index
    if (start > cursor) parts.push({ type: 'text', value: text.slice(cursor, start) })
    parts.push({ type: 'link', value: match[0], href: match[0] })
    cursor = start + match[0].length
  }

  if (cursor < text.length) parts.push({ type: 'text', value: text.slice(cursor) })
  return parts
}
