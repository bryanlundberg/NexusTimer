import { render, screen } from '@testing-library/react'
import TimerHeaderCollapse from '@/features/timer/ui/TimerHeaderCollapse'
import { TimerStatus } from '@/features/timer/model/enums'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'

const renderCollapse = () => {
  render(
    <TimerHeaderCollapse>
      <div>header</div>
    </TimerHeaderCollapse>
  )
  return screen.getByTestId('timer-header-collapse')
}

describe('TimerHeaderCollapse', () => {
  afterEach(() => {
    useTimerStore.setState({ isSolving: false, timerStatus: TimerStatus.IDLE })
  })

  it('keeps the header open while idle', () => {
    useTimerStore.setState({ isSolving: false, timerStatus: TimerStatus.IDLE })

    expect(renderCollapse().className).not.toContain('max-md:grid-rows-[0fr]')
    expect(screen.getByText('header')).toBeInTheDocument()
  })

  it.each([TimerStatus.HOLDING, TimerStatus.INSPECTING, TimerStatus.READY, TimerStatus.SOLVING])(
    'collapses on phones while the status is %s',
    (timerStatus) => {
      useTimerStore.setState({ timerStatus })

      expect(renderCollapse().className).toContain('max-md:grid-rows-[0fr]')
    }
  )

  it('collapses while a solve runs even if the status stays idle', () => {
    useTimerStore.setState({ isSolving: true, timerStatus: TimerStatus.IDLE })

    expect(renderCollapse().className).toContain('max-md:grid-rows-[0fr]')
  })
})
