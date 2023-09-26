import { Categories } from "@/interfaces/Categories";
import getSolvesMetrics from "./getSolvesMetrics";
import calculateBestAo from "./calculateBestAo";

export default function calcAoStatistics(
  category: Categories,
  cubeName: string
) {
  const { global, session, cube } = getSolvesMetrics(category, cubeName);

  return {
    global: {
      ao3: calculateBestAo(global, 3),
      ao5: calculateBestAo(global, 5),
      ao12: calculateBestAo(global, 12),
      ao50: calculateBestAo(global, 50),
      ao100: calculateBestAo(global, 100),
      ao1000: calculateBestAo(global, 1000),
    },
    session: {
      ao3: calculateBestAo(session, 3),
      ao5: calculateBestAo(session, 5),
      ao12: calculateBestAo(session, 12),
      ao50: calculateBestAo(session, 50),
      ao100: calculateBestAo(session, 100),
      ao1000: calculateBestAo(session, 1000),
    },
    cube: {
      ao3: calculateBestAo(cube, 3),
      ao5: calculateBestAo(cube, 5),
      ao12: calculateBestAo(cube, 12),
      ao50: calculateBestAo(cube, 50),
      ao100: calculateBestAo(cube, 100),
      ao1000: calculateBestAo(cube, 1000),
    },
  };
}
