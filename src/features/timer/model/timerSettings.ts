import { Settings } from '@/shared/types/Settings'

export type TimerSettings = {
  timer: Pick<Settings['timer'], 'holdToStart'> & Partial<Pick<Settings['timer'], 'holdToStartTime' | 'inspectionTime'>>
  sounds?: Partial<Pick<Settings['sounds'], 'inspection' | 'voiceGender'>>
}
