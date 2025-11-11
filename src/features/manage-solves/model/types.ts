import { SolveTab } from '@/features/manage-solves/model/enums'

export type DeleteSolveDTO = {
  cubeId: string
  solveId: string
  solveTab: SolveTab
}

export type ToggleDNFSolveDTO = {
  cubeId: string
  solveId: string
  dnf: boolean
  solveTab: SolveTab
}

export type TogglePlus2SolveDTO = {
  cubeId: string
  solveId: string
  plus2: boolean
  solveTab: SolveTab
}

export type ToggleBookmarkSolveDTO = {
  cubeId: string
  solveId: string
  bookmark: boolean
  solveTab: SolveTab
}
