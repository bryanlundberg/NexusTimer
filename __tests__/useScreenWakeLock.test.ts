import { act, renderHook } from '@testing-library/react'
import { useScreenWakeLock } from '@/shared/model/useScreenWakeLock'

type FakeSentinel = { released: boolean; release: ReturnType<typeof vi.fn> }

let sentinels: FakeSentinel[]
let request: ReturnType<typeof vi.fn>

const setVisibility = (state: DocumentVisibilityState) => {
  Object.defineProperty(document, 'visibilityState', { value: state, configurable: true })
}

const flush = () => act(async () => {})

beforeEach(() => {
  sentinels = []
  request = vi.fn(async () => {
    const sentinel: FakeSentinel = {
      released: false,
      release: vi.fn(async () => {
        sentinel.released = true
      })
    }
    sentinels.push(sentinel)
    return sentinel
  })
  Object.defineProperty(navigator, 'wakeLock', { value: { request }, configurable: true })
  setVisibility('visible')
})

afterEach(() => {
  Reflect.deleteProperty(navigator, 'wakeLock')
})

describe('useScreenWakeLock', () => {
  it('requests a screen lock on mount and releases it on unmount', async () => {
    const { unmount } = renderHook(() => useScreenWakeLock())
    await flush()

    expect(request).toHaveBeenCalledWith('screen')

    unmount()
    expect(sentinels[0].release).toHaveBeenCalledOnce()
  })

  it('does nothing when disabled', async () => {
    renderHook(() => useScreenWakeLock(false))
    await flush()

    expect(request).not.toHaveBeenCalled()
  })

  it('reacquires the lock when the page becomes visible again', async () => {
    renderHook(() => useScreenWakeLock())
    await flush()

    sentinels[0].released = true
    setVisibility('hidden')
    document.dispatchEvent(new Event('visibilitychange'))
    await flush()
    expect(request).toHaveBeenCalledTimes(1)

    setVisibility('visible')
    document.dispatchEvent(new Event('visibilitychange'))
    await flush()
    expect(request).toHaveBeenCalledTimes(2)
  })

  it('does not stack locks while one is still held', async () => {
    renderHook(() => useScreenWakeLock())
    await flush()

    document.dispatchEvent(new Event('visibilitychange'))
    await flush()

    expect(request).toHaveBeenCalledTimes(1)
  })

  it('releases a lock that resolves after unmount', async () => {
    const { unmount } = renderHook(() => useScreenWakeLock())
    unmount()
    await flush()

    expect(sentinels[0].release).toHaveBeenCalledOnce()
  })

  it('swallows request failures', async () => {
    request.mockRejectedValueOnce(new DOMException('Not allowed', 'NotAllowedError'))

    renderHook(() => useScreenWakeLock())
    await flush()

    expect(request).toHaveBeenCalledOnce()
  })

  it('is a no-op when the API is unsupported', async () => {
    Reflect.deleteProperty(navigator, 'wakeLock')

    expect(() => renderHook(() => useScreenWakeLock())).not.toThrow()
  })
})
