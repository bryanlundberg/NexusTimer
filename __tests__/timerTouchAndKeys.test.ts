import { act, renderHook } from '@testing-library/react'
import useTimer from '@/features/timer/model/useTimer'
import { TimerMode, TimerStatus } from '@/features/timer/model/enums'
import { Cube } from '@/entities/cube/model/types'

type Props = Parameters<typeof useTimer>[0]

const settingsWith = (timer: Record<string, unknown> = {}) => ({
  timer: { holdToStart: false, holdToStartTime: 300, inspectionTime: 15000, ...timer },
  sounds: {}
})

const touch = (type: 'touchstart' | 'touchend', target: Element, timeStamp: number, identifier = 1) => {
  const event = new Event(type, { bubbles: true, cancelable: true })
  Object.defineProperty(event, 'changedTouches', { value: [{ identifier }] })
  Object.defineProperty(event, 'timeStamp', { value: timeStamp })
  act(() => {
    target.dispatchEvent(event)
  })
}

const key = (type: 'keydown' | 'keyup', code: string, repeat = false) => {
  act(() => {
    window.dispatchEvent(new KeyboardEvent(type, { code, repeat }))
  })
}

describe('timer touch and keyboard input', () => {
  let root: HTMLDivElement
  let child: HTMLSpanElement
  let unmount: () => void
  let frames: FrameRequestCallback[]

  beforeEach(() => {
    frames = []
    vi.spyOn(performance, 'now').mockReturnValue(100_000)
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => frames.push(callback))
    )
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    root = document.createElement('div')
    root.id = 'touch'
    child = document.createElement('span')
    child.id = 'touch'
    root.appendChild(child)
    document.body.appendChild(root)
  })

  afterEach(() => {
    unmount?.()
    root.remove()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  const setup = (overrides: Partial<Props> = {}) => {
    const props: Props = {
      isSolving: false,
      setTimerStatus: vi.fn(),
      selectedCube: { id: 'cube' } as Cube,
      inspectionRequired: false,
      setIsSolving: vi.fn(),
      setSolvingTime: vi.fn(),
      timerMode: TimerMode.NORMAL,
      settings: settingsWith(),
      onFinishSolve: vi.fn(),
      ...overrides
    }
    const hook = renderHook((current: Props) => useTimer(current), { initialProps: props })
    unmount = hook.unmount
    return { props, rerender: (next: Partial<Props>) => hook.rerender({ ...props, ...next }) }
  }

  it('starts the solve when the touched element is removed before the finger lifts', () => {
    const { props, rerender } = setup()

    touch('touchstart', child, 1000)
    child.remove()
    rerender({})
    touch('touchend', child, 1150)

    expect(props.setIsSolving).toHaveBeenCalledWith(true)
  })

  it('lets the next touch hold after inspection started on an element that was replaced', () => {
    const { props, rerender } = setup({ inspectionRequired: true })

    touch('touchstart', child, 1000)
    expect(props.setTimerStatus).toHaveBeenLastCalledWith(TimerStatus.INSPECTING)
    child.remove()
    rerender({})
    touch('touchend', child, 1100)

    touch('touchstart', root, 3000)
    touch('touchend', root, 3100)

    expect(props.setIsSolving).toHaveBeenCalledWith(true)
  })

  it('handles a touch once even when it lands inside nested touch areas', () => {
    const { props } = setup({ inspectionRequired: true })

    touch('touchstart', child, 1000)
    touch('touchend', child, 1100)
    touch('touchstart', child, 2000)
    touch('touchend', child, 2100)

    expect(props.setIsSolving).toHaveBeenCalledTimes(1)
  })

  it('measures hold to start from the touch times', () => {
    const { props } = setup({ settings: settingsWith({ holdToStart: true, holdToStartTime: 300 }) })

    touch('touchstart', root, 1000)
    touch('touchend', root, 1200)
    expect(props.setIsSolving).not.toHaveBeenCalled()
    expect(props.setTimerStatus).toHaveBeenLastCalledWith(TimerStatus.IDLE)

    touch('touchstart', root, 2000)
    touch('touchend', root, 2400)
    expect(props.setIsSolving).toHaveBeenCalledWith(true)
  })

  it('starts on a quick tap after a previous solve', () => {
    const { props, rerender } = setup()

    touch('touchstart', root, 1000)
    touch('touchend', root, 1050)
    rerender({ isSolving: true })
    touch('touchstart', root, 5000)
    touch('touchend', root, 5100)
    rerender({ isSolving: false })

    touch('touchstart', root, 6000)
    touch('touchend', root, 6005)

    expect(props.setIsSolving).toHaveBeenCalledTimes(2)
  })

  it('keeps inspecting past the limit instead of resetting', () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'setTimeout', 'clearTimeout'] })
    try {
      const { props } = setup({ inspectionRequired: true })

      touch('touchstart', root, 1000)
      touch('touchend', root, 1100)
      act(() => {
        vi.advanceTimersByTime(20_000)
      })

      expect(props.setTimerStatus).toHaveBeenLastCalledWith(TimerStatus.INSPECTING)
      expect(props.setTimerStatus).not.toHaveBeenCalledWith(TimerStatus.IDLE)
    } finally {
      vi.useRealTimers()
    }
  })

  describe('inspection penalties', () => {
    const solveStartingAt = (startsAt: number) => {
      const { props, rerender } = setup({ inspectionRequired: true })

      touch('touchstart', root, 1000)
      touch('touchend', root, 1100)
      touch('touchstart', root, startsAt - 100)
      touch('touchend', root, startsAt)
      rerender({ isSolving: true })
      touch('touchstart', root, startsAt + 10_000)
      act(() => frames.at(-1)?.(0))

      return props.onFinishSolve
    }

    it('adds no penalty when the solve starts within the inspection time', () => {
      expect(solveStartingAt(15_900)).toHaveBeenCalledWith('none')
    })

    it('adds +2 when the solve starts in the 2 seconds after it', () => {
      expect(solveStartingAt(17_500)).toHaveBeenCalledWith('plus2')
    })

    it('marks the solve DNF when it starts later than that', () => {
      expect(solveStartingAt(18_200)).toHaveBeenCalledWith('dnf')
    })
  })

  it('ignores held keys repeating while the solve runs', () => {
    const { props, rerender } = setup()

    key('keydown', 'Space')
    key('keyup', 'Space')
    rerender({ isSolving: true })
    const stops = () => vi.mocked(props.setTimerStatus).mock.calls.filter(([s]) => s === TimerStatus.IDLE).length
    const before = stops()

    key('keydown', 'KeyA', true)
    expect(stops()).toBe(before)

    key('keydown', 'KeyA')
    expect(stops()).toBe(before + 1)
  })
})
