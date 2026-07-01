import * as cstimer from 'cstimer_module'
import { CubeCategory } from '@/shared/const/cube-categories'
import { CubeCollection } from '@/shared/types/types'
import { cubeCollection } from '@/shared/const/cube-collection'

const CSTIMER_SCRAMBLE: Record<CubeCategory, { type: string; length?: number }> = {
  '2x2': { type: '222so' },
  '3x3': { type: '333' },
  '3x3 OH': { type: '333' },
  '3x3 BLD': { type: '333ni' },
  '4x4': { type: '444wca' },
  '4x4 BLD': { type: '444bld' },
  '5x5': { type: '555wca', length: 60 },
  '6x6': { type: '666wca', length: 80 },
  '7x7': { type: '777wca', length: 100 },
  SQ1: { type: 'sqrs' },
  Skewb: { type: 'skbso' },
  Pyraminx: { type: 'pyrso' },
  Megaminx: { type: 'mgmp', length: 70 },
  Clock: { type: 'clkwca' }
}

export default function genScramble(category: CubeCategory) {
  const findEvent = (category: CubeCategory) => cubeCollection.find((cube: CubeCollection) => cube.name === category)

  const eventId = findEvent(category)

  if (!eventId || eventId.event == null) {
    throw new Error('Error: Scrambler not available for this category.')
  }

  const config = CSTIMER_SCRAMBLE[category]

  if (!config) {
    throw new Error('Error: Scrambler not available for this category.')
  }

  const newScramble = cstimer.getScramble(config.type, config.length ?? 0)

  return newScramble?.trim() || 'Error: Unable to retrieve scramble.'
}
