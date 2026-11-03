import { act, render } from '@testing-library/react'
import TimerChromeHider from '@/features/timer/ui/TimerChromeHider'
import { TimerStatus } from '@/features/timer/model/enums'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'

const isMarked = () => document.documentElement.hasAttribute('data-timer-active')

describe('TimerChromeHider', () => {
  beforeEach(() => {
    useTimerStore.setState({ isSolving: false, timerStatus: TimerStatus.IDLE })
  })

  it('marks the page only while an attempt is active', () => {
    render(<TimerChromeHider />)
    expect(isMarked()).toBe(false)

    act(() => useTimerStore.setState({ timerStatus: TimerStatus.INSPECTING }))
    expect(isMarked()).toBe(true)

    act(() => useTimerStore.setState({ timerStatus: TimerStatus.IDLE }))
    expect(isMarked()).toBe(false)
  })

  it('marks the page while a solve runs even if the status stays idle', () => {
    render(<TimerChromeHider />)

    act(() => useTimerStore.setState({ isSolving: true }))

    expect(isMarked()).toBe(true)
  })

  it('clears the mark when leaving the page mid attempt', () => {
    useTimerStore.setState({ isSolving: true })
    const { unmount } = render(<TimerChromeHider />)

    unmount()

    expect(isMarked()).toBe(false)
  })
})
