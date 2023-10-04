import { cubeCollection } from "./cubeCollection";
import { Categories } from "@/interfaces/Categories";
import { Cube } from "@/interfaces/Cube";

export default function getCategoryTotalRatingPoints(cubes: Cube[] | null) {
  if (!cubes) return [];

  interface CubeRatingPoints {
    name: Categories;
    value: number;
  }

  const played: CubeRatingPoints[] = [];

  for (const category of cubeCollection) {
    played.push({
      name: category.name,
      value: 0,
    });
  }

  cubes.map((cube) => {
    played.forEach((element) => {
      if (element.name === cube.category) {
        element.value += cube.solves.all.reduce(
          (total, current) => total + current.rating,
          0
        );
        element.value += cube.solves.session.reduce(
          (total, current) => total + current.rating,
          0
        );
      }
    });
  });

  // const sorted = sort(played).desc((u) => u.resolutions);
  return played;
}
