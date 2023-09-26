import { Categories } from "@/interfaces/Categories";
import getSolvesMetrics from "./getSolvesMetrics";

export default function calcBestTime(category: Categories, cubeName: string) {
  const { global, session, cube } = getSolvesMetrics(category, cubeName);

  return {
    global: global.length > 0 ? global[0].time / 1000 : "--",
    session: session.length > 0 ? session[0].time / 1000 : "--",
    cube: cube.length > 0 ? cube[0].time / 1000 : "--",
  };
}
