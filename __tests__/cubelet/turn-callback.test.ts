import { describe, expect, it, vi } from 'vitest'
import { CubeView, type CubeFrameRenderer, type FrameScheduler, type GlCubePalette } from '@nexustimer/cubelet/webgl'

const PALETTE: GlCubePalette = {
  colors: Array.from({ length: 6 }, () => [1, 1, 1] as const),
  dimColors: Array.from({ length: 6 }, () => [0.2, 0.2, 0.2] as const),
  ignored: [0.3, 0.3, 0.3],
  body: [0, 0, 0]
}

class ManualScheduler implements FrameScheduler {
  #callbacks = new Map<number, (now: number) => void>()
  #next = 1

  request(callback: (now: number) => void): number {
    const handle = this.#next++
    this.#callbacks.set(handle, callback)
    return handle
  }

  cancel(handle: number): void {
    this.#callbacks.delete(handle)
  }

  run(now: number): void {
    const callbacks = [...this.#callbacks.values()]
    this.#callbacks.clear()
    for (const callback of callbacks) callback(now)
  }
}

const renderer: CubeFrameRenderer = { render: () => {} }

const createView = () => {
  const canvas = document.createElement('canvas')
  Object.defineProperty(canvas, 'clientWidth', { value: 100 })
  Object.defineProperty(canvas, 'clientHeight', { value: 100 })
  const scheduler = new ManualScheduler()
  const onTurn = vi.fn()
  const view = new CubeView({ size: 3, canvas, renderer, palette: PALETTE, scheduler, onTurn })
  return { view, scheduler, onTurn }
}

describe('CubeView turn callback', () => {
  it('fires once per turn, 70% of the way through its animation', () => {
    const { view, scheduler, onTurn } = createView()
    view.play("R U'")
    scheduler.run(0)
    scheduler.run(300)
    expect(onTurn).not.toHaveBeenCalled()
    scheduler.run(360)
    expect(onTurn).toHaveBeenCalledTimes(1)
    scheduler.run(500)
    expect(onTurn).toHaveBeenCalledTimes(1)
    scheduler.run(1000)
    expect(onTurn).toHaveBeenCalledTimes(2)
  })

  it('lands the running turn when a new move snaps it', () => {
    const { view, scheduler, onTurn } = createView()
    view.play('R')
    scheduler.run(0)
    scheduler.run(100)
    view.play('U')
    expect(onTurn).toHaveBeenCalledTimes(1)
  })

  it('marks half turns as double', () => {
    const { view, scheduler, onTurn } = createView()
    view.play('R2 U')
    scheduler.run(0)
    scheduler.run(500)
    scheduler.run(1000)
    expect(onTurn.mock.calls.map(([turn]) => turn.double)).toEqual([true, false])
    expect(onTurn.mock.calls.every(([turn]) => turn.duration > 0)).toBe(true)
  })

  it('stays quiet for states shown without animation', () => {
    const { view, scheduler, onTurn } = createView()
    view.show("R U R'")
    scheduler.run(0)
    expect(onTurn).not.toHaveBeenCalled()
  })

  it('stays quiet for whole-cube rotations', () => {
    const { view, scheduler, onTurn } = createView()
    view.play('x')
    scheduler.run(0)
    scheduler.run(500)
    expect(onTurn).not.toHaveBeenCalled()
  })
})
