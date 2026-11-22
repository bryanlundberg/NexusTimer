import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { TimerMode } from '@/features/timer/model/enums'
import { useVirtualKeymapStore } from '@/features/timer/model/useVirtualKeymapStore'

export function useIsShortcutFree(code: string) {
  const isVirtual = useTimerStore((state) => state.timerMode === TimerMode.VIRTUAL)
  const isMapped = useVirtualKeymapStore((state) => code in state.keymap)
  return !(isVirtual && isMapped)
}
