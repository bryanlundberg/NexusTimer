import { Categories } from "@/interfaces/Categories";
import getSolvesMetrics from "./getSolvesMetrics";

export default function calcTotalSolvesStatistics(
  category: Categories,
  cubeName: string
) {
  const { global, session, cubeAll, cubeSession } = getSolvesMetrics(
    category,
    cubeName
  );

  return {
    global: global.length,
    session: session.length,
    cubeAll: cubeAll.length,
    cubeSession: cubeSession.length,
  };
}
