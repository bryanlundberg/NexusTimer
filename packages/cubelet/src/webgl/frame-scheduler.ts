export interface FrameScheduler {
  request(callback: (now: number) => void): number
  cancel(handle: number): void
}

export const animationFrameScheduler: FrameScheduler = {
  request: (callback) => requestAnimationFrame(callback),
  cancel: (handle) => cancelAnimationFrame(handle)
}
