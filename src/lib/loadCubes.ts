import { Cube } from "@/interfaces/Cube";

export default function loadCubes(): Cube[] {
  const cubesDB = window.localStorage.getItem("cubes");
  if (!cubesDB) {
    window.localStorage.setItem("cubes", JSON.stringify([]));
    return [];
  }

  const parsedCubes = JSON.parse(cubesDB);
  if (!Array.isArray(parsedCubes)) {
    window.localStorage.setItem("cubes", JSON.stringify([]));
    return [];
  }

  return parsedCubes;
}
