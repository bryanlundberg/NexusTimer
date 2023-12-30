import { Solve } from "@/interfaces/Solve";
import { sort } from "fast-sort";

export default function calculateCurrentAo(solves: Solve[], ao: number) {
  let result = 0;
  if (solves.length < ao) {
    return result;
  }

  const cubeAo = solves.slice(0, ao);
  // sort by fastest solve time
  const sortedSolves = sort(cubeAo).asc((u) => u.time);
  // remove best and worst time from array
  const trimmedSolves = sortedSolves.slice(1, ao - 1);

  const sum = trimmedSolves.reduce(
    (accumulator, currentValue) => accumulator + currentValue.time,
    0
  );

  // 2 balance the removed solves (best - worst)
  result = sum / (ao - 2);
  return result;
}
