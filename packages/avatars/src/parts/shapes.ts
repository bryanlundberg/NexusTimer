import type { NexiShape } from '@nexustimer/contracts'
import type { RenderContext } from '../context'
import { f, lerp, NEXI_INK, pt, type Point } from '../svg'

export type Anchors = {
  cx: number
  eyeY: number
  eyeDx: number
  mouthY: number
  top: number
  topW: number
  hatX: number
  sideL: number
  sideR: number
  bottom: number
}

export type Palette = { light: string; l1: string; base: string; d1: string; dark: string; fx: string }

type Specular = { cx: number; cy: number; rx: number; ry: number; rot: number }

type ShapePart = {
  outline: (radius: number) => string
  seams?: string
  grid?: boolean
  rim?: boolean
  spec: Specular
  faceTransform?: string
  anchors: Anchors
}

export const FACE_ANCHORS: Anchors = {
  cx: 64,
  eyeY: 66.5,
  eyeDx: 12.8,
  mouthY: 79,
  top: 32,
  topW: 74,
  hatX: 64,
  sideL: 27,
  sideR: 101,
  bottom: 106
}

const BODY = { x: 27, y: 32, s: 74 }
const EM = BODY.s / 0.78
const CORNER = 12

function roundedPolygon(points: readonly Point[], radius: number) {
  const n = points.length
  const toward = (from: Point, to: Point, dist: number): Point => {
    const dx = to[0] - from[0]
    const dy = to[1] - from[1]
    const len = Math.hypot(dx, dy)
    return [from[0] + (dx / len) * dist, from[1] + (dy / len) * dist]
  }
  let d = ''
  points.forEach((cur, i) => {
    const prev = points[(i + n - 1) % n] as Point
    const next = points[(i + 1) % n] as Point
    d += `${i ? 'L' : 'M'}${pt(toward(cur, prev, radius))}Q${pt(cur)} ${pt(toward(cur, next, radius))}`
  })
  return d + 'Z'
}

const SQUARE: Point[] = [
  [27, 32],
  [101, 32],
  [101, 106],
  [27, 106]
]
const pentagon = (radius: number): Point[] =>
  [0, 1, 2, 3, 4].map((k) => [
    64 + radius * Math.sin((2 * Math.PI * k) / 5),
    70 - radius * Math.cos((2 * Math.PI * k) / 5)
  ])
const PENTA = pentagon(46)
const PENTA_IN = pentagon(19.3)
const TRI: Point[] = [
  [64, 19],
  [110, 104],
  [18, 104]
]
const SQUARE_SPEC: Specular = { cx: 50.7, cy: 42.4, rx: 13.3, ry: 5.7, rot: 0 }

function square1Seams() {
  let d = ''
  for (const base of [0, 90, 180, 270])
    for (const offset of [-15, 15]) {
      const angle = ((base + offset) * Math.PI) / 180
      const t = 34 / Math.cos(Math.PI / 12)
      d += `M64 69L${f(64 + t * Math.cos(angle))} ${f(69 + t * Math.sin(angle))}`
    }
  return d
}

function megaminxSeams() {
  let d = `M${PENTA_IN.map(pt).join('L')}Z`
  PENTA_IN.forEach((inner, k) => {
    const corner = PENTA[k] as Point
    const next = PENTA[(k + 1) % 5] as Point
    const prev = PENTA[(k + 4) % 5] as Point
    d += `M${pt(inner)}L${pt(lerp(corner, next, 0.3))}M${pt(inner)}L${pt(lerp(corner, prev, 0.3))}`
  })
  return d
}

function pyraminxSeams() {
  const [a, b, c] = TRI as [Point, Point, Point]
  let d = ''
  for (const t of [1 / 3, 2 / 3]) {
    d += `M${pt(lerp(a, b, t))}L${pt(lerp(a, c, t))}`
    d += `M${pt(lerp(c, b, t))}L${pt(lerp(c, a, t))}`
    d += `M${pt(lerp(b, a, t))}L${pt(lerp(b, c, t))}`
  }
  return d
}

export const SHAPES: Record<NexiShape, ShapePart> = {
  cube: { outline: (r) => roundedPolygon(SQUARE, r), grid: true, rim: true, spec: SQUARE_SPEC, anchors: FACE_ANCHORS },
  skewb: {
    outline: (r) => roundedPolygon(SQUARE, r),
    seams: 'M64 35L98 69L64 103L30 69Z',
    rim: true,
    spec: SQUARE_SPEC,
    anchors: FACE_ANCHORS
  },
  square1: {
    outline: (r) => roundedPolygon(SQUARE, r),
    seams: square1Seams(),
    rim: true,
    spec: SQUARE_SPEC,
    anchors: FACE_ANCHORS
  },
  megaminx: {
    outline: (r) => roundedPolygon(PENTA, r * 0.8),
    seams: megaminxSeams(),
    spec: { cx: 44, cy: 48, rx: 10, ry: 4.5, rot: -36 },
    faceTransform: 'translate(0 2)',
    anchors: {
      cx: 64,
      eyeY: 68.5,
      eyeDx: 12.8,
      mouthY: 81,
      top: 30,
      topW: 50,
      hatX: 64,
      sideL: 23,
      sideR: 105,
      bottom: 107
    }
  },
  pyraminx: {
    outline: (r) => roundedPolygon(TRI, r * 0.85),
    seams: pyraminxSeams(),
    spec: { cx: 52, cy: 50, rx: 8, ry: 3.6, rot: -62 },
    faceTransform: 'translate(64 77) scale(.88) translate(-64 -69)',
    anchors: {
      cx: 64,
      eyeY: 75,
      eyeDx: 11.3,
      mouthY: 86,
      top: 24,
      topW: 44,
      hatX: 64,
      sideL: 35,
      sideR: 93,
      bottom: 104
    }
  }
}

function cubeGrid() {
  const { x, y, s } = BODY
  const inset = 0.07 * EM
  const ix = x + inset
  const iw = s - 2 * inset
  const t1 = f(ix + iw / 3)
  const t2 = f(ix + (2 * iw) / 3)
  const ty1 = f(y + inset + iw / 3)
  const ty2 = f(y + inset + (2 * iw) / 3)
  return (
    `<g opacity=".6"><path d="M${t1} ${f(y + inset)}V${f(y + s - inset)}M${t2} ${f(y + inset)}V${f(y + s - inset)}" stroke="#fff" stroke-opacity=".14" stroke-width="1.3"/>` +
    `<path d="M${f(ix)} ${ty1}H${f(ix + iw)}M${f(ix)} ${ty2}H${f(ix + iw)}" stroke="#000" stroke-opacity=".16" stroke-width="1.3"/></g>`
  )
}

export function drawBody(ctx: RenderContext, p: Palette, shape: ShapePart) {
  ctx.defs.push(
    `<radialGradient id="${ctx.id('nb')}" cx=".3" cy=".22" r="1.2"><stop offset="0" stop-color="${p.light}"/><stop offset=".34" stop-color="${p.l1}"/><stop offset=".52" stop-color="${p.base}"/><stop offset=".76" stop-color="${p.d1}"/><stop offset="1" stop-color="${p.dark}"/></radialGradient>`,
    `<linearGradient id="${ctx.id('ni')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".34"/><stop offset=".09" stop-color="#fff" stop-opacity="0"/><stop offset=".84" stop-color="#1e1e50" stop-opacity="0"/><stop offset="1" stop-color="#1e1e50" stop-opacity=".42"/></linearGradient>`,
    `<radialGradient id="${ctx.id('ns')}"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>`
  )
  const { x, y, s } = BODY
  const d = shape.outline(CORNER)
  const seams = shape.grid
    ? cubeGrid()
    : `<path d="${shape.seams}" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>`
  const sp = shape.spec
  const rim = shape.rim
    ? `<path d="M${x + CORNER} ${y + 2.6}H${x + s - CORNER}" stroke="#fff" stroke-opacity=".35" stroke-width="1.6" stroke-linecap="round"/>`
    : ''
  return (
    `<path d="${d}" fill="url(#${ctx.id('nb')})"/>` +
    `<path d="${d}" fill="url(#${ctx.id('ni')})"/>` +
    seams +
    `<ellipse cx="${sp.cx}" cy="${sp.cy}" rx="${sp.rx}" ry="${sp.ry}"${sp.rot ? ` transform="rotate(${sp.rot} ${sp.cx} ${sp.cy})"` : ''} fill="url(#${ctx.id('ns')})"/>` +
    `<path d="${d}" fill="none" stroke="${NEXI_INK}" stroke-width="3.4" stroke-linejoin="round"/>` +
    rim
  )
}
