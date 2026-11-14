import { registerBackDismiss } from '@/shared/lib/backDismiss'

function setPointer(coarse: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({ matches: coarse }) as unknown as typeof window.matchMedia
}

function nextPopState() {
  return new Promise<void>((resolve) => {
    window.addEventListener('popstate', () => setTimeout(resolve, 0), { once: true })
  })
}

async function flush() {
  await Promise.resolve()
}

function depth() {
  return window.history.state?.__overlayDepth ?? 0
}

describe('registerBackDismiss', () => {
  beforeEach(() => {
    setPointer(true)
  })

  it('does nothing on fine pointers', async () => {
    setPointer(false)
    const length = window.history.length
    const release = registerBackDismiss(vi.fn())
    await flush()
    expect(window.history.length).toBe(length)
    release()
  })

  it('closes the overlay when the user goes back', async () => {
    const close = vi.fn()
    const release = registerBackDismiss(close)
    await flush()
    expect(depth()).toBe(1)

    const popped = nextPopState()
    window.history.back()
    await popped

    expect(close).toHaveBeenCalledTimes(1)
    expect(depth()).toBe(0)
    release()
  })

  it('removes its history entry when closed some other way', async () => {
    const close = vi.fn()
    const release = registerBackDismiss(close)
    await flush()
    expect(depth()).toBe(1)

    const popped = nextPopState()
    release()
    await popped

    expect(close).not.toHaveBeenCalled()
    expect(depth()).toBe(0)
  })

  it('reuses the entry when one overlay replaces another', async () => {
    const releaseFirst = registerBackDismiss(vi.fn())
    await flush()
    const length = window.history.length

    releaseFirst()
    const close = vi.fn()
    const releaseSecond = registerBackDismiss(close)
    await flush()

    expect(window.history.length).toBe(length)
    expect(depth()).toBe(1)

    const popped = nextPopState()
    window.history.back()
    await popped
    expect(close).toHaveBeenCalledTimes(1)
    releaseSecond()
  })

  it('closes only the top overlay per back press', async () => {
    const closeOuter = vi.fn()
    const closeInner = vi.fn()
    const releaseOuter = registerBackDismiss(closeOuter)
    const releaseInner = registerBackDismiss(closeInner)
    await flush()
    expect(depth()).toBe(2)

    let popped = nextPopState()
    window.history.back()
    await popped
    expect(closeInner).toHaveBeenCalledTimes(1)
    expect(closeOuter).not.toHaveBeenCalled()
    releaseInner()

    popped = nextPopState()
    window.history.back()
    await popped
    expect(closeOuter).toHaveBeenCalledTimes(1)
    releaseOuter()
  })

  it('leaves history alone when the page navigated while open', async () => {
    const release = registerBackDismiss(vi.fn())
    await flush()

    window.history.pushState({}, '', '/other')
    const length = window.history.length
    release()
    await flush()
    await new Promise((resolve) => setTimeout(resolve, 20))

    expect(window.history.length).toBe(length)
    expect(window.location.pathname).toBe('/other')
  })
})
