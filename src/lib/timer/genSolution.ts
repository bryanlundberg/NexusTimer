import { Categories } from '@/interfaces/Categories'
import cubeSolver from 'cube-solver'
import { Layers } from '@/shared/types/enums'

/**
 * Generates cross solutions based on the provided event, scramble, and layer.
 *
 * @param {Categories} event - The event category.
 * @param {string | null} scramble - The scramble string or null if not provided.
 * @param {Layers} layer - The layer color (e.g., "yellow").
 * @returns {Promise<CrossSolutions>} - Promise resolving to an object containing different cross solutions.
 */

export default function genSolution(
  event: Categories,
  scramble: string | null,
  layer: Layers
): Promise<CrossSolutions> {
  return new Promise((resolve) => {
    const solution: CrossSolutions = {
      cross: [],
      xcross: [],
      fb: [],
      eoline: []
    }

    if (event === '3x3' || event === '3x3 OH') {
      if (layer === 'yellow') {
        const crossPromises = [
          cubeSolver.solve(`${scramble}`, 'cross'),
          cubeSolver.solve(`y ${scramble}`, 'cross'),
          cubeSolver.solve(`y y ${scramble}`, 'cross'),
          cubeSolver.solve(`y' ${scramble}`, 'cross')
        ]

        const xcrossPromises = [
          cubeSolver.solve(`${scramble}`, 'xcross'),
          cubeSolver.solve(`y ${scramble}`, 'xcross'),
          cubeSolver.solve(`y y ${scramble}`, 'xcross'),
          cubeSolver.solve(`y' ${scramble}`, 'xcross')
        ]

        Promise.all([...crossPromises, ...xcrossPromises]).then((results) => {
          solution.cross = results.slice(0, 4)
          solution.xcross = results.slice(4, 8)
          resolve(solution)
        })
      }
    } else {
      resolve(solution)
    }
  })
}
