import { Solve } from "@/interfaces/Solve";
import loadCubes from "./loadCubes";
import { Categories } from "@/interfaces/Categories";
import { sort } from "fast-sort";

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

  sort(result.global).asc((u) => u.endTime);
  sort(result.session).asc((u) => u.endTime);

  const targetCube = cubesDB.find((cube) => cube.name === cubeName);
  if (targetCube) {
    targetCube.solves.all.map((i) => result.cubeAll.push(i));
    targetCube.solves.session.map((i) => result.cubeAll.push(i));
    targetCube.solves.session.map((i) => result.cubeSession.push(i));
    sort(result.cubeAll).asc((u) => u.endTime);
    sort(result.cubeSession).asc((u) => u.endTime);
  }

  return result;
}
