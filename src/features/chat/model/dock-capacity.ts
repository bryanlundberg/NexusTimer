import { useSyncExternalStore } from 'react'

// Tailwind md / xl / 2xl: the launcher fits from md, then one more window per breakpoint
const BREAKPOINTS = ['(min-width: 768px)', '(min-width: 1280px)', '(min-width: 1536px)']

function subscribe(onChange: () => void) {
  const queries = BREAKPOINTS.map((query) => window.matchMedia(query))
  queries.forEach((query) => query.addEventListener('change', onChange))
  return () => queries.forEach((query) => query.removeEventListener('change', onChange))
}

/** 0 means no dock at all. */
export const getDockCapacity = () => BREAKPOINTS.filter((query) => window.matchMedia(query).matches).length

/** Decided in JS, not CSS: windows that do not fit stay unmounted and never mark messages as read. */
export function useDockCapacity() {
  return useSyncExternalStore(subscribe, getDockCapacity, () => 0)
}
