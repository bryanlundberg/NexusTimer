import { Categories } from "@/interfaces/Categories";
import getSolvesMetrics from "./getSolvesMetrics";
import { Cube } from "@/interfaces/Cube";
import calcPenaltyRate from "./calcPenaltyRate";

/**
 * Calculates the success rate (percentage of solves with a "+2" penalty) for different solve sets
 * (global, session, cubeSession, cubeAll) of a specific cube.
 * @param cubesDB
 * @param category
 * @param cubeName
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

  const globalRate = calcPenaltyRate(global);
  const sessionRate = calcPenaltyRate(session);
  const cubeAllRate = calcPenaltyRate(cubeAll);
  const cubeSessionRate = calcPenaltyRate(cubeSession);

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
