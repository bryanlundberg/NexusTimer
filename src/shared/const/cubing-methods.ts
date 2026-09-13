export const CUBING_METHODS = ['cfop', 'roux', 'zz', 'petrus', 'mehta', 'beginner'] as const
export type CubingMethod = (typeof CUBING_METHODS)[number]

interface MethodSpec {
  name: string | null
  steps: string[] | null
  phases: string[]
}

export const METHOD_SPECS: Record<CubingMethod, MethodSpec> = {
  cfop: {
    name: 'CFOP',
    steps: ['Cross', 'F2L', 'OLL', 'PLL'],
    phases: ['bg-sky-500', 'bg-emerald-500', 'bg-amber-400', 'bg-rose-500']
  },
  roux: {
    name: 'Roux',
    steps: ['FB', 'SB', 'CMLL', 'LSE'],
    phases: ['bg-sky-500', 'bg-indigo-500', 'bg-amber-400', 'bg-rose-500']
  },
  zz: {
    name: 'ZZ',
    steps: ['EOLine', 'F2L', 'LL'],
    phases: ['bg-violet-500', 'bg-emerald-500', 'bg-rose-500']
  },
  petrus: {
    name: 'Petrus',
    steps: ['2x2x2', '2x2x3', 'EO', 'F2L', 'LL'],
    phases: ['bg-sky-500', 'bg-indigo-500', 'bg-violet-500', 'bg-emerald-500', 'bg-rose-500']
  },
  mehta: {
    name: 'Mehta',
    steps: ['FB', '3QB', 'EOLE', '6CO', '6CP', 'L5EP'],
    phases: ['bg-sky-500', 'bg-teal-500', 'bg-violet-500', 'bg-amber-400', 'bg-orange-500', 'bg-rose-500']
  },
  beginner: {
    name: null,
    steps: null,
    phases: ['bg-sky-500', 'bg-emerald-500', 'bg-amber-400']
  }
}

export function isCubingMethod(value: unknown): value is CubingMethod {
  return typeof value === 'string' && (CUBING_METHODS as readonly string[]).includes(value)
}
