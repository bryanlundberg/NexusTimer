import { useCallback, useEffect, useRef, useState } from 'react'
import type { TwistyPlayer } from '@rednaxela101/cubing/twisty'
import type { SmartCubeConnection, SmartCubeEvent } from 'smartcube-web-bluetooth'
import { IDENTITY, conjugate, multiply, normalize, slerp, type Quaternion } from '@/features/smart-cube/lib/quaternion'

interface UseSmartCubeGyroArgs {
  player: TwistyPlayer | null
  connection: SmartCubeConnection | null
}

// Minimal structural types: cubing.js bundles its own older @types/three.
type Vantage = { render?: () => void; scheduleRender: () => void }
type PuzzleObject = { quaternion: Quaternion & { set: (x: number, y: number, z: number, w: number) => void } }

const deviceToThree = ({ x, y, z, w }: Quaternion): Quaternion => normalize({ x, y: z, z: -y, w })

export function useSmartCubeGyro({ player, connection }: UseSmartCubeGyroArgs) {
  const [active, setActive] = useState(false)
  const pendingResetRef = useRef(true)

  useEffect(() => {
    if (!player || !connection) return
    let cancelled = false
    let rafId = 0
    let subscription: ReturnType<SmartCubeConnection['events$']['subscribe']> | null = null

    let homeInverse = IDENTITY
    let target: Quaternion | null = null

    void (async () => {
      try {
        const puzzleObject = (await player.experimentalCurrentThreeJSPuzzleObject()) as unknown as PuzzleObject
        if (cancelled) return
        const vantages = Array.from(await player.experimentalCurrentVantages()) as Vantage[]
        if (cancelled) return

        const tick = () => {
          if (target) {
            const { quaternion } = puzzleObject
            const next = slerp(quaternion, target, 0.3)
            quaternion.set(next.x, next.y, next.z, next.w)
            for (const vantage of vantages) (vantage.render ?? vantage.scheduleRender).call(vantage)
          }
          rafId = window.requestAnimationFrame(tick)
        }
        rafId = window.requestAnimationFrame(tick)

        subscription = connection.events$.subscribe((event: SmartCubeEvent) => {
          if (event.type !== 'GYRO') return
          const current = deviceToThree(event.quaternion)
          if (pendingResetRef.current) {
            homeInverse = conjugate(current)
            pendingResetRef.current = false
          }
          target = multiply(homeInverse, current)
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
