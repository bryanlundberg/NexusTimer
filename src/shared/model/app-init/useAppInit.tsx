import { useEffect, useState } from 'react'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { getStoredSelectedCubeId } from '@/shared/lib/selectedCubeStorage'
import { cubesDB } from '@/entities/cube/api/indexdb'

export function useAppInit() {
  const setCubes = useTimerStore((store) => store.setCubes)
  const setSelectedCube = useTimerStore((store) => store.setSelectedCube)
  const setNewScramble = useTimerStore((store) => store.setNewScramble)
  const [isAppReady, setIsAppReady] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const cubes = await cubesDB.getAll()
      setCubes(cubes)

      const storedCubeId = getStoredSelectedCubeId()
      const storedCube = storedCubeId ? cubes.find((cube) => cube.id === storedCubeId) : undefined

      if (storedCube) {
        setSelectedCube(storedCube)
        setNewScramble(storedCube)
      } else {
        setSelectedCube(null)
      }

      setIsAppReady(true)
    }

    loadData()
  }, [])

  return { isAppReady }
}
