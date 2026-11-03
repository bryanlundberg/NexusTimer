import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { SCRAMBLE_ZOOM_TARGET_ID } from '@/shared/const/scramble-zoom-target'

export default function ScrambleModal() {
  const zoomInScramble = useTimerStore((store) => store.zoomInScramble)
  const setZoomInScramble = useTimerStore((store) => store.setZoomInScramble)

  if (!zoomInScramble) return null

  const handleClose = () => setZoomInScramble(false)

  return (
    <div
      className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-transparent"
      data-no-timer-touch
      onClick={handleClose}
    >
      <div id={SCRAMBLE_ZOOM_TARGET_ID} className="w-full h-120 max-h-full" />
    </div>
  )
}
