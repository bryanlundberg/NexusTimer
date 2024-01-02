import { sort } from "fast-sort";
import { Solve } from "@/interfaces/Solve";

/**
 * Gets the best time from an array of solves.
 * @param {Object} params - Parameters for getting the best time.
 * @param {Solve[]} params.solves - An array of solve objects.
 * @returns {number} The best time from the array of solves.
 * @throws {Error} If any solve object is missing the 'time' property or if 'time' is not a number.
 */
export default function getBestTime({ solves }: { solves: Solve[] }): number {
  // Return 0 if the array is empty
  if (solves.length === 0) return 0;

  // Ensure each solve object has a 'time' property of type number
  if (solves.some((solve) => typeof solve.time !== "number")) {
    throw new Error(
      "Invalid solve data. Each solve object must have a 'time' property of type number."
    );
  }

  // Sort solves in ascending order based on the 'time' property
  const sortedSolves = sort(solves).asc((solve) => solve.time);

  // Return the best time (first element after sorting)
  return sortedSolves[0].time;
}
