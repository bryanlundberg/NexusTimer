export type VirtualKeyMove = {
  move: string
  isRotation?: boolean
  require3x3?: boolean
}

export const VIRTUAL_KEYMAP: Record<string, VirtualKeyMove> = {
  h: { move: 'F' },
  g: { move: "F'" },
  j: { move: 'U' },
  f: { move: "U'" },
  i: { move: 'R' },
  k: { move: "R'" },
  s: { move: 'D' },
  l: { move: "D'" },
  d: { move: 'L' },
  e: { move: "L'" },
  w: { move: 'B' },
  o: { move: "B'" },

  y: { move: 'x', isRotation: true },
  t: { move: 'x', isRotation: true },
  n: { move: "x'", isRotation: true },
  b: { move: "x'", isRotation: true },
  ñ: { move: 'y', isRotation: true },
  ';': { move: 'y', isRotation: true },
  a: { move: "y'", isRotation: true },
  p: { move: 'z', isRotation: true },
  q: { move: "z'", isRotation: true },

  ',': { move: 'Uw', require3x3: true },
  c: { move: "Uw'", require3x3: true },
  z: { move: 'Dw', require3x3: true },
  '-': { move: "Dw'", require3x3: true },
  '/': { move: "Dw'", require3x3: true },
  u: { move: 'Rw', require3x3: true },
  m: { move: "Rw'", require3x3: true },
  v: { move: 'Lw', require3x3: true },
  r: { move: "Lw'", require3x3: true },
  '.': { move: "M'", require3x3: true },
  x: { move: "M'", require3x3: true },
  '5': { move: 'M', require3x3: true },
  '6': { move: 'M', require3x3: true }
}
