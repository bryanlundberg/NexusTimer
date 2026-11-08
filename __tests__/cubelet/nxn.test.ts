import { UnsupportedMoveError } from '@nexustimer/cubelet'
import { cube, CubeDefinition, type CubeState } from '@nexustimer/cubelet/nxn'
import { describePuzzleContract } from './puzzle-contract'

const U = 0
const R = 1
const F = 2
const D = 3
const L = 4
const B = 5

const after = (size: number, alg: string): CubeState => cube(size).solved().apply(cube(size).compile(alg))

const faceColors = (state: CubeState, face: number): number[][] => {
  const { size } = state
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => state.colorAt(face * size * size + row * size + col))
  )
}

const columns = (state: CubeState, face: number, col: number) => faceColors(state, face).map((row) => row[col])

const order = (size: number, alg: string): number => {
  const definition = cube(size)
  const moves = definition.compile(alg)
  let state = definition.solved().apply(moves)
  let count = 1
  while (!state.equals(definition.solved())) {
    state = state.apply(moves)
    count++
  }
  return count
}

for (const size of [2, 3, 4, 5, 6, 7]) {
  describePuzzleContract(cube(size), [
    "R U R' U'",
    "x y' z2 F2 B' L D2",
    "Rw U2 Lw' Fw2 Dw Bw'",
    `${size > 2 ? '2' : ''}R ${size > 3 ? "3Rw'" : 'Rw'} (R U)3`
  ])
}

describe('cube()', () => {
  it('returns one definition per size', () => {
    expect(cube(3)).toBe(cube(3))
    expect(cube(4).id).toBe('4x4x4')
  })

  it.each([1, 21, 2.5])('rejects size %s', (size) => {
    expect(() => new CubeDefinition(size)).toThrow(RangeError)
  })
})

describe('3x3x3 face turns', () => {
  it('R brings the front column up to U', () => {
    const state = after(3, 'R')
    expect(columns(state, U, 2)).toEqual([F, F, F])
    expect(columns(state, F, 2)).toEqual([D, D, D])
    expect(columns(state, U, 0)).toEqual([U, U, U])
  })

  it('U turns the front row to the left', () => {
    expect(faceColors(after(3, 'U'), F)[0]).toEqual([R, R, R])
    expect(faceColors(after(3, "U'"), F)[0]).toEqual([L, L, L])
  })

  it('M follows L, E follows D and S follows F', () => {
    expect(columns(after(3, 'M'), U, 1)).toEqual([B, B, B])
    expect(faceColors(after(3, 'E'), F)[1]).toEqual([L, L, L])
    expect(faceColors(after(3, 'S'), U)[1]).toEqual([L, L, L])
  })

  it('x, y and z rotate the whole cube', () => {
    expect(faceColors(after(3, 'x'), U).flat()).toEqual(Array(9).fill(F))
    expect(faceColors(after(3, 'y'), F).flat()).toEqual(Array(9).fill(R))
    expect(faceColors(after(3, 'z'), U).flat()).toEqual(Array(9).fill(L))
    expect(after(3, 'x y z').isSolved()).toBe(true)
  })

  it.each([
    ['R', 4],
    ['R2', 2],
    ["R U R' U'", 6],
    ['R U', 105]
  ])('%s has order %i', (alg, expected) => {
    expect(order(3, alg)).toBe(expected)
  })
})

describe('big cube layers', () => {
  it('Rw and r turn two layers, 2R only the second', () => {
    expect(faceColors(after(4, 'Rw'), U)[0]).toEqual([U, U, F, F])
    expect(faceColors(after(4, 'r'), U)[0]).toEqual([U, U, F, F])
    expect(faceColors(after(4, '2R'), U)[0]).toEqual([U, U, F, U])
  })

  it('3Rw turns three layers and 2-3Rw only the inner two', () => {
    expect(faceColors(after(5, '3Rw'), U)[0]).toEqual([U, U, F, F, F])
    expect(faceColors(after(5, '2-3Rw'), U)[0]).toEqual([U, U, F, F, U])
  })

  it('M is the middle layer and m every inner layer', () => {
    expect(faceColors(after(5, 'M'), U)[0]).toEqual([U, U, B, U, U])
    expect(faceColors(after(5, 'm'), U)[0]).toEqual([U, B, B, B, U])
  })

  it('a two-layer wide move on 2x2x2 is a rotation', () => {
    expect(after(2, 'Rw').equals(after(2, 'x'))).toBe(true)
    expect(after(2, 'd').equals(after(2, "y'"))).toBe(true)
  })
})

describe('unsupported moves', () => {
  it.each([
    [4, 'M'],
    [4, '5R'],
    [3, '2x'],
    [3, 'Q'],
    [2, 'm'],
    [3, '/'],
    [3, '(1,0)'],
    [3, 'BR']
  ])('size %i rejects %s', (size, alg) => {
    expect(() => cube(size).compile(alg)).toThrow(UnsupportedMoveError)
  })
})
