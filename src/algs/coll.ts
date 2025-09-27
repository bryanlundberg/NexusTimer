import { AlgorithmCollection } from '@/interfaces/AlgorithmCollection';

export const COLL_ALGS: AlgorithmCollection[] = [
  // Sune cases
  {
    name: "Sune 1",
    alg: [
      "R U R' U R U2' R'"
    ],
    group: "Sune cases",
    prob: null
  },
  {
    name: "Sune 2",
    alg: [
      "F' (R U2' R' U2) R' F2 (R U R U') R' F'"
    ],
    group: "Sune cases",
    prob: null
  },
  {
    name: "Sune 3",
    alg: [
      "R U' L' U R' U' L L' (R U R' U') L (U2 R U2' R')"
    ],
    group: "Sune cases",
    prob: null
  },
  {
    name: "Sune 4",
    alg: [
      "(L' U2 L U2') R (U' L' U L) R'"
    ],
    group: "Sune cases",
    prob: null
  },
  {
    name: "Sune 5",
    alg: [
      "y' (R U R' U) (R U' R D) (R' U' R D') R2'"
    ],
    group: "Sune cases",
    prob: null
  },

  // Anti-Sune cases
  {
    name: "Anti-Sune 1",
    alg: [
      "y R U2' R' U' R U' R'"
    ],
    group: "Anti-Sune cases",
    prob: null
  },
  {
    name: "Anti-Sune 2",
    alg: [
      "(R U' R' U2) (R U' R' U2) (R' D' R) U (R' D R)"
    ],
    group: "Anti-Sune cases",
    prob: null
  },
  {
    name: "Anti-Sune 3",
    alg: [
      "y2 L' U R U' L U R' y2 R (L' U' L U) R' (U2' L' U2 L)"
    ],
    group: "Anti-Sune cases",
    prob: null
  },
  {
    name: "Anti-Sune 4",
    alg: [
      "y2 (R U2 R' U2') L' (U R U' R') L"
    ],
    group: "Anti-Sune cases",
    prob: null
  },
  {
    name: "Anti-Sune 5",
    alg: [
      "y (R' U' R U') (R' U R' D') (R U R' D) R2"
    ],
    group: "Anti-Sune cases",
    prob: null
  },

  // L cases
  {
    name: "L 1",
    alg: [
      "y (R U R' U) (R U' R' U) (R U' R' U) R U2' R'"
    ],
    group: "L cases",
    prob: null
  },
  {
    name: "L 2",
    alg: [
      "y' r U2' (R2' F R F') R U2' r'"
    ],
    group: "L cases",
    prob: null
  },
  {
    name: "L 3",
    alg: [
      "y' (R U2 R D) (R' U2 R D') R2' y2 (R' U2 R' D') (R U2 R' D) R2"
    ],
    group: "L cases",
    prob: null
  },
  {
    name: "L 4",
    alg: [
      "y' (F R' F' r) (U R U' r') F' (r U R' U') (r' F R)"
    ],
    group: "L cases",
    prob: null
  },

  // T cases
  {
    name: "T 1",
    alg: [
      "(R U2' R' U' R U' R2') (U2' R U R' U R)"
    ],
    group: "T cases",
    prob: null
  },
  {
    name: "T 2",
    alg: [
      "y2 F (R U R' U') (R U' R' U') (R U R' F')"
    ],
    group: "T cases",
    prob: null
  },
  {
    name: "T 3",
    alg: [
      "(R' U R) U2' L' (R' U R U') L (R' U R2 D) (r' U2 r) (D' R2' U' R)"
    ],
    group: "T cases",
    prob: null
  },
  {
    name: "T 4",
    alg: [
      "y (l' U' L U) (R U' r' F) y' (r U R' U') (r' F R F')"
    ],
    group: "T cases",
    prob: null
  },

  // U cases
  {
    name: "U 1",
    alg: [
      "y2 (R U R' U R U2' R2') (U' R U' R' U2 R)"
    ],
    group: "U cases",
    prob: null
  },
  {
    name: "U 2",
    alg: [
      "F (R U' R' U) (R U R' U) (R U' R' F')"
    ],
    group: "U cases",
    prob: null
  },
  {
    name: "U 3",
    alg: [
      "y2 R2 D (R' U2 R) D' (R' U2 R') R2' D' (R U2 R') D (R U2 R)"
    ],
    group: "U cases",
    prob: null
  },
  {
    name: "U 4",
    alg: [
      "R' F (R U' R' U') (R U R' F') (R U R' U') (R' F R F' R)"
    ],
    group: "U cases",
    prob: null
  },
  {
    name: "U 5",
    alg: [
      "(R' U2 R) F (U' R' U' R) U F'"
    ],
    group: "U cases",
    prob: null
  },

  // Pi cases
  {
    name: "Pi 1",
    alg: [
      "R U2' R2' U' R2 U' R2' U2' R"
    ],
    group: "Pi cases",
    prob: null
  },
  {
    name: "Pi 2",
    alg: [
      "(R U D') (R U R' D) (R2 U' R' U') R2' U2' R"
    ],
    group: "Pi cases",
    prob: null
  },
  {
    name: "Pi 3",
    alg: [
      "y F (U R U' R') (U R U' R2') F' R (U R U' R')"
    ],
    group: "Pi cases",
    prob: null
  },
  {
    name: "Pi 4",
    alg: [
      "(R U R' U') R' F (R2 U R' U') (R U R' U') F'"
    ],
    group: "Pi cases",
    prob: null
  },
  {
    name: "Pi 5",
    alg: [
      "y' (R U R' U) F' (R U2' R' U2') (R' F R)"
    ],
    group: "Pi cases",
    prob: null
  },
  {
    name: "Pi 6",
    alg: [
      "y F (U R U' R') (U R U2' R') (U' R U R') F'"
    ],
    group: "Pi cases",
    prob: null
  },

  // H cases
  {
    name: "H 1",
    alg: [
      "(R U R' U) (R U' R' U) R U2' R'"
    ],
    group: "H cases",
    prob: null
  },
  {
    name: "H 2",
    alg: [
      "y F (R U R' U') (R U R' U') (R U R' U') F'"
    ],
    group: "H cases",
    prob: null
  },
  {
    name: "H 3",
    alg: [
      "F (R U' R' U) (R U2 R' U') (R U R' U') F'"
    ],
    group: "H cases",
    prob: null
  },
  {
    name: "H 4",
    alg: [
      "(R U R' U) (R U L' U) R' U' L"
    ],
    group: "H cases",
    prob: null
  }
];
