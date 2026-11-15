import type { CurrentBackup } from '@nexustimer/contracts'

type PullSchedulerOptions = {
  run: (known: CurrentBackup | undefined) => Promise<void>
  ready: () => Promise<void>
  delayMs?: number
}

export type PullScheduler = {
  request(known?: CurrentBackup): void
  dispose(): void
}

export function createPullScheduler({ run, ready, delayMs = 1000 }: PullSchedulerOptions): PullScheduler {
  let timer: ReturnType<typeof setTimeout> | undefined
  let running = false
  let pending = false
  let fresh = false
  let known: CurrentBackup | undefined
  let disposed = false

  const schedule = () => {
    if (timer || disposed) return
    timer = setTimeout(() => void flush(), delayMs)
  }

  const flush = async () => {
    timer = undefined
    if (running || disposed || !pending) return
    running = true
    try {
      await ready()
      if (disposed) return
      const target = fresh ? undefined : known
      pending = false
      fresh = false
      known = undefined
      await run(target)
    } catch (error) {
      console.error(error)
    } finally {
      running = false
      if (pending) schedule()
    }
  }

  return {
    request(backup) {
      if (disposed) return
      pending = true
      if (!backup) {
        fresh = true
        known = undefined
      } else if (!fresh) {
        known = backup
      }
      if (!running) schedule()
    },
    dispose() {
      disposed = true
      clearTimeout(timer)
      timer = undefined
    }
  }
}
