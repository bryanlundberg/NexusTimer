import { Solve } from "@/interfaces/Solve";
import loadCubes from "./loadCubes";
import { Categories } from "@/interfaces/Categories";

export default function getSolvesMetrics(
  category: Categories,
  cubeName: string
) {
  const cubesDB = loadCubes();

  interface Result {
    global: Solve[];
    session: Solve[];
    cubeAll: Solve[];
    cubeSession: Solve[];
  }

  const result: Result = {
    global: [],
    session: [],
    cubeAll: [],
    cubeSession: [],
  };

  const filterCubesByCategory = cubesDB.filter(
    (cube) => cube.category === category
  );

  for (const cube of filterCubesByCategory) {
    cube.solves.all.map((i) => result.global.push(i));
    cube.solves.session.map((i) => result.global.push(i));
    cube.solves.session.map((i) => result.session.push(i));
  }

  const targetCube = cubesDB.find((cube) => cube.name === cubeName);
  if (targetCube) {
    targetCube.solves.all.map((i) => result.cubeAll.push(i));
    targetCube.solves.session.map((i) => result.cubeAll.push(i));
    targetCube.solves.session.map((i) => result.cubeSession.push(i));
  }

  result.global.sort((a, b) => b.endTime - a.endTime);
  result.session.sort((a, b) => b.endTime - a.endTime);
  result.cubeAll.sort((a, b) => b.endTime - a.endTime);
  result.cubeSession.sort((a, b) => b.endTime - a.endTime);

  return result;
}
