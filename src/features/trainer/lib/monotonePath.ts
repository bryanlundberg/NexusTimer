export type ChartPoint = { x: number; y: number }

const sign = (value: number) => (value < 0 ? -1 : 1)

function innerTangent(previous: ChartPoint, point: ChartPoint, next: ChartPoint) {
  const h0 = point.x - previous.x
  const h1 = next.x - point.x
  const s0 = (point.y - previous.y) / h0
  const s1 = (next.y - point.y) / h1
  const p = (s0 * h1 + s1 * h0) / (h0 + h1)
  return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0
}

const edgeTangent = (from: ChartPoint, to: ChartPoint, neighbour: number) =>
  ((3 * (to.y - from.y)) / (to.x - from.x) - neighbour) / 2

export function monotonePath(points: ChartPoint[]): string {
  if (points.length === 0) return ''
  const [first] = points
  if (points.length < 3) return points.map((point, i) => `${i ? 'L' : 'M'}${point.x},${point.y}`).join('')

  const last = points.length - 1
  const tangents = points.map((point, i) =>
    i === 0 || i === last ? 0 : innerTangent(points[i - 1], point, points[i + 1])
  )
  tangents[0] = edgeTangent(points[0], points[1], tangents[1])
  tangents[last] = edgeTangent(points[last - 1], points[last], tangents[last - 1])

  let path = `M${first.x},${first.y}`
  for (let i = 0; i < last; i++) {
    const a = points[i]
    const b = points[i + 1]
    const dx = (b.x - a.x) / 3
    path += `C${a.x + dx},${a.y + dx * tangents[i]},${b.x - dx},${b.y - dx * tangents[i + 1]},${b.x},${b.y}`
  }
  return path
}
