import { cubeMesh, cubeMeshPiece, hasCubeMesh, surfaceSlots, type CubieStyle } from './cube-mesh'

const SLICE_MS = 8

const nextTask = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0))

export async function prepareCubeMesh(size: number, style: CubieStyle, signal?: AbortSignal): Promise<void> {
  if (hasCubeMesh(size, style)) return
  let sliceStart = performance.now()
  for (const slot of surfaceSlots(size)) {
    if (signal?.aborted) return
    cubeMeshPiece(size, style, slot)
    if (performance.now() - sliceStart >= SLICE_MS) {
      await nextTask()
      sliceStart = performance.now()
    }
  }
  await nextTask()
  if (!signal?.aborted) cubeMesh(size, style)
}
