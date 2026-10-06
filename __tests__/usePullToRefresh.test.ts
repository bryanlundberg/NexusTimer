import { act, renderHook } from '@testing-library/react'
import { PULL_TRIGGER_OFFSET, usePullToRefresh } from '@/shared/model/usePullToRefresh'
import { triggerHaptic } from '@/shared/model/useHaptics'

vi.mock('@/shared/model/useHaptics', () => ({ triggerHaptic: vi.fn() }))

let scroller: HTMLDivElement
let item: HTMLButtonElement

const setScrollTop = (value: number) => {
  Object.defineProperty(scroller, 'scrollTop', { value, configurable: true })
}

const touch = (type: string, point: { x?: number; y: number } | null, target: Element = item) => {
  const event = new Event(type, { bubbles: true, cancelable: true })
  const touches = point === null ? [] : [{ clientX: point.x ?? 0, clientY: point.y }]
  Object.defineProperty(event, 'touches', { value: touches })
  act(() => {
    target.dispatchEvent(event)
  })
}

const pull = (to: number, from = 0) => {
  touch('touchstart', { y: from })
  touch('touchmove', { y: from + 10 })
  touch('touchmove', { y: to })
}

const mount = (onRefresh: () => unknown = vi.fn()) => {
  const scrollerRef = { current: scroller }
  return renderHook(() => usePullToRefresh(scrollerRef, onRefresh))
}

beforeEach(() => {
  scroller = document.createElement('div')
  item = document.createElement('button')
  scroller.append(item)
  document.body.append(scroller)
  setScrollTop(0)
})

afterEach(() => {
  scroller.remove()
  vi.useRealTimers()
})

describe('usePullToRefresh', () => {
  it('follows the finger while pulling down at the top', () => {
    const { result } = mount()

    pull(100)

    expect(result.current.dragging).toBe(true)
    expect(result.current.offset).toBeGreaterThan(0)
    expect(result.current.offset).toBeLessThan(PULL_TRIGGER_OFFSET)
  })

  it('springs back without refreshing when released before the trigger point', () => {
    const onRefresh = vi.fn()
    const { result } = mount(onRefresh)

    pull(60)
    touch('touchend', null)

    expect(result.current).toEqual({ offset: 0, dragging: false, refreshing: false })
    expect(onRefresh).not.toHaveBeenCalled()
  })

  it('refreshes when released past the trigger point and settles once it finishes', async () => {
    vi.useFakeTimers()
    let finish = () => {}
    const onRefresh = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finish = () => resolve()
        })
    )
    const { result } = mount(onRefresh)

    pull(400)
    expect(triggerHaptic).toHaveBeenCalledTimes(1)
    touch('touchend', null)

    await act(() => vi.advanceTimersByTimeAsync(0))
    expect(onRefresh).toHaveBeenCalledTimes(1)
    expect(result.current).toEqual({ offset: PULL_TRIGGER_OFFSET, dragging: false, refreshing: true })

    await act(() => vi.advanceTimersByTimeAsync(1000))
    expect(result.current.refreshing).toBe(true)

    await act(async () => finish())
    expect(result.current).toEqual({ offset: 0, dragging: false, refreshing: false })
  })

  it('keeps the spinner for a minimum time when the refresh is instant', async () => {
    vi.useFakeTimers()
    const { result } = mount(vi.fn())

    pull(400)
    touch('touchend', null)
    await act(() => vi.advanceTimersByTimeAsync(100))
    expect(result.current.refreshing).toBe(true)

    await act(() => vi.advanceTimersByTimeAsync(600))
    expect(result.current.refreshing).toBe(false)
  })

  it('ignores new pulls while a refresh is running', async () => {
    vi.useFakeTimers()
    const onRefresh = vi.fn(() => new Promise(() => {}))
    const { result } = mount(onRefresh)

    pull(400)
    touch('touchend', null)
    await act(() => vi.advanceTimersByTimeAsync(0))
    pull(400)
    touch('touchend', null)
    await act(() => vi.advanceTimersByTimeAsync(0))

    expect(onRefresh).toHaveBeenCalledTimes(1)
    expect(result.current.offset).toBe(PULL_TRIGGER_OFFSET)
  })

  it('stays capped no matter how far it is pulled', () => {
    const { result } = mount()

    pull(5000)

    expect(result.current.offset).toBeLessThanOrEqual(96)
  })

  it('does nothing while the list can still scroll up', () => {
    setScrollTop(40)
    const { result } = mount()

    pull(400)

    expect(result.current.offset).toBe(0)
  })

  it('does nothing while an inner list under the finger is scrolled', () => {
    const inner = document.createElement('div')
    Object.defineProperty(inner, 'scrollTop', { value: 20, configurable: true })
    inner.append(item)
    scroller.append(inner)
    const { result } = mount()

    pull(400)

    expect(result.current.offset).toBe(0)
  })

  it('measures the pull from where the list reached the top', () => {
    setScrollTop(40)
    const { result } = mount()

    touch('touchstart', { y: 100 })
    touch('touchmove', { y: 150 })
    setScrollTop(0)
    touch('touchmove', { y: 200 })
    expect(result.current.offset).toBe(0)

    touch('touchmove', { y: 260 })
    expect(result.current.offset).toBeCloseTo(96 * (1 - Math.exp(-60 / 110)), 5)
  })

  it('lets horizontal swipes through', () => {
    const { result } = mount()

    touch('touchstart', { x: 0, y: 0 })
    touch('touchmove', { x: 40, y: 10 })
    touch('touchmove', { x: 60, y: 300 })

    expect(result.current.offset).toBe(0)
  })

  it('backs off when another handler claims the drag', () => {
    const { result } = mount()
    item.addEventListener('touchmove', (event) => event.preventDefault())

    pull(400)

    expect(result.current.offset).toBe(0)
  })

  it('cancels on touchcancel without refreshing', () => {
    const onRefresh = vi.fn()
    const { result } = mount(onRefresh)

    pull(400)
    touch('touchcancel', null)

    expect(result.current.offset).toBe(0)
    expect(onRefresh).not.toHaveBeenCalled()
  })

  it('ignores touches that start outside the scroller', () => {
    const { result } = mount()
    const outside = document.createElement('div')
    document.body.append(outside)

    touch('touchstart', { y: 0 }, outside)
    touch('touchmove', { y: 10 }, outside)
    touch('touchmove', { y: 400 }, outside)

    expect(result.current.offset).toBe(0)
    outside.remove()
  })
})
