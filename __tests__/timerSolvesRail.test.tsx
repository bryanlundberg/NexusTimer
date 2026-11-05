import { render, screen } from '@testing-library/react'
import TimerSolvesRail from '@/features/timer-solves-rail/ui/TimerSolvesRail'
import { useTimerRailStore } from '@/features/timer-solves-rail/model/useTimerRailStore'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { makeCube } from './fixtures/cube'
import { makeSolve } from './fixtures/solve'

vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }))
vi.mock('@/features/manage-solves/ui/SolveDetails', () => ({ default: () => null }))

function setup(isDesktop: boolean, isOpen: boolean) {
  vi.stubGlobal('matchMedia', () => ({
    matches: isDesktop,
    addEventListener: () => {},
    removeEventListener: () => {}
  }))
  const cube = makeCube({ id: 'a', name: 'A', category: '3x3' })
  cube.solves.session = [makeSolve({ id: 's1', cubeId: 'a', time: 1000 })]
  useTimerRailStore.setState({ isOpen })
  useTimerStore.setState({ cubes: [cube], selectedCube: cube })
  render(<TimerSolvesRail />)
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('TimerSolvesRail', () => {
  it('works on the solves while it is visible', () => {
    setup(true, true)
    expect(screen.queryByText('no-solves')).not.toBeInTheDocument()
  })

  it('skips the work on mobile, where it is hidden', () => {
    setup(false, true)
    expect(screen.getByText('no-solves')).toBeInTheDocument()
  })

  it('skips the work on desktop while it is closed', () => {
    setup(true, false)
    expect(screen.getByText('no-solves')).toBeInTheDocument()
  })
})
