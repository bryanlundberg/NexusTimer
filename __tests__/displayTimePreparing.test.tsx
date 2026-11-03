import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import messages from '../messages/en.json'
import DisplayTime from '@/features/timer/ui/display-time'
import { TimerStatus } from '@/features/timer/model/enums'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { Solve } from '@/entities/solve/model/types'

vi.mock('@/features/timer/model/timerFonts', () => ({ timerFontClass: () => '' }))

const solve = (patch: Partial<Solve> = {}) => ({ time: 12340, dnf: false, plus2: false, ...patch }) as Solve

const renderDisplay = (timerStatus: TimerStatus, lastSolve: Solve | null) =>
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <DisplayTime
        isSolving={false}
        timerStatus={timerStatus}
        lastSolve={lastSolve}
        isMobile
        inspectionTime={15}
        inspectionRequired={false}
        hideWhileSolving={false}
      />
    </NextIntlClientProvider>
  )

describe('DisplayTime while preparing the next solve', () => {
  beforeEach(() => {
    useTimerStore.setState({ solvingTime: 12340 })
  })

  afterEach(() => {
    useTimerStore.setState({ solvingTime: 0 })
  })

  it('keeps the last time while idle', () => {
    const { container } = renderDisplay(TimerStatus.IDLE, solve())

    expect(container.textContent).toContain('12.34')
  })

  it.each([TimerStatus.HOLDING, TimerStatus.READY])('shows zero while %s', (status) => {
    const { container } = renderDisplay(status, solve())

    expect(container.textContent).not.toContain('12.34')
    expect(container.textContent).toMatch(/0\.00/)
  })

  it('hides the last penalty and DNF while preparing', () => {
    const plus2 = renderDisplay(TimerStatus.READY, solve({ plus2: true }))
    expect(plus2.container.textContent).not.toContain('+2')
    plus2.unmount()

    renderDisplay(TimerStatus.READY, solve({ dnf: true }))
    expect(screen.queryByText('DNF')).toBeNull()
  })

  it('brings the last time back when the press ends without a solve', () => {
    const { container, rerender } = renderDisplay(TimerStatus.READY, solve())

    rerender(
      <NextIntlClientProvider locale="en" messages={messages}>
        <DisplayTime
          isSolving={false}
          timerStatus={TimerStatus.IDLE}
          lastSolve={solve()}
          isMobile
          inspectionTime={15}
          inspectionRequired={false}
          hideWhileSolving={false}
        />
      </NextIntlClientProvider>
    )

    expect(container.textContent).toContain('12.34')
  })
})
