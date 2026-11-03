import { act, fireEvent, render, waitFor } from '@testing-library/react'
import ScrambleImagePanel from '@/features/timer/ui/ScrambleImagePanel'
import ScrambleModal from '@/features/timer/ui/ScrambleModal'
import { TimerStatus } from '@/features/timer/model/enums'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'

const constructed = vi.hoisted(() => ({ count: 0 }))

vi.mock('@/shared/ui/scramble-display/ui/ScrambleDisplay', async () => {
  const { useState } = await import('react')
  return {
    default: function ScrambleDisplayMock() {
      useState(() => {
        constructed.count += 1
      })
      return <div data-testid="scramble-display" />
    }
  }
})

const floating = (container: HTMLElement) => container.querySelector('[data-scramble-floating]')

const renderPanel = () =>
  render(
    <div id="touch">
      <ScrambleImagePanel />
      <ScrambleModal />
    </div>
  )

describe('scramble zoom', () => {
  beforeEach(() => {
    constructed.count = 0
    useTimerStore.setState({ isSolving: false, timerStatus: TimerStatus.IDLE, zoomInScramble: false })
  })

  it('stays in the slot until it is tapped', () => {
    const { container } = renderPanel()

    expect(floating(container)).toBeNull()
    expect(document.querySelector('[data-testid="scramble-zoom-catcher"]')).toBeNull()
  })

  it('floats the same display on tap instead of mounting a second one', () => {
    const { container, getAllByTestId } = renderPanel()

    fireEvent.click(getAllByTestId('scramble-display')[0])

    expect(useTimerStore.getState().zoomInScramble).toBe(true)
    expect(document.querySelector('[data-testid="scramble-zoom-catcher"]')).not.toBeNull()
    expect(floating(container)).not.toBeNull()
    expect(container.querySelector('[data-testid="scramble-zoom-backdrop"]')).not.toBeNull()
    expect(getAllByTestId('scramble-display')).toHaveLength(1)
    expect(constructed.count).toBe(1)
  })

  it('returns to the slot after closing', async () => {
    const { container, getByTestId } = renderPanel()
    fireEvent.click(getByTestId('scramble-display'))

    fireEvent.click(document.querySelector('[data-testid="scramble-zoom-catcher"]')!)

    expect(useTimerStore.getState().zoomInScramble).toBe(false)
    expect(floating(container)).not.toBeNull()
    await waitFor(() => expect(floating(container)).toBeNull())
    await waitFor(() => expect(container.querySelector('[data-testid="scramble-zoom-backdrop"]')).toBeNull())
    expect(getByTestId('scramble-display').parentElement?.getAttribute('style')).toBeNull()
  })

  it('closes when the timer leaves idle', () => {
    const { getByTestId } = renderPanel()
    fireEvent.click(getByTestId('scramble-display'))

    act(() => useTimerStore.setState({ timerStatus: TimerStatus.INSPECTING }))

    expect(useTimerStore.getState().zoomInScramble).toBe(false)
  })

  it('does not leave the tap catcher behind when the panel unmounts', () => {
    const { getByTestId, unmount } = renderPanel()
    fireEvent.click(getByTestId('scramble-display'))

    unmount()

    expect(useTimerStore.getState().zoomInScramble).toBe(false)
  })
})
