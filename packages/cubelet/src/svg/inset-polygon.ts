import type { Point } from '../geometry/triangle-grid'

const signedArea = (points: readonly Point[]): number => {
  let sum = 0
  for (let i = 0; i < points.length; i++) {
    const p = points[i]!
    const q = points[(i + 1) % points.length]!
    sum += p[0]! * q[1]! - q[0]! * p[1]!
  }
  return sum / 2
}

export function insetPolygon(points: readonly Point[], gap: number): number[] {
  const inward = Math.sign(signedArea(points))
  const lines = points.map((p, i) => {
    const q = points[(i + 1) % points.length]!
    const dx = q[0]! - p[0]!
    const dy = q[1]! - p[1]!
    const length = Math.hypot(dx, dy)
    const nx = (-dy / length) * inward
    const ny = (dx / length) * inward
    return { x: p[0]! + nx * gap, y: p[1]! + ny * gap, dx, dy }
  })
  return lines.flatMap((current, i) => {
    const previous = lines[(i + lines.length - 1) % lines.length]!
    const denominator = previous.dx * current.dy - previous.dy * current.dx
    const t = ((current.x - previous.x) * current.dy - (current.y - previous.y) * current.dx) / denominator
    return [previous.x + previous.dx * t, previous.y + previous.dy * t]
  })
}
