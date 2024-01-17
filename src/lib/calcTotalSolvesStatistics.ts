import { Categories } from "@/interfaces/Categories";
import getSolvesMetrics from "./getSolvesMetrics";

/**
 * Calculates the total number of solves for different solve sets (global, session, cubeSession, cubeAll) of a specific cube.
 * @param {Categories} category - The category of the cube solves.
 * @param {string} cubeName - The name of the cube.
 * @returns {StatisticN} The total number of solves for global, session, cubeSession, and cubeAll.
 */
export default async function calcTotalSolvesStatistics(
  category: Categories,
  cubeName: string
): Promise<StatisticN> {
  // Get solve metrics for global, session, cubeSession, and cubeAll
  const { global, session, cubeAll, cubeSession } = await getSolvesMetrics(
    category,
    cubeName
  );

  // Calculate the total number of solves for each solve set
  return {
    global: global.length,
    session: session.length,
    cubeAll: cubeAll.length,
    cubeSession: cubeSession.length,
  };
}
