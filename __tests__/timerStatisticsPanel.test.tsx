import { act, render, screen } from '@testing-library/react'
import { cloneDeep } from 'es-toolkit'
import StatisticsProvider from '@/components/statistics-provider'
import StatisticsPanel from '@/features/timer/ui/StatisticsPanel'
import { timerStatSizes } from '@/shared/lib/statistics/averageSizes'
import { defaultSettings } from '@/shared/model/settings/defaultSettings'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { defaultTimerStatistics } from '@/shared/model/timer/defaultTimerStatistics'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { makeCube } from './fixtures/cube'

function setWidth(isDesktop: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: isDesktop,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {}
  }))
}

function setup(timerAverages: number[], session: Record<string, number> = {}) {
  const settings = cloneDeep(defaultSettings)
  settings.features.timerAverages = timerAverages
  useSettingsStore.setState({ settings })
  useTimerStore.setState({
    timerStatistics: {
      global: defaultTimerStatistics,
      session: { ...defaultTimerStatistics, ...session },
      cubeSession: defaultTimerStatistics
    }
  })
  render(<StatisticsPanel />)
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('timer StatisticsPanel on desktop', () => {
  it('keeps the fixed tiles whatever the user configured', () => {
    setWidth(true)
    setup([3, 25, 500])
    for (const size of [5, 12, 50, 100]) {
      expect(screen.getByTestId(`timer-session-ao${size}`)).toBeInTheDocument()
    }
    expect(screen.queryByTestId('timer-session-ao3')).not.toBeInTheDocument()
    expect(screen.queryByTestId('timer-session-ao500')).not.toBeInTheDocument()
  })
})

describe('timer StatisticsPanel on mobile', () => {
  beforeEach(() => setWidth(false))

  it('lists the default averages', () => {
    setup([])
    for (const size of [5, 12, 50, 100]) {
      expect(screen.getByTestId(`timer-session-ao${size}`)).toBeInTheDocument()
    }
    expect(screen.queryByTestId('timer-session-ao3')).not.toBeInTheDocument()
  })

  it('lists exactly what the user configured', () => {
    const sizes = [5, 12, 25, 50, 100, 500, 1000, 1500]
    setup(sizes)
    for (const size of sizes) {
      expect(screen.getByTestId(`timer-session-ao${size}`)).toBeInTheDocument()
    }
    expect(screen.queryByTestId('timer-session-ao3')).not.toBeInTheDocument()
  })

  it('keeps a size the worker has not computed yet empty, not DNF', () => {
    setup([500], { count: 600 })
    expect(screen.getByTestId('timer-session-ao500')).toHaveTextContent('--')
  })

  it('shows DNF once a computed average has too many DNFs', () => {
    setup([500], { count: 600, ao500: 0 })
    expect(screen.getByTestId('timer-session-ao500')).toHaveTextContent('DNF')
  })
})

describe('timerStatSizes', () => {
  it('covers the fixed tiles and the rail list on desktop', () => {
    expect(timerStatSizes({ railAverages: [], timerAverages: [7] }, true, true)).toEqual([3, 5, 12, 50, 100])
    expect(timerStatSizes({ railAverages: [25, 500], timerAverages: [7] }, true, true)).toEqual([
      5, 12, 25, 50, 100, 500
    ])
  })

  it('leaves the rail list out while the rail is closed', () => {
    expect(timerStatSizes({ railAverages: [25, 500], timerAverages: [7] }, true, false)).toEqual([5, 12, 50, 100])
  })

  it('covers only the configured list on mobile', () => {
    expect(timerStatSizes({ railAverages: [500], timerAverages: [] }, false, true)).toEqual([5, 12, 50, 100])
    expect(timerStatSizes({ railAverages: [500], timerAverages: [25] }, false, true)).toEqual([25])
  })
})

describe('StatisticsProvider', () => {
  it.each([
    [true, 'features.railAverages', [3, 5, 12, 50, 100], [5, 12, 50, 100, 1500]],
    [false, 'features.timerAverages', [5, 12, 50, 100], [1500]]
  ] as const)(
    'asks the worker for the new sizes when the visible list changes (desktop: %s)',
    (isDesktop, setting, before, after) => {
      setWidth(isDesktop)
      const posted: { command: string; data: { averages?: number[] } }[] = []
      vi.stubGlobal(
        'Worker',
        class {
          onmessage = null
          onerror = null
          postMessage(message: (typeof posted)[number]) {
            posted.push(message)
          }
          terminate() {}
        }
      )
      const cube = makeCube({ id: 'a', name: 'A', category: '3x3' })
      useSettingsStore.setState({ settings: cloneDeep(defaultSettings) })
      useTimerStore.setState({ cubes: [cube], selectedCube: cube })

      render(<StatisticsProvider />)
      expect(posted.at(-1)?.data.averages).toEqual(before)

      act(() => useSettingsStore.getState().updateSetting(setting, [1500]))
      expect(posted.at(-1)?.command).toBe('reset')
      expect(posted.at(-1)?.data.averages).toEqual(after)
    }
  )
})
