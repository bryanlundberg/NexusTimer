import { applyYellowOrientation, yellowOrientationSetupAlg } from '@/shared/lib/algorithms/vizConfig'

// `applyYellowOrientation` is generic over the config it patches, so the keys it
// adds are not on the input type.
const viz = (config: Record<string, unknown>): Record<string, unknown> => applyYellowOrientation(config)

describe('applyYellowOrientation', () => {
  // The thumbnail has to show the case the algorithm solves, and the image must
  // not depend on where cubing.js parks the playhead: with the moves left in
  // `alg` and any setup alg present, the player sits on the setup state and
  // every thumbnail renders solved.
  it('shows the inverted case as a setup alg with nothing left to animate', () => {
    const config = viz({ puzzle: '3x3x3', alg: "R U R' U'", experimentalStickering: 'OLL' })

    expect(config.experimentalSetupAlg).toBe("z2 U R U' R'")
    expect(config.alg).toBe('')
  })

  it('keeps the D-layer stickering mask', () => {
    const config = viz({ puzzle: '3x3x3', alg: "R U R' U'", experimentalStickering: 'PLL' })

    expect(config).toHaveProperty('experimentalStickeringMaskOrbits')
  })

  it('orients 2x2 through 4x4 and leaves the other puzzles unrotated', () => {
    for (const puzzle of ['2x2x2', '3x3x3', '4x4x4']) {
      expect(viz({ puzzle, alg: "R U R'" }).experimentalSetupAlg).toBe("z2 R U' R'")
      expect(yellowOrientationSetupAlg(puzzle)).toBe('z2')
    }

    for (const puzzle of ['5x5x5', 'pyraminx']) {
      expect(viz({ puzzle, alg: "R U R'" }).experimentalSetupAlg).toBe("R U' R'")
      expect(yellowOrientationSetupAlg(puzzle)).toBe('')
    }
  })

  it('inverts Square-1 tuples without losing their parentheses', () => {
    const config = viz({ puzzle: 'square1', alg: '/ (3,0) / (-1,1)' })

    expect(config.experimentalSetupAlg).toBe('(1, -1) / (-3, 0) /')
    expect(config).not.toHaveProperty('experimentalStickeringMaskOrbits')
    expect(yellowOrientationSetupAlg('sq1')).toBe('')
  })

  it('leaves a case it cannot parse untouched instead of throwing', () => {
    const input = { puzzle: 'square1', alg: '1,0 / -1,0' }

    expect(viz(input)).toEqual(input)
  })
})
