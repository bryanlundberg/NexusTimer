import { useEffect, useState } from 'react'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { cubesDB } from '@/entities/cube/api/indexdb'

export function useAppInit() {
  const setCubes = useTimerStore((store) => store.setCubes)
  const setSelectedCube = useTimerStore((store) => store.setSelectedCube)
  const setNewScramble = useTimerStore((store) => store.setNewScramble)
  const settings = useSettingsStore((store) => store.settings)
  const updateSetting = useSettingsStore((store) => store.updateSetting)
  const [isAppReady, setIsAppReady] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const cubes = await cubesDB.getAll()
      const defaultCubeId = settings.preferences.defaultCube
      setCubes(cubes)

      const defaultCube = defaultCubeId ? cubes.find((cube) => cube.id === defaultCubeId) : undefined

      if (defaultCube) {
        setSelectedCube(defaultCube)
        setNewScramble(defaultCube)
      } else {
        setSelectedCube(null)
        if (defaultCubeId) updateSetting('preferences.defaultCube', '')
      }

      setIsAppReady(true)
    }

    loadData()
  }, [])

  return { isAppReady }
}
