import { Categories } from "@/interfaces/Categories";
import getSolvesMetrics from "./getSolvesMetrics";
import calculateBestAo from "./calculateBestAo";
import { Cube } from "@/interfaces/Cube";

/**
 * Calculates various average of X (AoX) statistics for a specific cube and category.
 * @param {Categories} category - The category of the cube solves.
 * @param {string} cubeName - The name of the cube.
 * @returns {AoStatistics} The calculated AoX statistics for global, session, cubeAll, and cubeSession.
 */

export default function calcAoStatistics({
  cubesDB,
  category,
  cubeName,
}: {
  cubesDB: Cube[] | null;
  category: Categories;
  cubeName: string;
}): AoStatistics {
  // Get solve metrics for global, session, cubeAll, and cubeSession
  const { global, session, cubeAll, cubeSession } = getSolvesMetrics({
    cubesDB,
    category,
    cubeName,
  });

  // Calculate AoX statistics for global, session, cubeAll, and cubeSession
  return {
    global: {
      ao3: calculateBestAo(global, 3),
      ao5: calculateBestAo(global, 5),
      ao12: calculateBestAo(global, 12),
      ao50: calculateBestAo(global, 50),
      ao100: calculateBestAo(global, 100),
      ao1000: calculateBestAo(global, 1000),
    },
    session: {
      ao3: calculateBestAo(session, 3),
      ao5: calculateBestAo(session, 5),
      ao12: calculateBestAo(session, 12),
      ao50: calculateBestAo(session, 50),
      ao100: calculateBestAo(session, 100),
      ao1000: calculateBestAo(session, 1000),
    },
    cubeAll: {
      ao3: calculateBestAo(cubeAll, 3),
      ao5: calculateBestAo(cubeAll, 5),
      ao12: calculateBestAo(cubeAll, 12),
      ao50: calculateBestAo(cubeAll, 50),
      ao100: calculateBestAo(cubeAll, 100),
      ao1000: calculateBestAo(cubeAll, 1000),
    },
    cubeSession: {
      ao3: calculateBestAo(cubeSession, 3),
      ao5: calculateBestAo(cubeSession, 5),
      ao12: calculateBestAo(cubeSession, 12),
      ao50: calculateBestAo(cubeSession, 50),
      ao100: calculateBestAo(cubeSession, 100),
      ao1000: calculateBestAo(cubeSession, 1000),
    },
  };
}
