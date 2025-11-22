// <reference lib="webworker" />
import calcStatistics from '@/lib/calcStatistics'
import { Cube } from '@/entities/cube/model/types'

type InMsg = {
  command: 'start'
  data: {
    cubes: Cube[]
    selectedCube: Cube
  }
}

self.onmessage = (event: MessageEvent<InMsg>) => {
  const { command, data } = event.data
  if (command === 'start') {
    const { global, session, cubeSession } = calcStatistics({
      cubesDB: data.cubes,
      selectedCube: data.selectedCube
    })

    ;(self as unknown as DedicatedWorkerGlobalScope).postMessage({
      result: {
        global,
        session,
        cubeSession
      }
    })
  }
}
