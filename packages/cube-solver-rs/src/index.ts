export const CROSS_FACES = ['U', 'D', 'F', 'B', 'R', 'L'] as const

export type CrossFace = (typeof CROSS_FACES)[number]

export interface CrossHint {
  face: CrossFace
  rotation: string
  cross: string
  xcross: [string, string, string, string]
}

export interface CubeSolver {
  crossHints(scramble: string): CrossHint[]
  transition(history: string, setup: string, goal: string): string
}

const FIELDS_PER_FACE = 7

export function toCrossHints(flat: readonly string[]): CrossHint[] {
  const hints: CrossHint[] = []
  for (let i = 0; i + FIELDS_PER_FACE <= flat.length; i += FIELDS_PER_FACE) {
    const [face, rotation, cross, ...xcross] = flat.slice(i, i + FIELDS_PER_FACE) as [CrossFace, ...string[]]
    hints.push({
      face,
      rotation: rotation ?? '',
      cross: cross ?? '',
      xcross: [xcross[0] ?? '', xcross[1] ?? '', xcross[2] ?? '', xcross[3] ?? '']
    })
  }
  return hints
}
