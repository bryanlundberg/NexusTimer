import type { FreePlayEvent } from '@nexustimer/contracts'
import cstimer from 'cstimer_module'

/** Copied from src/shared/lib/timer/genScramble.ts so free play rooms scramble exactly like the timer. */
const CSTIMER_SCRAMBLE: Record<FreePlayEvent, { type: string; length?: number }> = {
  '2x2': { type: '222so' },
  '3x3': { type: '333' },
  '4x4': { type: '444wca' },
  '5x5': { type: '555wca', length: 60 },
  '6x6': { type: '666wca', length: 80 },
  '7x7': { type: '777wca', length: 100 },
  '3x3 OH': { type: '333' },
  Clock: { type: 'clkwca' },
  Megaminx: { type: 'mgmp', length: 70 },
  Pyraminx: { type: 'pyrso' },
  Skewb: { type: 'skbso' },
  FTO: { type: 'ftoso' },
  SQ1: { type: 'sqrs' }
}

/**
 * Random-state 4x4 and FTO take 120 to 250 ms each and block the event loop, so they are generated one per
 * request; the gateway keeps asking until its buffer is full.
 */
const SLOW_EVENTS: ReadonlySet<FreePlayEvent> = new Set(['4x4', 'FTO'])

export type ScrambleGenerator = (event: FreePlayEvent, count: number) => string[]

export const generateScrambles: ScrambleGenerator = (event, count) => {
  const { type, length = 0 } = CSTIMER_SCRAMBLE[event]
  const total = SLOW_EVENTS.has(event) ? 1 : count
  const scrambles: string[] = []
  for (let i = 0; i < total; i++) {
    const scramble = String(cstimer.getScramble(type, length) ?? '').trim()
    if (scramble) scrambles.push(scramble)
  }
  return scrambles
}
