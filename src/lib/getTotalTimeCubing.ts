import { Cube } from "@/interfaces/Cube";
import prettyMilliseconds from "pretty-ms";

export default function getTotalTimeCubing(cubes: Cube[] | null) {
  if (!cubes) return 0;
  let total = 0;
  for (const cube of cubes) {
    total = total + cube.solves.all.reduce((acc, total) => acc + total.time, 0);
    total =
      total + cube.solves.session.reduce((acc, total) => acc + total.time, 0);
  }
  const result = prettyMilliseconds(total);
  return result;
}
