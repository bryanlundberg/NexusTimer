export const SQUARE1_SLOTS_PER_LAYER = 12
export const SQUARE1_WEDGES = 2 * SQUARE1_SLOTS_PER_LAYER

const CORNER_FIRST_HALVES = new Set([0, 3, 6, 9, 13, 16, 19, 22])

export const isCornerStart = (wedge: number): boolean => CORNER_FIRST_HALVES.has(wedge)

export const isCornerEnd = (wedge: number): boolean => CORNER_FIRST_HALVES.has(wedge - 1)

export const isTopWedge = (wedge: number): boolean => wedge < SQUARE1_SLOTS_PER_LAYER

export const Square1Color = {
  Up: 0,
  Down: 1,
  Front: 2,
  Right: 3,
  Back: 4,
  Left: 5
} as const

const SIDES_CLOCKWISE_FROM_FRONT = [Square1Color.Front, Square1Color.Left, Square1Color.Back, Square1Color.Right]

export const slotCenterAngle = (slot: number): number =>
  slot < SQUARE1_SLOTS_PER_LAYER ? 30 * slot + 30 : -30 * (slot - SQUARE1_SLOTS_PER_LAYER)

const sideAt = (degrees: number): number =>
  SIDES_CLOCKWISE_FROM_FRONT[Math.round((((degrees % 360) + 360) % 360) / 90) % 4]!

export const faceColorOf = (wedge: number): number => (isTopWedge(wedge) ? Square1Color.Up : Square1Color.Down)

export const sideColorOf = (wedge: number): number => sideAt(slotCenterAngle(wedge))
