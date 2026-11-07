import { applyYellowOrientation } from '@/shared/lib/algorithms/vizConfig'
import { twistyConfigToCube3d } from '@/shared/lib/twisty/twistyConfigToCube3d'
import { twistyConfigToCubeImage } from '@/shared/lib/twisty/twistyConfigToCubeImage'

const caseConfig = (overrides: Record<string, unknown>) =>
  applyYellowOrientation({
    visualization: '3D',
    alg: "U R U' R'",
    experimentalStickering: 'F2L',
    ...overrides
  })

describe('twistyConfigToCube3d', () => {
  it('reads a yellow-oriented F2L case', () => {
    expect(twistyConfigToCube3d(caseConfig({}))).toEqual({
      request: { size: 3, alg: "z2 R U R' U'", stickering: 'F2L', lastLayer: 'D' },
      dragInput: true
    })
  })

  it('turns drag off when the config disables it', () => {
    expect(twistyConfigToCube3d(caseConfig({ experimentalDragInput: 'none' }))?.dragInput).toBe(false)
  })

  it('handles bigger cubes', () => {
    expect(
      twistyConfigToCube3d(caseConfig({ puzzle: '5x5x5', experimentalStickering: 'centers-only' }))?.request
    ).toMatchObject({ size: 5, stickering: 'centers-only', lastLayer: 'U' })
  })

  it.each([
    ['a 2D view', { visualization: '2D' }],
    ['a last-layer view', { visualization: 'experimental-2D-LL' }],
    ['a puzzle that is not a cube', { puzzle: 'pyraminx' }],
    ['the default view', { visualization: undefined }]
  ])('leaves %s alone', (_, overrides) => {
    expect(twistyConfigToCube3d(caseConfig(overrides))).toBeNull()
  })

  it('never claims a config the 2D renderer takes', () => {
    const config = caseConfig({ visualization: 'experimental-2D-LL', experimentalStickering: 'OLL' })
    expect(twistyConfigToCubeImage(config)).not.toBeNull()
    expect(twistyConfigToCube3d(config)).toBeNull()
  })
})
