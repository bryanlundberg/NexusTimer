import { CUBE_CATEGORIES, type CubeCategory } from '@/shared/const/cube-categories'
import formatTime from '@/shared/lib/formatTime'
import type { Solve } from '@/entities/solve/model/types'
import { MAX_MESSAGE_LENGTH } from '@/entities/chat/model/types'

export interface SolveCardData {
  puzzle: CubeCategory
  time: number
  scramble: string
  moves?: string
  date?: number
  plus2: boolean
  dnf: boolean
}

/** `[solve;puzzle:3x3;time:9043;scramble:R U' D F;moves:R U;date:1789000000000;plus2;dnf]` */
export const SOLVE_CARD_PATTERN = /\[solve;([^\]\n]*)\]/g

const MAX_TIME_MS = 24 * 60 * 60 * 1000
const MAX_SCRAMBLE_LENGTH = 1000
const DIGITS = /^\d+$/

const clean = (value: string) =>
  value
    .replace(/[;:[\]\n\r]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

export function encodeSolveCard(data: SolveCardData): string {
  const build = (withMoves: boolean) => {
    const fields = [`puzzle:${clean(data.puzzle)}`, `time:${Math.round(data.time)}`, `scramble:${clean(data.scramble)}`]
    const moves = data.moves && clean(data.moves)
    if (withMoves && moves) fields.push(`moves:${moves}`)
    if (data.date) fields.push(`date:${Math.round(data.date)}`)
    if (data.plus2) fields.push('plus2')
    if (data.dnf) fields.push('dnf')
    return `[solve;${fields.join(';')}]`
  }

  const card = build(true)
  return card.length <= MAX_MESSAGE_LENGTH ? card : build(false)
}

export function solveCardFromSolve(solve: Solve, puzzle: CubeCategory): string {
  return encodeSolveCard({
    puzzle,
    time: solve.time,
    scramble: solve.scramble,
    moves: solve.replay?.moves.map((move) => move.m).join(' '),
    date: solve.endTime,
    plus2: solve.plus2,
    dnf: solve.dnf
  })
}

export function decodeSolveCard(body: string): SolveCardData | null {
  const fields = new Map<string, string>()
  for (const field of body.split(';')) {
    const colon = field.indexOf(':')
    if (colon === -1) fields.set(field.trim(), '')
    else fields.set(field.slice(0, colon).trim(), field.slice(colon + 1).trim())
  }

  const puzzle = fields.get('puzzle')
  const time = fields.get('time')
  const scramble = fields.get('scramble')
  const date = fields.get('date')
  const moves = fields.get('moves')

  if (!puzzle || !(CUBE_CATEGORIES as readonly string[]).includes(puzzle)) return null
  if (!time || !DIGITS.test(time) || Number(time) > MAX_TIME_MS) return null
  if (!scramble || scramble.length > MAX_SCRAMBLE_LENGTH) return null
  if (date !== undefined && !DIGITS.test(date)) return null

  return {
    puzzle: puzzle as CubeCategory,
    time: Number(time),
    scramble,
    moves: moves || undefined,
    date: date ? Number(date) : undefined,
    plus2: fields.has('plus2'),
    dnf: fields.has('dnf')
  }
}

export function formatSolveCardTime({ time, plus2, dnf }: Pick<SolveCardData, 'time' | 'plus2' | 'dnf'>): string {
  if (dnf) return 'DNF'
  return `${formatTime(time)}${plus2 ? '+' : ''}`
}
