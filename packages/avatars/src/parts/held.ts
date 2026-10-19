import type { NexiHeldItem } from '@nexustimer/contracts'
import { f, INK, pt, STICKER, starPath, type Point, type StickerKey } from '../svg'

type HeldPart = { draw?: () => string; scale?: number }

const outlined = (w = 2.4) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round"`

function miniGrid(n: number, size: number, colors: StickerKey[], rotation: number) {
  const pad = 1.8
  const gap = 1.2
  const s = (size - 2 * pad - (n - 1) * gap) / n
  let g = `<rect x="${-size / 2}" y="${-size}" width="${size}" height="${size}" rx="${size * 0.2}" fill="${INK}"/>`
  colors.forEach((key, i) => {
    g += `<rect x="${f(-size / 2 + pad + (i % n) * (s + gap))}" y="${f(-size + pad + Math.floor(i / n) * (s + gap))}" width="${f(s)}" height="${f(s)}" rx="${f(s * 0.24)}" fill="${STICKER[key]}"/>`
  })
  return `<g transform="rotate(${rotation})">${g}</g>`
}

function pyraminx() {
  const a: Point = [0, -28]
  const b: Point = [-15, -1]
  const c: Point = [15, -1]
  const mid = (p: Point, q: Point): Point => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]
  const ab = mid(a, b)
  const ac = mid(a, c)
  const bc = mid(b, c)
  const sticker = (p: Point, q: Point, r: Point, key: StickerKey) => {
    const cx = (p[0] + q[0] + r[0]) / 3
    const cy = (p[1] + q[1] + r[1]) / 3
    const shrink = (v: Point): Point => [cx + (v[0] - cx) * 0.8, cy + (v[1] - cy) * 0.8]
    return `<path d="M${pt(shrink(p))}L${pt(shrink(q))}L${pt(shrink(r))}Z" fill="${STICKER[key]}" stroke="${STICKER[key]}" stroke-width="1" stroke-linejoin="round"/>`
  }
  return (
    `<path d="M${pt(a)}L${pt(b)}L${pt(c)}Z" fill="${INK}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>` +
    sticker(a, ab, ac, 'y') +
    sticker(ab, b, bc, 'r') +
    sticker(ac, bc, c, 'b') +
    sticker(ab, bc, ac, 'g')
  )
}

function megaminx() {
  const at = (k: number, r: number): Point => [
    r * Math.sin((2 * Math.PI * k) / 5),
    -13 + -r * Math.cos((2 * Math.PI * k) / 5)
  ]
  const outer = [0, 1, 2, 3, 4].map((k) => at(k, 14))
  const inner = [0, 1, 2, 3, 4].map((k) => at(k, 6))
  let d = `M${inner.map(pt).join('L')}Z`
  inner.forEach((v, k) => {
    d += `M${pt(v)}L${pt(outer[k] as Point)}`
  })
  return (
    `<path d="M${outer.map(pt).join('L')}Z" fill="${STICKER.g}" ${outlined(2.6)}/>` +
    `<path d="${d}" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>`
  )
}

export const HELD: Record<NexiHeldItem, HeldPart> = {
  none: {},
  cube: { draw: () => miniGrid(3, 24, ['r', 'w', 'b', 'y', 'g', 'o', 'b', 'r', 'y'], -14) },
  pocket: { draw: () => miniGrid(2, 19, ['w', 'r', 'g', 'y'], -10) },
  pyraminx: { draw: pyraminx },
  megaminx: { draw: megaminx },
  stackmat: {
    scale: 1.15,
    draw: () =>
      `<rect x="-17" y="-13" width="34" height="13" rx="4" fill="#2b2d36" ${outlined(2.4)}/>` +
      `<rect x="-7.5" y="-11" width="15" height="6.6" rx="1.4" fill="#b9f0a8"/>` +
      `<path d="M-5 -9.6V-6.2M-2.4 -9.6H-0.4V-6.2H-2.4M1.4 -9.6H3.6V-7.9H1.4V-6.2H3.6" fill="none" stroke="#1f3b1f" stroke-width="1"/>` +
      `<ellipse cx="-12" cy="-4" rx="4" ry="2.2" fill="${STICKER.r}"/><ellipse cx="12" cy="-4" rx="4" ry="2.2" fill="${STICKER.b}"/>`
  },
  stopwatch: {
    draw: () =>
      `<rect x="-2.6" y="-30" width="5.2" height="5" rx="1.2" fill="#b8bec8" ${outlined(1.8)}/>` +
      `<circle cx="0" cy="-13" r="12" fill="#ffffff" ${outlined(2.8)}/>` +
      `<circle cx="0" cy="-13" r="8.6" fill="none" stroke="${INK}" stroke-width="1" opacity=".25"/>` +
      `<path d="M0 -13V-21M0 -13L5 -10" stroke="${STICKER.r}" stroke-width="2" stroke-linecap="round"/>` +
      `<circle cx="0" cy="-13" r="1.6" fill="${INK}"/>`
  },
  trophy: {
    scale: 1.05,
    draw: () =>
      `<path d="M-11 -24Q-18 -24 -17 -17Q-16 -12 -9 -12M11 -24Q18 -24 17 -17Q16 -12 9 -12" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>` +
      `<path d="M-11 -29H11V-21Q11 -9 0 -9Q-11 -9 -11 -21Z" fill="${STICKER.y}" ${outlined(2.6)}/>` +
      `<rect x="-2.6" y="-10" width="5.2" height="8" fill="#e0b84a" ${outlined(1.8)}/>` +
      `<rect x="-8.5" y="-3" width="17" height="5" rx="1.5" fill="#a77b4f" ${outlined(2)}/>` +
      `<path d="M-6 -25V-19" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".55"/>`
  },
  medal: {
    scale: 1.1,
    draw: () =>
      `<path d="M-6 -27L-1 -12H3L-2 -27Z" fill="${STICKER.b}" ${outlined(1.6)}/>` +
      `<path d="M6 -27L1 -12H-3L2 -27Z" fill="${STICKER.r}" ${outlined(1.6)}/>` +
      `<circle cx="0" cy="-5" r="8.5" fill="${STICKER.y}" ${outlined(2.4)}/>` +
      starPath(0, -5, 4.6, 2, '#fff3b0', 1.4)
  },
  lube: {
    draw: () =>
      `<path d="M-1.6 -31L0 -37L1.6 -31Z" fill="${INK}"/>` +
      `<rect x="-4.5" y="-32" width="9" height="6" rx="1.5" fill="${STICKER.r}" ${outlined(1.8)}/>` +
      `<rect x="-7.5" y="-27" width="15" height="25" rx="3.5" fill="#9fd3ff" ${outlined(2.4)}/>` +
      `<rect x="-7.5" y="-20" width="15" height="7" fill="#ffffff"/>` +
      `<path d="M-4 -16.5H4" stroke="${INK}" stroke-width="1.4" stroke-linecap="round" opacity=".5"/>`
  },
  bottle: {
    draw: () =>
      `<rect x="-6.5" y="-31" width="13" height="5.5" rx="2" fill="#2b2d36" ${outlined(1.8)}/>` +
      `<rect x="-8" y="-26.5" width="16" height="26.5" rx="5" fill="#7cc4ff" ${outlined(2.4)}/>` +
      `<rect x="-8" y="-17" width="16" height="7" fill="#ffffff"/>` +
      `<path d="M-4.6 -22V-4" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".5"/>`
  },
  mic: {
    draw: () =>
      `<g transform="rotate(16)">` +
      `<rect x="-3.2" y="-15" width="6.4" height="18" rx="3.2" fill="#3a3f4c" ${outlined(1.8)}/>` +
      `<rect x="-5" y="-16.5" width="10" height="3.4" rx="1.4" fill="#b8bec8" ${outlined(1.6)}/>` +
      `<circle cx="0" cy="-23" r="8" fill="#c9ced6" ${outlined(2.4)}/>` +
      `<path d="M-5.6 -23H5.6M0 -28.6V-17.4M-4 -27L4 -19M4 -27L-4 -19" stroke="${INK}" stroke-width="1" opacity=".3"/>` +
      `</g>`
  },
  cup: {
    draw: () =>
      `<path d="M2 -27L6 -39H11" fill="none" stroke="${INK}" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="M2 -27L6 -39H11" fill="none" stroke="${STICKER.r}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="M-9 -25H9L7 0H-7Z" fill="#ffffff" ${outlined(2.4)}/>` +
      `<path d="M-8.5 -18H8.5L8 -13H-8Z" fill="#f472b6"/>` +
      `<rect x="-10.5" y="-28" width="21" height="4.5" rx="2" fill="#f472b6" ${outlined(2)}/>`
  },
  coffee: {
    draw: () =>
      `<path d="M-3 -29Q-6 -33 -3 -36M3 -29Q0 -33 3 -36" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round" opacity=".4"/>` +
      `<path d="M9 -19Q16 -19 16 -13.5Q16 -8 9 -8" fill="none" stroke="${INK}" stroke-width="2.6"/>` +
      `<rect x="-9.5" y="-24" width="19" height="21" rx="3.5" fill="#ffffff" ${outlined(2.4)}/>` +
      `<ellipse cx="0" cy="-23.6" rx="7.6" ry="1.8" fill="#6b4226"/>` +
      `<path d="M-5 -14H5" stroke="${STICKER.r}" stroke-width="3" stroke-linecap="round"/>`
  },
  gamepad: {
    scale: 1,
    draw: () =>
      `<path d="M-15 -14Q-15 -20 -9 -20H9Q15 -20 15 -14L17 -4Q17.5 1 13 1Q10 1 8 -3H-8Q-10 1 -13 1Q-17.5 1 -17 -4Z" fill="#4b5563" ${outlined(2.4)}/>` +
      `<path d="M-9.5 -13.5V-8.5M-12 -11H-7" stroke="#e5e7eb" stroke-width="2" stroke-linecap="round"/>` +
      `<circle cx="8" cy="-13" r="1.8" fill="${STICKER.r}"/><circle cx="11.5" cy="-9.5" r="1.8" fill="${STICKER.b}"/>`
  }
}

export function drawHeld(item: HeldPart) {
  if (!item.draw) return ''
  const scale = item.scale ?? 1.2
  return (
    `<g transform="translate(99 99) rotate(-6) scale(${scale})">` +
    `<ellipse cx="0" cy="1.5" rx="11" ry="2.8" fill="#000" opacity=".22"/>` +
    item.draw() +
    `</g>`
  )
}
