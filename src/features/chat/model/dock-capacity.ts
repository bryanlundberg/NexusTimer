import { useSyncExternalStore } from 'react'

const BREAKPOINTS = ['(min-width: 768px)', '(min-width: 1280px)', '(min-width: 1536px)']

function subscribe(onChange: () => void) {
  const queries = BREAKPOINTS.map((query) => window.matchMedia(query))
  queries.forEach((query) => query.addEventListener('change', onChange))
  return () => queries.forEach((query) => query.removeEventListener('change', onChange))
}

export const getDockCapacity = () => BREAKPOINTS.filter((query) => window.matchMedia(query).matches).length

/** Computed in JS so windows that do not fit stay unmounted and never mark messages as read. */
export function useDockCapacity() {
  return useSyncExternalStore(subscribe, getDockCapacity, () => 0)
}
