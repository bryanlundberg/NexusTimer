export const CUBE_CATEGORIES = [
  '2x2',
  '3x3',
  '3x3 OH',
  '3x3 BLD',
  '4x4',
  '4x4 BLD',
  '5x5',
  '6x6',
  '7x7',
  'SQ1',
  'Skewb',
  'Pyraminx',
  'Megaminx',
  'Clock',
  'FTO'
] as const

export type CubeCategory =
  | '2x2'
  | '3x3'
  | '3x3 OH'
  | '3x3 BLD'
  | '4x4'
  | '4x4 BLD'
  | '5x5'
  | '6x6'
  | '7x7'
  | 'SQ1'
  | 'Skewb'
  | 'Pyraminx'
  | 'Megaminx'
  | 'Clock'
  | 'FTO'

export function isValidCategory(category: string): category is CubeCategory {
  return CUBE_CATEGORIES.includes(category as CubeCategory)
}
