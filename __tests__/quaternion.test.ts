import { IDENTITY, conjugate, multiply, normalize, slerp, type Quaternion } from '@/features/smart-cube/lib/quaternion'

const expectClose = (actual: Quaternion, expected: Quaternion) => {
  expect(actual.x).toBeCloseTo(expected.x, 12)
  expect(actual.y).toBeCloseTo(expected.y, 12)
  expect(actual.z).toBeCloseTo(expected.z, 12)
  expect(actual.w).toBeCloseTo(expected.w, 12)
}

const aroundZ = (angle: number): Quaternion => ({ x: 0, y: 0, z: Math.sin(angle / 2), w: Math.cos(angle / 2) })

describe('quaternion', () => {
  it('normalizes to unit length and falls back to identity for zero', () => {
    expectClose(normalize({ x: 0, y: 0, z: 3, w: 4 }), { x: 0, y: 0, z: 0.6, w: 0.8 })
    expect(normalize({ x: 0, y: 0, z: 0, w: 0 })).toEqual(IDENTITY)
  })

  it('multiplies rotations about the same axis by adding the angles', () => {
    expectClose(multiply(aroundZ(0.4), aroundZ(0.6)), aroundZ(1))
  })

  it('cancels a rotation with its conjugate', () => {
    const q = normalize({ x: 0.3, y: -0.2, z: 0.5, w: 0.7 })
    expectClose(multiply(conjugate(q), q), IDENTITY)
  })

  it('interpolates along the shortest arc', () => {
    expectClose(slerp(aroundZ(0), aroundZ(1), 0.3), aroundZ(0.3))
    const opposite = aroundZ(1)
    const negated = { x: -opposite.x, y: -opposite.y, z: -opposite.z, w: -opposite.w }
    expectClose(slerp(aroundZ(0), negated, 0.5), aroundZ(0.5))
  })

  it('returns the start when both rotations match', () => {
    const q = aroundZ(0.8)
    expectClose(slerp(q, q, 0.3), q)
  })
})
