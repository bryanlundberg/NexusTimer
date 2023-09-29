import { sort } from "fast-sort";
import findCube from "./findCube";

export default function getBestTime({
  cubeId,
  typeSearch,
}: {
  cubeId: string;
  typeSearch: "session" | "all";
}) {
  let sortByTime = null;
  const cube = findCube({ cubeId: cubeId });
  if (!cube) return;

  if (typeSearch === "session") {
    sortByTime = sort(cube.solves.session).asc((u) => u.time);
  } else {
    sortByTime = sort(cube.solves.session).asc((u) => u.time);
  }

  if (sortByTime.length <= 0) return 0;

  return sortByTime[0].time;
}
