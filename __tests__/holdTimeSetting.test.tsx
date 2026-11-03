import { act, render, renderHook, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { useForm } from 'react-hook-form'
import messages from '../messages/en.json'
import MenuTimerSection from '@/features/settings/ui/MenuTimerSection'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { defaultSettings } from '@/shared/model/settings/defaultSettings'

const setHold = (holdToStart: boolean) =>
  useSettingsStore.setState({
    settings: { ...defaultSettings, timer: { ...defaultSettings.timer, holdToStart } }
  })

const renderSection = () => {
  const { control } = renderHook(() => useForm({ defaultValues: defaultSettings })).result.current
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <MenuTimerSection control={control} />
    </NextIntlClientProvider>
  )
  return screen.getByRole('textbox', { name: 'Hold to start time' }) as HTMLInputElement
}

describe('the hold to start time setting', () => {
  beforeEach(() => {
    vi.stubGlobal('matchMedia', () => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }))
  })

  afterEach(() => {
    useSettingsStore.setState({ settings: defaultSettings })
    vi.unstubAllGlobals()
  })

  it('is disabled while hold to start is off', () => {
    setHold(false)

    expect(renderSection().disabled).toBe(true)
  })

  it('turns on together with hold to start', () => {
    setHold(false)
    const input = renderSection()

    act(() => setHold(true))

    expect(input.disabled).toBe(false)
  })
})
