import { NEXUS_CUBE_PALETTE } from '@/shared/lib/puzzle/nexusCubePalette'
import { cubeSizeOf, renderCubeImage } from '@/shared/lib/puzzle/renderCubeImage'

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
