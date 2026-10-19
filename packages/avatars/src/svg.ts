export type Point = readonly [number, number]

export const INK = '#22252b'
export const NEXI_INK = '#15152c'
export const STICKER = { r: '#e0453e', o: '#f07f24', y: '#f5c518', g: '#3fa34d', b: '#2f6fd0', w: '#f7f7f5' } as const
export type StickerKey = keyof typeof STICKER

export const f = (n: number) => +n.toFixed(2)
export const pt = (p: Point) => `${f(p[0])} ${f(p[1])}`
export const lerp = (p: Point, q: Point, t: number): Point => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]

export const line = (d: string, w = 4.5, extra = '') =>
  `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`

export function starPath(x: number, y: number, outer: number, inner: number, fill: string, strokeWidth: number) {
  const points: string[] = []
  for (let k = 0; k < 10; k++) {
    const radius = k % 2 ? inner : outer
    const angle = (Math.PI * k) / 5
    points.push(`${f(x + radius * Math.sin(angle))} ${f(y - radius * Math.cos(angle))}`)
  }
  return `<path d="M${points.join('L')}Z" fill="${fill}" stroke="${INK}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>`
}

export const sparkle = (x: number, y: number, r: number) =>
  `<path d="M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z" fill="${STICKER.y}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`
