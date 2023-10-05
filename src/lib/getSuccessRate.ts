import { Cube } from "@/interfaces/Cube";
import calcPlus2Rate from "./calcPlus2Rate";
import { Solve } from "@/interfaces/Solve";

export default function getSuccessRate(cubes: Cube[] | null) {
  if (!cubes) return [];
  const globalSolves: Solve[] = [];

  cubes.map((cube) => {
    cube.solves.all.map((solve) => globalSolves.push(solve));
    cube.solves.session.map((solve) => globalSolves.push(solve));
  });

  const totalPlus2 = calcPlus2Rate(globalSolves);

  const successRate: number = 100 - (totalPlus2 * 100) / globalSolves.length;

  return globalSolves.length <= 0 ? 0 : successRate.toFixed(2);
}
