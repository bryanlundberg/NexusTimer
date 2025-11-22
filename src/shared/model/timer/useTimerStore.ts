import { TimerMode, TimerStatus } from '@/features/timer/model/enums'
import { cubeCollection } from '@/lib/const/cubeCollection'
import { defaultTimerStatistics } from '@/lib/const/defaultTimerStatistics'
import genScramble from '@/lib/timer/genScramble'
import { create } from 'zustand'
import { DisplayTimerStatistics } from '@/features/deep-statistics/model/types'
import { Solve } from '@/entities/solve/model/types'
import { Cube } from '@/entities/cube/model/types'
import { CrossSolution } from '@/shared/types/types'
import { Event } from '@/shared/types/types'

type UseTimerStore = {
  cubes: Cube[] | null
  selectedCube: Cube | null
  scramble: string | null
  event: Event
  lastSolve: Solve | null
  solvingTime: number
  isSolving: boolean
  timerStatus: TimerStatus
  zoomInScramble: boolean
  hint: CrossSolution | null
  timerStatistics: DisplayTimerStatistics
  timerMode: TimerMode.NORMAL | TimerMode.MANUAL | TimerMode.STACKMAT | TimerMode.VIRTUAL | TimerMode.SMART_CUBE
  isOpenDrawerNewCollection: boolean
  setNewScramble: (cube: Cube | null) => void
  setCubes: (cubesDB: Cube[]) => void
  setSelectedCube: (cube: Cube | null) => void
  setLastSolve: (solve: Solve | null) => void
  setSolvingTime: (newTime: number) => void
  setIsSolving: (isSolving: boolean) => void
  setTimerStatus: (timerStatus: TimerStatus) => void
  setZoomInScramble: (status: boolean) => void
  setHints: (solutions: CrossSolution) => void
  setCustomScramble: (scramble: string) => void
  setTimerStatistics: (stats: DisplayTimerStatistics) => void
  setTimerMode: (
    mode: TimerMode.NORMAL | TimerMode.MANUAL | TimerMode.STACKMAT | TimerMode.VIRTUAL | TimerMode.SMART_CUBE
  ) => void
  setIsOpenDrawerNewCollection: (status: boolean) => void
  reset: () => void
}

export const useTimerStore = create<UseTimerStore>((set) => ({
  selectedCube: null,
  scramble: null,
  cubes: null,
  event: '333',
  lastSolve: null,
  solvingTime: 0,
  isSolving: false,
  timerStatus: TimerStatus.IDLE,
  zoomInScramble: false,
  hint: null,
  timerStatistics: {
    global: defaultTimerStatistics,
    session: defaultTimerStatistics,
    cubeSession: defaultTimerStatistics
  },
  timerMode: TimerMode.NORMAL,
  isOpenDrawerNewCollection: false,
  setNewScramble: (cube: Cube | null) => {
    set({ scramble: cube ? genScramble(cube.category) : null })
  },
  setCustomScramble: (scramble: string) => {
    set({ scramble: scramble })
  },
  setCubes: (cubesDB: Cube[]) => {
    set({ cubes: cubesDB })
  },
  setSelectedCube: (cube: Cube | null) => {
    set((state) => {
      if (!cube || typeof cube !== 'object') {
        return {
          event: null,
          selectedCube: null
        }
      }

      const selectedEvent = cubeCollection.find((item) => item.name === cube.category)

      const filteredCube = {
        ...cube,
        solves: {
          session: cube.solves.session.filter((solve) => !solve.isDeleted),
          all: cube.solves.all.filter((solve) => !solve.isDeleted)
        }
      }

      return {
        event: selectedEvent?.event,
        selectedCube: filteredCube,
        cubes: state.cubes?.map((item) => (item.id === cube.id ? filteredCube : item))
      }
    })
  },
  setLastSolve: (solve: Solve | null) => {
    set({ lastSolve: solve })
  },
  setSolvingTime: (newTime: number) => {
    set({ solvingTime: newTime })
  },
  setIsSolving: (isSolving: boolean) => {
    set({ isSolving: isSolving })
  },
  setTimerStatus: (timerStatus: TimerStatus) => {
    set({ timerStatus })
  },
  setZoomInScramble: (status: boolean) => {
    set({ zoomInScramble: status })
  },
  setHints: (solutions: CrossSolution) => {
    set({ hint: solutions })
  },
  setTimerStatistics: (stats) => {
    set({ timerStatistics: stats })
  },
  setTimerMode: (
    mode: TimerMode.NORMAL | TimerMode.MANUAL | TimerMode.STACKMAT | TimerMode.VIRTUAL | TimerMode.SMART_CUBE
  ) => {
    set({ timerMode: mode })
  },
  setIsOpenDrawerNewCollection: (status: boolean) => {
    set({ isOpenDrawerNewCollection: status })
  },
  reset: () =>
    set({
      isSolving: false,
      timerStatus: TimerStatus.IDLE,
      zoomInScramble: false,
      hint: null,
      isOpenDrawerNewCollection: false
    })
}))
