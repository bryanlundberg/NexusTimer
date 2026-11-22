import { act, renderHook } from '@testing-library/react'
import useTimer from '@/features/timer/model/useTimer'
import { TimerMode, TimerStatus } from '@/features/timer/model/enums'
import { Cube } from '@/entities/cube/model/types'
import { useCtrlPadsStore } from '@/features/timer/model/useCtrlPadsStore'

type Props = Parameters<typeof useTimer>[0]

const key = (type: 'keydown' | 'keyup', code: string, init: KeyboardEventInit = {}) => {
  act(() => {
    window.dispatchEvent(new KeyboardEvent(type, { code, ...init }))
  })
}

describe('keyboard stackmat mode', () => {
  let frames: FrameRequestCallback[]
  let unmount: () => void

  beforeEach(() => {
    frames = []
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => frames.push(callback))
    )
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
  })

  afterEach(() => {
    unmount?.()
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
      timerMode: TimerMode.KEYBOARD_STACKMAT,
      settings: { timer: { holdToStart: false, holdToStartTime: 300, inspectionTime: 15000 }, sounds: {} },
      onFinishSolve: vi.fn(),
      ...overrides
    }
    const hook = renderHook((current: Props) => useTimer(current), { initialProps: props })
    unmount = hook.unmount
    return { props, rerender: (next: Partial<Props>) => hook.rerender({ ...props, ...next }) }
  }

  it('starts the solve after holding both Ctrl keys and releasing one', () => {
    const { props } = setup()

    key('keydown', 'ControlLeft', { ctrlKey: true })
    key('keydown', 'ControlLeft', { ctrlKey: true, repeat: true })
    key('keydown', 'ControlRight', { ctrlKey: true })
    expect(props.setTimerStatus).toHaveBeenLastCalledWith(TimerStatus.READY)
    key('keyup', 'ControlRight', { ctrlKey: true })

    expect(props.setIsSolving).toHaveBeenCalledWith(true)
  })

  it('recovers a held Ctrl from its key repeats', () => {
    const { props } = setup()

    key('keydown', 'ControlLeft', { ctrlKey: true })
    act(() => {
      window.dispatchEvent(new Event('blur'))
    })
    key('keydown', 'ControlLeft', { ctrlKey: true, repeat: true })
    key('keydown', 'ControlRight', { ctrlKey: true })

    expect(props.setTimerStatus).toHaveBeenLastCalledWith(TimerStatus.READY)
  })

  it('starts with the right Ctrl reported as ControlLeft plus a location', () => {
    const { props } = setup()

    key('keydown', 'ControlLeft', { ctrlKey: true, location: 1 })
    key('keydown', '', { key: 'Control', ctrlKey: true, location: 2 })

    expect(props.setTimerStatus).toHaveBeenLastCalledWith(TimerStatus.READY)
  })

  it('reports each held side to the pads store', () => {
    setup()

    key('keydown', 'ControlRight', { ctrlKey: true })
    expect(useCtrlPadsStore.getState()).toMatchObject({ left: false, right: true })
    key('keydown', 'ControlLeft', { ctrlKey: true })
    expect(useCtrlPadsStore.getState()).toMatchObject({ left: true, right: true })
    key('keyup', 'ControlLeft', { ctrlKey: true })
    key('keyup', 'ControlRight')
    expect(useCtrlPadsStore.getState()).toMatchObject({ left: false, right: false })
  })

  it('stops once and waits for both Ctrl keys to lift before preparing again', () => {
    const { props } = setup({ isSolving: true })

    key('keydown', 'ControlLeft', { ctrlKey: true })
    key('keydown', 'ControlRight', { ctrlKey: true })
    act(() => frames.forEach((frame) => frame(0)))
    expect(props.onFinishSolve).toHaveBeenCalledTimes(1)
    expect(props.setTimerStatus).not.toHaveBeenCalledWith(TimerStatus.READY)
  })
})
