const DEPTH_KEY = '__overlayDepth'
const TOUCH_QUERY = '(pointer: coarse)'

type Overlay = { close: () => void }

const stack: Overlay[] = []
let traversing = false
let scheduled = false
let listening = false

function historyDepth() {
  return Number(window.history.state?.[DEPTH_KEY]) || 0
}

function sync() {
  scheduled = false
  if (traversing) return

  const current = historyDepth()
  const wanted = stack.length

  if (current > wanted) {
    traversing = true
    window.history.go(wanted - current)
    return
  }

  for (let depth = current + 1; depth <= wanted; depth++) {
    window.history.pushState({ ...window.history.state, [DEPTH_KEY]: depth }, '')
  }
}

function scheduleSync() {
  if (scheduled) return
  scheduled = true
  queueMicrotask(sync)
}

function handlePopState() {
  if (traversing) {
    traversing = false
    sync()
    return
  }

  const current = historyDepth()
  while (stack.length > current) stack.pop()?.close()
  sync()
}

export function registerBackDismiss(close: () => void) {
  if (typeof window === 'undefined') return () => {}
  if (typeof window.matchMedia !== 'function' || !window.matchMedia(TOUCH_QUERY).matches) return () => {}

  if (!listening) {
    listening = true
    window.addEventListener('popstate', handlePopState)
  }

  const overlay: Overlay = { close }
  stack.push(overlay)
  scheduleSync()

  return () => {
    const index = stack.indexOf(overlay)
    if (index === -1) return
    stack.splice(index, 1)
    scheduleSync()
  }
}
