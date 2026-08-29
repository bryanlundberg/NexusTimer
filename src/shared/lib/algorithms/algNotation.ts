import { Alg } from '@rednaxela101/cubing/alg'

/**
 * Square-1 moves are `(x,y)` tuples separated by `/`, so their parentheses are
 * part of the notation and cubing.js refuses to parse the alg without them. NxN
 * algorithms only use parentheses to group moves for readability, which is why
 * those are stripped before parsing.
 */
const SQUARE1_MOVE = /\(\s*-?\d+\s*,\s*-?\d+\s*\)/

export const isSquare1Alg = (moves: string): boolean => SQUARE1_MOVE.test(moves)

export const invertAlgorithm = (moves: string): string => {
  const normalized = isSquare1Alg(moves) ? moves : moves.replace(/[()]/g, '')
  return new Alg(normalized.replace(/\s+/g, ' ').trim()).invert().toString()
}
