import { Scrambow } from 'scrambow'
import { CubeCategory } from '@/shared/config/cube-categories'
import { CubeCollection } from '@/shared/types/types'
import { cubeCollection } from '@/shared/const/cube-collection'

/**
 * Generates a scramble for the given cube category using Scrambow.
 *
 * @param {CubeCategory} category - The cube category for which to generate a scramble.
 * @throws {Error} Throws an error if the scrambler is not available for the specified category.
 * @returns {string} The generated scramble string.
 */

export default function genScramble(category: CubeCategory) {
  const findEvent = (category: CubeCategory) => cubeCollection.find((cube: CubeCollection) => cube.name === category)

  const eventId = findEvent(category)

  if (!eventId || eventId.event == null) {
    throw new Error('Error: Scrambler not available for this category.')
  }

  // Initialize Scrambow with the event code
  const scramble = new Scrambow(eventId.event)

  // Get one scramble from Scrambow
  const newScramble = scramble.get(1)

  // Return the scramble string from the first element of the array
  return newScramble?.[0]?.scramble_string || 'Error: Unable to retrieve scramble.'
}
