import { useTimerStore } from '@/shared/model/timer/useTimerStore'

export default function ScrambleModal() {
  const zoomInScramble = useTimerStore((store) => store.zoomInScramble)
  const setZoomInScramble = useTimerStore((store) => store.setZoomInScramble)

  if (!zoomInScramble) return null

  const handleClose = () => setZoomInScramble(false)

  return (
    <div
      className="absolute top-0 left-0 w-full h-full z-50 bg-transparent"
      data-testid="scramble-zoom-catcher"
      data-no-timer-touch
      onClick={handleClose}
    />
  )
}
