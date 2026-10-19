import type { NexiExtra } from '@nexustimer/contracts'
import { INK, line, sparkle } from '../svg'
import type { Anchors } from './shapes'

type ExtraPart = {
  face?: (a: Anchors) => string
  back?: (a: Anchors) => string
  front?: (a: Anchors) => string
}

const DROP = '#a9d1ff'

function glasses(a: Anchors) {
  const left = a.cx - a.eyeDx
  const right = a.cx + a.eyeDx
  const y = a.eyeY
  return (
    `<circle cx="${left}" cy="${y}" r="11" fill="#fff" fill-opacity=".3" stroke="${INK}" stroke-width="3.5"/>` +
    `<circle cx="${right}" cy="${y}" r="11" fill="#fff" fill-opacity=".3" stroke="${INK}" stroke-width="3.5"/>` +
    line(`M${left + 11} ${y - 1}Q${a.cx} ${y - 6} ${right - 11} ${y - 1}`, 3.5)
  )
}

function shades(a: Anchors) {
  const left = a.cx - a.eyeDx
  const right = a.cx + a.eyeDx
  const y = a.eyeY - 4
  const lens = (x: number) =>
    `<path d="M${x - 11} ${y}H${x + 11}V${y + 7}Q${x + 11} ${y + 16} ${x} ${y + 16}Q${x - 11} ${y + 16} ${x - 11} ${y + 7}Z" fill="${INK}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`
  return (
    line(
      `M${left - 11} ${y + 4}H${a.sideL + 2}M${right + 11} ${y + 4}H${a.sideR - 2}M${left + 11} ${y + 4}H${right - 11}`,
      4
    ) +
    lens(left) +
    lens(right) +
    `<path d="M${left - 6} ${y + 4}H${left}M${right - 6} ${y + 4}H${right}" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".55"/>`
  )
}

function blindfold(a: Anchors) {
  const y = a.eyeY - 9
  return (
    `<rect x="${a.sideL - 3}" y="${y}" width="${a.sideR - a.sideL + 6}" height="17" rx="3" fill="${INK}" stroke="${INK}" stroke-width="0"/>` +
    line(`M${a.sideR + 1} ${y + 6}L${a.sideR + 13} ${y - 2}`, 5) +
    line(`M${a.sideR + 1} ${y + 10}L${a.sideR + 14} ${y + 17}`, 5)
  )
}

function patch(a: Anchors) {
  const left = a.cx - a.eyeDx
  const y = a.eyeY
  return (
    `<path d="M${a.sideL - 1} ${y + 8}L${a.sideR + 1} ${y - 16}" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>` +
    `<ellipse cx="${left}" cy="${y}" rx="10.5" ry="9.5" fill="${INK}" stroke="${INK}" stroke-width="0"/>`
  )
}

function mustache(a: Anchors) {
  const x = a.cx
  const y = a.mouthY - 4
  return `<path d="M${x} ${y}Q${x - 7} ${y - 7} ${x - 16} ${y - 3}Q${x - 22} ${y} ${x - 27} ${y - 4}Q${x - 25} ${y + 8} ${x - 14} ${y + 7}Q${x - 5} ${y + 6} ${x} ${y + 2}Q${x + 5} ${y + 6} ${x + 14} ${y + 7}Q${x + 25} ${y + 8} ${x + 27} ${y - 4}Q${x + 22} ${y} ${x + 16} ${y - 3}Q${x + 7} ${y - 7} ${x} ${y}Z" fill="${INK}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`
}

function bandaid(a: Anchors) {
  const x = a.cx + a.eyeDx + 12
  const y = a.eyeY + 14
  return (
    `<g transform="rotate(-30 ${x} ${y})"><rect x="${x - 14}" y="${y - 5.5}" width="28" height="11" rx="5.5" fill="#f2c9a0" stroke="${INK}" stroke-width="3"/>` +
    `<rect x="${x - 5}" y="${y - 3}" width="10" height="6" rx="1.5" fill="#fbe3c8"/></g>`
  )
}

function freckles(a: Anchors) {
  return [-1, 1]
    .map((side) => {
      const x = a.cx + side * (a.eyeDx + 12)
      const y = a.eyeY + 12
      return [
        [0, 0],
        [5, 3],
        [-4, 4]
      ]
        .map(([dx = 0, dy = 0]) => `<circle cx="${x + dx}" cy="${y + dy}" r="1.6" fill="${INK}" opacity=".55"/>`)
        .join('')
    })
    .join('')
}

function sweat(a: Anchors) {
  const x = a.sideR - 1
  const y = a.top - 4
  return `<path d="M${x} ${y}Q${x + 8} ${y + 12} ${x} ${y + 17}Q${x - 8} ${y + 12} ${x} ${y}Z" fill="${DROP}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`
}

function tears(a: Anchors) {
  const y = a.eyeY + 5
  const end = a.bottom - 6
  return [a.cx - a.eyeDx, a.cx + a.eyeDx]
    .map(
      (x) =>
        `<path d="M${x - 5} ${y}H${x + 5}V${end}Q${x} ${end + 5} ${x - 5} ${end}Z" fill="${DROP}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`
    )
    .join('')
}

function speed(a: Anchors) {
  const x = a.sideL - 8
  const y = a.top + 16
  return line(`M${x - 14} ${y}H${x}M${x - 18} ${y + 16}H${x}M${x - 12} ${y + 32}H${x}`, 4)
}

function steam(a: Anchors) {
  const puffs: [number, number][] = [
    [a.sideL + 2, a.top - 6],
    [a.sideR - 2, a.top - 6]
  ]
  return puffs
    .map(
      ([x, y]) =>
        `<g fill="#ffffff" stroke="${INK}" stroke-width="3"><circle cx="${x - 5}" cy="${y}" r="5"/><circle cx="${x + 4}" cy="${y - 3}" r="6"/><circle cx="${x + 1}" cy="${y - 10}" r="4.5"/></g>`
    )
    .join('')
}

export const EXTRAS: Record<NexiExtra, ExtraPart> = {
  none: {},
  glasses: { face: glasses },
  shades: { face: shades },
  blindfold: { face: blindfold },
  patch: { face: patch },
  mustache: { face: mustache },
  bandaid: { face: bandaid },
  freckles: { face: freckles },
  sparkles: {
    front: (a) =>
      sparkle(a.sideL - 10, a.top + 4, 7) + sparkle(a.sideR + 9, a.top - 4, 6) + sparkle(a.sideR + 6, a.bottom - 22, 5)
  },
  sweat: { front: sweat },
  tears: { front: tears },
  speed: { back: speed },
  steam: { front: steam }
}
