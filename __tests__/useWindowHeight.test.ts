import { act, renderHook } from '@testing-library/react'
import { useWindowHeight } from '@/shared/model/useWindowHeight'

const resizeTo = (height: number) => {
  Object.defineProperty(window, 'innerHeight', { value: height, configurable: true, writable: true })
  window.dispatchEvent(new Event('resize'))
}

describe('useWindowHeight', () => {
  const initial = window.innerHeight

  afterEach(() => {
    Object.defineProperty(window, 'innerHeight', { value: initial, configurable: true, writable: true })
  })

  it('returns the current window height', () => {
    resizeTo(800)
    const { result } = renderHook(() => useWindowHeight())

    expect(result.current).toBe(800)
  })

  it('updates on resize', () => {
    resizeTo(800)
    const { result } = renderHook(() => useWindowHeight())

    act(() => resizeTo(420))

    expect(result.current).toBe(420)
  })

  it('stops listening after unmount', () => {
    const remove = vi.spyOn(window, 'removeEventListener')
    const { unmount } = renderHook(() => useWindowHeight())

    unmount()

    expect(remove).toHaveBeenCalledWith('resize', expect.any(Function))
  })
})
