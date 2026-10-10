import { CubeCategory } from '@/shared/const/cube-categories'
import { PuzzleID } from '@rednaxela101/cubing/twisty'
import type { CrossHint } from '@nexustimer/cube-solver-rs'

export type CrossHints = {
  scramble: string
  faces: CrossHint[]
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
  | 'fto'

type TwistyTimerEvent =
  null | '222' | '333' | '444' | '555' | '666' | '777' | 'skewb' | 'mega' | 'pyra' | 'sq1' | 'clock' | 'fto'

export type CubeCollection = {
  event: Event
  id: number
  name: CubeCategory
  src: any
  displayId: PuzzleID
  twistyId: TwistyTimerEvent
}
