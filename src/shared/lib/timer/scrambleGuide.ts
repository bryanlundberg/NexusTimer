// Guides a user applying a scramble on a smart cube. Progress is a state machine
// rather than one reduced move list so a committed correct move can never merge
// with a later mistake on the same face (e.g. a right `U`, then an accidental
// `U`). Smart cubes report single quarter turns, so half turns (X2) arrive as two
// quarters — mid-turn progress is pending, not a mistake.

export interface ScrambleMove {
  family: string
  amount: number // 1 = CW quarter, 2 = half, 3 = CCW quarter
}

export interface ScrambleGuideItem {
  key: string // stable across renders so a removed move can animate out
  move: string
}

export interface ScrambleGuide {
  // Red moves to undo mistakes. Never merged with each other or with `pending`.
  corrections: ScrambleGuideItem[]
  pending: ScrambleGuideItem[]
}

export interface GuideState {
  index: number // committed scramble moves
  acc: number // partial amount on scramble[index]
  errors: ScrambleMove[] // divergent moves to undo, last-first
}

const MOVE_RE = /^(\d*[A-Za-z]+)(2|')?$/
const ROTATION_RE = /^[xyz]$/

export function parseMove(token: string): ScrambleMove | null {
  const match = token.trim().match(MOVE_RE)
  if (!match) return null
  const family = match[1]
  const amount = match[2] === '2' ? 2 : match[2] === "'" ? 3 : 1
  return { family, amount }
}

export function isRotation(token: string): boolean {
  const parsed = parseMove(token)
  return parsed != null && ROTATION_RE.test(parsed.family)
}

export function formatMove(move: ScrambleMove): string {
  if (move.amount === 2) return `${move.family}2`
  if (move.amount === 3) return `${move.family}'`
  return move.family
}

export function invertMove(move: ScrambleMove): ScrambleMove {
  return { family: move.family, amount: (4 - move.amount) % 4 }
}

export function tokenizeScramble(scramble: string): ScrambleMove[] {
  return scramble
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(parseMove)
    .filter((move): move is ScrambleMove => move != null)
}

export function appendMove(list: ScrambleMove[], move: ScrambleMove): ScrambleMove[] {
  const next = list.slice()
  const last = next[next.length - 1]
  if (last && last.family === move.family) {
    const amount = (last.amount + move.amount) % 4
    if (amount === 0) next.pop()
    else next[next.length - 1] = { family: move.family, amount }
  } else {
    next.push(move)
  }
  return next
}

export function initGuideState(): GuideState {
  return { index: 0, acc: 0, errors: [] }
}

export function stepGuide(scramble: ScrambleMove[], state: GuideState, move: ScrambleMove): GuideState {
  // Corrections must be cleared first, so every move feeds the error stack.
  if (state.errors.length > 0) {
    return { ...state, errors: appendMove(state.errors, move) }
  }

  const target = state.index < scramble.length ? scramble[state.index] : null

  if (target && move.family === target.family) {
    // A quarter in either direction is valid progress toward a half turn.
    if (target.amount === 2) {
      const acc = (state.acc + move.amount) % 4
      if (acc === 2) return { ...state, index: state.index + 1, acc: 0 }
      return { ...state, acc }
    }
    const acc = (state.acc + move.amount) % 4
    if (acc === target.amount) return { ...state, index: state.index + 1, acc: 0 }
    if (acc === 0) return { ...state, acc: 0 }
    return { ...state, errors: appendMove(state.errors, move) }
  }

  return { ...state, errors: appendMove(state.errors, move) }
}

export function guideFromState(scramble: ScrambleMove[], state: GuideState): ScrambleGuide {
  // Key by stack position (not display order) so keys stay stable as the front
  // of the list clears.
  const corrections = state.errors.map((move, i) => ({ key: `e${i}`, move: formatMove(invertMove(move)) })).reverse()

  const pending: ScrambleGuideItem[] = []
  if (state.index < scramble.length) {
    const target = scramble[state.index]
    if (state.acc > 0) {
      const remaining = (target.amount - state.acc + 4) % 4
      if (remaining !== 0) {
        pending.push({ key: `s${state.index}`, move: formatMove({ family: target.family, amount: remaining }) })
      }
    } else {
      pending.push({ key: `s${state.index}`, move: formatMove(target) })
    }
    for (let i = state.index + 1; i < scramble.length; i++) {
      pending.push({ key: `s${i}`, move: formatMove(scramble[i]) })
    }
  }

  return { corrections, pending }
}

export function isComplete(scramble: ScrambleMove[], state: GuideState): boolean {
  return state.errors.length === 0 && state.acc === 0 && state.index >= scramble.length
}
