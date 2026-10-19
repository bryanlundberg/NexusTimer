import type { NexiPattern } from '@nexustimer/contracts'
import { lighten, luminance, shade } from '../color'
import type { RenderContext } from '../context'
import { f, INK } from '../svg'

type Overlay = { c: string; o: number }
type PatternPart = (bg: string, ctx: RenderContext) => string

function overlay(bg: string): Overlay {
  const l = luminance(bg)
  if (l > 0.8) return { c: INK, o: 0.08 }
  return l < 0.45 ? { c: '#ffffff', o: 0.13 } : { c: '#ffffff', o: 0.36 }
}

function hex(bg: string) {
  const { c, o } = overlay(bg)
  const r = 8
  const w = r * Math.sqrt(3)
  let d = ''
  for (let row = -1; row < 12; row++)
    for (let col = -1; col < 10; col++) {
      const cx = col * w + (row % 2 ? w / 2 : 0)
      const cy = row * r * 1.5
      const points = [0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (Math.PI / 3) * i - Math.PI / 2
        return `${f(cx + r * Math.cos(angle))} ${f(cy + r * Math.sin(angle))}`
      })
      d += `M${points.join('L')}Z`
    }
  return `<path d="${d}" fill="none" stroke="${c}" stroke-opacity="${o * 1.2}" stroke-width="1.3"/>`
}

function lines(bg: string) {
  const { c, o } = overlay(bg)
  let d = ''
  for (let k = -128; k < 128; k += 9) d += `M${k} 128L${k + 128} 0`
  return `<path d="${d}" stroke="${c}" stroke-opacity="${o}" stroke-width="1.5"/>`
}

function gridlines(bg: string) {
  const { c, o } = overlay(bg)
  let d = ''
  for (let v = 8; v < 128; v += 16) d += `M${v} 0V128M0 ${v}H128`
  return `<path d="${d}" stroke="${c}" stroke-opacity="${o * 1.1}" stroke-width="1"/>`
}

function rays(bg: string) {
  const { c, o } = overlay(bg)
  let d = ''
  for (let k = 0; k < 12; k++) {
    const a0 = (k * Math.PI) / 6
    const a1 = a0 + Math.PI / 12
    d += `M64 64L${f(64 + 140 * Math.cos(a0))} ${f(64 + 140 * Math.sin(a0))}L${f(64 + 140 * Math.cos(a1))} ${f(64 + 140 * Math.sin(a1))}Z`
  }
  return `<path d="${d}" fill="${c}" fill-opacity="${o}"/>`
}

function grid(bg: string) {
  const { c, o } = overlay(bg)
  let d = ''
  for (let y = 2; y < 128; y += 21)
    for (let x = 2; x < 128; x += 21) d += `<rect x="${x}" y="${y}" width="17" height="17" rx="4"/>`
  return `<g fill="${c}" fill-opacity="${o * 0.85}">${d}</g>`
}

function stripes(bg: string) {
  const { c, o } = overlay(bg)
  let d = ''
  for (let k = -128; k < 128; k += 18) d += `M${k} 128L${k + 128} 0`
  return `<path d="${d}" stroke="${c}" stroke-opacity="${o}" stroke-width="7"/>`
}

function checker(bg: string) {
  const { c, o } = overlay(bg)
  let d = ''
  for (let y = 0; y < 128; y += 16)
    for (let x = (y / 16) % 2 ? 16 : 0; x < 128; x += 32) d += `<rect x="${x}" y="${y}" width="16" height="16"/>`
  return `<g fill="${c}" fill-opacity="${o * 0.6}">${d}</g>`
}

const CUBE_SPOTS: [number, number, number][] = [
  [16, 18, -12],
  [108, 22, 14],
  [14, 100, 10],
  [110, 104, -16],
  [64, 6, 6],
  [6, 58, 20],
  [122, 62, -8]
]

function cubes(bg: string) {
  const { c, o } = overlay(bg)
  return CUBE_SPOTS.map(([x, y, r]) => {
    const g =
      `<rect x="${x - 9}" y="${y - 9}" width="18" height="18" rx="4"/>` +
      `<path d="M${x - 3} ${y - 9}V${y + 9}M${x + 3} ${y - 9}V${y + 9}M${x - 9} ${y - 3}H${x + 9}M${x - 9} ${y + 3}H${x + 9}"/>`
    return `<g transform="rotate(${r} ${x} ${y})" fill="none" stroke="${c}" stroke-opacity="${o * 1.4}" stroke-width="2">${g}</g>`
  }).join('')
}

function gradient(bg: string, ctx: RenderContext) {
  ctx.defs.push(
    `<linearGradient id="${ctx.id('bgg')}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${lighten(bg, 0.35)}"/><stop offset="1" stop-color="${shade(bg, 0.25)}"/></linearGradient>`
  )
  return `<rect width="128" height="128" fill="url(#${ctx.id('bgg')})"/>`
}

const PATTERNS: Record<NexiPattern, PatternPart> = {
  none: () => '',
  hex,
  lines,
  gridlines,
  rays,
  grid,
  stripes,
  checker,
  cubes,
  gradient
}

export function drawBackground(ctx: RenderContext, bg: string, pattern: NexiPattern) {
  ctx.defs.push(
    `<radialGradient id="${ctx.id('bgl')}" cx=".38" cy=".3" r=".85"><stop offset="0" stop-color="#fff" stop-opacity=".26"/><stop offset=".7" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".08"/></radialGradient>`
  )
  return (
    `<rect width="128" height="128" fill="${bg}"/>` +
    PATTERNS[pattern](bg, ctx) +
    `<rect width="128" height="128" fill="url(#${ctx.id('bgl')})"/>`
  )
}
