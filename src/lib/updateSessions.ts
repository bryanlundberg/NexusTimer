import { Cube } from "@/interfaces/Cube";
import { Solve } from "@/interfaces/Solve";
import loadCubes from "./loadCubes";

export default function updateSessions(selectedCube: Cube) {
  const cubeDB = loadCubes();

  cubeDB.map((cube: Cube) => {
    if (cube.category === selectedCube.category) {
      if (cube.solves.session.length >= 1) {
        const sessionSolves: Solve[] = cube.solves.session;
        const allSolves: Solve[] = cube.solves.all;
        const combinedSolves = [...allSolves, ...sessionSolves];
        cube.solves.all = combinedSolves;
        cube.solves.session = [];
      }
    }
  });
  window.localStorage.setItem("cubes", JSON.stringify(cubeDB));
  return cubeDB;
}
