import { Solve } from "@/interfaces/Solve";
import { sort } from "fast-sort";
import calculateCurrentAo from "./calculateCurrentAo";

export default function calculateBestAo(solves: Solve[], ao: number) {
  if (solves.length < ao) {
    return 0;
  }

  const averages: number[] = [];

  for (let i = 0; i <= solves.length - ao; i++) {
    const currentAo = calculateCurrentAo(solves.slice(i, i + ao), ao);
    averages.push(currentAo);
  }

  const averagesSorted = sort(averages).asc();

  return averagesSorted[0];
}
