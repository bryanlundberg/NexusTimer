import loadCubes from "./loadCubes";

export default function findCube({ cubeId }: { cubeId: string }) {
  const cubesDB = loadCubes();
  const cube = cubesDB.find((cube) => cube.id === cubeId);
  return cube;
}
