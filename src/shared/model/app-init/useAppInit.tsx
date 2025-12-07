import { useEffect, useState } from 'react'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useSession } from 'next-auth/react'
import { cubesDB } from '@/entities/cube/api/indexdb'

export function useAppInit() {
  const setCubes = useTimerStore((store) => store.setCubes)
  const setSelectedCube = useTimerStore((store) => store.setSelectedCube)
  const setNewScramble = useTimerStore((store) => store.setNewScramble)
  const settings = useSettingsStore((store) => store.settings)
  const [isMounted, setIsMounted] = useState(false)
  const [isAppReady, setIsAppReady] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    const loadData = async () => {
      const cubes = await cubesDB.getAll()
      const defaultCubeId = settings.preferences.defaultCube
      setCubes(cubes)

      if (defaultCubeId) {
        const defaultCube = await cubesDB.getById(defaultCubeId)
        if (defaultCube) {
          setSelectedCube(defaultCube)
          setNewScramble(defaultCube)
        } else {
          setSelectedCube(null)
        }
      } else {
        setSelectedCube(null)
      }

      setIsAppReady(true)
    }

    loadData()
  }, [])

  useEffect(() => {
    if (!session?.user?.id) return

    const updateLastSeen = async () => {
      try {
        await fetch(`/api/v1/users/${session.user.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ lastSeenAt: Date.now() }),
          headers: { 'Content-Type': 'application/json' }
        })
      } catch (error) {
        console.error('Failed to update last seen at:', error)
      }
    }

    updateLastSeen()
  }, [session?.user?.id])

  useEffect(() => {
    setIsMounted(true)
  }, [])


  return { isMounted, isAppReady }
}
