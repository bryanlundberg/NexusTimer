import { PuzzleID } from "cubing/twisty";
import { cubeCollection } from "./const/cubeCollection";
import { Categories } from "@/interfaces/Categories";

export default function getDisplayId(category: Categories): PuzzleID {
  const id = cubeCollection.find((u) => u.name === category);
  return id?.displayId ?? "3x3x3";
}
