import { fireEvent, render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import messages from '../messages/en.json'
import PeopleOverviewRow from '@/widgets/people/ui/PeopleOverviewRow'
import type { CategoryStats, RecordSolve } from '@/entities/user-stats/model/types'

vi.mock('@/shared/ui/scramble-display/ui/ScrambleDisplay', () => ({
  default: ({ scramble }: { scramble: string }) => <div data-testid="scramble-image">{scramble}</div>
}))

beforeAll(() => {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    addEventListener() {},
    removeEventListener() {}
  })) as never
})

const recordSolve = (id: string, time: number, penalty: Partial<RecordSolve> = {}): RecordSolve => ({
  id,
  cubeId: 'c1',
  scramble: `scramble ${id}`,
  startTime: 1_700_000_000_000 - time,
  endTime: 1_700_000_000_000,
  bookmark: false,
  time,
  rating: 0,
  dnf: false,
  plus2: false,
  ...penalty
})

const solves = [
  recordSolve('s0', 31320),
  recordSolve('s1', 40200, { plus2: true }),
  recordSolve('s2', 45040, { dnf: true }),
  recordSolve('s3', 29770),
  recordSolve('s4', 34410)
]
const single = recordSolve('single', 25290)

const stats = (withSolves: boolean): CategoryStats => ({
  category: '3x3',
  count: 84,
  best: { time: 25290, cubeName: 'GAN', endTime: 1_700_000_000_000, ...(withSolves && { solve: single }) },
  bestAo5: {
    time: 35310,
    cubeName: 'GAN',
    endTime: 1_700_000_000_000,
    window: solves.map(({ id, time, dnf, plus2 }) => ({ id, time, dnf, plus2 })),
    ...(withSolves && { solves })
  }
})

const renderExpanded = (withSolves: boolean) => {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <PeopleOverviewRow stats={stats(withSolves)} />
    </NextIntlClientProvider>
  )
  fireEvent.click(screen.getAllByText('84')[0])
}

const cards = () => screen.queryAllByRole('button').filter((button) => button.hasAttribute('aria-pressed'))

describe('PeopleOverviewRow record solves strip', () => {
  it('shows a card per solve, single first, and the single scramble by default', () => {
    renderExpanded(true)

    expect(cards()).toHaveLength(6)
    expect(screen.getAllByTestId('scramble-image').map((image) => image.textContent)).toEqual([
      'scramble single',
      ...solves.map((solve) => solve.scramble)
    ])
    expect(screen.getByRole('button', { pressed: true }).textContent).toContain('Single')
    expect(screen.getByText('scramble single', { selector: 'span' })).toBeTruthy()
  })

  it('switches the scramble line to the selected solve', () => {
    renderExpanded(true)

    fireEvent.click(cards()[4])

    expect(cards()[4].getAttribute('aria-pressed')).toBe('true')
    expect(cards()[0].getAttribute('aria-pressed')).toBe('false')
    expect(screen.getByText('scramble s3', { selector: 'span' })).toBeTruthy()
  })

  it('tags penalties and wraps the trimmed Ao5 times in parentheses', () => {
    renderExpanded(true)

    expect(screen.getByText('+2')).toBeTruthy()
    expect(screen.getByText('DNF')).toBeTruthy()
    expect(screen.getByText('(45.04)')).toBeTruthy()
    expect(screen.getByText('(29.77)')).toBeTruthy()
    expect(screen.queryByText(/^\[/)).toBeNull()
  })

  it('keeps the Ao5 string and shows no cards when an older summary has no solves', () => {
    renderExpanded(false)

    expect(cards()).toHaveLength(0)
    expect(screen.getByText('[31.32 40.20+ (DNF) (29.77) 34.41]')).toBeTruthy()
  })
})
