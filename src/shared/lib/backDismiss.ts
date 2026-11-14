const DEPTH_KEY = '__overlayDepth'
const TOUCH_QUERY = '(pointer: coarse)'

type Overlay = { close: () => void }

const stack: Overlay[] = []
let lastDepth = 0
let skipping = false
let scheduled = false
let installed = false

function historyDepth() {
  return Number(window.history.state?.[DEPTH_KEY]) || 0
}

function pushMissingEntries() {
  scheduled = false
  for (let depth = historyDepth() + 1; depth <= stack.length; depth++) {
    window.history.pushState({ ...window.history.state, [DEPTH_KEY]: depth }, '')
  }
}

function scheduleSync() {
  if (scheduled) return
  scheduled = true
  queueMicrotask(pushMissingEntries)
}

function skip(delta: number) {
  skipping = true
  window.history.go(delta)
}

function handlePopState() {
  const previous = lastDepth
  const current = historyDepth()
  lastDepth = current

  if (skipping) {
    skipping = false
    return
  }

  const openBefore = stack.length
  while (stack.length > current) stack.pop()?.close()

  if (current < previous && previous > openBefore) {
    skip(stack.length - current - 1)
    return
  }

  if (current > stack.length) skip(stack.length - current)
}

function install() {
  if (installed) return
  installed = true
  lastDepth = historyDepth()

  const push = window.history.pushState
  const replace = window.history.replaceState

  window.history.pushState = function (this: History, ...args: Parameters<History['pushState']>) {
    const reuseLeftover = args[2] != null && historyDepth() > stack.length
    const result = (reuseLeftover ? replace : push).apply(this, args)
    lastDepth = historyDepth()
    return result
  }

  window.history.replaceState = function (this: History, data: unknown, unused: string, url?: string | URL | null) {
    const depth = historyDepth()
    const keepDepth = depth > 0 && typeof data === 'object' && data !== null && !(DEPTH_KEY in data)
    const result = replace.call(this, keepDepth ? { ...data, [DEPTH_KEY]: depth } : data, unused, url)
    lastDepth = historyDepth()
    return result
  }

  window.addEventListener('popstate', handlePopState)
}

export function registerBackDismiss(close: () => void) {
  if (typeof window === 'undefined') return () => {}
  if (typeof window.matchMedia !== 'function' || !window.matchMedia(TOUCH_QUERY).matches) return () => {}

  install()

  const overlay: Overlay = { close }
  stack.push(overlay)
  scheduleSync()

  return () => {
    const index = stack.indexOf(overlay)
    if (index !== -1) stack.splice(index, 1)
  }
}
