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
  'FTO',
  '2x2 Virtual',
  '3x3 Virtual'
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
  | '2x2 Virtual'
  | '3x3 Virtual'

export function isValidCategory(category: string): category is CubeCategory {
  return CUBE_CATEGORIES.includes(category as CubeCategory)
}

/**
 * Returns the canonical sort index for a category based on CUBE_CATEGORIES order.
 * Unknown categories are pushed to the end.
 */
export function getCategoryOrder(category: string): number {
  const index = CUBE_CATEGORIES.indexOf(category as CubeCategory)
  return index === -1 ? CUBE_CATEGORIES.length : index
}
