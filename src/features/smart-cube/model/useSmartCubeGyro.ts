import { useCallback, useEffect, useRef, useState } from 'react'
import { Quaternion } from 'three'
import type { TwistyPlayer } from 'cubing/twisty'
import type { SmartCubeConnection, SmartCubeEvent } from 'smartcube-web-bluetooth'

interface UseSmartCubeGyroArgs {
  player: TwistyPlayer | null
  connection: SmartCubeConnection | null
}

// Minimal structural types: cubing.js bundles its own older @types/three.
type Vantage = { scheduleRender: () => void }
type QuaternionLike = { x: number; y: number; z: number; w: number }
type PuzzleObject = { quaternion: { copy: (q: QuaternionLike) => void } }

function deviceToThree(target: Quaternion, x: number, y: number, z: number, w: number): Quaternion {
  return target.set(x, z, -y, w).normalize()
}

export function useSmartCubeGyro({ player, connection }: UseSmartCubeGyroArgs) {
  const [active, setActive] = useState(false)

  const homeInverseRef = useRef(new Quaternion())
  const currentRef = useRef(new Quaternion())
  const appliedRef = useRef(new Quaternion())
  const pendingResetRef = useRef(true)

  useEffect(() => {
    if (!player || !connection) return
    let cancelled = false
    let subscription: ReturnType<SmartCubeConnection['events$']['subscribe']> | null = null

    void (async () => {
      try {
        const puzzleObject = (await player.experimentalCurrentThreeJSPuzzleObject()) as unknown as PuzzleObject
        if (cancelled) return
        const vantages = Array.from(await player.experimentalCurrentVantages()) as Vantage[]
        if (cancelled) return

        subscription = connection.events$.subscribe((event: SmartCubeEvent) => {
          if (event.type !== 'GYRO') return
          const { x, y, z, w } = event.quaternion
          const current = deviceToThree(currentRef.current, x, y, z, w)
          if (pendingResetRef.current) {
            homeInverseRef.current.copy(current).invert()
            pendingResetRef.current = false
          }
          const applied = appliedRef.current.copy(homeInverseRef.current).multiply(current)
          puzzleObject.quaternion.copy(applied)
          for (const vantage of vantages) vantage.scheduleRender()
          setActive(true)
        })
      } catch {}
    })()

    return () => {
      cancelled = true
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
