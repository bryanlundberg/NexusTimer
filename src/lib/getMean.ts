import { Solve } from "@/interfaces/Solve";

export default function getMean(solves: Solve[]) {
  if (solves.length < 1) return 0;
  const n = solves.length;
  const totalSolvingTime = solves.reduce(
    (acumulador, solve) => acumulador + solve.time,
    0
  );
  const mean = totalSolvingTime / n;

  return mean;
}
