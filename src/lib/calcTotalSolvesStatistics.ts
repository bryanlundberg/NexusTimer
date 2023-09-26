import { Categories } from "@/interfaces/Categories";
import getSolvesMetrics from "./getSolvesMetrics";

export default function calcTotalSolvesStatistics(
  category: Categories,
  cubeName: string
) {
  const { global, session, cube } = getSolvesMetrics(category, cubeName);

  return {
    global: global.length,
    session: session.length,
    cube: cube.length,
  };
}
