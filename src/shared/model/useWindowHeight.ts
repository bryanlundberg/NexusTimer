import { useSyncExternalStore } from 'react'

function subscribe(onChange: () => void) {
  window.addEventListener('resize', onChange)
  return () => window.removeEventListener('resize', onChange)
}

const getHeight = () => window.innerHeight
const getServerHeight = () => 0

export function useWindowHeight(): number {
  return useSyncExternalStore(subscribe, getHeight, getServerHeight)
}
