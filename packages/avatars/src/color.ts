type Rgb = [number, number, number]

const rgb = (hex: string): Rgb => {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

const toHex = (channels: Rgb) =>
  '#' +
  channels
    .map((c) =>
      Math.max(0, Math.min(255, Math.round(c)))
        .toString(16)
        .padStart(2, '0')
    )
    .join('')

const map = (hex: string, fn: (c: number) => number): Rgb => {
  const [r, g, b] = rgb(hex)
  return [fn(r), fn(g), fn(b)]
}

export const shade = (hex: string, t: number) => toHex(map(hex, (c) => c * (1 - t)))
export const lighten = (hex: string, t: number) => toHex(map(hex, (c) => c + (255 - c) * t))

export function luminance(hex: string) {
  const [r, g, b] = map(hex, (c) => c / 255)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function toHsl(hex: string): [h: number, s: number, l: number] {
  const [r, g, b] = map(hex, (c) => c / 255)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4
  return [h * 60, s, l]
}

function fromHsl(h: number, s: number, l: number) {
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const c = (n: number) => 255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))))
  return toHex([c(0), c(8), c(4)])
}

export function tone(hex: string, delta: number) {
  const [h, s, l] = toHsl(hex)
  return fromHsl(h, s, Math.max(0, Math.min(0.97, l + delta)))
}
