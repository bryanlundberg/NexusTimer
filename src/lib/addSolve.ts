import { Solve } from "@/interfaces/Solve";
import loadCubes from "./loadCubes";

export default function addSolve({
  cubeId,
  solve,
}: {
  cubeId: string;
  solve: Solve;
}) {
  const cubesDB = loadCubes();
  const cubesAddedSolve = cubesDB.map((cube) => {
    if (cube.id === cubeId) {
      cube.solves.session.push(solve);
      cube.solves.all.push(solve);
    }
    return cube;
  });

  window.localStorage.setItem("cubes", JSON.stringify(cubesAddedSolve));
  return cubesAddedSolve;
}
