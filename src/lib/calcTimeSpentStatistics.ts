import { Categories } from "@/interfaces/Categories";
import getSolvesMetrics from "./getSolvesMetrics";
import prettyMilliseconds from "pretty-ms";

export default function calcTimeSpentStatistics(
  category: Categories,
  cubeName: string
) {
  const solveMetrics = getSolvesMetrics(category, cubeName);

  const global = solveMetrics.global.reduce(
    (total, acc) => total + acc.time,
    0
  );

  const session = solveMetrics.session.reduce(
    (total, acc) => total + acc.time,
    0
  );
  const cubeSession = solveMetrics.cubeSession.reduce(
    (total, acc) => total + acc.time,
    0
  );
  const cubeAll = solveMetrics.cubeAll.reduce(
    (total, acc) => total + acc.time,
    0
  );

  return {
    global: prettyMilliseconds(global),
    session: prettyMilliseconds(session),
    cubeAll: prettyMilliseconds(cubeAll),
    cubeSession: prettyMilliseconds(cubeSession),
  };
}
