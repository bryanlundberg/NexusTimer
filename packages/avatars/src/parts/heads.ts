import type { NexiHead } from '@nexustimer/contracts'
import { shade } from '../color'
import { f, INK, line, STICKER, starPath, type StickerKey } from '../svg'
import type { Anchors } from './shapes'

type HeadPart = { back?: (a: Anchors, bodyColor: string) => string; front?: (a: Anchors, bodyColor: string) => string }

const HAT_REF_TOP = 32
const CAT_EAR = '#ff6b81'

function hatSpace(a: Anchors, inner: string) {
  const scale = Math.max(0.5, Math.min(1, a.topW / 72))
  return `<g transform="translate(${a.hatX} ${a.top}) scale(${f(scale)}) translate(-64 -${HAT_REF_TOP})">${inner}</g>`
}

function headsetBand(a: Anchors) {
  const left = a.sideL - 6
  const right = a.sideR + 6
  const t = a.top - 14
  const d = `M${left} ${a.eyeY}V${a.top + 10}Q${left} ${t} 64 ${t}Q${right} ${t} ${right} ${a.top + 10}V${a.eyeY}`
  return line(d, 8) + `<path d="${d}" fill="none" stroke="#3a3f4c" stroke-width="3.6" stroke-linecap="round"/>`
}

function headsetCups(a: Anchors) {
  const left = a.sideL - 6
  const right = a.sideR + 6
  const y = a.eyeY
  const cup = (x: number) =>
    `<rect x="${x - 9}" y="${y - 16}" width="18" height="32" rx="7" fill="#2b2d36" stroke="${INK}" stroke-width="3.5"/>` +
    `<rect x="${x - 3}" y="${y - 10}" width="6" height="20" rx="3" fill="#ef4444"/>`
  const boom = `M${left + 3} ${y + 12}Q${left + 8} ${a.mouthY + 12} ${a.cx - 12} ${a.mouthY + 5}`
  return (
    line(boom, 4.6) +
    `<path d="${boom}" fill="none" stroke="#3a3f4c" stroke-width="2.4" stroke-linecap="round"/>` +
    `<circle cx="${a.cx - 12}" cy="${a.mouthY + 5}" r="3.4" fill="#2b2d36" stroke="${INK}" stroke-width="2"/>` +
    cup(left) +
    cup(right)
  )
}

function miniCube() {
  const colors: StickerKey[] = ['r', 'w', 'b', 'y', 'g', 'o', 'b', 'r', 'y']
  let g = `<rect x="51" y="7" width="26" height="26" rx="5" fill="${INK}"/>`
  colors.forEach((key, i) => {
    g += `<rect x="${f(52.8 + (i % 3) * 7.8)}" y="${f(8.8 + Math.floor(i / 3) * 7.8)}" width="6.6" height="6.6" rx="1.6" fill="${STICKER[key]}"/>`
  })
  return `<g transform="rotate(-12 64 22)">${g}</g>`
}

export const HEADS: Record<NexiHead, HeadPart> = {
  none: {},
  headset: { back: headsetBand, front: headsetCups },
  cap: {
    front: (a) =>
      hatSpace(
        a,
        `<path d="M28 49Q28 19 64 19Q100 19 100 49Z" fill="${STICKER.b}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>` +
          `<path d="M64 21V49M46 24Q42 36 42 49M82 24Q86 36 86 49" fill="none" stroke="${INK}" stroke-width="2.5" opacity=".2"/>` +
          `<path d="M88 46Q106 38 120 45Q118 53 103 54L88 52Z" fill="${shade(STICKER.b, 0.25)}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
          `<circle cx="64" cy="19" r="4.5" fill="${STICKER.b}" stroke="${INK}" stroke-width="3"/>`
      )
  },
  capback: {
    back: (a) =>
      hatSpace(
        a,
        `<path d="M36 30Q22 20 28 9L48 22Z" fill="${shade(STICKER.b, 0.25)}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`
      ),
    front: (a) =>
      hatSpace(
        a,
        `<path d="M28 49Q28 19 64 19Q100 19 100 49ZM54 49Q54 39 64 39Q74 39 74 49Z" fill="${STICKER.b}" fill-rule="evenodd" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>` +
          `<rect x="55" y="40.5" width="18" height="3.4" rx="1.4" fill="#2b2d36" stroke="${INK}" stroke-width="1.4"/>` +
          `<path d="M46 24Q42 36 42 49M82 24Q86 36 86 49" fill="none" stroke="${INK}" stroke-width="2.5" opacity=".2"/>` +
          `<circle cx="64" cy="19" r="4.5" fill="${STICKER.b}" stroke="${INK}" stroke-width="3"/>`
      )
  },
  beanie: {
    front: (a) =>
      hatSpace(
        a,
        `<path d="M27 50Q27 17 64 17Q101 17 101 50Z" fill="${STICKER.r}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>` +
          `<path d="M50 22V46M64 19V46M78 22V46" stroke="${INK}" stroke-width="2.5" opacity=".18"/>` +
          `<rect x="23" y="42" width="82" height="13" rx="6" fill="${STICKER.w}" stroke="${INK}" stroke-width="4"/>` +
          `<circle cx="64" cy="14" r="8" fill="${STICKER.w}" stroke="${INK}" stroke-width="4"/>`
      )
  },
  headband: {
    front: (a) =>
      hatSpace(
        a,
        `<rect x="25" y="41" width="78" height="11" rx="2" fill="${STICKER.r}" stroke="${INK}" stroke-width="3.5"/>` +
          `<path d="M27 46L14 38M27 47L13 52" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>` +
          `<path d="M27 46L14 38M27 47L13 52" stroke="${STICKER.r}" stroke-width="3" stroke-linecap="round"/>`
      )
  },
  crown: {
    front: (a) =>
      hatSpace(
        a,
        `<path d="M41 37L38 12L52 25L64 8L76 25L90 12L87 37Z" fill="${STICKER.y}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><circle cx="64" cy="28" r="3.5" fill="${STICKER.r}" stroke="${INK}" stroke-width="2"/>`
      )
  },
  tophat: {
    front: (a) =>
      hatSpace(
        a,
        `<path d="M44 33V8Q44 4 48 4H80Q84 4 84 8V33Z" fill="#2b2d36" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
          `<rect x="44" y="23" width="40" height="7" fill="${STICKER.r}"/>` +
          `<path d="M50 9V20" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".3"/>` +
          `<ellipse cx="64" cy="35" rx="34" ry="6" fill="#2b2d36" stroke="${INK}" stroke-width="4"/>`
      )
  },
  gradcap: {
    front: (a) =>
      hatSpace(
        a,
        `<path d="M42 26V38Q64 46 86 38V26Z" fill="#2b2d36" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
          `<path d="M64 8L108 22L64 36L20 22Z" fill="#3a3d48" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
          `<path d="M64 22L96 28V40" fill="none" stroke="${STICKER.y}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>` +
          `<rect x="93" y="38" width="6" height="9" rx="2" fill="${STICKER.y}" stroke="${INK}" stroke-width="2"/>` +
          `<circle cx="64" cy="22" r="3" fill="${STICKER.y}" stroke="${INK}" stroke-width="2"/>`
      )
  },
  hardhat: {
    front: (a) =>
      hatSpace(
        a,
        `<path d="M30 44Q30 12 64 12Q98 12 98 44Z" fill="${STICKER.y}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>` +
          `<path d="M58 13V44M70 13V44" stroke="${INK}" stroke-width="3" opacity=".25"/>` +
          `<rect x="20" y="40" width="88" height="10" rx="5" fill="${STICKER.y}" stroke="${INK}" stroke-width="4"/>`
      )
  },
  viking: {
    front: (a) =>
      hatSpace(
        a,
        `<path d="M31 34Q14 31 11 10Q22 21 35 23Z" fill="#f3ead8" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
          `<path d="M97 34Q114 31 117 10Q106 21 93 23Z" fill="#f3ead8" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
          `<path d="M29 46Q29 14 64 14Q99 14 99 46Z" fill="#b8bec8" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>` +
          `<rect x="25" y="38" width="78" height="11" rx="3" fill="#a77b4f" stroke="${INK}" stroke-width="4"/>` +
          [40, 52, 64, 76, 88].map((x) => `<circle cx="${x}" cy="43.5" r="1.8" fill="${INK}" opacity=".6"/>`).join('') +
          `<path d="M64 14V38" stroke="${INK}" stroke-width="3" opacity=".25"/>`
      )
  },
  astronaut: {
    back: () => `<circle cx="64" cy="66" r="52" fill="#fff" fill-opacity=".22"/>`,
    front: () =>
      `<circle cx="64" cy="66" r="52" fill="none" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M34 40Q44 24 62 20" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".75"/>` +
      `<circle cx="30" cy="54" r="3" fill="#fff" opacity=".75"/>`
  },
  wizard: {
    front: (a) =>
      hatSpace(
        a,
        `<path d="M44 38L69 4L86 38Z" fill="${STICKER.b}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>` +
          `<ellipse cx="64" cy="38" rx="37" ry="7" fill="${STICKER.b}" stroke="${INK}" stroke-width="4.5"/>` +
          starPath(67, 23, 6.5, 2.8, STICKER.y, 2.5) +
          `<circle cx="58" cy="32" r="2" fill="${STICKER.y}"/>`
      )
  },
  chef: {
    front: (a) =>
      hatSpace(
        a,
        `<circle cx="49" cy="18" r="12" fill="#ffffff" stroke="${INK}" stroke-width="4"/>` +
          `<circle cx="79" cy="18" r="12" fill="#ffffff" stroke="${INK}" stroke-width="4"/>` +
          `<circle cx="64" cy="12" r="14" fill="#ffffff" stroke="${INK}" stroke-width="4"/>` +
          `<rect x="42" y="22" width="44" height="15" rx="3" fill="#ffffff" stroke="${INK}" stroke-width="4"/>` +
          `<path d="M53 26V33M64 26V33M75 26V33" stroke="${INK}" stroke-width="2" opacity=".2"/>`
      )
  },
  party: {
    front: (a) =>
      hatSpace(
        a,
        `<path d="M46 37L66 9L82 35Z" fill="${STICKER.b}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
          `<path d="M58 21L71 26M52 30L76 34" stroke="${STICKER.y}" stroke-width="4" stroke-linecap="round"/>` +
          `<circle cx="66" cy="9" r="5.5" fill="${STICKER.y}" stroke="${INK}" stroke-width="3"/>`
      )
  },
  propeller: {
    front: (a) =>
      hatSpace(
        a,
        `<rect x="60.5" y="16" width="7" height="18" rx="2" fill="${INK}"/>` +
          `<ellipse cx="64" cy="16" rx="38" ry="5" fill="${INK}" stroke="${INK}" stroke-width="0"/>` +
          `<circle cx="64" cy="16" r="6" fill="${STICKER.y}" stroke="${INK}" stroke-width="3"/>` +
          line('M30 6Q46 0 60 2M68 2Q82 0 98 6', 3, ' opacity=".45"')
      )
  },
  halo: {
    front: (a) =>
      hatSpace(
        a,
        `<ellipse cx="64" cy="15" rx="21" ry="6.5" fill="none" stroke="${INK}" stroke-width="9"/><ellipse cx="64" cy="15" rx="21" ry="6.5" fill="none" stroke="${STICKER.y}" stroke-width="4"/>`
      )
  },
  horns: {
    back: (a) =>
      hatSpace(
        a,
        `<path d="M35 40Q27 24 36 12Q40 26 52 33Z" fill="${STICKER.r}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
          `<path d="M93 40Q101 24 92 12Q88 26 76 33Z" fill="${STICKER.r}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`
      )
  },
  cat: {
    back: (a, bodyColor) =>
      hatSpace(
        a,
        `<path d="M31 46L33 15L56 33Z" fill="${bodyColor}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>` +
          `<path d="M97 46L95 15L72 33Z" fill="${bodyColor}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>` +
          `<path d="M36 34L37 23L46 31Z" fill="${CAT_EAR}" opacity=".7"/><path d="M92 34L91 23L82 31Z" fill="${CAT_EAR}" opacity=".7"/>`
      )
  },
  antenna: {
    back: (a) => hatSpace(a, line('M64 36V16', 4.5)),
    front: (a) => hatSpace(a, `<circle cx="64" cy="13" r="6" fill="${STICKER.r}" stroke="${INK}" stroke-width="3.5"/>`)
  },
  minicube: { front: (a) => hatSpace(a, miniCube()) }
}
