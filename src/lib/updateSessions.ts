import { Cube } from "@/interfaces/Cube";
import { Solve } from "@/interfaces/Solve";
import loadCubes from "./loadCubes";

export default function updateSessions(selectedCube: Cube) {
  const sessionSolves: Solve[] = selectedCube.solves.session;
  const allSolves: Solve[] = selectedCube.solves.all;
  const combinedSolves = [...allSolves, ...sessionSolves];
  selectedCube.solves.all = combinedSolves;
  selectedCube.solves.session = [];

  const cubesDB = loadCubes();
  if (cubesDB) {
    const newCubesList: Cube[] = cubesDB.map((targetCube) => {
      if (selectedCube.id === targetCube.id) {
        return selectedCube;
      }
      return targetCube;
    });
    window.localStorage.setItem("cubes", JSON.stringify(newCubesList));
    return newCubesList;
  }
}
