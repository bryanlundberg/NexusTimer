import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import messages from '../messages/en.json'
import { ScrambleZone } from '@/features/timer/ui/ScrambleZone'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'

vi.mock('@/shared/lib/timer/genSolution', () => ({ default: vi.fn(), prewarmSolver: vi.fn() }))

beforeAll(() => {
  class NoopObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver = NoopObserver as never
})

const cube = { id: 'c1', name: 'Main', category: '3x3' } as never

const renderZone = () =>
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ScrambleZone />
    </NextIntlClientProvider>
  )

describe('ScrambleZone', () => {
  it('says the scramble is being prepared and hides the hints until it arrives', () => {
    useTimerStore.setState({ selectedCube: cube, scramble: null })
    const { container } = renderZone()

    expect(screen.getByRole('status')).toHaveTextContent('Preparing scramble…')
    expect(container.querySelector('.lucide-lightbulb')).toBeNull()
  })

  it('shows the scramble and the hints once it is ready', () => {
    useTimerStore.setState({ selectedCube: cube, scramble: "R U R' U'" })
    const { container } = renderZone()

    expect(screen.getByTestId('scramble-text-zone')).toHaveTextContent("R U R' U'")
    expect(screen.queryByRole('status')).toBeNull()
    expect(container.querySelector('.lucide-lightbulb')).not.toBeNull()
  })

  it('asks for a cube when none is selected', () => {
    useTimerStore.setState({ selectedCube: null, scramble: null })
    renderZone()

    expect(screen.getByTestId('scramble-text-zone')).toHaveTextContent('Choose a cube to load a scramble.')
    expect(screen.queryByRole('status')).toBeNull()
  })
})
