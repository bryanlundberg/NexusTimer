import { Cube } from "@/interfaces/Cube";
import { Categories } from "@/interfaces/Categories";

export default function getTotalEvents(cubes: Cube[] | null) {
  if (!cubes) return 0;
  const currentCategories: Categories[] = [];
  for (const cube of cubes) {
    if (!currentCategories.includes(cube.category)) {
      currentCategories.push(cube.category);
    }
  }
  return currentCategories.length;
}
