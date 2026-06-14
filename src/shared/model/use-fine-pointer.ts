import * as React from 'react'

/**
 * Detects whether the primary input is a precise pointer (mouse/trackpad),
 * which in practice means a desktop/laptop with a physical keyboard.
 * Touch-only devices (phones/tablets) report `(pointer: coarse)` and return false.
 */
export function useIsFinePointer() {
  const [isFinePointer, setIsFinePointer] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia('(pointer: fine)')
    const onChange = () => setIsFinePointer(mql.matches)
    mql.addEventListener('change', onChange)
    setIsFinePointer(mql.matches)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return isFinePointer
}
