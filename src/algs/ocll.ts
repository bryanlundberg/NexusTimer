import { AlgorithmCollection } from '@/interfaces/AlgorithmCollection';

export const OCLL_ALGS: AlgorithmCollection[] = [
  {
    name: "Sune",
    alg: ["R U R' U R U2' R'", "U' R' U2' R U R' U R"],
    group: "Sune",
    prob: 4/27
  },
  {
    name: "Headlights",
    alg: ["F (R U R' U') F'", "U2 F (U R U' R') F'"],
    group: "U",
    prob: 4/27
  },
  {
    name: "Anti-Sune",
    alg: ["R' U' R U' R' U2 R", "U R U2' R' U' R U' R'"],
    group: "Anti-Sune",
    prob: 4/27
  },
  {
    name: "Bruno",
    alg: ["F (R U R' U') (R U R' U') F'", "U2 F (U R U' R') (U R U' R') F'", "U' R' F R2 U' R2' F R'"],
    group: "Pi",
    prob: 4/27
  },
  {
    name: "Chameleon",
    alg: ["(R U R' U') (R' F R F')", "U2 (L' U' L U) (L F' L' F)"],
    group: "T",
    prob: 4/27
  },
  {
    name: "Double Anti-Sune",
    alg: ["R2 U2' R' U2' R2"],
    group: "H",
    prob: 2/27
  },
  {
    name: "Bowtie",
    alg: ["F R U' (R' U' R U) R' F'", "U F' (R U R' U') R' F R"],
    group: "L",
    prob: 4/27
  },
];
