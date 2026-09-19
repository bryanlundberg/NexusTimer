import { act, renderHook } from '@testing-library/react'
import { useIsOnline } from '@/shared/model/useIsOnline'

const setOnline = (online: boolean) => {
  Object.defineProperty(navigator, 'onLine', { value: online, configurable: true })
}

const goOnline = (online: boolean) => {
  setOnline(online)
  window.dispatchEvent(new Event(online ? 'online' : 'offline'))
}

describe('useIsOnline', () => {
  afterEach(() => {
    setOnline(true)
  })

  it('reports offline on the first render when the device starts offline', () => {
    setOnline(false)
    const seen: boolean[] = []

    renderHook(() => seen.push(useIsOnline()))

    expect(seen[0]).toBe(false)
  })

  it('follows online and offline events', () => {
    setOnline(true)
    const { result } = renderHook(() => useIsOnline())
    expect(result.current).toBe(true)

    act(() => goOnline(false))
    expect(result.current).toBe(false)

    act(() => goOnline(true))
    expect(result.current).toBe(true)
  })

  it('stops listening after unmount', () => {
    const remove = vi.spyOn(window, 'removeEventListener')
    const { unmount } = renderHook(() => useIsOnline())

    unmount()

    expect(remove).toHaveBeenCalledWith('online', expect.any(Function))
    expect(remove).toHaveBeenCalledWith('offline', expect.any(Function))
  })
})
