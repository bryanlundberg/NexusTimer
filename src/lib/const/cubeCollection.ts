import { CubeCollection } from "@/interfaces/cubeCollection";
import cube222 from "@/images/categories/cube222.svg";
import cube333 from "@/images/categories/cube333.svg";
import cube333oh from "@/images/categories/cube333oh.svg";
import cube444 from "@/images/categories/cube444.svg";
import cube555 from "@/images/categories/cube555.svg";
import cube666 from "@/images/categories/cube666.svg";
import cube777 from "@/images/categories/cube777.svg";
import cubesq1 from "@/images/categories/cubesq1.svg";
import cubeskewb from "@/images/categories/skewb.svg";
import cubepyramix from "@/images/categories/pyramix.svg";
import cubemegaminx from "@/images/categories/minx.svg";
export const cubeCollection: CubeCollection[] = [
  {
    event: "222",
    id: 1,
    name: "2x2",
    src: cube222,
    displayId: "2x2x2",
    twistyId: "222",
  },
  {
    event: "333",
    id: 2,
    name: "3x3",
    src: cube333,
    displayId: "3x3x3",
    twistyId: "333",
  },
  {
    event: "333",
    id: 3,
    name: "3x3 OH",
    src: cube333oh,
    displayId: "3x3x3",
    twistyId: "333",
  },
  {
    event: "444",
    id: 4,
    name: "4x4",
    src: cube444,
    displayId: "4x4x4",
    twistyId: "444",
  },
  {
    event: "555",
    id: 5,
    name: "5x5",
    src: cube555,
    displayId: "5x5x5",
    twistyId: "555",
  },
  {
    event: "666",
    id: 6,
    name: "6x6",
    src: cube666,
    displayId: "6x6x6",
    twistyId: "666",
  },
  {
    event: "777",
    id: 7,
    name: "7x7",
    src: cube777,
    displayId: "7x7x7",
    twistyId: "777",
  },
  {
    event: "sq1",
    id: 8,
    name: "SQ1",
    src: cubesq1,
    displayId: "square1",
    twistyId: "sq1",
  },
  {
    event: "skewb",
    id: 9,
    name: "Skewb",
    src: cubeskewb,
    displayId: "skewb",
    twistyId: "skewb",
  },
  {
    event: "pyram",
    id: 10,
    name: "Pyraminx",
    src: cubepyramix,
    displayId: "pyraminx",
    twistyId: "pyra",
  },
  {
    event: "minx",
    id: 11,
    name: "Megaminx",
    src: cubemegaminx,
    displayId: "megaminx",
    twistyId: "mega",
  },
];
