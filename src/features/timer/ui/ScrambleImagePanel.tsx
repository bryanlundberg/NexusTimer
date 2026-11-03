import { useEffect, useLayoutEffect, useRef } from 'react'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { AnimatePresence, motion, useAnimate, useReducedMotion } from 'motion/react'
import { cn } from '@/shared/lib/utils'
import { useWindowHeight } from '@/shared/model/useWindowHeight'
import ScrambleDisplay from '@/shared/ui/scramble-display/ui/ScrambleDisplay'
import { SCRAMBLE_HEIGHT } from '@/shared/const/scramble-height'
import { SCRAMBLE_ZOOM_TARGET_ID } from '@/shared/const/scramble-zoom-target'
import { TimerStatus } from '@/features/timer/model/enums'

const FLOATING_ATTRIBUTE = 'data-scramble-floating'
const ZOOM_TRANSITION = { duration: 0.32, ease: [0.22, 1, 0.36, 1] } as const

export default function ScrambleImagePanel() {
  const settings = useSettingsStore((store) => store.settings)
  const scramble = useTimerStore((store) => store.scramble)
  const selectedCube = useTimerStore((store) => store.selectedCube)
  const setZoomInScramble = useTimerStore((store) => store.setZoomInScramble)
  const zoomInScramble = useTimerStore((store) => store.zoomInScramble)
  const isSolving = useTimerStore((store) => store.isSolving)
  const timerStatus = useTimerStore((store) => store.timerStatus)
  const height = useWindowHeight()
  const reduceMotion = useReducedMotion()
  const slotRef = useRef<HTMLDivElement>(null)
  const [frameRef, animate] = useAnimate<HTMLDivElement>()
  const flightRef = useRef<ReturnType<typeof animate> | null>(null)
  const zoomTransition = reduceMotion ? { duration: 0 } : ZOOM_TRANSITION

  const flyTo = (target: DOMRect) => {
    const frame = frameRef.current
    const from = frame.getBoundingClientRect()
    flightRef.current?.stop()
    frame.setAttribute(FLOATING_ATTRIBUTE, '')
    frame.style.position = 'fixed'
    frame.style.zIndex = '50'
    const flight = animate(
      frame,
      {
        left: [from.left, target.left],
        top: [from.top, target.top],
        width: [from.width, target.width],
        height: [from.height, target.height]
      },
      zoomTransition
    )
    flightRef.current = flight
    return flight
  }

  useLayoutEffect(() => {
    const frame = frameRef.current
    const slot = slotRef.current
    if (!frame || !slot) return

    if (zoomInScramble) {
      const flyToZoomTarget = () => {
        const target = document.getElementById(SCRAMBLE_ZOOM_TARGET_ID)
        if (target) flyTo(target.getBoundingClientRect())
      }
      flyToZoomTarget()
      window.addEventListener('resize', flyToZoomTarget)
      return () => window.removeEventListener('resize', flyToZoomTarget)
    }

    if (!frame.hasAttribute(FLOATING_ATTRIBUTE)) return
    const flight = flyTo(slot.getBoundingClientRect())
    flight.then(() => {
      if (flightRef.current !== flight) return
      frame.removeAttribute(FLOATING_ATTRIBUTE)
      frame.removeAttribute('style')
    })
  }, [zoomInScramble])

  useEffect(() => {
    if (isSolving || timerStatus !== TimerStatus.IDLE) setZoomInScramble(false)
  }, [isSolving, timerStatus, setZoomInScramble])

  useEffect(() => () => setZoomInScramble(false), [setZoomInScramble])

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0.8, top: 100 }}
      animate={{ opacity: 1, top: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <AnimatePresence>
        {zoomInScramble && (
          <motion.div
            data-testid="scramble-zoom-backdrop"
            className="fixed inset-0 z-40 bg-black/40 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={zoomTransition}
          />
        )}
      </AnimatePresence>
      <div
        className={'w-fit mx-auto'}
        data-no-timer-touch
        onClick={() => setZoomInScramble(true)}
        onContextMenu={(e) => e.preventDefault()}
      >
        <div
          ref={slotRef}
          className={cn('w-20 h-20 md:w-32 mx-auto cursor-pointer', height <= SCRAMBLE_HEIGHT && 'h-18 max-w-20')}
        >
          <div ref={frameRef} className="size-full">
            <ScrambleDisplay
              className="size-full"
              show={settings.features.scrambleImage}
              scramble={scramble}
              event={selectedCube?.category || '3x3'}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
