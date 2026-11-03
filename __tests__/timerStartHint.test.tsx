import { render } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import messages from '../messages/en.json'
import DisplayTime from '@/features/timer/ui/display-time'
import { TimerMode, TimerStatus } from '@/features/timer/model/enums'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { defaultSettings } from '@/shared/model/settings/defaultSettings'

vi.mock('@/features/timer/model/timerFonts', () => ({ timerFontClass: () => '' }))

const renderHint = (holdToStart: boolean, isMobile: boolean) => {
  useSettingsStore.setState({
    settings: { ...defaultSettings, timer: { ...defaultSettings.timer, holdToStart } }
  })
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <DisplayTime
        isSolving={false}
        timerStatus={TimerStatus.IDLE}
        lastSolve={null}
        isMobile={isMobile}
        inspectionTime={15}
        inspectionRequired={false}
        hideWhileSolving={false}
      />
    </NextIntlClientProvider>
  ).container.textContent
}

describe('the hint to start the timer', () => {
  beforeEach(() => {
    useTimerStore.setState({ timerMode: TimerMode.NORMAL })
  })

  afterEach(() => {
    useSettingsStore.setState({ settings: defaultSettings })
  })

  it.each([
    [true, true, 'Tap and hold to start'],
    [true, false, 'Hold space to start'],
    [false, true, 'Tap to start'],
    [false, false, 'Press space to start']
  ])('with hold %s and mobile %s says %s', (holdToStart, isMobile, hint) => {
    expect(renderHint(holdToStart, isMobile)).toContain(hint)
  })
})
