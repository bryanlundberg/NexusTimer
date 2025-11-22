import { CubeCategory } from '@/shared/config/cube-categories'
import { PuzzleID } from 'cubing/twisty'

export type CrossSolution = {
  cross: string[]
  xcross: string[]
  fb: string[]
  eoline: string[]
}

export type Event =
  | null
  | '222'
  | '333'
  | '444'
  | '555'
  | '666'
  | '777'
  | '333bf'
  | '333fm'
  | '333oh'
  | 'clock'
  | 'minx'
  | 'pyram'
  | 'skewb'
  | 'sq1'
  | '444bf'
  | '555bf'
  | '333mbf'
  | '333ft'

type TwistyTimerEvent =
  | null
  | '222'
  | '333'
  | '444'
  | '555'
  | '666'
  | '777'
  | 'skewb'
  | 'mega'
  | 'pyra'
  | 'sq1'
  | 'clock'

export type CubeCollection = {
  event: Event
  id: number
  name: CubeCategory
  src: any
  displayId: PuzzleID
  twistyId: TwistyTimerEvent
}
