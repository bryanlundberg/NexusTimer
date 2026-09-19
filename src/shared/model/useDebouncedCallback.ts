import { useEffect, useMemo, useRef } from 'react'

/**
 * Delays `callback` until `delay` ms pass without another call. Pending calls are dropped on unmount.
 */
export function useDebouncedCallback<Args extends unknown[]>(callback: (...args: Args) => void, delay: number) {
  const callbackRef = useRef(callback)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    callbackRef.current = callback
  })

  const debounced = useMemo(() => {
    const run = (...args: Args) => {
      clearTimeout(timer.current)
      timer.current = setTimeout(() => callbackRef.current(...args), delay)
    }
    run.cancel = () => clearTimeout(timer.current)
    return run
  }, [delay])

  useEffect(() => debounced.cancel, [debounced])

  return debounced
}
