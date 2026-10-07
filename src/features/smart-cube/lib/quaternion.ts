export type Quaternion = { x: number; y: number; z: number; w: number }

export const IDENTITY: Quaternion = { x: 0, y: 0, z: 0, w: 1 }

const mix = (a: Quaternion, b: Quaternion, weightA: number, weightB: number): Quaternion => ({
  x: a.x * weightA + b.x * weightB,
  y: a.y * weightA + b.y * weightB,
  z: a.z * weightA + b.z * weightB,
  w: a.w * weightA + b.w * weightB
})

export function normalize(q: Quaternion): Quaternion {
  const length = Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w)
  return length === 0 ? IDENTITY : mix(q, q, 1 / length, 0)
}

export const conjugate = (q: Quaternion): Quaternion => ({ x: -q.x, y: -q.y, z: -q.z, w: q.w })

export const multiply = (a: Quaternion, b: Quaternion): Quaternion => ({
  x: a.x * b.w + a.w * b.x + a.y * b.z - a.z * b.y,
  y: a.y * b.w + a.w * b.y + a.z * b.x - a.x * b.z,
  z: a.z * b.w + a.w * b.z + a.x * b.y - a.y * b.x,
  w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z
})

export function slerp(a: Quaternion, b: Quaternion, t: number): Quaternion {
  const dot = a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w
  const end = dot < 0 ? mix(b, b, -1, 0) : b
  const cos = Math.abs(dot)
  if (cos >= 1) return { x: a.x, y: a.y, z: a.z, w: a.w }

  const sinSquared = 1 - cos * cos
  if (sinSquared <= Number.EPSILON) return normalize(mix(a, end, 1 - t, t))

  const sin = Math.sqrt(sinSquared)
  const angle = Math.atan2(sin, cos)
  return mix(a, end, Math.sin((1 - t) * angle) / sin, Math.sin(t * angle) / sin)
}
