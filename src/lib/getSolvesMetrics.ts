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
    cube: Solve[];
  }

  const result: Result = {
    global: [],
    session: [],
    cube: [],
  };

  const filterCubesByCategory = cubesDB.filter(
    (cube) => cube.category === category
  );

  for (const cube of filterCubesByCategory) {
    cube.solves.all.map((i) => result.global.push(i));
    cube.solves.session.map((i) => result.global.push(i));
  }

  sort(result.global).asc((u) => u.endTime);

  if (cubeName === "All") return result;

  const targetCube = cubesDB.find((cube) => cube.name === cubeName);
  if (targetCube) {
    targetCube.solves.all.map((i) => result.cube.push(i));
    targetCube.solves.session.map((i) => result.cube.push(i));
    targetCube.solves.session.map((i) => result.session.push(i));
    sort(result.session).asc((u) => u.endTime);
    sort(result.cube).asc((u) => u.endTime);
  }

  return result;
}
