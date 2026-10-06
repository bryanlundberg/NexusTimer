import { renderHook } from '@testing-library/react'
import { useSwipeToClose } from '@/shared/model/useSwipeToClose'

const WIDTH = 300

let content: HTMLDivElement
let overlay: HTMLDivElement
let item: HTMLButtonElement
let onClose: ReturnType<typeof vi.fn<() => void>>

const touch = (type: string, clientX: number | null, time: number, target: Element = item, clientY = 0) => {
  const event = new Event(type, { bubbles: true, cancelable: true })
  Object.defineProperty(event, 'touches', { value: clientX === null ? [] : [{ clientX, clientY }] })
  Object.defineProperty(event, 'timeStamp', { value: time })
  target.dispatchEvent(event)
}

const offset = () => {
  const match = content.style.transform.match(/^translate3d\((-?[\d.]+)px/)
  return match ? Number(match[1]) : 0
}

const mount = (options?: Parameters<typeof useSwipeToClose>[3]) =>
  renderHook(() => useSwipeToClose({ current: content }, { current: overlay }, onClose, options))

beforeEach(() => {
  onClose = vi.fn<() => void>()
  content = document.createElement('div')
  overlay = document.createElement('div')
  item = document.createElement('button')
  content.append(item)
  Object.defineProperty(content, 'offsetWidth', { value: WIDTH, configurable: true })
  document.body.append(overlay, content)
})

afterEach(() => {
  content.remove()
  overlay.remove()
})

describe('useSwipeToClose', () => {
  it('follows the finger to the left and fades the overlay', () => {
    mount()

    touch('touchstart', 250, 0)
    touch('touchmove', 175, 300)

    expect(offset()).toBe(-75)
    expect(content.style.transition).toBe('none')
    expect(Number(overlay.style.opacity)).toBeCloseTo(0.75, 5)
  })

  it('closes when released past the threshold', () => {
    mount()

    touch('touchstart', 250, 0)
    touch('touchmove', 200, 400)
    touch('touchmove', 100, 800)
    touch('touchend', null, 820)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('springs back when released before the threshold', () => {
    mount()

    touch('touchstart', 250, 0)
    touch('touchmove', 220, 400)
    touch('touchmove', 200, 800)
    touch('touchend', null, 820)

    expect(onClose).not.toHaveBeenCalled()
    expect(content.style.transform).toBe('')
    expect(content.style.transition).toContain('transform')
    expect(overlay.style.opacity).toBe('')
  })

  it('closes on a quick flick even when short', () => {
    mount()

    touch('touchstart', 250, 0)
    touch('touchmove', 225, 10)
    touch('touchend', null, 20)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('ignores a flick that stopped before the finger lifted', () => {
    mount()

    touch('touchstart', 250, 0)
    touch('touchmove', 225, 10)
    touch('touchend', null, 500)

    expect(onClose).not.toHaveBeenCalled()
  })

  it('stays open when flicked back to the right past the threshold', () => {
    mount()

    touch('touchstart', 250, 0)
    touch('touchmove', 80, 500)
    touch('touchmove', 120, 510)
    touch('touchend', null, 515)

    expect(onClose).not.toHaveBeenCalled()
    expect(content.style.transform).toBe('')
  })

  it('never drags past the closed position or to the right', () => {
    mount()

    touch('touchstart', 250, 0)
    touch('touchmove', 200, 100)
    touch('touchmove', -400, 200)
    expect(offset()).toBe(-WIDTH)

    touch('touchmove', 400, 300)
    expect(offset()).toBe(0)
  })

  it('lets vertical scrolling through', () => {
    mount()

    touch('touchstart', 250, 0, item, 100)
    touch('touchmove', 240, 100, item, 200)
    touch('touchmove', 100, 200, item, 300)
    touch('touchend', null, 220)

    expect(content.style.transform).toBe('')
    expect(onClose).not.toHaveBeenCalled()
  })

  it('ignores swipes toward the open side', () => {
    mount()

    touch('touchstart', 100, 0)
    touch('touchmove', 250, 100)
    touch('touchend', null, 120)

    expect(content.style.transform).toBe('')
    expect(onClose).not.toHaveBeenCalled()
  })

  it('can be dragged from the overlay', () => {
    mount()

    touch('touchstart', 350, 0, overlay)
    touch('touchmove', 200, 400, overlay)
    touch('touchend', null, 420, overlay)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('ignores touches that start elsewhere', () => {
    mount()
    const outside = document.createElement('div')
    document.body.append(outside)

    touch('touchstart', 250, 0, outside)
    touch('touchmove', 50, 400, outside)
    touch('touchend', null, 420, outside)

    expect(content.style.transform).toBe('')
    expect(onClose).not.toHaveBeenCalled()
    outside.remove()
  })

  it('springs back when a second finger lands', () => {
    mount()

    touch('touchstart', 250, 0)
    touch('touchmove', 150, 400)
    const event = new Event('touchstart', { bubbles: true })
    Object.defineProperty(event, 'touches', {
      value: [
        { clientX: 150, clientY: 0 },
        { clientX: 50, clientY: 0 }
      ]
    })
    item.dispatchEvent(event)

    expect(content.style.transform).toBe('')
    expect(onClose).not.toHaveBeenCalled()
  })

  it('closes toward the right for a sheet on the right side', () => {
    mount({ side: 'right' })

    touch('touchstart', 100, 0)
    touch('touchmove', 175, 300)
    expect(offset()).toBe(75)

    touch('touchmove', 250, 600)
    touch('touchend', null, 620)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does nothing when disabled', () => {
    mount({ enabled: false })

    touch('touchstart', 250, 0)
    touch('touchmove', 50, 400)
    touch('touchend', null, 420)

    expect(content.style.transform).toBe('')
    expect(onClose).not.toHaveBeenCalled()
  })
})
