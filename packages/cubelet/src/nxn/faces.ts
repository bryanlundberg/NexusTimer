export type Axis = 0 | 1 | 2

export type FaceName = 'U' | 'R' | 'F' | 'D' | 'L' | 'B'

export interface Face {
  readonly name: FaceName
  readonly axis: Axis
  readonly sign: 1 | -1
}

export const FACES: readonly Face[] = [
  { name: 'U', axis: 1, sign: 1 },
  { name: 'R', axis: 0, sign: 1 },
  { name: 'F', axis: 2, sign: 1 },
  { name: 'D', axis: 1, sign: -1 },
  { name: 'L', axis: 0, sign: -1 },
  { name: 'B', axis: 2, sign: -1 }
]

export const FACE_BY_NAME: Readonly<Record<FaceName, Face>> = Object.fromEntries(
  FACES.map((face) => [face.name, face])
) as Record<FaceName, Face>
