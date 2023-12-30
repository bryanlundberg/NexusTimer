import { Solve } from "@/interfaces/Solve";

export default function getDeviation(solves: Solve[]) {
  if (solves.length < 2) return 0; // standard deviation require min 2 values
  const n = solves.length;
  const totalSolves = solves.reduce(
    (acumulador, solve) => acumulador + solve.time,
    0
  );
  const mean = totalSolves / n;

  const diff = solves.reduce((acumulador, solve) => {
    const difference = solve.time - mean;
    return acumulador + difference ** 2;
  }, 0);

  const desvStandard = Math.sqrt(diff / (n - 1));

  return desvStandard;
}
