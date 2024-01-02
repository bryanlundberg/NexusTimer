import { Cube } from "@/interfaces/Cube";

/**
 * Loads cubes from local storage. If no cubes are found, initializes an empty array.
 * @returns {Cube[]} An array containing cube objects.
 */
export default function loadCubes(): Cube[] {
  const cubesDB = window.localStorage.getItem("cubes");

  try {
    if (!cubesDB) {
      // Initialize local storage with an empty array if no cubes are found
      window.localStorage.setItem("cubes", JSON.stringify([]));
      return [];
    }

    const parsedCubes = JSON.parse(cubesDB);

    // Ensure the parsed result is an array
    if (Array.isArray(parsedCubes)) {
      return parsedCubes;
    } else {
      throw new Error("Invalid data format in local storage.");
    }
  } catch (error) {
    // Handle parsing errors and initialize local storage with an empty array
    window.localStorage.setItem("cubes", JSON.stringify([]));
    return [];
  }
}
