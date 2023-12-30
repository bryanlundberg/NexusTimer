import { Cube } from "@/interfaces/Cube";
import genId from "./genId";
import { Categories } from "@/interfaces/Categories";
import loadCubes from "./loadCubes";

export default function createCube({
  cubeName,
  category,
}: {
  cubeName: string;
  category: Categories;
}) {
  const cubesDB = loadCubes();
  const newCube: Cube = {
    id: genId(),
    name: cubeName,
    category: category,
    solves: {
      session: [],
      all: [],
    },
    createdAt: Date.now(),
    favorite: false,
  };

  const newCubes = [...cubesDB, newCube];
  window.localStorage.setItem("cubes", JSON.stringify(newCubes));

  return newCubes;
}
