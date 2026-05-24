import { RefObject, useEffect, useState } from 'react'
import { SCRAMBLE_MAX_HEIGHT_RATIO } from '@/features/timer/model/const'

export function useScrambleOverflow(ref: RefObject<HTMLElement | null>, deps: unknown[]) {
  const [isOverflowing, setIsOverflowing] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const check = () => {
      const maxAllowed = window.innerHeight * SCRAMBLE_MAX_HEIGHT_RATIO
      setIsOverflowing(el.scrollHeight > maxAllowed)
    }

    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    window.addEventListener('resize', check)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', check)
    }
  }, deps)

  return isOverflowing
}
