import { Categories } from "@/interfaces/Categories";
import getSolvesMetrics from "./getSolvesMetrics";
import { sort } from "fast-sort";

export default function calcBestTime(category: Categories, cubeName: string) {
  const { global, session, cubeAll, cubeSession } = getSolvesMetrics(
    category,
    cubeName
  );

  const bestGlobal = sort(global).asc((u) => u.time);
  const bestSession = sort(global).asc((u) => u.time);
  const bestCubeAll = sort(global).asc((u) => u.time);
  const bestCubeSession = sort(global).asc((u) => u.time);

  return {
    global: global.length > 0 ? bestGlobal[0].time / 1000 : "--",
    session: session.length > 0 ? bestSession[0].time / 1000 : "--",
    cubeAll: cubeAll.length > 0 ? bestCubeAll[0].time / 1000 : "--",
    cubeSession: cubeSession.length > 0 ? bestCubeSession[0].time / 1000 : "--",
  };
}
