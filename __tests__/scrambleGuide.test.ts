import {
  formatMove,
  guideFromState,
  initGuideState,
  invertMove,
  isComplete,
  isRotation,
  parseMove,
  stepGuide,
  tokenizeScramble,
  type ScrambleGuide
} from '@/shared/lib/timer/scrambleGuide'

const run = (scramble: string, moves: string[]) => {
  const tokens = tokenizeScramble(scramble)
  let state = initGuideState()
  for (const token of moves) {
    const parsed = parseMove(token)
    if (parsed) state = stepGuide(tokens, state, parsed)
  }
  return { guide: guideFromState(tokens, state), complete: isComplete(tokens, state) }
}

const moves = (guide: ScrambleGuide['pending']) => guide.map((item) => item.move)
const pending = (scramble: string, applied: string[]) => moves(run(scramble, applied).guide.pending)
const corrections = (scramble: string, applied: string[]) => moves(run(scramble, applied).guide.corrections)

describe('scrambleGuide parsing', () => {
  it('parses faces, half turns and primes', () => {
    expect(parseMove('R')).toEqual({ family: 'R', amount: 1 })
    expect(parseMove('U2')).toEqual({ family: 'U', amount: 2 })
    expect(parseMove("F'")).toEqual({ family: 'F', amount: 3 })
    expect(parseMove('Rw')).toEqual({ family: 'Rw', amount: 1 })
  })

  it('rejects junk tokens', () => {
    expect(parseMove('2')).toBeNull()
    expect(parseMove('')).toBeNull()
  })

  it('detects rotations', () => {
    expect(isRotation('x')).toBe(true)
    expect(isRotation("y'")).toBe(true)
    expect(isRotation('R')).toBe(false)
  })

  it('inverts and formats', () => {
    expect(formatMove(invertMove(parseMove('R')!))).toBe("R'")
    expect(formatMove(invertMove(parseMove("R'")!))).toBe('R')
    expect(formatMove(invertMove(parseMove('R2')!))).toBe('R2')
  })
})

describe('progressive scramble', () => {
  it('shows the full scramble before any move', () => {
    expect(pending('R U F', [])).toEqual(['R', 'U', 'F'])
    expect(corrections('R U F', [])).toEqual([])
  })

  it('drops moves as they are correctly applied', () => {
    expect(pending('R U F', ['R'])).toEqual(['U', 'F'])
    expect(pending('R U F', ['R', 'U'])).toEqual(['F'])
  })

  it('marks the scramble complete', () => {
    const { guide, complete } = run('R U F', ['R', 'U', 'F'])
    expect(complete).toBe(true)
    expect(moves(guide.pending)).toEqual([])
    expect(moves(guide.corrections)).toEqual([])
  })

  it('treats half turns done as two quarters as in-progress, not a mistake', () => {
    const mid = run('R U2 F', ['R', 'U'])
    expect(moves(mid.guide.corrections)).toEqual([])
    expect(moves(mid.guide.pending)).toEqual(['U', 'F'])

    const done = run('R U2 F', ['R', 'U', 'U'])
    expect(moves(done.guide.corrections)).toEqual([])
    expect(moves(done.guide.pending)).toEqual(['F'])
  })

  it('completes a half turn applied in the prime direction', () => {
    expect(pending('U2 F', ["U'"])).toEqual(["U'", 'F'])
    expect(pending('U2 F', ["U'", "U'"])).toEqual(['F'])
  })
})

describe('corrections', () => {
  it('shows the correction for a wrong face before the real scramble', () => {
    expect(corrections('R U F', ['R', 'D'])).toEqual(["D'"])
    expect(pending('R U F', ['R', 'D'])).toEqual(['U', 'F'])
  })

  it('does not merge a correction with the pending move of the same face', () => {
    expect(corrections('U F', ["U'"])).toEqual(['U'])
    expect(pending('U F', ["U'"])).toEqual(['U', 'F'])
  })

  it('undoes multiple wrong moves last-first', () => {
    expect(corrections('R U F', ['R', 'D', 'L'])).toEqual(["L'", "D'"])
    expect(pending('R U F', ['R', 'D', 'L'])).toEqual(['U', 'F'])
  })

  it('clears the correction once the user undoes the mistake', () => {
    expect(corrections('R U F', ['R', 'D', "D'"])).toEqual([])
    expect(pending('R U F', ['R', 'D', "D'"])).toEqual(['U', 'F'])
  })

  // Regression: a committed move must not merge with a later same-face mistake.
  it('does not lose a committed move when the same face is turned again by mistake', () => {
    expect(corrections('U F', ['U', 'U'])).toEqual(["U'"])
    expect(pending('U F', ['U', 'U'])).toEqual(['F'])
  })

  it('treats an extra turn after a finished half turn as a mistake', () => {
    expect(corrections('U2 F', ['U', 'U', 'U'])).toEqual(["U'"])
    expect(pending('U2 F', ['U', 'U', 'U'])).toEqual(['F'])
  })

  it('keeps the mid-turn progress under a correction and restores it after', () => {
    expect(corrections('U2 F', ['U', 'D'])).toEqual(["D'"])
    expect(pending('U2 F', ['U', 'D'])).toEqual(['U', 'F'])
    expect(pending('U2 F', ['U', 'D', "D'"])).toEqual(['U', 'F'])
  })
})
