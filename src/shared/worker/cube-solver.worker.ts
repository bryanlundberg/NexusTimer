import { loadSolver } from '@nexustimer/cube-solver-rs/web'
import type { SolverRequest, SolverResponse, SolverTask } from '@/shared/lib/timer/cubeSolverClient'

const scope = self as unknown as DedicatedWorkerGlobalScope

loadSolver().catch(() => {})

async function run(task: SolverTask) {
  const solver = await loadSolver()
  return task.kind === 'hints'
    ? solver.crossHints(task.scramble)
    : solver.transition(task.history, task.setup, task.goal)
}

self.onmessage = async (event: MessageEvent<SolverRequest>) => {
  const { id, task } = event.data
  let response: SolverResponse = { id, value: null, fatal: false }
  try {
    response = { id, value: await run(task), fatal: false }
  } catch (error) {
    response = { id, value: null, fatal: error instanceof WebAssembly.RuntimeError }
  }
  scope.postMessage(response)
}
