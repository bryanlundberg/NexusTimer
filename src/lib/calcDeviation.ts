import { Categories } from "@/interfaces/Categories";
import getSolvesMetrics from "./getSolvesMetrics";
import getDeviation from "./getDeviation";

/**
 * Calculates the standard deviation of solve times for different solve sets (global, session, cubeSession, cubeAll) of a specific cube.
 * @param {Categories} category - The category of the cube solves.
 * @param {string} cubeName - The name of the cube.
 * @returns {StatisticN} The standard deviation of solve times for global, session, cubeSession, and cubeAll.
 */
export default async function calcDeviation(
  category: Categories,
  cubeName: string
): Promise<StatisticN> {
  // Get solve metrics for global, session, cubeSession, and cubeAll
  const { global, session, cubeAll, cubeSession } = await getSolvesMetrics(
    category,
    cubeName
  );

  // Calculate standard deviation for each solve set
  return {
    global: getDeviation(global),
    session: getDeviation(session),
    cubeAll: getDeviation(cubeAll),
    cubeSession: getDeviation(cubeSession),
  };
}
