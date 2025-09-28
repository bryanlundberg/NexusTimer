import { AlgorithmCollection } from '@/interfaces/AlgorithmCollection';

export const COLL_ALGS: AlgorithmCollection[] = [
  // Sune cases (6 algorithms)
  {
    name: "Sune 1",
    alg: ["R U R' U R U2' R'"],
    group: "Sune"
  },
  {
    name: "Sune 2",
    alg: ["F' (R U2' R' U2) R' F2 (R U R U') R' F'"],
    group: "Sune"
  },
  {
    name: "Sune 3",
    alg: ["R U' L' U R' U' L"],
    group: "Sune"
  },
  {
    name: "Sune 4",
    alg: ["L' (R U R' U') L (U2 R U2' R')"],
    group: "Sune"
  },
  {
    name: "Sune 5",
    alg: ["(L' U2 L U2') R (U' L' U L) R'"],
    group: "Sune"
  },
  {
    name: "Sune 6",
    alg: ["y' (R U R' U) (R U' R D) (R' U' R D') R2'"],
    group: "Sune"
  },

  // Anti-Sune cases (6 algorithms)
  {
    name: "Anti-Sune 1",
    alg: ["y R U2' R' U' R U' R'"],
    group: "Anti-Sune"
  },
  {
    name: "Anti-Sune 2",
    alg: ["(R U' R' U2) (R U' R' U2) (R' D' R) U (R' D R)"],
    group: "Anti-Sune"
  },
  {
    name: "Anti-Sune 3",
    alg: ["y2 L' U R U' L U R'"],
    group: "Anti-Sune"
  },
  {
    name: "Anti-Sune 4",
    alg: ["y2 R (L' U' L U) R' (U2' L' U2 L)"],
    group: "Anti-Sune"
  },
  {
    name: "Anti-Sune 5",
    alg: ["y2 (R U2 R' U2') L' (U R U' R') L "],
    group: "Anti-Sune"
  },
  {
    name: "Anti-Sune 6",
    alg: ["y (R' U' R U') (R' U R' D') (R U R' D) R2"],
    group: "Anti-Sune"
  },

  // L cases (6 algorithms)
  {
    name: "L 1",
    alg: ["y (R U R' U) (R U' R' U) (R U' R' U) R U2' R'"],
    group: "L"
  },
  {
    name: "L 2",
    alg: ["y' r U2' (R2' F R F') R U2' r'"],
    group: "L"
  },
  {
    name: "L 3",
    alg: ["y' (R U2 R D) (R' U2 R D') R2'"],
    group: "L"
  },
  {
    name: "L 4",
    alg: ["y2 (R' U2 R' D') (R U2 R' D) R2"],
    group: "L"
  },
  {
    name: "L 5",
    alg: ["y' (F R' F' r) (U R U' r')"],
    group: "L"
  },
  {
    name: "L 6",
    alg: ["F' (r U R' U') (r' F R)"],
    group: "L"
  },

  // T cases (6 algorithms)
  {
    name: "T 1",
    alg: ["(R U2' R' U' R U' R2') (U2' R U R' U R)"],
    group: "T"
  },
  {
    name: "T 2",
    alg: ["y2 F (R U R' U') (R U' R' U') (R U R' F')"],
    group: "T"
  },
  {
    name: "T 3",
    alg: ["(R' U R) U2' L' (R' U R U') L"],
    group: "T"
  },
  {
    name: "T 4",
    alg: ["(R' U R2 D) (r' U2 r) (D' R2' U' R)"],
    group: "T"
  },
  {
    name: "T 5",
    alg: ["y (l' U' L U) (R U' r' F)"],
    group: "T"
  },
  {
    name: "T 6",
    alg: ["y' (r U R' U') (r' F R F')"],
    group: "T"
  },

  // U cases (6 algorithms)
  {
    name: "U 1",
    alg: ["y2 (R U R' U R U2' R2') (U' R U' R' U2 R)"],
    group: "U"
  },
  {
    name: "U 2",
    alg: ["F (R U' R' U) (R U R' U) (R U' R' F')"],
    group: "U"
  },
  {
    name: "U 3",
    alg: ["y2 R2 D (R' U2 R) D' (R' U2 R')"],
    group: "U"
  },
  {
    name: "U 4",
    alg: ["R2' D' (R U2 R') D (R U2 R)"],
    group: "U"
  },
  {
    name: "U 5",
    alg: ["R' F (R U' R' U') (R U R' F') (R U R' U') (R' F R F' R)"],
    group: "U"
  },
  {
    name: "U 6",
    alg: ["(R' U2 R) F (U' R' U' R) U F'"],
    group: "U"
  },

  // Pi cases (6 algorithms)
  {
    name: "Pi 1",
    alg: ["R U2' R2' U' R2 U' R2' U2' R"],
    group: "Pi"
  },
  {
    name: "Pi 2",
    alg: ["(R U D') (R U R' D) (R2 U' R' U') R2' U2' R"],
    group: "Pi"
  },
  {
    name: "Pi 3",
    alg: ["y F (U R U' R') (U R U' R2') F' R (U R U' R')"],
    group: "Pi"
  },
  {
    name: "Pi 4",
    alg: ["(R U R' U') R' F (R2 U R' U') (R U R' U') F'"],
    group: "Pi"
  },
  {
    name: "Pi 5",
    alg: ["y' (R U R' U) F' (R U2' R' U2') (R' F R)"],
    group: "Pi"
  },
  {
    name: "Pi 6",
    alg: ["y F (U R U' R') (U R U2' R') (U' R U R') F'"],
    group: "Pi"
  },

  // H cases (4 algorithms)
  {
    name: "H 1",
    alg: ["(R U R' U) (R U' R' U) R U2' R'"],
    group: "H"
  },
  {
    name: "H 2",
    alg: ["y F (R U R' U') (R U R' U') (R U R' U') F'"],
    group: "H"
  },
  {
    name: "H 3",
    alg: ["F (R U' R' U) (R U2 R' U') (R U R' U') F'"],
    group: "H"
  },
  {
    name: "H 4",
    alg: ["(R U R' U) (R U L' U) R' U' L"],
    group: "H"
  }
];
