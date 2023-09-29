import loadCubes from "./loadCubes";

export default function updateSolve(solveId: string, type: "+2" | "DNF") {
  const cubesDB = loadCubes();
  for (const cube of cubesDB) {
    for (const allSolve of cube.solves.all) {
      if (allSolve.id === solveId) {
        if (!allSolve.plus2) {
          allSolve.plus2 = true;
          allSolve.time += 2000;
        } else {
          allSolve.plus2 = false;
          allSolve.time -= 2000;
        }
      }
    }
    for (const sessionSolve of cube.solves.session) {
      if (sessionSolve.id === solveId) {
        if (!sessionSolve.plus2) {
          sessionSolve.plus2 = true;
          sessionSolve.time += 2000;
        } else {
          sessionSolve.plus2 = false;
          sessionSolve.time -= 2000;
        }
      }
    }
  }
  window.localStorage.setItem("cubes", JSON.stringify(cubesDB));
  return cubesDB;
}
