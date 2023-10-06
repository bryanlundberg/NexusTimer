import { Cube } from "@/interfaces/Cube";
import { cubeCollection } from "./cubeCollection";
import { sort } from "fast-sort";
import { Categories } from "@/interfaces/Categories";

export default function getMostPlayedEvent(cubes: Cube[] | null) {
  if (!cubes) return "No solves";

  interface Played {
    category: Categories;
    resolutions: number;
  }

  const played: Played[] = [];

  for (const category of cubeCollection) {
    played.push({
      category: category.name,
      resolutions: 0,
    });
  }

  cubes.map((cube) => {
    played.forEach((element) => {
      if (element.category === cube.category) {
        element.resolutions += cube.solves.all.length;
        element.resolutions += cube.solves.session.length;
      }
    });
  });

  const sorted = sort(played).desc((u) => u.resolutions);
  return sorted[0].resolutions === 0 ? "-" : sorted[0].category;
}
