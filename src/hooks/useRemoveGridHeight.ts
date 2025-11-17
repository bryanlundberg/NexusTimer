import { useTimerStore } from '@/store/timerStore'
import { useEffect } from 'react'
import { useQueryState } from 'nuqs'
import { STATES } from '@/shared/const/states'

const useRemoveGridHeight = (otherStates: any = undefined) => {
  const selectedCube = useTimerStore((store) => store.selectedCube)
  const [tabMode] = useQueryState(STATES.SOLVES_PAGE.TAB_MODE.KEY, {
    defaultValue: STATES.SOLVES_PAGE.TAB_MODE.DEFAULT_VALUE
  })

  useEffect(() => {
    const container = document.querySelector('.container') as HTMLElement
    if (container) container.style.setProperty('--grid-height', 'auto')
  }, [selectedCube, tabMode, otherStates])
}

export default useRemoveGridHeight
