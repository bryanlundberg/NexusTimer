import { useCallback, useEffect, useRef, useState } from 'react'
import type { SmartCubeConnection, SmartCubeEvent } from 'smartcube-web-bluetooth'
import { IDENTITY, conjugate, multiply, normalize, slerp, type Quaternion } from '@/features/smart-cube/lib/quaternion'

export interface OrientablePuzzle {
  setOrientation(orientation: readonly [number, number, number, number]): void
}

interface UseSmartCubeGyroArgs {
  player: OrientablePuzzle | null
  connection: SmartCubeConnection | null
}

const deviceToView = ({ x, y, z, w }: Quaternion): Quaternion => normalize({ x, y: z, z: -y, w })

export function useSmartCubeGyro({ player, connection }: UseSmartCubeGyroArgs) {
  const [active, setActive] = useState(false)
  const pendingResetRef = useRef(true)

  useEffect(() => {
    if (!player || !connection) return
    let rafId = 0
    let homeInverse = IDENTITY
    let current = IDENTITY
    let target: Quaternion | null = null

    const tick = () => {
      if (target) {
        current = slerp(current, target, 0.3)
        player.setOrientation([current.x, current.y, current.z, current.w])
      }
      rafId = window.requestAnimationFrame(tick)
    }
    rafId = window.requestAnimationFrame(tick)

    const subscription = connection.events$.subscribe((event: SmartCubeEvent) => {
      if (event.type !== 'GYRO') return
      const reading = deviceToView(event.quaternion)
      if (pendingResetRef.current) {
        homeInverse = conjugate(reading)
        pendingResetRef.current = false
      }
      target = multiply(homeInverse, reading)
      setActive(true)
    })

    return () => {
      window.cancelAnimationFrame(rafId)
      subscription.unsubscribe()
      setActive(false)
      pendingResetRef.current = true
    }
  }, [player, connection])

  const resetOrientation = useCallback(() => {
    pendingResetRef.current = true
  }, [])

  return { active, resetOrientation }
}
