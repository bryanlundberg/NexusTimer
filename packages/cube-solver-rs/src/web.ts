import init, { crossHints, solveTransition } from '../pkg/cube_solver_rs.js'
import { toCrossHints, type CubeSolver } from './index'

export * from './index'

const solver: CubeSolver = {
  crossHints: (scramble) => toCrossHints(crossHints(scramble)),
  transition: solveTransition
}

let loading: Promise<CubeSolver> | undefined

export function loadSolver(): Promise<CubeSolver> {
  loading ??= init({ module_or_path: new URL('../pkg/cube_solver_rs_bg.wasm', import.meta.url) }).then(
    () => solver,
    (error: unknown) => {
      loading = undefined
      throw error
    }
  )
  return loading
}
