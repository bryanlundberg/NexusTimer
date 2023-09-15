import { CubeCollection } from "@/interfaces/cubeCollection";
import cube222 from "@/images/categories/cube222.png";
import cube333 from "@/images/categories/cube333.png";
import cube444 from "@/images/categories/cube444.png";

export const cubeCollection: CubeCollection[] = [
  {
    event: "222",
    id: 1,
    name: "2x2",

    src: cube222,
  },
  {
    event: "333",
    id: 2,
    name: "3x3",
    src: cube333,
  },
  {
    event: "333oh",
    id: 3,
    name: "3x3 OH",
    src: cube333,
  },
  {
    event: "444",
    id: 4,
    name: "4x4",
    src: cube444,
  },
];
