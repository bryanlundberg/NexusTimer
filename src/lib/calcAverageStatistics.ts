import { Categories } from "@/interfaces/Categories";
import getSolvesMetrics from "./getSolvesMetrics";
import { Cube } from "@/interfaces/Cube";

/**
 * Calculates the average solve time for different solve sets (global, session, cubeSession, cubeAll) of a specific cube.
 * @param {Categories} category - The category of the cube solves.
 * @param {string} cubeName - The name of the cube.
 * @returns {StatisticN} The calculated average solve times for global, session, cubeSession, and cubeAll.
 */
export default function calcAverageStatistics({
  cubesDB,
  category,
  cubeName,
}: {
  cubesDB: Cube[] | null;
  category: Categories;
  cubeName: string;
}): StatisticN {
  // Get solve metrics for global, session, cubeSession, and cubeAll
  const solveMetrics = getSolvesMetrics({ cubesDB, category, cubeName });

  // Calculate average solve time for global solves
  const globalTime =
    solveMetrics.global.reduce((total, acc) => total + acc.time, 0) /
    solveMetrics.global.length;

  // Calculate average solve time for session solves
  const sessionTime =
    solveMetrics.session.reduce((total, acc) => total + acc.time, 0) /
    solveMetrics.session.length;

  // Calculate average solve time for cubeSession solves
  const cubeSessionTime =
    solveMetrics.cubeSession.reduce((total, acc) => total + acc.time, 0) /
    solveMetrics.cubeSession.length;

  // Calculate average solve time for cubeAll solves
  const cubeAllTime =
    solveMetrics.cubeAll.reduce((total, acc) => total + acc.time, 0) /
    solveMetrics.cubeAll.length;

  // Return the calculated average solve times for each solve set
  return {
    global: globalTime > 0 ? globalTime : 0,
    session: sessionTime > 0 ? sessionTime : 0,
    cubeSession: cubeSessionTime > 0 ? cubeSessionTime : 0,
    cubeAll: cubeAllTime > 0 ? cubeAllTime : 0,
  };
}
