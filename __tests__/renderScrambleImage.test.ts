import { renderScrambleImage } from '@/shared/lib/puzzle/renderScrambleImage'

const shapeCount = (svg: string | null) => (svg?.match(/Z/g) ?? []).length

describe('renderScrambleImage', () => {
  it.each([
    ['3x3x3', "R U R' F2", 54],
    ['pyraminx', "U L' R B' u r'", 36],
    ['skewb', "R U' L B' R' U L' B", 30],
    ['megaminx', "R++ D-- R-- D++ U'", 132],
    ['fto', "R' L B' U' D F' BR' BL", 72],
    ['square1', '(1,0) / (-1,0)', 42],
    ['clock', 'UR3+ DR0+ DL5- UL1+ U2- R4+ D3+ L0+ ALL6+ y2 U1+ R2- D3+ L4- ALL5- UR DL', 18]
  ])('draws the %s net', (puzzle, scramble, shapes) => {
    expect(shapeCount(renderScrambleImage(puzzle, scramble))).toBe(shapes)
  })

  it('returns null for puzzles without a net and for scrambles that do not parse', () => {
    expect(renderScrambleImage('kilominx', 'R++ D--')).toBeNull()
    expect(renderScrambleImage('clock', 'R2')).toBeNull()
    expect(renderScrambleImage('skewb', 'F')).toBeNull()
    expect(renderScrambleImage('pyraminx', 'R(')).toBeNull()
  })
})
