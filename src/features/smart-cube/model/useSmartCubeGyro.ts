import { useCallback, useEffect, useRef, useState } from 'react'
import { Quaternion } from 'three'
import type { TwistyPlayer } from 'cubing/twisty'
import type { SmartCubeConnection, SmartCubeEvent } from 'smartcube-web-bluetooth'

interface UseSmartCubeGyroArgs {
  player: TwistyPlayer | null
  connection: SmartCubeConnection | null
}

// Minimal structural types: cubing.js bundles its own older @types/three.
type Vantage = { render?: () => void; scheduleRender: () => void }
type QuaternionLike = { x: number; y: number; z: number; w: number }
type PuzzleObject = { quaternion: { slerp: (q: QuaternionLike, t: number) => void } }

function deviceToThree(target: Quaternion, x: number, y: number, z: number, w: number): Quaternion {
  return target.set(x, z, -y, w).normalize()
}

export function useSmartCubeGyro({ player, connection }: UseSmartCubeGyroArgs) {
  const [active, setActive] = useState(false)
  const pendingResetRef = useRef(true)

  useEffect(() => {
    if (!player || !connection) return
    let cancelled = false
    let rafId = 0
    let subscription: ReturnType<SmartCubeConnection['events$']['subscribe']> | null = null

    const current = new Quaternion()
    const homeInverse = new Quaternion()
    const target = new Quaternion()
    let hasTarget = false

    void (async () => {
      try {
        const puzzleObject = (await player.experimentalCurrentThreeJSPuzzleObject()) as unknown as PuzzleObject
        if (cancelled) return
        const vantages = Array.from(await player.experimentalCurrentVantages()) as Vantage[]
        if (cancelled) return

        const tick = () => {
          if (hasTarget) {
            puzzleObject.quaternion.slerp(target, 0.3)
            for (const vantage of vantages) (vantage.render ?? vantage.scheduleRender).call(vantage)
          }
          rafId = window.requestAnimationFrame(tick)
        }
        rafId = window.requestAnimationFrame(tick)

        subscription = connection.events$.subscribe((event: SmartCubeEvent) => {
          if (event.type !== 'GYRO') return
          const { x, y, z, w } = event.quaternion
          deviceToThree(current, x, y, z, w)
          if (pendingResetRef.current) {
            homeInverse.copy(current).invert()
            pendingResetRef.current = false
          }
          target.copy(homeInverse).multiply(current)
          hasTarget = true
          setActive(true)
        })
      } catch {}
    })()

    return () => {
      cancelled = true
      if (rafId) window.cancelAnimationFrame(rafId)
      subscription?.unsubscribe()
      setActive(false)
      pendingResetRef.current = true
    }
  }, [player, connection])

  const resetOrientation = useCallback(() => {
    pendingResetRef.current = true
  }, [])

  return { active, resetOrientation }
}
