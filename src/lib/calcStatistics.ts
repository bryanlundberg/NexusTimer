import { sort } from "fast-sort";
import findCube from "./findCube";
import calculateCurrentAo from "./calculateCurrentAo";

export default function calcStatistics({
  cubeId,
  typeSearch = "session",
}: {
  cubeId: string;
  typeSearch: "session" | "all";
}): CubeStatistics {
  const defaultResult: CubeStatistics = {
    count: 0,
    best: 0,
    ao3: 0,
    ao5: 0,
    ao12: 0,
    ao50: 0,
    ao100: 0,
    ao1000: 0,
  };

  const cube = findCube({ cubeId: cubeId });
  if (!cube) return defaultResult;

  if (typeSearch === "session") {
    defaultResult.count = cube.solves.session.length;
    const sortByTime = sort(cube.solves.session).asc((u) => u.time);
    if (sortByTime.length <= 0) return defaultResult;
    defaultResult.best = sortByTime[0].time;
    const sortByDate = sort(cube.solves.session).desc((u) => u.endTime);
    if (sortByDate.length >= 3) {
      defaultResult.ao3 = calculateCurrentAo(sortByDate, 3);
    }
    if (sortByDate.length >= 5) {
      defaultResult.ao5 = calculateCurrentAo(sortByDate, 5);
    }
    if (sortByDate.length >= 12) {
      defaultResult.ao12 = calculateCurrentAo(sortByDate, 12);
    }
    if (sortByDate.length >= 50) {
      defaultResult.ao50 = calculateCurrentAo(sortByDate, 50);
    }
    if (sortByDate.length >= 100) {
      defaultResult.ao100 = calculateCurrentAo(sortByDate, 100);
    }
    if (sortByDate.length >= 1000) {
      defaultResult.ao1000 = calculateCurrentAo(sortByDate, 100);
    }
  } else {
    const sortByTime = sort(cube.solves.all).asc((u) => u.time);
    if (sortByTime.length <= 0) return defaultResult;
    defaultResult.best = sortByTime[0].time;
  }
  return defaultResult;
}
