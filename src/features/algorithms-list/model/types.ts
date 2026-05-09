export interface Alg {
  id: string
  moves: string
  label?: string
}

export interface AlgorithmCollection {
  id: string
  name: string
  idMethod: string
  puzzle: string
  algs: Alg[]
  group: string
  prob?: number | null
  setup?: string | null
  tags?: string[]
}
