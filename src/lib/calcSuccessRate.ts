import { Categories } from "@/interfaces/Categories";
import getSolvesMetrics from "./getSolvesMetrics";
import calcPlus2Rate from "./calcPlus2Rate";

export default function calcSuccessRate(
  category: Categories,
  cubeName: string
) {
  const { global, session, cubeAll, cubeSession } = getSolvesMetrics(
    category,
    cubeName
  );

  const globalRate = calcPlus2Rate(global);
  const sessionRate = calcPlus2Rate(session);
  const cubeAllRate = calcPlus2Rate(cubeAll);
  const cubeSessionRate = calcPlus2Rate(cubeSession);

  return {
    global: calculatePercentage(globalRate, global.length),
    session: calculatePercentage(sessionRate, session.length),
    cubeAll: calculatePercentage(cubeAllRate, cubeAll.length),
    cubeSession: calculatePercentage(cubeSessionRate, cubeSession.length),
  };
}

function calculatePercentage(rate: number, length: number) {
  return length === 0 ? 100 : (100 - (rate * 100) / length).toFixed(2);
}
