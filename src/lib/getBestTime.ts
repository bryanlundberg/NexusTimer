import { sort } from "fast-sort";
import { Solve } from "@/interfaces/Solve";

export default function getBestTime({ solves }: { solves: Solve[] }): number {
  if (solves.length === 0) return 0;
  const sortByTime = sort(solves).asc((solve) => solve.time);
  return sortByTime[0].time;
}
