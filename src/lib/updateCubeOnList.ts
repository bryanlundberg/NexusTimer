import { Cube } from "@/interfaces/Cube";
import loadCubes from "./loadCubes";

export default function updateCubeOnList(cube: Cube) {
  const cubesDB = loadCubes();
  const newCubesList: Cube[] = cubesDB.map((targetCube) => {
    if (cube.id === targetCube.id) {
      return cube;
    }
    return targetCube;
  });
  window.localStorage.setItem("cubes", JSON.stringify(newCubesList));
  return newCubesList;
}
