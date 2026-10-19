import type { NexiFace } from '@nexustimer/contracts'
import { f, NEXI_INK, starPath } from '../svg'
import type { Palette } from './shapes'

type FacePart = { draw: () => string; tilt?: number; fx?: (p: Palette) => string }

const FX = { yellow: '#ffce3a', red: '#f0473f', orange: '#ff8a3c', blue: '#3b82f6', green: '#2ec27e' } as const
const TONGUE = '#ff7a95'
const DROP = '#8fcbff'

const L = 64 - 12.8
const R = 64 + 12.8
const EY = 66.5

function eye(x: number, y: number, height = 8.3, highlight = true, width = 6.4) {
  const rx = f(width * 0.8)
  const ry = f(height * 0.78)
  return (
    `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${rx}" ry="${ry}" fill="${NEXI_INK}"/>` +
    (highlight
      ? `<circle cx="${f(x - rx * 0.29)}" cy="${f(y - ry * 0.49)}" r="${f(rx * 0.32)}" fill="#fff" opacity=".92"/>`
      : '')
  )
}

const arc = (x: number, y: number) =>
  `<path d="M${f(x - 6.6)} ${f(y + 3)}Q${f(x)} ${f(y - 5.5)} ${f(x + 6.6)} ${f(y + 3)}" fill="none" stroke="${NEXI_INK}" stroke-width="3.8" stroke-linecap="round"/>`

const openMouth = (w: number, h: number, y = 76) =>
  `<path d="M${f(64 - w / 2)} ${y}H${f(64 + w / 2)}Q${f(64 + w / 2)} ${f(y + h)} 64 ${f(y + h)}Q${f(64 - w / 2)} ${f(y + h)} ${f(64 - w / 2)} ${y}Z" fill="${NEXI_INK}"/>`

const stroke = (d: string, w = 3) =>
  `<path d="${d}" fill="none" stroke="${NEXI_INK}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`

const spiral = (x: number, y: number) =>
  `<circle cx="${f(x)}" cy="${y}" r="8.6" fill="#fff" stroke="${NEXI_INK}" stroke-width="2.6"/>` +
  `<path d="M${f(x)} ${y}a1.4 1.4 0 0 1 2.8 0a2.8 2.8 0 0 1 -5.6 0a4.2 4.2 0 0 1 8.4 0a5.6 5.6 0 0 1 -11.2 0" fill="none" stroke="${NEXI_INK}" stroke-width="2" stroke-linecap="round"/>`

const halfEye = (x: number) =>
  `<path d="M${f(x - 6.4)} ${EY - 1}H${f(x + 6.4)}Q${f(x + 6.4)} ${EY + 7} ${f(x)} ${EY + 7}Q${f(x - 6.4)} ${EY + 7} ${f(x - 6.4)} ${EY - 1}Z" fill="${NEXI_INK}"/>` +
  stroke(`M${f(x - 7.6)} ${EY - 1.6}H${f(x + 7.6)}`, 3)

const lid = (x: number, y: number) =>
  `<path d="M${f(x - 5.2)} ${f(y - 1.4)}H${f(x + 5.2)}Q${f(x + 5.4)} ${f(y + 5.4)} ${f(x)} ${f(y + 5.4)}Q${f(x - 5.4)} ${f(y + 5.4)} ${f(x - 5.2)} ${f(y - 1.4)}Z" fill="${NEXI_INK}"/>` +
  `<circle cx="${f(x - 1.8)}" cy="${f(y + 0.8)}" r="1.5" fill="#fff" opacity=".9"/>`

const tear = (x: number, y: number) =>
  `<path d="M${x} ${y}Q${x + 3.5} ${y + 6} ${x} ${y + 8.5}Q${x - 3.5} ${y + 6} ${x} ${y}Z" fill="${DROP}" stroke="#4f9be8" stroke-width="1"/>`

function celebration() {
  const spark = (x: number, y: number, r: number, color: string) =>
    `<path d="M${x} ${y - r}L${f(x + r * 0.22)} ${f(y - r * 0.22)}L${x + r} ${y}L${f(x + r * 0.22)} ${f(y + r * 0.22)}L${x} ${y + r}L${f(x - r * 0.22)} ${f(y + r * 0.22)}L${x - r} ${y}L${f(x - r * 0.22)} ${f(y - r * 0.22)}Z" fill="${color}"/>`
  const bits: [number, number, string, number][] = [
    [24, 30, FX.red, 20],
    [104, 26, FX.blue, -30],
    [16, 74, FX.yellow, 45],
    [112, 70, FX.green, -15],
    [40, 16, FX.orange, 60],
    [90, 14, FX.yellow, -50]
  ]
  return (
    spark(16, 22, 6, FX.yellow) +
    spark(110, 44, 5, FX.red) +
    spark(20, 96, 4.5, FX.blue) +
    spark(106, 98, 5.5, FX.green) +
    bits
      .map(
        ([x, y, color, r]) =>
          `<rect x="${x - 2.4}" y="${y - 3.3}" width="4.8" height="6.6" rx="1.1" fill="${color}" transform="rotate(${r} ${x} ${y})"/>`
      )
      .join('')
  )
}

export const FACES: Record<NexiFace, FacePart> = {
  idle: { draw: () => eye(L, EY) + eye(R, EY) + stroke('M57.6 77.2Q64 83.6 70.4 77.2') },
  confident: { draw: () => lid(L, EY) + lid(R, EY) + stroke('M58 79Q65 82.5 71.5 76.5') },
  hello: { draw: () => eye(L, EY) + eye(R, EY) + openMouth(12.4, 8.2) },
  wink: { draw: () => eye(L, EY) + arc(R, EY) + openMouth(14.2, 9.5) },
  cool: { draw: () => halfEye(L) + halfEye(R) + stroke('M58 79Q65 82.5 71.5 76.5') },
  focus: {
    draw: () =>
      `<ellipse cx="${L}" cy="${EY + 1}" rx="5" ry="3.4" fill="${NEXI_INK}"/><ellipse cx="${R}" cy="${EY + 1}" rx="5" ry="3.4" fill="${NEXI_INK}"/>` +
      stroke('M44.5 56.5L57 58.5', 3) +
      stroke('M83.5 56.5L71 58.5', 3) +
      stroke('M60 81H68', 2.8)
  },
  xd: {
    draw: () =>
      stroke('M45.5 60.5L55.5 66.5L45.5 72.5', 3.6) +
      stroke('M82.5 60.5L72.5 66.5L82.5 72.5', 3.6) +
      openMouth(15, 10.5, 75) +
      `<ellipse cx="64" cy="82.6" rx="4.6" ry="2.6" fill="${TONGUE}"/>`
  },
  tongue: {
    draw: () =>
      eye(L, EY) +
      eye(R, EY) +
      `<path d="M60.5 79.2v3.6a3.5 3.5 0 0 0 7 0v-3.6" fill="${TONGUE}" stroke="${NEXI_INK}" stroke-width="2.2" stroke-linejoin="round"/>` +
      stroke('M57 77.2Q64 83 71 77.2')
  },
  surprised: {
    draw: () =>
      eye(L, EY - 1, 9.4, true, 7.2) +
      eye(R, EY - 1, 9.4, true, 7.2) +
      `<ellipse cx="64" cy="81.5" rx="4" ry="5" fill="${NEXI_INK}"/>`
  },
  starry: {
    draw: () =>
      starPath(L, EY - 1, 9, 3.8, FX.yellow, 2.4) + starPath(R, EY - 1, 9, 3.8, FX.yellow, 2.4) + openMouth(13, 9)
  },
  pb: { draw: () => arc(L, EY) + arc(R, EY) + openMouth(15.2, 10.5, 75), fx: celebration },
  think: {
    draw: () => eye(L + 3.3, EY - 2.4, 7.1) + eye(R + 3.3, EY - 2.4, 7.1) + stroke('M58.2 80H63.9', 2.8),
    fx: (p) =>
      [
        [94, 26, 2.2],
        [101, 19, 2.8],
        [107, 13, 3.4]
      ]
        .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${p.fx}"/>`)
        .join('')
  },
  solving: {
    draw: () =>
      eye(L, EY + 1.9, 5.1, false) +
      eye(R, EY + 1.9, 5.1, false) +
      stroke('M45.7 53.8L55.9 55.8', 2.6) +
      stroke('M82.3 53.8L72.1 55.8', 2.6) +
      stroke('M59.3 82.5H68.7', 2.8),
    fx: () =>
      `<path d="M86 55Q91 62 88 65.5Q84.5 68 82.5 64.5Q81.5 61 86 55Z" fill="${DROP}" stroke="#4f9be8" stroke-width="1"/>`
  },
  angry: {
    draw: () =>
      eye(L, EY + 1, 6.8) +
      eye(R, EY + 1, 6.8) +
      stroke('M45 53.5L56 57.5', 3) +
      stroke('M83 53.5L72 57.5', 3) +
      stroke('M58.5 82Q64 78 69.5 82')
  },
  rage: {
    draw: () =>
      `<ellipse cx="${L}" cy="${EY + 1}" rx="4.4" ry="4.4" fill="${NEXI_INK}"/><ellipse cx="${R}" cy="${EY + 1}" rx="4.4" ry="4.4" fill="${NEXI_INK}"/>` +
      stroke('M44.5 53L56.5 58.5', 3.2) +
      stroke('M83.5 53L71.5 58.5', 3.2) +
      `<rect x="55.5" y="76.5" width="17" height="8" rx="2.2" fill="#fff" stroke="${NEXI_INK}" stroke-width="2.4"/>` +
      `<path d="M59.75 77V84M64 77V84M68.25 77V84M56 80.5H72" stroke="${NEXI_INK}" stroke-width="1.3"/>`
  },
  sad: {
    draw: () =>
      eye(L, EY, 8) +
      eye(R, EY, 8) +
      stroke('M45.5 56.5L55.4 53.5', 2.6) +
      stroke('M82.5 56.5L72.6 53.5', 2.6) +
      stroke('M58.3 82Q64 77 69.7 82') +
      tear(46, 74)
  },
  oops: {
    draw: () =>
      eye(L, EY, 7.8) +
      eye(R, EY, 7.8) +
      stroke('M45.5 55.8L55.4 53.3', 2.6) +
      stroke('M82.5 55.8L72.6 53.3', 2.6) +
      stroke('M58.3 82Q64 76.2 69.7 82')
  },
  dizzy: { draw: () => spiral(L, EY) + spiral(R, EY) + stroke('M55 81q3 -3.5 6 0t6 0t6 0', 2.8) },
  empty: {
    tilt: 4,
    draw: () => eye(L - 2, EY) + eye(R - 2, EY) + stroke('M59 79H67', 2.8),
    fx: (p) =>
      `<path d="M84 14Q84 7 90.5 7Q97 7 97 13Q97 17 91 19.5V23" fill="none" stroke="${p.fx}" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="91" cy="28.8" r="2.7" fill="${p.fx}"/>`
  },
  sleep: {
    tilt: -7,
    draw: () =>
      arc(L, EY + 1) +
      arc(R, EY + 1) +
      `<circle cx="64" cy="81" r="2.6" fill="none" stroke="${NEXI_INK}" stroke-width="2.5"/>`,
    fx: (p) =>
      `<g fill="none" stroke="${p.fx}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">` +
      `<path d="M92 30H100L92 38H100"/><path d="M103 17H109.5L103 23.5H109.5"/><path d="M109 8H114L109 13H114"/></g>`
  }
}
