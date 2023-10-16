import { Categories } from "@/interfaces/Categories";
import getSolvesMetrics from "./getSolvesMetrics";

export default function calcAverageStatistics(
  category: Categories,
  cubeName: string
) {
  const solveMetrics = getSolvesMetrics(category, cubeName);

  const globalTime = solveMetrics.global.reduce((total, acc) => total + acc.time, 0) / solveMetrics.global.length;

  const sessionTime = solveMetrics.session.reduce((total, acc) => total + acc.time, 0) / solveMetrics.session.length;

  const cubeSessionTime = solveMetrics.cubeSession.reduce((total, acc) => total + acc.time, 0) / solveMetrics.cubeSession.length;
  
  const cubeAllTime = solveMetrics.cubeAll.reduce((total, acc) => total + acc.time, 0) / solveMetrics.cubeAll.length;

  return {
    global: globalTime > 0 ? globalTime : 0,
    session: sessionTime > 0 ? sessionTime : 0,
    cubeSession: cubeSessionTime > 0 ? cubeSessionTime : 0,
    cubeAll: cubeAllTime > 0 ? cubeAllTime : 0,
  };
}
