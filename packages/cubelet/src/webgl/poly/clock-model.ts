import type { CellFace } from '../../geometry/convex-cells'
import { clock } from '../../clock/clock-definition'
import { CLOCK_DIALS_PER_FACE, type ClockMove, type ClockState } from '../../clock/clock-state'
import { BoundedCache } from '../../shared/bounded-cache'
import { BODY_COLOR, buildPolyMesh, type PolyMesh, type PolyPiece } from './poly-mesh'
import type { PuzzleModel3d } from './puzzle-model'

export const ClockColor = {
  BodyA: 0,
  BodyB: 1,
  DialA: 2,
  DialB: 3,
  HandA: 4,
  HandB: 5,
  Marker: 6,
  Pin: 7
} as const

type Outline = ReadonlyArray<readonly [number, number]>

const HALF = 1
const CORNER_RADIUS = 0.38
const THICKNESS = 0.13
const SPACING = 0.62
const DIAL_RADIUS = 0.24
const DIAL_HEIGHT = 0.04
const HAND_HEIGHT = 0.025
const PIN_RADIUS = 0.055
const ARC_SEGMENTS = 8
const DIAL_SEGMENTS = 24

const circle = (x: number, y: number, radius: number, segments: number): Outline =>
  Array.from({ length: segments }, (_, i) => {
    const angle = (i / segments) * 2 * Math.PI
    return [x + Math.cos(angle) * radius, y + Math.sin(angle) * radius] as const
  })

const roundedSquare = (): Outline => {
  const inner = HALF - CORNER_RADIUS
  const corners: ReadonlyArray<readonly [number, number, number]> = [
    [inner, inner, 0],
    [-inner, inner, 90],
    [-inner, -inner, 180],
    [inner, -inner, 270]
  ]
  return corners.flatMap(([cx, cy, start]) =>
    Array.from({ length: ARC_SEGMENTS + 1 }, (_, i) => {
      const angle = ((start + (90 * i) / ARC_SEGMENTS) * Math.PI) / 180
      return [cx + Math.cos(angle) * CORNER_RADIUS, cy + Math.sin(angle) * CORNER_RADIUS] as const
    })
  )
}

const prism = (outline: Outline, low: number, high: number, top: number, bottom: number, side: number): PolyPiece => {
  const faces: CellFace[] = [
    { points: outline.map(([x, y]) => [x, y, high]), tag: 0 },
    { points: outline.map(([x, y]) => [x, y, low]).reverse(), tag: 0 }
  ]
  const colors = [top, bottom]
  outline.forEach(([x, y], i) => {
    const [nx, ny] = outline[(i + 1) % outline.length]!
    faces.push({
      points: [
        [x, y, low],
        [nx, ny, low],
        [nx, ny, high],
        [x, y, high]
      ],
      tag: 0
    })
    colors.push(side)
  })
  return { cell: faces, colorOf: (face) => colors[face]! }
}

const hand = (x: number, y: number, angle: number): Outline => {
  const along = [Math.sin(angle), Math.cos(angle)] as const
  const across = [along[1], -along[0]] as const
  const point = (forward: number, sideways: number) =>
    [x + along[0] * forward + across[0] * sideways, y + along[1] * forward + across[1] * sideways] as const
  return [point(0.2, 0), point(0, 0.045), point(-0.06, 0), point(0, -0.045)]
}

const facePieces = (state: ClockState, face: 0 | 1, sideB: boolean): PolyPiece[] => {
  const sign = face === 0 ? 1 : -1
  const base = sign * THICKNESS
  const lift = (height: number) => base + sign * height
  const range = (height: number): [number, number] => (sign > 0 ? [base, lift(height)] : [lift(height), base])
  const [dial, handColor] = sideB ? [ClockColor.DialB, ClockColor.HandB] : [ClockColor.DialA, ClockColor.HandA]
  const pieces: PolyPiece[] = []
  for (let index = 0; index < CLOCK_DIALS_PER_FACE; index++) {
    const column = (index % 3) - 1
    const row = Math.floor(index / 3) - 1
    const x = sign * column * SPACING
    const y = -row * SPACING
    const [dialLow, dialHigh] = range(DIAL_HEIGHT)
    pieces.push(prism(circle(x, y, DIAL_RADIUS, DIAL_SEGMENTS), dialLow, dialHigh, dial, dial, dial))
    const angle = sign * ((state.dialAt(face * CLOCK_DIALS_PER_FACE + index) * Math.PI) / 6)
    const [handLow, handHigh] = range(DIAL_HEIGHT + HAND_HEIGHT)
    pieces.push(prism(hand(x, y, angle), handLow, handHigh, handColor, handColor, handColor))
    const [markLow, markHigh] = range(0.012)
    pieces.push(
      prism(
        circle(x, y + DIAL_RADIUS + 0.05, 0.025, 8),
        markLow,
        markHigh,
        ClockColor.Marker,
        ClockColor.Marker,
        ClockColor.Marker
      )
    )
  }
  for (const dx of [-0.5, 0.5]) {
    for (const dy of [-0.5, 0.5]) {
      const [pinLow, pinHigh] = range(0.05)
      pieces.push(
        prism(
          circle(dx * SPACING, dy * SPACING, PIN_RADIUS, 12),
          pinLow,
          pinHigh,
          ClockColor.Pin,
          ClockColor.Pin,
          ClockColor.Pin
        )
      )
    }
  }
  return pieces
}

const meshes = new BoundedCache<string, PolyMesh>(32)

export const clockModel3d: PuzzleModel3d<ClockMove, ClockState> = {
  definition: clock,
  mesh: (state) => {
    const key = state.key()
    let mesh = meshes.get(key)
    if (!mesh) {
      const [front, back] = state.flipped ? [ClockColor.BodyB, ClockColor.BodyA] : [ClockColor.BodyA, ClockColor.BodyB]
      const body = prism(roundedSquare(), -THICKNESS, THICKNESS, front, back, BODY_COLOR)
      mesh = buildPolyMesh([body, ...facePieces(state, 0, state.flipped), ...facePieces(state, 1, !state.flipped)], 1)
      meshes.set(key, mesh)
    }
    return mesh
  },
  colorOf: (_state, colorRef, palette) => palette.colors[colorRef]!,
  motions: () => []
}
