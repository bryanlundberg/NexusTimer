import { Cube } from "@/interfaces/Cube";
import { Solve } from "@/interfaces/Solve";
import updateCubeOnList from "./updateCubeOnList";

export default function moveSolve(solve: Solve, selectedCube: Cube) {
  const sessionSolves: Solve[] = selectedCube.solves.session;
  const allSolves: Solve[] = selectedCube.solves.all;
  const combinedSolves = [...allSolves, solve];

  selectedCube.solves.all = combinedSolves;
  selectedCube.solves.session = sessionSolves.filter((sessionSolve) => {
    return sessionSolve.id !== solve.id;
  });

  return updateCubeOnList(selectedCube);
}
