import { Solve } from "@/interfaces/Solve";
import { sort } from "fast-sort";

export default function calculateBestAo(solves: Solve[], ao: number) {
  if (solves.length < ao) {
    return 0;
  }

  const averages: number[] = [];

  for (let i = 0; i <= solves.length - ao; i++) {
    const cubeAo = solves.slice(i, i + ao);
    const sum = cubeAo.reduce(
      (accumulator, currentValue) => accumulator + currentValue.time,
      0
    );
    const average = sum / ao;
    averages.push(average);
  }

  const averagesSorted = sort(averages).asc();

  return averagesSorted[0];
}
