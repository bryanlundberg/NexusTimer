// <reference lib="webworker" />
import cubeSolver from 'cube-solver'

cubeSolver.initialize('cross')
cubeSolver.initialize('xcross')
cubeSolver.initialize('kociemba')

type SolveTask = { scramble: string; type: 'cross' | 'xcross' | 'kociemba' }

type InMsg = {
  id: number
  tasks: SolveTask[]
}

type OutMsg = {
  id: number
  results: string[]
}

self.onmessage = (event: MessageEvent<InMsg>) => {
  const { id, tasks } = event.data
  const results = tasks.map((task) => cubeSolver.solve(task.scramble, task.type))
  ;(self as unknown as DedicatedWorkerGlobalScope).postMessage({ id, results } satisfies OutMsg)
}
