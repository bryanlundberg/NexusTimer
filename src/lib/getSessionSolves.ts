import loadCubes from "./loadCubes";

export default function getCountSolves({ cubeId }: { cubeId: string }) {
  const cubesDB = loadCubes();
  const cube = cubesDB.filter((cube) => cube.id === cubeId);
  if (cube) {
    return cube[0].solves.session.length;
  }
  return 0;
}
