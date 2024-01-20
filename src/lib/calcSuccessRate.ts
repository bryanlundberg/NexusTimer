import { Categories } from "@/interfaces/Categories";
import getSolvesMetrics from "./getSolvesMetrics";
import calcPlus2Rate from "./calcPlus2Rate";
import { Cube } from "@/interfaces/Cube";

/**
 * Calculates the success rate (percentage of solves with a "+2" penalty) for different solve sets
 * (global, session, cubeSession, cubeAll) of a specific cube.
 * @param {Categories} category - The category of the cube solves.
 * @param {string} cubeName - The name of the cube.
 * @returns {StatisticS} The success rate for global, session, cubeSession, and cubeAll.
 */
export default function calcSuccessRate({
  cubesDB,
  category,
  cubeName,
}: {
  cubesDB: Cube[] | null;
  category: Categories;
  cubeName: string;
}): StatisticS {
  // Get solve metrics for global, session, cubeSession, and cubeAll
  const { global, session, cubeAll, cubeSession } = getSolvesMetrics({
    cubesDB,
    category,
    cubeName,
  });

  // Calculate the number of solves with a "+2" penalty for each solve set
  const globalRate = calcPlus2Rate(global);
  const sessionRate = calcPlus2Rate(session);
  const cubeAllRate = calcPlus2Rate(cubeAll);
  const cubeSessionRate = calcPlus2Rate(cubeSession);

  // Calculate the success rate (percentage) for each solve set
  return {
    global: calculatePercentage(globalRate, global.length),
    session: calculatePercentage(sessionRate, session.length),
    cubeAll: calculatePercentage(cubeAllRate, cubeAll.length),
    cubeSession: calculatePercentage(cubeSessionRate, cubeSession.length),
  };
}

/**
 * The `calculatePercentage` function calculates the percentage of completion based on a rate and length.
 * @param {number} rate - The rate parameter represents the number of occurrences or events that have
 * happened.
 * @param {number} length - The length parameter represents the total number of items.
 * @returns a string representation of the calculated percentage.
 */

function calculatePercentage(rate: number, length: number): string {
  return length === 0 ? "100" : (100 - (rate * 100) / length).toFixed(2);
}
