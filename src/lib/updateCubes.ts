import { Cube } from "@/interfaces/Cube";

export default function updateCubes(cubes: Cube[]) {
  window.localStorage.setItem("cubes", JSON.stringify(cubes));
}
