import { TimerStatus } from '@/features/timer/model/enums'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { Cube } from '@/entities/cube/model/types'

type TimerSnapshot = { cubes: Cube[] | null; timerStatus: TimerStatus; isSolving: boolean }

export const canSyncNow = ({ cubes, timerStatus, isSolving }: TimerSnapshot) =>
  cubes !== null && timerStatus === TimerStatus.IDLE && !isSolving

export function waitForSyncWindow(): Promise<void> {
  if (canSyncNow(useTimerStore.getState())) return Promise.resolve()
  return new Promise((resolve) => {
    const unsubscribe = useTimerStore.subscribe((state) => {
      if (!canSyncNow(state)) return
      unsubscribe()
      resolve()
    })
  })
}
