import { Categories } from "@/interfaces/Categories";
import getSolvesMetrics from "./getSolvesMetrics";

export default function calcAverageStatistics(
  category: Categories,
  cubeName: string
) {
  const solveMetrics = getSolvesMetrics(category, cubeName);

  const globalTime =
    solveMetrics.global.reduce((total, acc) => total + acc.time, 0) /
    1000 /
    solveMetrics.global.length;
  const cubeSessionTime =
    solveMetrics.session.reduce((total, acc) => total + acc.time, 0) /
    1000 /
    solveMetrics.session.length;
  const cubeAllTime =
    solveMetrics.cube.reduce((total, acc) => total + acc.time, 0) /
    1000 /
    solveMetrics.cube.length;

  return {
    global: globalTime > 0 ? globalTime : 0,
    session: cubeSessionTime > 0 ? cubeSessionTime : 0,
    cube: cubeAllTime > 0 ? cubeAllTime : 0,
  };
}
