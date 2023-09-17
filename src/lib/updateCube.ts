import loadCubes from "./loadCubes";

export default function updateCube({ cubeId }: { cubeId: string }) {
  const cubesDB = loadCubes();
  const cube = cubesDB.find((cube) => cube.id === cubeId);
  if (cube) {
    cube.favorite = !cube.favorite;
  }
  window.localStorage.setItem("cubes", JSON.stringify(cubesDB));
  return cubesDB;
}
