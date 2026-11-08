import { Appearance } from '@nexustimer/cubelet'
import { cube, cubeStickering, type CubeState } from '@nexustimer/cubelet/nxn'

const U = 0
const R = 1
const F = 2
const D = 3
const B = 5

const at = (size: number, face: number, row: number, col: number) => face * size * size + row * size + col

const appearanceAt = (state: CubeState, preset: string, position: number, lastLayer: 'U' | 'D' = 'U') =>
  cubeStickering(state.size, preset, { lastLayer })!.appearanceOf(state.stickerAt(position))

const solved = (size: number) => cube(size).solved()

describe('cubeStickering', () => {
  it('returns null for presets it does not know', () => {
    expect(cubeStickering(3, 'Void Cube')).toBeNull()
  })

  it('reuses one stickering per size, preset and last layer', () => {
    expect(cubeStickering(3, 'OLL')).toBe(cubeStickering(3, 'OLL'))
    expect(cubeStickering(3, 'OLL')).not.toBe(cubeStickering(3, 'OLL', { lastLayer: 'D' }))
  })

  it('OLL keeps the last-layer face, hides its side stickers and dims the rest', () => {
    const state = solved(3)
    expect(appearanceAt(state, 'OLL', at(3, U, 0, 0))).toBe(Appearance.Regular)
    expect(appearanceAt(state, 'OLL', at(3, U, 1, 1))).toBe(Appearance.Regular)
    expect(appearanceAt(state, 'OLL', at(3, F, 0, 1))).toBe(Appearance.Ignored)
    expect(appearanceAt(state, 'OLL', at(3, F, 1, 1))).toBe(Appearance.Dim)
    expect(appearanceAt(state, 'OLL', at(3, D, 1, 1))).toBe(Appearance.Dim)
  })

  it('OLL on the D layer marks the yellow pieces instead', () => {
    const state = solved(3)
    expect(appearanceAt(state, 'OLL', at(3, D, 0, 0), 'D')).toBe(Appearance.Regular)
    expect(appearanceAt(state, 'OLL', at(3, F, 2, 1), 'D')).toBe(Appearance.Ignored)
    expect(appearanceAt(state, 'OLL', at(3, U, 0, 0), 'D')).toBe(Appearance.Dim)
  })

  it('OLL-F2L marks the last layer like OLL and keeps the whole F2L in color', () => {
    const state = solved(3)
    expect(appearanceAt(state, 'OLL-F2L', at(3, U, 1, 1))).toBe(Appearance.Regular)
    expect(appearanceAt(state, 'OLL-F2L', at(3, U, 0, 0))).toBe(Appearance.Regular)
    expect(appearanceAt(state, 'OLL-F2L', at(3, F, 0, 1))).toBe(Appearance.Ignored)
    for (const row of [1, 2]) {
      for (const col of [0, 1, 2]) expect(appearanceAt(state, 'OLL-F2L', at(3, F, row, col))).toBe(Appearance.Regular)
    }
    expect(appearanceAt(state, 'OLL-F2L', at(3, D, 1, 1))).toBe(Appearance.Regular)
  })

  it('OLL-F2L on the D layer marks the yellow pieces and keeps the white half in color', () => {
    const state = solved(3)
    expect(appearanceAt(state, 'OLL-F2L', at(3, D, 0, 0), 'D')).toBe(Appearance.Regular)
    expect(appearanceAt(state, 'OLL-F2L', at(3, F, 2, 1), 'D')).toBe(Appearance.Ignored)
    expect(appearanceAt(state, 'OLL-F2L', at(3, F, 0, 1), 'D')).toBe(Appearance.Regular)
    expect(appearanceAt(state, 'OLL-F2L', at(3, U, 1, 1), 'D')).toBe(Appearance.Regular)
  })

  it('PLL shows the whole last layer and dims the rest', () => {
    const state = solved(3)
    expect(appearanceAt(state, 'PLL', at(3, F, 0, 2))).toBe(Appearance.Regular)
    expect(appearanceAt(state, 'PLL', at(3, F, 1, 2))).toBe(Appearance.Dim)
  })

  it('F2L hides the last layer', () => {
    const state = solved(3)
    expect(appearanceAt(state, 'F2L', at(3, U, 1, 1))).toBe(Appearance.Ignored)
    expect(appearanceAt(state, 'F2L', at(3, R, 1, 0))).toBe(Appearance.Regular)
  })

  it('L2E keeps only the UF and UB edges', () => {
    const state = solved(5)
    for (const col of [1, 2, 3]) {
      expect(appearanceAt(state, 'L2E', at(5, U, 4, col))).toBe(Appearance.Regular)
      expect(appearanceAt(state, 'L2E', at(5, U, 0, col))).toBe(Appearance.Regular)
      expect(appearanceAt(state, 'L2E', at(5, F, 0, col))).toBe(Appearance.Regular)
    }
    expect(appearanceAt(state, 'L2E', at(5, U, 0, 0))).toBe(Appearance.Ignored)
    expect(appearanceAt(state, 'L2E', at(5, U, 2, 4))).toBe(Appearance.Ignored)
    expect(appearanceAt(state, 'L2E', at(5, U, 2, 2))).toBe(Appearance.Ignored)
  })

  it('centers-only hides every corner and edge', () => {
    const state = solved(4)
    expect(appearanceAt(state, 'centers-only', at(4, F, 1, 2))).toBe(Appearance.Regular)
    expect(appearanceAt(state, 'centers-only', at(4, F, 0, 1))).toBe(Appearance.Ignored)
  })

  it('follows each piece when moves carry it elsewhere', () => {
    const state = solved(3).apply(cube(3).compile('R'))
    expect(appearanceAt(state, 'OLL', at(3, U, 1, 2))).toBe(Appearance.Dim)
    expect(appearanceAt(state, 'OLL', at(3, U, 0, 2))).toBe(Appearance.Ignored)
    expect(appearanceAt(state, 'OLL', at(3, B, 1, 0))).toBe(Appearance.Regular)
  })
})
