import { useCallback } from 'react'

const FIT_VAR = '--timer-fit'

export function useTimerFit() {
  return useCallback((row: HTMLElement | null) => {
    if (!row || typeof ResizeObserver === 'undefined') return

    let fit = 1
    let frame = 0

    const measure = () => {
      frame = 0
      let used = 0
      for (const child of row.children) used += (child as HTMLElement).offsetWidth
      const available = row.clientWidth
      if (!used || !available) return
      const natural = used / fit
      const next = natural > available ? Math.floor((available / natural) * 1000) / 1000 : 1
      if (Math.abs(next - fit) < 0.002) return
      fit = next
      if (fit === 1) row.style.removeProperty(FIT_VAR)
      else row.style.setProperty(FIT_VAR, String(fit))
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    const resize = new ResizeObserver(schedule)
    const observeChildren = () => {
      for (const child of row.children) resize.observe(child)
    }
    resize.observe(row)
    observeChildren()

    const mutations = new MutationObserver(() => {
      observeChildren()
      schedule()
    })
    mutations.observe(row, { childList: true })
    schedule()

    return () => {
      if (frame) cancelAnimationFrame(frame)
      resize.disconnect()
      mutations.disconnect()
    }
  }, [])
}
