import { AlgParseError, expandAlg, formatAlg, formatMove, invertAlg, parseAlg } from '@nexustimer/cubelet'

const roundTrip = (alg: string) => formatAlg(parseAlg(alg))

describe('parseAlg', () => {
  it('reads face moves with amounts and primes', () => {
    expect(parseAlg("R U2 F' B2'")).toEqual([
      { kind: 'move', family: 'R', amount: 1 },
      { kind: 'move', family: 'U', amount: 2 },
      { kind: 'move', family: 'F', amount: -1 },
      { kind: 'move', family: 'B', amount: -2 }
    ])
  })

  it('reads layer prefixes and ranges', () => {
    expect(parseAlg("3Rw' 2L 2-3Uw2")).toEqual([
      { kind: 'move', family: 'Rw', amount: -1, innerLayer: 3 },
      { kind: 'move', family: 'L', amount: 1, innerLayer: 2 },
      { kind: 'move', family: 'Uw', amount: 2, innerLayer: 3, outerLayer: 2 }
    ])
  })

  it('reads multi-letter families', () => {
    expect(parseAlg("BR DR' U_SQ_3'").map((node) => node.kind === 'move' && node.family)).toEqual(['BR', 'DR', 'U_SQ_'])
  })

  it('reads groups with repetition', () => {
    expect(parseAlg("(R U)2'")).toEqual([
      {
        kind: 'group',
        amount: -2,
        nodes: [
          { kind: 'move', family: 'R', amount: 1 },
          { kind: 'move', family: 'U', amount: 1 }
        ]
      }
    ])
  })

  it('reads Square-1 tuples and slashes', () => {
    expect(parseAlg('/ (3,0) / ( -1 , 1 )')).toEqual([
      { kind: 'slash' },
      { kind: 'tuple', first: 3, second: 0 },
      { kind: 'slash' },
      { kind: 'tuple', first: -1, second: 1 }
    ])
  })

  it('returns an empty alg for blank input', () => {
    expect(parseAlg('   ')).toEqual([])
  })

  it.each(['1,0 / -1,0', '(R U', 'R U)', "R'2", 'R,', '2-R'])('rejects %s', (alg) => {
    expect(() => parseAlg(alg)).toThrow(AlgParseError)
  })

  it('returns the cached alg for the same text', () => {
    expect(parseAlg("R U R' U'")).toBe(parseAlg("R U R' U'"))
  })
})

describe('formatAlg', () => {
  it.each([
    ["R U R' U'", "R U R' U'"],
    ["  R   U2'  ", "R U2'"],
    ["(R U R' U')2", "(R U R' U')2"],
    ['/ (3,0) / (-1,1)', '/ (3, 0) / (-1, 1)'],
    ["3Rw' 2-3Lw2", "3Rw' 2-3Lw2"]
  ])('formats %s as %s', (alg, expected) => {
    expect(roundTrip(alg)).toBe(expected)
  })

  it('formats amounts the way cubing.js does', () => {
    expect(formatMove({ kind: 'move', family: 'U_SQ_', amount: 1 })).toBe('U_SQ_')
    expect(formatMove({ kind: 'move', family: 'U_SQ_', amount: -1 })).toBe("U_SQ_'")
    expect(formatMove({ kind: 'move', family: 'D_SQ_', amount: -3 })).toBe("D_SQ_3'")
  })
})

describe('invertAlg', () => {
  it.each([
    ["R U R' U'", "U R U' R'"],
    ['R2', "R2'"],
    ["(R U)2 F'", "F (U' R')2"],
    ['/ (3,0) / (-1,1)', '(1, -1) / (-3, 0) /']
  ])('inverts %s into %s', (alg, expected) => {
    expect(formatAlg(invertAlg(parseAlg(alg)))).toBe(expected)
  })
})

describe('expandAlg', () => {
  it('flattens groups and repeats them', () => {
    expect(formatAlg(expandAlg(parseAlg("F (R U)2 F'")))).toBe("F R U R U F'")
  })

  it('inverts groups with a negative amount', () => {
    expect(formatAlg(expandAlg(parseAlg("(R U)2'")))).toBe("U' R' U' R'")
  })

  it('keeps tuples and slashes as leaves', () => {
    expect(expandAlg(parseAlg('(1,0) /')).map((node) => node.kind)).toEqual(['tuple', 'slash'])
  })
})
