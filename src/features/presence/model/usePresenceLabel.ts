import { useSyncExternalStore } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import dayjs from '@/shared/lib/dayjs'
import { resolvePresenceDisplay, type PresenceState } from '@/features/presence/model/usePresence'

const TICK_MS = 60_000

let tick = 0
let timer: ReturnType<typeof setInterval> | undefined
const listeners = new Set<() => void>()

function subscribeTick(listener: () => void) {
  listeners.add(listener)
  timer ??= setInterval(() => {
    tick++
    for (const l of listeners) l()
  }, TICK_MS)

  return () => {
    listeners.delete(listener)
    if (listeners.size > 0) return
    clearInterval(timer)
    timer = undefined
  }
}

export function usePresenceLabel(presence?: PresenceState | null): string | null {
  const t = useTranslations('Index.Presence')
  const locale = useLocale()

  useSyncExternalStore(
    subscribeTick,
    () => tick,
    () => 0
  )

  const display = resolvePresenceDisplay(presence)
  if (display !== 'offline') return t(display)
  if (!presence?.lastSeen) return null

  return t('last-seen', { time: dayjs(presence.lastSeen).locale(locale).fromNow() })
}

export default usePresenceLabel
