import { renderHook } from '@testing-library/react'
import { eventTime } from '@/features/timer/lib/eventTime'
import useTimerControls from '@/features/timer/model/useTimerControls'

const eventAt = (timeStamp: number) => ({ timeStamp }) as Event

describe('eventTime', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('uses the event timestamp when it is on the performance clock', () => {
    vi.spyOn(performance, 'now').mockReturnValue(5000)
    expect(eventTime(eventAt(4200))).toBe(4200)
  })

  it('falls back to now when the event has no timestamp', () => {
    vi.spyOn(performance, 'now').mockReturnValue(5000)
    expect(eventTime(eventAt(0))).toBe(5000)
  })

  it('falls back to now when the timestamp is on another clock', () => {
    vi.spyOn(performance, 'now').mockReturnValue(5000)
    expect(eventTime(eventAt(1_760_000_000_000))).toBe(5000)
  })
})

describe('useTimerControls', () => {
  let frames: FrameRequestCallback[]

  beforeEach(() => {
    frames = []
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => frames.push(callback))
    )
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  const setup = () => {
    const setSolvingTime = vi.fn()
    const { result } = renderHook(() =>
      useTimerControls({ setSolvingTime, setIsSolving: vi.fn(), setTimerStatus: vi.fn() })
    )
    return { controls: result.current, setSolvingTime }
  }

  it('keeps the time of the stop event, not the last painted frame', () => {
    const now = vi.spyOn(performance, 'now')
    const { controls, setSolvingTime } = setup()

    controls.startTimer(0, 1000)
    now.mockReturnValue(1200)
    frames.shift()?.(1200)
    expect(setSolvingTime).toHaveBeenLastCalledWith(200)

    now.mockReturnValue(1300)
    controls.stopTimer(1234.5)
    expect(setSolvingTime).toHaveBeenLastCalledWith(234.5)
  })

  it('does not add the delay of a blocked main thread', () => {
    const now = vi.spyOn(performance, 'now')
    const { controls, setSolvingTime } = setup()

    controls.startTimer(0, 1000)
    now.mockReturnValue(3000)
    controls.stopTimer(1500)
    expect(setSolvingTime).toHaveBeenLastCalledWith(500)
  })

  it('stops at the current time when no event time is given', () => {
    const now = vi.spyOn(performance, 'now')
    const { controls, setSolvingTime } = setup()

    controls.startTimer(0, 1000)
    now.mockReturnValue(1750)
    controls.stopTimer()
    expect(setSolvingTime).toHaveBeenLastCalledWith(750)
  })

  it('counts a resumed solve from how long ago it started', () => {
    const now = vi.spyOn(performance, 'now')
    const { controls, setSolvingTime } = setup()

    now.mockReturnValue(10_000)
    controls.startTimer(4000)
    controls.stopTimer(10_500)
    expect(setSolvingTime).toHaveBeenLastCalledWith(4500)
  })
})
