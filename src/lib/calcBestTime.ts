import { Categories } from "@/interfaces/Categories";
import getSolvesMetrics from "./getSolvesMetrics";

export default function calcBestTime(category: Categories, cubeName: string) {
  const { global, session, cubeAll, cubeSession } = getSolvesMetrics(
    category,
    cubeName
  );

  return {
    global: global.length > 0 ? global[0].time / 1000 : "--",
    session: session.length > 0 ? session[0].time / 1000 : "--",
    cubeAll: cubeAll.length > 0 ? cubeAll[0].time / 1000 : "--",
    cubeSession: cubeSession.length > 0 ? cubeSession[0].time / 1000 : "--",
  };
}
