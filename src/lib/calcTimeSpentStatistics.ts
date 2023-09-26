import { Categories } from "@/interfaces/Categories";
import getSolvesMetrics from "./getSolvesMetrics";
import prettyMilliseconds from "pretty-ms";

export default function calcTimeSpentStatistics(
  category: Categories,
  cubeName: string
) {
  const solveMetrics = getSolvesMetrics(category, cubeName);

  const globalTime = solveMetrics.global.reduce(
    (total, acc) => total + acc.time,
    0
  );
  const cubeSessionTime = solveMetrics.session.reduce(
    (total, acc) => total + acc.time,
    0
  );
  const cubeAllTime = solveMetrics.cube.reduce(
    (total, acc) => total + acc.time,
    0
  );

  return {
    global: prettyMilliseconds(globalTime),
    session: prettyMilliseconds(cubeSessionTime),
    cube: prettyMilliseconds(cubeAllTime),
  };
}
