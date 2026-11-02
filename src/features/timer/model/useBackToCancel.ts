import { useEffect, useRef } from 'react'

interface CloseWatcherLike {
  onclose: (() => void) | null
  destroy: () => void
}

type WindowWithCloseWatcher = Window & { CloseWatcher?: new () => CloseWatcherLike }

// CloseWatcher takes Android's back press before it reaches the history, so nothing is pushed per solve.
export function useBackToCancel(active: boolean, onCancel: () => void) {
  const latestOnCancel = useRef(onCancel)
  latestOnCancel.current = onCancel

  useEffect(() => {
    if (!active) return
    const Watcher = (window as WindowWithCloseWatcher).CloseWatcher
    if (!Watcher) return

    const watcher = new Watcher()
    watcher.onclose = () => latestOnCancel.current()
    return () => watcher.destroy()
  }, [active])
}
