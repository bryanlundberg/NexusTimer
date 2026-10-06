import { renderHook } from '@testing-library/react'
import { LIGHT_STRETCH, useOverscrollStretch } from '@/shared/model/useOverscrollStretch'

let scroller: HTMLDivElement
let content: HTMLDivElement
let item: HTMLButtonElement

const setReducedMotion = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', { value: () => ({ matches }), configurable: true })
}

const setScrollTop = (value: number) => {
  Object.defineProperty(scroller, 'scrollTop', { value, configurable: true })
}

const touch = (type: string, clientY: number | null, target: Element = item, clientX = 0) => {
  const event = new Event(type, { bubbles: true, cancelable: true })
  Object.defineProperty(event, 'touches', { value: clientY === null ? [] : [{ clientX, clientY }] })
  target.dispatchEvent(event)
}

const scale = () => {
  const match = content.style.transform.match(/^scaleY\((.+)\)$/)
  return match ? Number(match[1]) : 1
}

const mount = (options?: Parameters<typeof useOverscrollStretch>[2]) =>
  renderHook(() => useOverscrollStretch({ current: scroller }, { current: content }, options))

beforeEach(() => {
  setReducedMotion(false)
  scroller = document.createElement('div')
  content = document.createElement('div')
  item = document.createElement('button')
  content.append(item)
  scroller.append(content)
  document.body.append(scroller)
  setScrollTop(0)
})

afterEach(() => {
  scroller.remove()
})

describe('useOverscrollStretch', () => {
  it('stretches the content while pulling down at the top and springs back on release', () => {
    mount()

    touch('touchstart', 100)
    touch('touchmove', 250)

    expect(scale()).toBeGreaterThan(1)
    expect(content.style.transformOrigin).toBe('top')

    touch('touchend', null)

    expect(content.style.transform).toBe('')
    expect(content.style.transition).toContain('transform')
  })

  it('stretches more the further it is pulled, up to a limit', () => {
    mount()

    touch('touchstart', 0)
    touch('touchmove', 100)
    const short = scale()
    touch('touchmove', 2000)
    const long = scale()

    expect(long).toBeGreaterThan(short)
    expect(long).toBeLessThanOrEqual(1.08)
  })

  it('does not stretch while the list can still scroll up', () => {
    setScrollTop(40)
    mount()

    touch('touchstart', 100)
    touch('touchmove', 300)

    expect(content.style.transform).toBe('')
  })

  it('measures the pull from where the list reached the top', () => {
    setScrollTop(40)
    mount()

    touch('touchstart', 100)
    touch('touchmove', 150)
    setScrollTop(0)
    touch('touchmove', 200)
    expect(content.style.transform).toBe('')

    touch('touchmove', 260)
    expect(scale()).toBeCloseTo(1 + 0.08 * (1 - Math.exp(-60 / 300)), 5)
  })

  it('ignores touches that start outside the scroller', () => {
    mount()
    const outside = document.createElement('div')
    document.body.append(outside)

    touch('touchstart', 100, outside)
    touch('touchmove', 300, outside)

    expect(content.style.transform).toBe('')
    outside.remove()
  })

  it('stretches less with a lighter maximum', () => {
    mount({ maxStretch: LIGHT_STRETCH })

    touch('touchstart', 0)
    touch('touchmove', 100)
    touch('touchmove', 5000)

    expect(scale()).toBeGreaterThan(1)
    expect(scale()).toBeLessThanOrEqual(1 + LIGHT_STRETCH)
  })

  it('does nothing when disabled', () => {
    mount({ enabled: false })

    touch('touchstart', 100)
    touch('touchmove', 300)

    expect(content.style.transform).toBe('')
  })

  it('lets horizontal swipes through', () => {
    mount()

    touch('touchstart', 0, item, 0)
    touch('touchmove', 10, item, 40)
    touch('touchmove', 300, item, 60)

    expect(content.style.transform).toBe('')
  })

  it('backs off when another handler claims the drag', () => {
    mount()
    item.addEventListener('touchmove', (event) => event.preventDefault())

    touch('touchstart', 100)
    touch('touchmove', 300)

    expect(content.style.transform).toBe('')
  })

  it('does not stretch while an inner list under the finger is scrolled', () => {
    const inner = document.createElement('div')
    Object.defineProperty(inner, 'scrollTop', { value: 20, configurable: true })
    inner.append(item)
    content.append(inner)
    mount()

    touch('touchstart', 100)
    touch('touchmove', 300)

    expect(content.style.transform).toBe('')
  })

  it('does nothing when the user prefers reduced motion', () => {
    setReducedMotion(true)
    mount()

    touch('touchstart', 100)
    touch('touchmove', 300)

    expect(content.style.transform).toBe('')
  })
})
