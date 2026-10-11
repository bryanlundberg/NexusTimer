export type NotationToken = { type: 'move'; move: string } | { type: 'group'; moves: string[] }

const SQ1_TURN = /^\(-?\d+,-?\d+\)$/

const TRIGGERS = [
  "R U R' U'",
  "U R U' R'",
  "R' F R F'",
  "F R' F' R",
  "L' U' L U",
  "U' L' U L",
  "L F' L' F",
  "F' L F L'",
  "r U R' U'",
  "U R U' r'",
  "Rw U R' U'",
  "U R U' Rw'"
].map((trigger) => trigger.split(' '))

function opensGroup(token: string): boolean {
  return token.startsWith('(') && !SQ1_TURN.test(token)
}

function explicitGroups(tokens: string[]): NotationToken[] {
  const out: NotationToken[] = []
  let group: string[] | null = null
  const add = (list: string[], move: string) => {
    if (move) list.push(move)
  }

  for (const token of tokens) {
    if (group === null && opensGroup(token)) {
      const inner = token.slice(1)
      if (inner.endsWith(')')) {
        const single: string[] = []
        add(single, inner.slice(0, -1))
        if (single.length) out.push({ type: 'group', moves: single })
      } else {
        group = []
        add(group, inner)
      }
      continue
    }

    if (group !== null) {
      if (token.endsWith(')')) {
        add(group, token.slice(0, -1))
        if (group.length) out.push({ type: 'group', moves: group })
        group = null
      } else {
        add(group, token)
      }
      continue
    }

    out.push({ type: 'move', move: token })
  }

  if (group !== null) {
    for (const move of group) out.push({ type: 'move', move })
  }

  return out
}

function triggerGroups(tokens: string[]): NotationToken[] {
  const out: NotationToken[] = []
  let i = 0
  while (i < tokens.length) {
    const trigger = TRIGGERS.find((moves) => moves.every((move, k) => tokens[i + k] === move))
    if (trigger) {
      out.push({ type: 'group', moves: tokens.slice(i, i + trigger.length) })
      i += trigger.length
    } else {
      out.push({ type: 'move', move: tokens[i] })
      i++
    }
  }
  return out
}

export function parseNotation(alg: string, { triggers = true }: { triggers?: boolean } = {}): NotationToken[] {
  const tokens = alg.trim().split(/\s+/).filter(Boolean)
  if (tokens.some(opensGroup)) return explicitGroups(tokens)
  if (triggers) return triggerGroups(tokens)
  return tokens.map((move): NotationToken => ({ type: 'move', move }))
}
