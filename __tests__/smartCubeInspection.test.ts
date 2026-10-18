vi.mock('@/features/timer/lib/saveVirtualSolve', () => ({ saveVirtualSolve: vi.fn(async () => {}) }))

import { saveVirtualSolve } from '@/features/timer/lib/saveVirtualSolve'
import { useSmartSessionStore } from '@/features/smart-cube/model/useSmartSessionStore'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { defaultSettings } from '@/shared/model/settings/defaultSettings'
import { TimerMode } from '@/features/timer/model/enums'
import { makeCube } from './fixtures/cube'

const SCRAMBLE = 'R U'

describe('smart cube inspection penalties', () => {
  let now: number

  beforeEach(() => {
    now = 1000
    vi.spyOn(performance, 'now').mockImplementation(() => now)
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn(() => 1)
    )
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    vi.mocked(saveVirtualSolve).mockClear()
    useSettingsStore.setState({
      settings: { ...defaultSettings, timer: { ...defaultSettings.timer, inspection: true, inspectionTime: 15000 } }
    })
    useTimerStore.setState({
      timerMode: TimerMode.SMART_CUBE,
      selectedCube: makeCube({ id: 'cube' }),
      scramble: SCRAMBLE
    })
    useSmartSessionStore.getState().start()
  })

  afterEach(() => {
    useSmartSessionStore.getState().shutdown()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  const solveStartingAfter = (inspectedMs: number) => {
    const { trackMove } = useSmartSessionStore.getState()
    trackMove('R')
    trackMove('U')
    expect(useSmartSessionStore.getState().phase).toBe('inspecting')

    now += inspectedMs
    trackMove("U'")
    now += 5000
    trackMove("R'")

    return vi.mocked(saveVirtualSolve).mock.calls.at(-1)![0]
  }

  it('saves a solve started within the inspection time without a penalty', () => {
    expect(solveStartingAfter(14_000)).toMatchObject({ dnf: false, plus2: false })
  })

  it('saves +2 when the first turn comes in the 2 seconds after it', () => {
    expect(solveStartingAfter(16_000)).toMatchObject({ dnf: false, plus2: true })
    expect(useSmartSessionStore.getState().lastSolvePenalty).toBe('plus2')
  })

  it('saves DNF when the first turn comes later than that', () => {
    expect(solveStartingAfter(17_500)).toMatchObject({ dnf: true, plus2: false })
    expect(useSmartSessionStore.getState().lastSolvePenalty).toBe('dnf')
  })
})
