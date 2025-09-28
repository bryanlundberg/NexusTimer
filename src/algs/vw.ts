import { AlgorithmCollection } from "@/interfaces/AlgorithmCollection";

export const WV_ALGS: AlgorithmCollection[] = [
  // H Cases + Corners Oriented Case
  {
    name: "Case 1",
    alg: ["L' U2 (R U R') U2' L"],
    group: "3 Corners Oriented"
  },
  {
    name: "Case 1",
    alg: ["R U' R'"],
    group: "2 Corners Oriented"
  },
  {
    name: "Case 2",
    alg: ["(R U' R') U R' U' R U' R' U2 R"],
    group: "2 Corners Oriented"
  },
  {
    name: "Case 3",
    alg: ["U' (R U' R' U2) (R U' R' U2) (R U R')"],
    group: "2 Corners Oriented"
  },
  {
    name: "Case 4",
    alg: ["U' (R' F R U) (R U' R' F')"],
    group: "2 Corners Oriented"
  },
  {
    name: "Case 5",
    alg: ["R2 D (R' U' R) D' R2'"],
    group: "2 Corners Oriented"
  },
  {
    name: "Case 6",
    alg: ["(R U R' U') (R U' R')"],
    group: "2 Corners Oriented"
  },
  {
    name: "Case 1",
    alg: ["U (R U' R' U) (R U2' R')"],
    group: "1 Corner Oriented"
  },  {
    name: "Case 2",
    alg: ["R U R2' U' R2 U' R2' U2' R"],
    group: "1 Corner Oriented"
  },
  {
    name: "Case 3",
    alg: ["U R2 D (R' U2 R) D' R2'"],
    group: "1 Corner Oriented"
  },
  {
    name: "Case 4",
    alg: ["U R' U' R2 U' R2' U2' R"],
    group: "1 Corner Oriented"
  },
  {
    name: "Case 5",
    alg: ["U F' (R U2' R' U2') R' F R"],
    group: "1 Corner Oriented"
  },
  {
    name: "Case 6",
    alg: ["U R U2' R2' U' R U' R' U2 R"],
    group: "1 Corner Oriented"
  },
  {
    name: "Case 7",
    alg: ["U' L' (U R U' R') L"],
    group: "1 Corner Oriented"
  },
  {
    name: "Case 8",
    alg: ["U R U2' R'"],
    group: "1 Corner Oriented"
  },
  {
    name: "Case 1",
    alg: ["(R U' R') U' [R U R' U R U2' R'"],
    group: "0 Corners Oriented"
  },
  {
    name: "Case 2",
    alg: ["R U' R2' U2' R U R' U R"],
    group: "0 Corners Oriented"
  },
  {
    name: "Case 3",
    alg: ["U (R U' R' U) (R U' R' U) R U2' R'"],
    group: "0 Corners Oriented"
  },
  {
    name: "Case 4",
    alg: ["U R U2' R2' U2' R U R' U R"],
    group: "0 Corners Oriented"
  },
  {
    name: "Case 5",
    alg: ["R U' R2' U' R U' R' U2 R"],
    group: "0 Corners Oriented"
  },
  {
    name: "Case 6",
    alg: ["(R U R' U') (R U R' U') R U' R'"],
    group: "0 Corners Oriented"
  },
  {
    name: "Case 7",
    alg: ["R2 D (R' U R) D' R' U2 R'"],
    group: "0 Corners Oriented"
  }
];
