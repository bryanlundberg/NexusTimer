import { PuzzleID } from 'cubing/twisty'
import { cubeCollection } from './const/cubeCollection'
import { CubeCategory } from '@/shared/config/cube-categories'

/**
 * Retrieves the display ID for a given cube category.
 * @param {CubeCategory} category - The category of the cube.
 * @returns {PuzzleID} The display ID for the cube category.
 */
export default function getDisplayId(category: CubeCategory): PuzzleID {
  const id = cubeCollection.find((u) => u.name === category)
  return id?.displayId ?? '3x3x3'
}
