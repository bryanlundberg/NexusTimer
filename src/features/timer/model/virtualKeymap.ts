export type VirtualKeyMove = {
  move: string
  isRotation?: boolean
  require3x3?: boolean
}

export type VirtualMoveGroup = {
  id: 'faces' | 'rotations' | 'wide'
  label: string
  moves: VirtualKeyMove[]
}

export const VIRTUAL_MOVE_GROUPS: VirtualMoveGroup[] = [
  {
    id: 'faces',
    label: 'Faces',
    moves: [
      { move: 'F' },
      { move: "F'" },
      { move: 'U' },
      { move: "U'" },
      { move: 'R' },
      { move: "R'" },
      { move: 'D' },
      { move: "D'" },
      { move: 'L' },
      { move: "L'" },
      { move: 'B' },
      { move: "B'" }
    ]
  },
  {
    id: 'rotations',
    label: 'Rotations',
    moves: [
      { move: 'x', isRotation: true },
      { move: "x'", isRotation: true },
      { move: 'y', isRotation: true },
      { move: "y'", isRotation: true },
      { move: 'z', isRotation: true },
      { move: "z'", isRotation: true }
    ]
  },
  {
    id: 'wide',
    label: 'Wide & slice',
    moves: [
      { move: 'Uw', require3x3: true },
      { move: "Uw'", require3x3: true },
      { move: 'Dw', require3x3: true },
      { move: "Dw'", require3x3: true },
      { move: 'Rw', require3x3: true },
      { move: "Rw'", require3x3: true },
      { move: 'Lw', require3x3: true },
      { move: "Lw'", require3x3: true },
      { move: 'M', require3x3: true },
      { move: "M'", require3x3: true }
    ]
  }
]

export const VIRTUAL_MOVES: Record<string, VirtualKeyMove> = Object.fromEntries(
  VIRTUAL_MOVE_GROUPS.flatMap((group) => group.moves.map((move) => [move.move, move]))
)

// KeyboardEvent.code values: physical positions, identical on any keyboard layout
export const VIRTUAL_KEYBOARD_ROWS: string[][] = [
  [
    'Digit1',
    'Digit2',
    'Digit3',
    'Digit4',
    'Digit5',
    'Digit6',
    'Digit7',
    'Digit8',
    'Digit9',
    'Digit0',
    'Minus',
    'Equal'
  ],
  ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP'],
  ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote'],
  ['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash']
]

export const DEFAULT_VIRTUAL_KEYMAP: Record<string, string> = {
  KeyH: 'F',
  KeyG: "F'",
  KeyJ: 'U',
  KeyF: "U'",
  KeyI: 'R',
  KeyK: "R'",
  KeyS: 'D',
  KeyL: "D'",
  KeyD: 'L',
  KeyE: "L'",
  KeyW: 'B',
  KeyO: "B'",

  KeyY: 'x',
  KeyT: 'x',
  KeyN: "x'",
  KeyB: "x'",
  Semicolon: 'y',
  KeyA: "y'",
  KeyP: 'z',
  KeyQ: "z'",

  Comma: 'Uw',
  KeyC: "Uw'",
  KeyZ: 'Dw',
  Slash: "Dw'",
  KeyU: 'Rw',
  KeyM: "Rw'",
  KeyV: 'Lw',
  KeyR: "Lw'",
  Period: "M'",
  KeyX: "M'",
  Digit5: 'M',
  Digit6: 'M'
}

const PUNCTUATION_LABELS: Record<string, string> = {
  Minus: '-',
  Equal: '=',
  Semicolon: ';',
  Quote: "'",
  Comma: ',',
  Period: '.',
  Slash: '/'
}

// US legends, used until the browser reports the active layout
export const FALLBACK_KEY_LABELS: Record<string, string> = Object.fromEntries(
  VIRTUAL_KEYBOARD_ROWS.flat().map((code) => [
    code,
    PUNCTUATION_LABELS[code] ?? code.replace(/^(Key|Digit)/, '').toLowerCase()
  ])
)

export function resolveVirtualKeymap(keymap: Record<string, string>): Record<string, VirtualKeyMove> {
  const resolved: Record<string, VirtualKeyMove> = {}

  for (const [code, move] of Object.entries(keymap)) {
    const definition = VIRTUAL_MOVES[move]
    if (definition) resolved[code] = definition
  }

  return resolved
}
