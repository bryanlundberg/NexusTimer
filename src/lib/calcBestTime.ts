import { Categories } from "@/interfaces/Categories";
import getSolvesMetrics from "./getSolvesMetrics";
import { sort } from "fast-sort";
import { Cube } from "@/interfaces/Cube";

/**
 * Calculates the best solve time for different solve sets (global, session, cubeSession, cubeAll) of a specific cube.
 * @param {Categories} category - The category of the cube solves.
 * @param {string} cubeName - The name of the cube.
 * @returns {StatisticN} The best solve times for global, session, cubeSession, and cubeAll.
 */
export default function calcBestTime({
  cubesDB,
  category,
  cubeName,
}: {
  cubesDB: Cube[] | null;
  category: Categories;
  cubeName: string;
}): StatisticN {
  // Get solve metrics for global, session, cubeSession, and cubeAll
  const { global, session, cubeAll, cubeSession } = getSolvesMetrics({
    cubesDB,
    category,
    cubeName,
  });

  // Sort solve sets in ascending order based on solve times
  const bestGlobal = sort(global).asc((u) => u.time);
  const bestSession = sort(session).asc((u) => u.time);
  const bestCubeAll = sort(cubeAll).asc((u) => u.time);
  const bestCubeSession = sort(cubeSession).asc((u) => u.time);

  // Return the best solve times for each solve set
  return {
    global: bestGlobal[0]?.time || 0,
    session: bestSession[0]?.time || 0,
    cubeAll: bestCubeAll[0]?.time || 0,
    cubeSession: bestCubeSession[0]?.time || 0,
  };
}
