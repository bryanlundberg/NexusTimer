import {
  decodeSolveCard,
  formatSolveCardTime,
  SOLVE_CARD_PATTERN,
  type SolveCardData
} from '@/entities/chat/lib/solve-card'

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

export type MessageNode =
  | { type: 'text'; value: string }
  | { type: 'link'; value: string; href: string }
  | { type: 'code'; value: string }
  | { type: 'solve'; data: SolveCardData }
  | { type: 'bold' | 'italic' | 'strike'; children: MessageNode[] }

type StyleType = 'bold' | 'italic' | 'strike'
type Atom = { start: number; end: number; node: MessageNode }

// A trailing marker is formatting wrapped around the link, not part of it
const URL_PATTERN = /\bhttps?:\/\/[^\s<>"']+[^\s<>"'.,;:!?)\]}*~`_]/gi

// Doubles come first so ** is never read as two italic markers
const MARKERS: [string, StyleType][] = [
  ['**', 'bold'],
  ['~~', 'strike'],
  ['*', 'italic'],
  ['_', 'italic'],
  ['~', 'strike']
]

const MAX_DEPTH = 3
const WORD_CHAR = /[\p{L}\p{N}]/u
const SPACE = /\s/

const isWordChar = (char: string | undefined) => !!char && WORD_CHAR.test(char)
const isSpace = (char: string | undefined) => !char || SPACE.test(char)

// Cards and links are never split by a style marker
export function parseMessage(text: string): MessageNode[] {
  const atoms: Atom[] = []

  for (const match of text.matchAll(SOLVE_CARD_PATTERN)) {
    const data = decodeSolveCard(match[1])
    if (data) atoms.push({ start: match.index, end: match.index + match[0].length, node: { type: 'solve', data } })
  }

  for (const match of text.matchAll(URL_PATTERN)) {
    const start = match.index
    const end = start + match[0].length
    if (atoms.some((atom) => start < atom.end && end > atom.start)) continue
    atoms.push({ start, end, node: { type: 'link', value: match[0], href: match[0] } })
  }

  return parseRange(text, 0, text.length, atoms, 0)
}

function parseRange(text: string, start: number, end: number, atoms: Atom[], depth: number): MessageNode[] {
  const nodes: MessageNode[] = []
  let buffer = ''
  const flush = () => {
    if (buffer) nodes.push({ type: 'text', value: buffer })
    buffer = ''
  }

  let i = start
  outer: while (i < end) {
    const atom = atoms.find((range) => range.start === i)
    if (atom) {
      flush()
      nodes.push(atom.node)
      i = atom.end
      continue
    }

    if (text[i] === '`') {
      const close = text.indexOf('`', i + 1)
      const value = text.slice(i + 1, close)
      if (close !== -1 && close < end && value.trim() && !value.includes('\n')) {
        flush()
        nodes.push({ type: 'code', value })
        i = close + 1
        continue
      }
    }

    if (depth < MAX_DEPTH) {
      for (const [marker, type] of MARKERS) {
        if (!canOpen(text, i, marker, end)) continue
        const close = findClose(text, i, marker, end, atoms)
        if (close === -1) continue
        flush()
        nodes.push({ type, children: parseRange(text, i + marker.length, close, atoms, depth + 1) })
        i = close + marker.length
        continue outer
      }
    }

    buffer += text[i]
    i++
  }

  flush()
  return nodes
}

function canOpen(text: string, i: number, marker: string, end: number): boolean {
  if (!text.startsWith(marker, i)) return false
  const next = text[i + marker.length]
  if (i + marker.length >= end || isSpace(next)) return false
  // Single markers need a word boundary, so snake_case and 2*3*4 stay as typed
  if (marker.length === 1) return next !== marker && text[i - 1] !== marker && !isWordChar(text[i - 1])
  return true
}

function findClose(text: string, open: number, marker: string, end: number, atoms: Atom[]): number {
  const from = open + marker.length
  let j = text.indexOf(marker, from + 1)

  while (j !== -1 && j + marker.length <= end) {
    if (text.slice(from, j).includes('\n')) return -1

    const atom = atoms.find((range) => j >= range.start && j < range.end)
    if (atom) {
      j = text.indexOf(marker, atom.end)
      continue
    }

    const single = marker.length === 1
    const partOfDouble = single && (text[j + 1] === marker || text[j - 1] === marker)
    if (partOfDouble) {
      j = text.indexOf(marker, j + 2)
      continue
    }

    if (!isSpace(text[j - 1]) && !(single && isWordChar(text[j + 1]))) return j
    j = text.indexOf(marker, j + 1)
  }

  return -1
}

export function toPlainText(nodes: MessageNode[]): string {
  return nodes
    .map((node) => {
      if (node.type === 'solve') return `Solve ${node.data.puzzle} · ${formatSolveCardTime(node.data)}`
      return 'children' in node ? toPlainText(node.children) : node.value
    })
    .join('')
}
