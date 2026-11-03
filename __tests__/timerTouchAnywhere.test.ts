import { act, renderHook } from '@testing-library/react'
import useTimer from '@/features/timer/model/useTimer'
import { TimerMode, TimerStatus } from '@/features/timer/model/enums'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { Cube } from '@/entities/cube/model/types'

type Props = Parameters<typeof useTimer>[0]

const touch = (target: Element, timeStamp: number) => {
  const event = new Event('touchstart', { bubbles: true, cancelable: true })
  Object.defineProperty(event, 'changedTouches', { value: [{ identifier: 1 }] })
  Object.defineProperty(event, 'timeStamp', { value: timeStamp })
  act(() => {
    target.dispatchEvent(event)
  })
}

describe('touching outside the timer area', () => {
  let area: HTMLDivElement
  let outside: HTMLDivElement
  let button: HTMLButtonElement
  let unmount: () => void

  const setup = (overrides: Partial<Props> = {}) => {
    const props: Props = {
      isSolving: true,
      setTimerStatus: vi.fn(),
      selectedCube: { id: 'cube' } as Cube,
      inspectionRequired: false,
      setIsSolving: vi.fn(),
      setSolvingTime: vi.fn(),
      timerMode: TimerMode.NORMAL,
      settings: {
        timer: { holdToStart: false, holdToStartTime: 300, inspectionTime: 15000 },
        sounds: {}
      } as Props['settings'],
      onFinishSolve: vi.fn(),
      touchAnywhereWhileActive: true,
      ...overrides
    }
    unmount = renderHook((current: Props) => useTimer(current), { initialProps: props }).unmount
    return props
  }

  beforeEach(() => {
    vi.spyOn(performance, 'now').mockReturnValue(100_000)
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn(() => 1)
    )
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    area = document.createElement('div')
    area.id = 'touch'
    outside = document.createElement('div')
    button = document.createElement('button')
    outside.appendChild(button)
    document.body.append(area, outside)
    useTimerStore.setState({ isSolving: true, timerStatus: TimerStatus.SOLVING })
  })

  afterEach(() => {
    unmount?.()
    area.remove()
    outside.remove()
    useTimerStore.getState().reset()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('stops a running solve', () => {
    const props = setup()

    touch(outside, 1000)

    expect(props.setTimerStatus).toHaveBeenCalledWith(TimerStatus.IDLE)
  })

  it('handles a touch inside the area only once', () => {
    const props = setup()

    touch(area, 1000)

    expect(vi.mocked(props.setTimerStatus).mock.calls.filter(([status]) => status === TimerStatus.IDLE)).toHaveLength(1)
    expect(vi.mocked(requestAnimationFrame)).toHaveBeenCalledTimes(1)
  })

  it('does nothing while idle, so the rest of the page stays usable', () => {
    useTimerStore.setState({ isSolving: false, timerStatus: TimerStatus.IDLE })
    const props = setup({ isSolving: false })

    touch(outside, 1000)

    expect(props.setTimerStatus).not.toHaveBeenCalled()
  })

  it('leaves buttons alone', () => {
    const props = setup()

    touch(button, 1000)

    expect(props.setTimerStatus).not.toHaveBeenCalled()
  })

  it('stays off for timers that did not opt in', () => {
    const props = setup({ touchAnywhereWhileActive: false })

    touch(outside, 1000)

    expect(props.setTimerStatus).not.toHaveBeenCalled()
  })
})
