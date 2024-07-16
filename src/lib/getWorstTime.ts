import { Solve } from "@/interfaces/Solve";

export default function getWorstTime(solves: Solve[]) {
  if (solves.length === 0) return 0;

  const sortSolves = solves.sort((a: any, b: any) => b.time - a.time);
  return sortSolves[0].time;
}
