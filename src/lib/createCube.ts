import { Cube } from "@/interfaces/Cube";
import genId from "./genId";
import { Categories } from "@/interfaces/Categories";
import loadCubes from "./loadCubes";

/**
 * Creates a new cube and adds it to the list of cubes in local storage.
 * @param {Object} cubeDetails - Details of the new cube.
 * @param {string} cubeDetails.cubeName - The name of the new cube.
 * @param {Categories} cubeDetails.category - The category of the new cube.
 * @returns {Cube[]} The updated list of cubes with the newly created cube.
 */
export default function createCube({
  cubeName,
  category,
}: {
  cubeName: string;
  category: Categories;
}): Cube[] {
  // Load existing cubes from local storage
  const cubesDB = loadCubes();

  // Create a new cube object
  const newCube: Cube = {
    id: genId(),
    name: cubeName,
    category: category,
    solves: {
      session: [],
      all: [],
    },
    createdAt: Date.now(),
    favorite: false,
  };

  // Combine the existing cubes with the new cube
  const newCubes = [...cubesDB, newCube];

  // Update the list of cubes in local storage
  window.localStorage.setItem("cubes", JSON.stringify(newCubes));

  // Return the updated list of cubes
  return newCubes;
}
