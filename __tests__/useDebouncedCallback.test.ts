import { renderHook } from '@testing-library/react'
import { useDebouncedCallback } from '@/shared/model/useDebouncedCallback'

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('calls once with the last arguments after the delay', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(callback, 300))

    result.current('a')
    vi.advanceTimersByTime(200)
    result.current('ab')
    vi.advanceTimersByTime(299)
    expect(callback).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(callback).toHaveBeenCalledOnce()
    expect(callback).toHaveBeenCalledWith('ab')
  })

  it('drops the pending call on cancel', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(callback, 300))

    result.current('a')
    result.current.cancel()
    vi.advanceTimersByTime(300)

    expect(callback).not.toHaveBeenCalled()
  })

  it('drops the pending call on unmount', () => {
    const callback = vi.fn()
    const { result, unmount } = renderHook(() => useDebouncedCallback(callback, 300))

    result.current('a')
    unmount()
    vi.advanceTimersByTime(300)

    expect(callback).not.toHaveBeenCalled()
  })

  it('invokes the latest callback without changing identity', () => {
    const first = vi.fn()
    const second = vi.fn()
    const { result, rerender } = renderHook(({ callback }) => useDebouncedCallback(callback, 300), {
      initialProps: { callback: first }
    })
    const initial = result.current

    result.current('a')
    rerender({ callback: second })
    vi.advanceTimersByTime(300)

    expect(result.current).toBe(initial)
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledWith('a')
  })
})
