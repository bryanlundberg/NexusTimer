import { Categories } from "@/interfaces/Categories";
import getSolvesMetrics from "./getSolvesMetrics";
import { sort } from "fast-sort";

export default function calcBestTime(category: Categories, cubeName: string) {
  const { global, session, cubeAll, cubeSession } = getSolvesMetrics(
    category,
    cubeName
  );

  const bestGlobal = sort(global).asc((u) => u.time);
  const bestSession = sort(session).asc((u) => u.time);
  const bestCubeAll = sort(cubeAll).asc((u) => u.time);
  const bestCubeSession = sort(cubeSession).asc((u) => u.time);

  return {
    global: bestGlobal[0]?.time || 0,
    session: bestSession[0]?.time || 0,
    cubeAll: bestCubeAll[0]?.time || 0,
    cubeSession: bestCubeSession[0]?.time || 0,
  };
}
