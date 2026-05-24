import { CubeEngine } from 'cube-state-engine'

export type VirtualKeyMove = {
  move: string
  apply: (engine: CubeEngine) => void
  isRotation?: boolean
  require3x3?: boolean
}

export const VIRTUAL_KEYMAP: Record<string, VirtualKeyMove> = {
  h: { move: 'F', apply: (e) => e.rotateF(true) },
  g: { move: "F'", apply: (e) => e.rotateF(false) },
  j: { move: 'U', apply: (e) => e.rotateU(true) },
  f: { move: "U'", apply: (e) => e.rotateU(false) },
  i: { move: 'R', apply: (e) => e.rotateR(true) },
  k: { move: "R'", apply: (e) => e.rotateR(false) },
  s: { move: 'D', apply: (e) => e.rotateD(true) },
  l: { move: "D'", apply: (e) => e.rotateD(false) },
  d: { move: 'L', apply: (e) => e.rotateL(true) },
  e: { move: "L'", apply: (e) => e.rotateL(false) },
  w: { move: 'B', apply: (e) => e.rotateB(true) },
  o: { move: "B'", apply: (e) => e.rotateB(false) },

  y: { move: 'x', apply: (e) => e.rotateX(true), isRotation: true },
  t: { move: 'x', apply: (e) => e.rotateX(true), isRotation: true },
  n: { move: "x'", apply: (e) => e.rotateX(false), isRotation: true },
  b: { move: "x'", apply: (e) => e.rotateX(false), isRotation: true },
  ñ: { move: 'y', apply: (e) => e.rotateY(true), isRotation: true },
  ';': { move: 'y', apply: (e) => e.rotateY(true), isRotation: true },
  a: { move: "y'", apply: (e) => e.rotateY(false), isRotation: true },
  p: { move: 'z', apply: (e) => e.rotateZ(true), isRotation: true },
  q: { move: "z'", apply: (e) => e.rotateZ(false), isRotation: true },

  ',': { move: 'Uw', apply: (e) => e.rotateUw(true), require3x3: true },
  c: { move: "Uw'", apply: (e) => e.rotateUw(false), require3x3: true },
  z: { move: 'Dw', apply: (e) => e.rotateDw(true), require3x3: true },
  '-': { move: "Dw'", apply: (e) => e.rotateDw(false), require3x3: true },
  '/': { move: "Dw'", apply: (e) => e.rotateDw(false), require3x3: true },
  u: { move: 'Rw', apply: (e) => e.rotateRw(true), require3x3: true },
  m: { move: "Rw'", apply: (e) => e.rotateRw(false), require3x3: true },
  v: { move: 'Lw', apply: (e) => e.rotateLw(true), require3x3: true },
  r: { move: "Lw'", apply: (e) => e.rotateLw(false), require3x3: true },
  '.': { move: "M'", apply: (e) => e.rotateM(false), require3x3: true },
  x: { move: "M'", apply: (e) => e.rotateM(false), require3x3: true },
  '5': { move: 'M', apply: (e) => e.rotateM(true), require3x3: true },
  '6': { move: 'M', apply: (e) => e.rotateM(true), require3x3: true }
}
