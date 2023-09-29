import loadCubes from "./loadCubes";

export default function deleteSolve(solveId: string) {
  const cubesDB = loadCubes();
  for (const cube of cubesDB) {
    for (const allSolve of cube.solves.all) {
      if (allSolve.id === solveId) {
        const solveIndex = cube.solves.all.indexOf(allSolve);
        if (solveIndex !== -1) {
          cube.solves.all.splice(solveIndex, 1);
        }
      }
    }
    for (const sessionSolve of cube.solves.session) {
      if (sessionSolve.id === solveId) {
        const solveIndex = cube.solves.session.indexOf(sessionSolve);
        if (solveIndex !== -1) {
          cube.solves.session.splice(solveIndex, 1);
        }
      }
    }
  }
  window.localStorage.setItem("cubes", JSON.stringify(cubesDB));
  return cubesDB;
}
