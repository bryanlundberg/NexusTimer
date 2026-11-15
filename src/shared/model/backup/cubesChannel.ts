const CHANNEL = 'nx-cubes'

let channel: BroadcastChannel | null = null
const listeners = new Set<() => void>()

function ensureChannel() {
  if (channel || typeof BroadcastChannel === 'undefined') return channel
  channel = new BroadcastChannel(CHANNEL)
  channel.onmessage = () => {
    for (const listener of listeners) listener()
  }
  return channel
}

export function announceCubesChanged() {
  try {
    ensureChannel()?.postMessage('changed')
  } catch {}
}

export function onCubesChangedElsewhere(listener: () => void) {
  ensureChannel()
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
