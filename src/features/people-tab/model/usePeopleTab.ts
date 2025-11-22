'use client'
import { useQueryState } from 'nuqs'
import { PEOPLE_TAB_DEFAULT, PEOPLE_TAB_QS_KEY, PeopleTabs } from '@/widgets/people/model/types'

export function usePeopleTab() {
  const [value, set] = useQueryState(PEOPLE_TAB_QS_KEY, {
    defaultValue: PEOPLE_TAB_DEFAULT
  })
  return { value: value as PeopleTabs, set: (v: PeopleTabs) => set(v) }
}

export { PeopleTabs }
