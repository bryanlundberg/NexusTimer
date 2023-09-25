import { Cube } from "@/interfaces/Cube";

export default function getTotalCubesSolved(cubes: Cube[] | null) {
  if (!cubes) return 0;
  let total = 0;
  total =
    total + cubes.reduce((acc, total) => acc + total.solves.all.length, 0);
  total =
    total + cubes.reduce((acc, total) => acc + total.solves.session.length, 0);
  return total;
}
