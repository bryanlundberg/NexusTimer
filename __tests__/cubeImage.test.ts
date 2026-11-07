import { applyYellowOrientation } from '@/shared/lib/algorithms/vizConfig'
import { NEXUS_CUBE_PALETTE } from '@/shared/lib/puzzle/nexusCubePalette'
import { cubeSizeOf, renderCubeImage } from '@/shared/lib/puzzle/renderCubeImage'
import { twistyConfigToCubeImage } from '@/shared/lib/twisty/twistyConfigToCubeImage'

const caseConfig = (overrides: Record<string, unknown>) =>
  applyYellowOrientation({
    visualization: 'experimental-2D-LL',
    alg: "R U R' U'",
    experimentalStickering: 'OLL',
    ...overrides
  })

describe('cubeSizeOf', () => {
  it.each([
    ['2x2x2', 2],
    ['7x7x7', 7],
    ['8x8x8', null],
    ['megaminx', null],
    ['3x3x4', null]
  ])('%s is %s', (puzzle, size) => {
    expect(cubeSizeOf(puzzle)).toBe(size)
  })
})

describe('twistyConfigToCubeImage', () => {
  it('reads a yellow-oriented last-layer case', () => {
    expect(twistyConfigToCubeImage(caseConfig({ puzzle: '3x3x3' }))).toEqual({
      size: 3,
      view: 'last-layer',
      alg: "z2 U R U' R'",
      stickering: 'OLL',
      lastLayer: 'D'
    })
  })

  it('keeps the U layer for puzzles that are not reoriented', () => {
    expect(twistyConfigToCubeImage(caseConfig({ puzzle: '5x5x5', experimentalStickering: 'L2E' }))).toMatchObject({
      size: 5,
      alg: "U R U' R'",
      lastLayer: 'U'
    })
  })

  it('maps the 2D view to the net', () => {
    expect(twistyConfigToCubeImage(caseConfig({ visualization: '2D' }))?.view).toBe('net')
  })

  it.each([
    ['a 3D view', { visualization: '3D' }],
    ['a puzzle that is not a cube', { puzzle: 'megaminx' }],
    ['the default view', { visualization: undefined }]
  ])('leaves %s to TwistyPlayer', (_, overrides) => {
    expect(twistyConfigToCubeImage(caseConfig(overrides))).toBeNull()
  })

  it('leaves a config that still animates an alg to TwistyPlayer', () => {
    expect(twistyConfigToCubeImage({ visualization: '2D', alg: 'R U' })).toBeNull()
  })
})

describe('renderCubeImage', () => {
  it('draws the last layer of a case', () => {
    const svg = renderCubeImage({ size: 3, alg: "z2 U R U' R'", view: 'last-layer', stickering: 'OLL', lastLayer: 'D' })
    expect(svg).toContain(NEXUS_CUBE_PALETTE.colors[3])
    expect(svg).toContain(NEXUS_CUBE_PALETTE.ignored)
    expect(svg).toContain('var(--cube-yellow')
  })

  it('returns null for a stickering it cannot draw', () => {
    expect(renderCubeImage({ size: 3, alg: '', view: 'net', stickering: 'Void Cube' })).toBeNull()
  })

  it('returns null for an alg that does not parse', () => {
    expect(renderCubeImage({ size: 3, alg: 'R U (', view: 'net' })).toBeNull()
  })
})
