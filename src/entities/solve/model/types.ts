export type Solves = {
  session: Array<Solve>
  all: Array<Solve>
}

export type Solve = {
  id: string
  cubeId: string
  scramble: string
  startTime: number
  endTime: number
  bookmark: boolean
  time: number
  rating: number
  dnf: boolean
  plus2: boolean
  comment?: string
  isDeleted?: boolean
  updatedAt?: number
}
