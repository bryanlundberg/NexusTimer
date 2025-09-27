import { AlgorithmCollection } from '@/interfaces/AlgorithmCollection';

export const PLL_ALGS: AlgorithmCollection[] = [
  {
    name: "Ub",
    alg: [
      "R2 U (R U R' U') R' U' (R' U R')",
      "y2 (R' U R' U') R' U' (R' U R U) R2'"
    ],
    group: "Permutations of Edges Only",
    prob: 18
  },
  {
    name: "Ua",
    alg: [
      "(R U' R U) R U (R U' R' U') R2",
      "y2 (R U R' U) (R' U' R2 U') R' U R' U R",
      "y2 (R2 U' R' U') R U R U (R U' R)"
    ],
    group: "Permutations of Edges Only",
    prob: 18
  },
  {
    name: "Z",
    alg: [
      "(M2' U M2' U) (M' U2) (M2' U2 M')",
      "y' M' U (M2' U M2') U (M' U2 M2)"
    ],
    group: "Permutations of Edges Only",
    prob: 36
  },
  {
    name: "H",
    alg: [
      "(M2' U M2') U2 (M2' U M2')"
    ],
    group: "Permutations of Edges Only",
    prob: 72
  },
  {
    name: "Aa",
    alg: [
      "x (R' U R') D2 (R U' R') D2 R2 x'",
      "y x' R2 D2 (R' U' R) D2 (R' U R') x"
    ],
    group: "Permutations of Corners Only",
    prob: 18
  },
  {
    name: "Ab",
    alg: [
      "x R2' D2 (R U R') D2 (R U' R) x'",
      "y x' (R U' R) D2 (R' U R) D2 R2' x"
    ],
    group: "Permutations of Corners Only",
    prob: 18
  },
  {
    name: "E",
    alg: [
      "x' (R U' R' D) (R U R' D') (R U R' D) (R U' R' D') x"
    ],
    group: "Permutations of Corners Only",
    prob: 36
  },
  {
    name: "Ga",
    alg: [
      "R2 U (R' U R' U') (R U' R2) D U' (R' U R D')",
      "R2 u (R' U R' U') R u' R2 y' (R' U R)"
    ],
    group: "G Permutations (Double cycles)",
    prob: 18
  },
  {
    name: "Gb",
    alg: [
      "(F' U' F) (R2 u R' U) (R U' R u') R2'",
      "y' R' U' y F (R2 u R' U) (R U' R u') R2'",
      "y' D (R' U' R U) D' (R2 U R' U) (R U' R U') R2'"
    ],
    group: "G Permutations (Double cycles)",
    prob: 18
  },
  {
    name: "Gc",
    alg: [
      "R2 U' (R U' R U) (R' U R2 D') (U R U' R') D",
      "y2 R2' F2 (R U2' R U2') R' F (R U R' U') R' F R2"
    ],
    group: "G Permutations (Double cycles)",
    prob: 18
  },
  {
    name: "Gd",
    alg: [
      "D' (R U R' U') D (R2 U' R U') (R' U R' U) R2",
      "(R U R') y' (R2 u' R U') (R' U R' u) R2"
    ],
    group: "G Permutations (Double cycles)",
    prob: 18
  },
  {
    name: "Ra",
    alg: [
      "(R U' R' U') (R U R D) (R' U' R D') (R' U2 R') [U']",
      "y' (L U2 L' U2) L F' (L' U' L U) L F L2' [U]",
      "(R U R' F') (R U2' R' U2') (R' F R U) (R U2' R') [U']"
    ],
    group: "Swap One Set of Adjacent Corners",
    prob: 18
  },
  {
    name: "Rb",
    alg: [
      "(R' U2 R U2') R' F (R U R' U') R' F' R2 [U']",
      "(R' U2 R' D') (R U' R' D) (R U R U') (R' U' R) [U']"
    ],
    group: "Swap One Set of Adjacent Corners",
    prob: 18
  },
  {
    name: "Ja",
    alg: [
      "(R' U L' U2) (R U' R' U2 R) L [U']",
      "y' (L' U' L F) (L' U' L U) L F' L2' U L [U]"
    ],
    group: "Swap One Set of Adjacent Corners",
    prob: 18
  },
  {
    name: "Jb",
    alg: [
      "(R U R' F') (R U R' U') R' F R2 U' R' [U']"
    ],
    group: "Swap One Set of Adjacent Corners",
    prob: 18
  },
  {
    name: "T",
    alg: [
      "(R U R' U') (R' F R2 U') R' U' (R U R' F')"
    ],
    group: "Swap One Set of Adjacent Corners",
    prob: 18
  },
  {
    name: "F",
    alg: [
      "(R' U' F')(R U R' U')(R' F R2 U')(R' U' R U)(R' U R)",
      "y (R' U2 R' U') y (R' F' R2 U') (R' U R' F) R U' F"
    ],
    group: "Swap One Set of Adjacent Corners",
    prob: 18
  },
  {
    name: "V",
    alg: [
      "(R' U R' U') y (R' F' R2 U') (R' U R' F) R F"
    ],
    group: "Swap One Set of Diagonal Corners",
    prob: 18
  },
  {
    name: "Y",
    alg: [
      "F (R U' R' U') (R U R' F') (R U R' U') (R' F R F')"
    ],
    group: "Swap One Set of Diagonal Corners",
    prob: 18
  },
  {
    name: "Na",
    alg: [
      "(RUR'U)(RUR'F')(RUR'U')(R'FR2U') R' U2 (RU'R')",
      "z (U R' D) (R2 U' R D') (U R' D) (R2 U' R D') [R'] z'"
    ],
    group: "Swap One Set of Diagonal Corners",
    prob: 72
  },
  {
    name: "Nb",
    alg: [
      "(R' U R U') (R' F' U' F) (R U R' F) R' F' (R U' R)",
      "(R' U L' U2 R U' L) (R' U L' U2 R U' L) [U]"
    ],
    group: "Swap One Set of Diagonal Corners",
    prob: 72
  }
];
