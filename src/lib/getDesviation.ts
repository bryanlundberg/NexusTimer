import { Solve } from "@/interfaces/Solve";

export default function getDesviation(solves: Solve[]) {
  if (solves.length < 1) return 0;
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

  const desvStandard = Math.sqrt(diff / n);

  return desvStandard / 1000;
}
