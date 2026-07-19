const CATEGORY_CUBE_COLOR: Record<string, string> = {
  '2x2': 'bg-yellow-400',
  '3x3': 'bg-blue-500',
  '3x3 OH': 'bg-sky-400',
  '3x3 BLD': 'bg-indigo-500',
  '4x4': 'bg-green-500',
  '4x4 BLD': 'bg-teal-500',
  '5x5': 'bg-orange-500',
  '6x6': 'bg-red-500',
  '7x7': 'bg-rose-400',
  SQ1: 'bg-amber-600',
  Skewb: 'bg-lime-400',
  Pyraminx: 'bg-cyan-400',
  Megaminx: 'bg-purple-500',
  Clock: 'bg-slate-400',
  FTO: 'bg-fuchsia-500',
  '3x3x3': 'bg-blue-500',
  '2x2x2': 'bg-yellow-400',
  '4x4x4': 'bg-green-500',
  '5x5x5': 'bg-orange-500',
  pyraminx: 'bg-cyan-400'
}

export function cubeColorClass(puzzle: string): string {
  return CATEGORY_CUBE_COLOR[puzzle] ?? 'bg-blue-500'
}
