import { Categories } from "@/interfaces/Categories";
import getSolvesMetrics from "./getSolvesMetrics";
import getDeviation from "./getDeviation";

export default function calcDeviation(category: Categories, cubeName: string) {
  const { global, session, cubeAll, cubeSession } = getSolvesMetrics(
    category,
    cubeName
  );

  return {
    global: getDeviation(global),
    session: getDeviation(session),
    cubeAll: getDeviation(cubeAll),
    cubeSession: getDeviation(cubeSession),
  };
}
