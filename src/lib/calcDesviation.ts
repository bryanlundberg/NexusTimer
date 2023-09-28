import { Categories } from "@/interfaces/Categories";
import getSolvesMetrics from "./getSolvesMetrics";
import getDesviation from "./getDesviation";

export default function calcDesviation(category: Categories, cubeName: string) {
  const { global, session, cubeAll, cubeSession } = getSolvesMetrics(
    category,
    cubeName
  );

  return {
    global: getDesviation(global),
    session: getDesviation(session),
    cubeAll: getDesviation(cubeAll),
    cubeSession: getDesviation(cubeSession),
  };
}
