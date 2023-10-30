import { CubeCollection } from "@/interfaces/cubeCollection";
import cube222 from "@/images/categories/cube222.png";
import cube333 from "@/images/categories/cube333.png";
import cube333oh from "@/images/categories/cube333oh.png";
import cube444 from "@/images/categories/cube444.png";
import cube555 from "@/images/categories/cube555.png";
import cube666 from "@/images/categories/cube666.png";
import cube777 from "@/images/categories/cube777.png";
import cubesq1 from "@/images/categories/cubesq1.png";
import cubeskewb from "@/images/categories/skewb.png";
import cubepyramix from "@/images/categories/pyramix.png";
import cubemegaminx from "@/images/categories/minx.png";
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
    event: "333",
    id: 3,
    name: "3x3 OH",
    src: cube333oh,
  },
  {
    event: "444",
    id: 4,
    name: "4x4",
    src: cube444,
  },
  {
    event: "555",
    id: 5,
    name: "5x5",
    src: cube555,
  },
  {
    event: "666",
    id: 6,
    name: "6x6",
    src: cube666,
  },
  {
    event: "777",
    id: 7,
    name: "7x7",
    src: cube777,
  },
  {
    event: "sq1",
    id: 8,
    name: "SQ1",
    src: cubesq1,
  },
  {
    event: "skewb",
    id: 9,
    name: "Skewb",
    src: cubeskewb,
  },
  {
    event: "pyram",
    id: 10,
    name: "Pyraminx",
    src: cubepyramix,
  },
  {
    event: "minx",
    id: 11,
    name: "Megaminx",
    src: cubemegaminx,
  },
];
