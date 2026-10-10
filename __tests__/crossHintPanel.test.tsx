import { fireEvent, render, screen, within } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import messages from '../messages/en.json'
import { Dialog } from '@/components/ui/dialog'
import DrawerHintPanel from '@/features/timer/ui/drawer-hint-panel'
import { useCrossHintStore } from '@/features/timer/model/useCrossHintStore'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { Layers } from '@/shared/types/enums'
import type { CrossHint } from '@nexustimer/cube-solver-rs'

const scramble = "R U R' U' F2 D L2"

const face = (face: CrossHint['face'], rotation: string, cross: string): CrossHint => ({
  face,
  rotation,
  cross,
  xcross: [`${cross} R`, `${cross} L`, `${cross} B`, `${cross} F`]
})

const faces: CrossHint[] = [
  face('U', 'z2', 'F R U2'),
  face('D', '', "D L2 F'"),
  face('F', "x'", 'R2 B'),
  face('B', 'x', 'U L D2 F'),
  face('R', 'z', ''),
  face('L', "z'", 'B2 D R U')
]

const renderPanel = () =>
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <Dialog open>
        <DrawerHintPanel />
      </Dialog>
    </NextIntlClientProvider>
  )

beforeEach(() => {
  useCrossHintStore.setState({ color: Layers.YELLOW })
  useTimerStore.setState({ scramble, hint: { scramble, faces } })
})

describe('cross hint panel', () => {
  it('shows the cross and the four xcross slots of the chosen color', () => {
    renderPanel()

    expect(screen.getByText("D L2 F'")).toBeInTheDocument()
    for (const slot of ['FL', 'BL', 'BR', 'FR']) expect(screen.getByText(slot)).toBeInTheDocument()
    expect(screen.getAllByText('3 moves')).toHaveLength(1)
    expect(screen.getAllByText('4 moves')).toHaveLength(4)
  })

  it('switches color, prefixes the rotation and remembers the choice', () => {
    renderPanel()

    fireEvent.click(screen.getByRole('button', { name: 'White' }))

    expect(screen.getByRole('button', { name: 'White' })).toHaveAttribute('aria-pressed', 'true')
    const line = (text: string) => (_: string, element: Element | null) =>
      element?.tagName === 'P' && element.textContent === text
    expect(screen.getByText(line('z2 F R U2'))).toBeInTheDocument()
    expect(screen.getByText(line('z2 F R U2 F'))).toBeInTheDocument()
    expect(useCrossHintStore.getState().color).toBe(Layers.WHITE)
  })

  it('shows the cross length of every color on the picker', () => {
    renderPanel()

    const picker = screen.getByRole('group', { name: 'Cross color' })
    expect(within(picker).getByRole('button', { name: 'Green' })).toHaveTextContent('2')
    expect(within(picker).getByRole('button', { name: 'Red' })).toHaveTextContent('0')
  })

  it('says when the cross is already solved', () => {
    useCrossHintStore.setState({ color: Layers.RED })
    renderPanel()

    expect(screen.getByText('Already solved')).toBeInTheDocument()
  })

  it('waits for hints that belong to the current scramble', () => {
    useTimerStore.setState({ scramble: 'B2 R2', hint: { scramble, faces } })
    renderPanel()

    expect(screen.getByRole('status')).toHaveTextContent('Calculating…')
  })
})
