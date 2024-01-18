import { sort } from "fast-sort";
import calculateBestAo from "./calculateBestAo";
import calculateCurrentAo from "./calculateCurrentAo";
import getDeviation from "./getDeviation";
import getMean from "./getMean";
import getSolvesMetrics from "./getSolvesMetrics";
import { defaultTimerStatistics } from "./const/defaultTimerStatistics";
import { Cube } from "@/interfaces/Cube";

/**
 * Calculates various statistics for a cube solving session, including
 * best time, average of X solves, deviation, and mean.
 * @param {Object} params - The parameters for calculating statistics.
 * @param {Cube | null} params.cube - The cube object for which statistics will be calculated.
 * @returns {DisplayTimerStatistics} An object containing the calculated statistics for global, session, and cubeSession.
 */
export default async function calcStatistics({
  selectedCube,
  cubesDB,
}: {
  selectedCube: Cube | null;
  cubesDB: Cube[] | null;
}): Promise<DisplayTimerStatistics> {
  // Array containing the values for average of X (AoX) calculations
  const aoValues: number[] = [3, 5, 12, 50, 100];

  /**
   * Calculates the statistics for a given set of solves (global, session, cubeSession).
   * @param {Solve[]} solves - The array of solves for which statistics will be calculated.
   * @param {string} type - The type of solves (global, session, cubeSession).
   * @returns {CubeStatistics} The calculated statistics for the given set of solves.
   */
  const calculateStatistics = (solves: any[], type: string): CubeStatistics => {
    // Sort solves in ascending order based on solve times
    const pbSolves = sort(solves).asc((solve) => solve.time);

    // Object to store calculated statistics
    const statistics: CubeStatistics = {
      count: solves.length,
      best: pbSolves[0]?.time || 0,
      deviation: getDeviation(solves),
      mean: getMean(solves),
      ao3: 0,
      ao5: 0,
      ao12: 0,
      ao50: 0,
      ao100: 0,
    };

    // Calculate average of X (AoX) statistics
    for (const aoValue of aoValues) {
      if (solves.length >= aoValue) {
        statistics[`ao${aoValue}` as keyof CubeStatistics] =
          type === "global"
            ? calculateBestAo(solves, aoValue)
            : calculateCurrentAo(solves, aoValue);
      }
    }

    return statistics;
  };

  // Check if the cube object is null
  if (!selectedCube) {
    // Return default statistics if cube is null
    return {
      global: defaultTimerStatistics,
      session: defaultTimerStatistics,
      cubeSession: defaultTimerStatistics,
    };
  }

  // Get solve metrics for global, session, and cubeSession
  const { global, session, cubeSession } = await getSolvesMetrics({
    cubesDB,
    category: selectedCube.category,
    cubeName: selectedCube.name,
  });

  // Calculate and return statistics for global, session, and cubeSession
  return {
    global: calculateStatistics(global, "global"),
    session: calculateStatistics(session, "session"),
    cubeSession: calculateStatistics(cubeSession, "cubeSession"),
  };
}
