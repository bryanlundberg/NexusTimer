const CATEGORY_CUBE_COLOR: Record<string, string> = {
  '2x2': 'bg-cube-yellow',
  '3x3': 'bg-cube-blue',
  '3x3 OH': 'bg-cube-blue',
  '3x3 BLD': 'bg-cube-blue',
  '4x4': 'bg-cube-green',
  '4x4 BLD': 'bg-cube-green',
  '5x5': 'bg-cube-orange',
  '6x6': 'bg-cube-red',
  '7x7': 'bg-cube-red',
  SQ1: 'bg-cube-orange',
  Skewb: 'bg-cube-green',
  Pyraminx: 'bg-cube-red',
  Megaminx: 'bg-cube-yellow',
  Clock: 'bg-cube-blue',
  FTO: 'bg-cube-white',
  '3x3x3': 'bg-cube-blue',
  '2x2x2': 'bg-cube-yellow'
}

export function cubeColorClass(puzzle: string): string {
  return CATEGORY_CUBE_COLOR[puzzle] ?? 'bg-cube-blue'
}
