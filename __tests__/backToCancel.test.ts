import { act, renderHook } from '@testing-library/react'
import useTimer from '@/features/timer/model/useTimer'
import { useBackToCancel } from '@/features/timer/model/useBackToCancel'
import { TimerMode, TimerStatus } from '@/features/timer/model/enums'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { Cube } from '@/entities/cube/model/types'

type Props = Parameters<typeof useTimer>[0]

class FakeCloseWatcher {
  static instances: FakeCloseWatcher[] = []
  onclose: (() => void) | null = null
  destroyed = false

  constructor() {
    FakeCloseWatcher.instances.push(this)
  }

  destroy() {
    this.destroyed = true
  }
}

describe('useBackToCancel', () => {
  beforeEach(() => {
    FakeCloseWatcher.instances = []
    vi.stubGlobal('CloseWatcher', FakeCloseWatcher)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('does not watch while the timer is idle', () => {
    renderHook(() => useBackToCancel(false, vi.fn()))

    expect(FakeCloseWatcher.instances).toHaveLength(0)
  })

  it('cancels through the latest callback when back is pressed', () => {
    const first = vi.fn()
    const second = vi.fn()
    const { rerender } = renderHook(({ onCancel }) => useBackToCancel(true, onCancel), {
      initialProps: { onCancel: first }
    })

    rerender({ onCancel: second })
    FakeCloseWatcher.instances[0].onclose?.()

    expect(FakeCloseWatcher.instances).toHaveLength(1)
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledTimes(1)
  })

  it('stops watching once the attempt is over, so the next back navigates', () => {
    const { rerender } = renderHook(({ active }) => useBackToCancel(active, vi.fn()), {
      initialProps: { active: true }
    })

    rerender({ active: false })

    expect(FakeCloseWatcher.instances[0].destroyed).toBe(true)
  })

  it('leaves back alone where CloseWatcher does not exist', () => {
    vi.stubGlobal('CloseWatcher', undefined)

    expect(() => renderHook(() => useBackToCancel(true, vi.fn()))).not.toThrow()
  })
})

describe('cancelling an attempt', () => {
  let root: HTMLDivElement
  let unmount: () => void

  const touch = (type: 'touchstart' | 'touchend', timeStamp: number) => {
    const event = new Event(type, { bubbles: true, cancelable: true })
    Object.defineProperty(event, 'changedTouches', { value: [{ identifier: 1 }] })
    Object.defineProperty(event, 'timeStamp', { value: timeStamp })
    act(() => {
      root.dispatchEvent(event)
    })
  }

  const setup = (overrides: Partial<Props> = {}) => {
    const props: Props = {
      isSolving: false,
      setTimerStatus: vi.fn((status) => useTimerStore.setState({ timerStatus: status })),
      selectedCube: { id: 'cube' } as Cube,
      inspectionRequired: true,
      setIsSolving: vi.fn(),
      setSolvingTime: vi.fn(),
      timerMode: TimerMode.NORMAL,
      settings: {
        timer: { holdToStart: false, holdToStartTime: 300, inspectionTime: 15000 },
        sounds: {}
      } as Props['settings'],
      onFinishSolve: vi.fn(),
      onCancelAttempt: vi.fn(),
      ...overrides
    }
    const hook = renderHook((current: Props) => useTimer(current), { initialProps: props })
    unmount = hook.unmount
    return { props, result: hook.result }
  }

  beforeEach(() => {
    vi.spyOn(performance, 'now').mockReturnValue(100_000)
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn(() => 1)
    )
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    root = document.createElement('div')
    root.id = 'touch'
    document.body.appendChild(root)
    useTimerStore.setState({ timerStatus: TimerStatus.IDLE, isSolving: false })
  })

  afterEach(() => {
    unmount?.()
    root.remove()
    useTimerStore.getState().reset()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('ends an inspection without saving, and the next touch starts a fresh one', () => {
    const { props, result } = setup()

    touch('touchstart', 1000)
    touch('touchend', 1100)
    expect(useTimerStore.getState().timerStatus).toBe(TimerStatus.INSPECTING)

    act(() => result.current.cancelAttempt())

    expect(useTimerStore.getState().timerStatus).toBe(TimerStatus.IDLE)
    expect(props.onFinishSolve).not.toHaveBeenCalled()
    expect(props.onCancelAttempt).toHaveBeenCalledTimes(1)

    touch('touchstart', 2000)
    expect(useTimerStore.getState().timerStatus).toBe(TimerStatus.INSPECTING)
  })

  it('discards a running solve without saving it', () => {
    const { props, result } = setup({ inspectionRequired: false, isSolving: true })
    useTimerStore.setState({ timerStatus: TimerStatus.SOLVING, isSolving: true })

    act(() => result.current.cancelAttempt())

    expect(useTimerStore.getState().isSolving).toBe(false)
    expect(useTimerStore.getState().timerStatus).toBe(TimerStatus.IDLE)
    expect(props.onFinishSolve).not.toHaveBeenCalled()
    expect(props.onCancelAttempt).toHaveBeenCalledTimes(1)
  })

  it('restores the display the same way when Escape cancels', () => {
    const { props } = setup()

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }))
    })

    expect(props.onCancelAttempt).toHaveBeenCalledTimes(1)
  })
})
