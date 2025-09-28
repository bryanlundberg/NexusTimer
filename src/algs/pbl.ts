import { AlgorithmCollection } from '@/interfaces/AlgorithmCollection';

export const PBL_ALGS: AlgorithmCollection[] = [
  {
    name: "Adjacent Swaps - Both Layers",
    alg: ["y2 R2 U' R2' U' D' R2 U' R2'", "y2 R2 U' R2' U2' F2 U' R2", "R2 U' B2 U2' R2' U' R2"],
    group: "PBL",
    prob: 4/9
  },
  {
    name: "Adjacent Top, Diagonal Bottom",
    alg: ["y2 R' U R' F2 R F' R", "R' F R' F2 R U' R"],
    group: "PBL",
    prob: 1/9
  },
  {
    name: "Adjacent Swap on Top",
    alg: ["R' U R' F2 R F' R' F2 R2", "y2 R' F R' F2 R U' R' F2 R2"],
    group: "PBL",
    prob: 1/9
  },
  {
    name: "Adjacent Bottom, Diagonal Top",
    alg: ["y2 R U' R' U' R' F2 U' R U R", "y R2 U R2' U' R2 U R2' U' R2"],
    group: "PBL",
    prob: 1/9
  },
  {
    name: "Adjacent Swap on Bottom",
    alg: ["R U' R' U' R' F2 U' R U R' F2 R2", "y R2 U' R' U R' F2 R F' R' F2"],
    group: "PBL",
    prob: 1/9
  },
  {
    name: "Diagonal Swap on Top",
    alg: ["R U' R' U' F2 U' R U R' D R2", "R' U R' F2 R F' U R' F2 R F' R"],
    group: "PBL",
    prob: 1/36
  },
  {
    name: "Diagonal Swap on Bottom",
    alg: ["R U' R' U' F2 U' R U R' D F2 R2"],
    group: "PBL",
    prob: 1/36
  },
  {
    name: "Diagonal Swaps - Both Layers",
    alg: ["R2' F2 R2", "R2 B2 R2'"],
    group: "PBL",
    prob: 1/36
  }
];
