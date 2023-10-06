import { Cube } from "@/interfaces/Cube";
import { cubeCollection } from "./cubeCollection";
import { PlayedCubes } from "@/interfaces/PlayedCube";

export default function getTotalCategoryPlay(cubes: Cube[] | null) {
  if (!cubes) return [];

  const played: PlayedCubes[] = [];

  for (const category of cubeCollection) {
    played.push({
      category: category.name,
      time: 0,
    });
  }

  cubes.map((cube) => {
    played.forEach((element) => {
      if (element.category === cube.category) {
        cube.solves.all.map((c) => (element.time += c.time));
        cube.solves.session.map((c) => (element.time += c.time));
      }
    });
  });

  played.forEach((element) => {
    element.time = element.time / 1000 / 60;
  });

  return played;
}
