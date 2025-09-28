import {AlgorithmCollection} from "@/interfaces/AlgorithmCollection";

export const OLL_ALGS: AlgorithmCollection[] = [
  // All Edges Oriented Correctly
  {
    name: "OCLL6 - 26",
    alg: [
      "R U2 R' U' R U' R'",
      "y' R' U' R U' R' U2 R"
    ],
    group: "All Edges Oriented Correctly",
    prob: 54
  },
  {
    name: "OCLL7 - 27",
    alg: [
      "R U R' U R U2' R'",
      "y' R' U2' R U R' U R"
    ],
    group: "All Edges Oriented Correctly",
    prob: 54
  },
  {
    name: "OCLL1 - 21",
    alg: [
      "(R U2 R') (U' R U R') (U' R U' R')",
      "y (R U R' U) (R U' R' U) (R U2' R')"
    ],
    group: "All Edges Oriented Correctly",
    prob: 108
  },
  {
    name: "OCLL2 - 22",
    alg: [
      "R U2' R2' U' R2 U' R2' U2' R"
    ],
    group: "All Edges Oriented Correctly",
    prob: 54
  },
  {
    name: "OCLL4 - 24",
    alg: [
      "(r U R' U') (r' F R F')",
      "y (R U R D) (R' U' R D') R2'"
    ],
    group: "All Edges Oriented Correctly",
    prob: 54
  },
  {
    name: "OCLL5 - 25",
    alg: [
      "y F' (r U R' U') r' F R",
      "x (R' U R) D' (R' U' R) D x'"
    ],
    group: "All Edges Oriented Correctly",
    prob: 54
  },
  {
    name: "OCLL3 - 23",
    alg: [
      "R2 D (R' U2 R) D' (R' U2 R')",
      "y2 R2' D' (R U2 R') D (R U2 R)"
    ],
    group: "All Edges Oriented Correctly",
    prob: 54
  },

  // T-Shapes
  {
    name: "T1 - 33",
    alg: [
      "(R U R' U') (R' F R F')"
    ],
    group: "T-Shapes",
    prob: 54
  },
  {
    name: "T2 - 45",
    alg: [
      "F (R U R' U') F'"
    ],
    group: "T-Shapes",
    prob: 54
  },

  // Squares
  {
    name: "S1 - 5",
    alg: [
      "(r' U2' R U R' U r)"
    ],
    group: "Squares",
    prob: 54
  },
  {
    name: "S2 - 6",
    alg: [
      "(r U2 R' U' R U' r')"
    ],
    group: "Squares",
    prob: 54
  },

  // C-Shapes
  {
    name: "C1 - 34",
    alg: [
      "(R U R2' U') (R' F R U) R U' F'"
    ],
    group: "C-Shapes",
    prob: 54
  },
  {
    name: "C2 - 46",
    alg: [
      "R' U' (R' F R F') U R"
    ],
    group: "C-Shapes",
    prob: 54
  },

  // W-Shapes
  {
    name: "W1 - 36",
    alg: [
      "(R' U' R U') (R' U R U) l U' R' U x",
      "y2 (R U R' F') (R U R' U') (R' F R U') (R' F R F')"
    ],
    group: "W-Shapes",
    prob: 54
  },
  {
    name: "W2 - 38",
    alg: [
      "(R U R' U) (R U' R' U') (R' F R F')"
    ],
    group: "W-Shapes",
    prob: 54
  },

  // Corners Correct, Edges Flipped
  {
    name: "E1 - 28",
    alg: [
      "(r U R' U') M (U R U' R')"
    ],
    group: "Corners Correct, Edges Flipped",
    prob: 54
  },
  {
    name: "E2 - 57",
    alg: [
      "(R U R' U') M' (U R U' r')"
    ],
    group: "Corners Correct, Edges Flipped",
    prob: 108
  },

  // P-Shapes
  {
    name: "P1 - 31",
    alg: [
      "(R' U' F) (U R U' R') F' R"
    ],
    group: "P-Shapes",
    prob: 54
  },
  {
    name: "P2 - 32",
    alg: [
      "R U B' (U' R' U) (R B R')",
      "S (R U R' U') (R' F R f')"
    ],
    group: "P-Shapes",
    prob: 54
  },
  {
    name: "P3 - 43",
    alg: [
      "y R' U' F' U F R",
      "f' (L' U' L U) f"
    ],
    group: "P-Shapes",
    prob: 54
  },
  {
    name: "P4 - 44",
    alg: [
      "f (R U R' U') f'",
      "y2 F (U R U' R') F'"
    ],
    group: "P-Shapes",
    prob: 54
  },

  // I-Shapes
  {
    name: "I1 - 51",
    alg: [
      "f (R U R' U') (R U R' U') f'",
      "y2 F (U R U' R') (U R U' R') F'"
    ],
    group: "I-Shapes",
    prob: 54
  },
  {
    name: "I4 - 56",
    alg: [
      "r' U' r (U' R' U R) (U' R' U R) r' U r"
    ],
    group: "I-Shapes",
    prob: 108
  },
  {
    name: "I2 - 52",
    alg: [
      "(R' U' R U' R' U) y' (R' U R) B",
      "(R U R' U R U') y (R U' R') F'"
    ],
    group: "I-Shapes",
    prob: 54
  },
  {
    name: "I3 - 55",
    alg: [
      "y (R' F R U) (R U' R2' F') R2 U' R' (U R U R')"
    ],
    group: "I-Shapes",
    prob: 108
  },

  // Fish Shapes
  {
    name: "F1 - 9",
    alg: [
      "(R U R' U') R' F (R2 U R' U') F'",
      "(R' U' R) y r U' r' U r U r'"
    ],
    group: "Fish Shapes",
    prob: 54
  },
  {
    name: "F2 - 10",
    alg: [
      "(R U R' U) (R' F R F') (R U2' R')",
      "(R U R') y (R' F R U') (R' F' R)"
    ],
    group: "Fish Shapes",
    prob: 54
  },
  {
    name: "F3 - 35",
    alg: [
      "(R U2') (R2' F R F') (R U2' R')"
    ],
    group: "Fish Shapes",
    prob: 54
  },
  {
    name: "F4 - 37",
    alg: [
      "F (R U' R' U') (R U R' F')"
    ],
    group: "Fish Shapes",
    prob: 54
  },

  // Knight Move Shapes
  {
    name: "K1 - 13",
    alg: [
      "(r U' r') (U' r U r') y' (R' U R)",
      "F U R U' R2' F' R U (R U' R')"
    ],
    group: "Knight Move Shapes",
    prob: 54
  },
  {
    name: "K2 - 14",
    alg: [
      "(R' F R) (U R' F' R) (F U' F')"
    ],
    group: "Knight Move Shapes",
    prob: 54
  },
  {
    name: "K4 - 16",
    alg: [
      "(r U r') (R U R' U') (r U' r')"
    ],
    group: "Knight Move Shapes",
    prob: 54
  },
  {
    name: "K3 - 15",
    alg: [
      "(r' U' r) (R' U' R U) (r' U r)"
    ],
    group: "Knight Move Shapes",
    prob: 54
  },

  // Awkward Shapes
  {
    name: "A1 - 29",
    alg: [
      "y (R U R' U') (R U' R') (F' U' F) (R U R')",
      "M U (R U R' U') (R' F R F') M'"
    ],
    group: "Awkward Shapes",
    prob: 54
  },
  {
    name: "A2 - 30",
    alg: [
      "y' F U (R U2 R' U') (R U2 R' U') F'",
      "y' (F R' F) (R2 U' R' U') (R U R') F2"
    ],
    group: "Awkward Shapes",
    prob: 54
  },
  {
    name: "A3 - 41",
    alg: [
      "(R U R' U R U2' R') F (R U R' U') F'"
    ],
    group: "Awkward Shapes",
    prob: 54
  },
  {
    name: "A4 - 42",
    alg: [
      "(R' U' R U' R' U2 R) F (R U R' U') F'",
      "y (R' F R F') (R' F R F') (R U R' U') (R U R')"
    ],
    group: "Awkward Shapes",
    prob: 54
  },

  // L-Shapes
  {
    name: "L2 - 48",
    alg: [
      "F (R U R' U') (R U R' U') F'"
    ],
    group: "L-Shapes",
    prob: 54
  },
  {
    name: "L1 - 47",
    alg: [
      "F' (L' U' L U) (L' U' L U) F",
      "R' U' (R' F R F') (R' F R F') U R"
    ],
    group: "L-Shapes",
    prob: 54
  },
  {
    name: "L3 - 49",
    alg: [
      "r U' r2' U r2 U r2' U' r"
    ],
    group: "L-Shapes",
    prob: 54
  },
  {
    name: "L4 - 50",
    alg: [
      "r' U r2 U' r2' U' r2 U r'",
      "y' (R U2 R' U' R U' R') F (R U R' U') F'"
    ],
    group: "L-Shapes",
    prob: 54
  },
  {
    name: "L5 - 53",
    alg: [
      "(r' U' R U') (R' U R U') R' U2 r",
      "y r' U2' R (U R' U' R) (U R' U r)"
    ],
    group: "L-Shapes",
    prob: 54
  },
  {
    name: "L6 - 54",
    alg: [
      "(r U R' U) (R U' R' U) R U2' r'",
      "y' (r U2 R' U') (R U R' U') R U' r'"
    ],
    group: "L-Shapes",
    prob: 54
  },

  // Lightning Bolts
  {
    name: "B1 - 7",
    alg: [
      "(r U R' U R U2' r')"
    ],
    group: "Lightning Bolts",
    prob: 54
  },
  {
    name: "B2 - 8",
    alg: [
      "(r' U' R U' R' U2 r)",
      "y2 l' U' L U' L' U2 l"
    ],
    group: "Lightning Bolts",
    prob: 54
  },
  {
    name: "B3 - 11",
    alg: [
      "r' (R2 U R' U R U2 R') U M'"
    ],
    group: "Lightning Bolts",
    prob: 54
  },
  {
    name: "B4 - 12",
    alg: [
      "M' (R' U' R U' R' U2 R) U' M",
      "y F (R U R' U') F' U F (R U R' U') F'"
    ],
    group: "Lightning Bolts",
    prob: 54
  },
  {
    name: "B5 - 39",
    alg: [
      "(L F') (L' U' L U) F U' L'",
      "F (R U R' U') F' (R' U' R U' R' U2 R)"
    ],
    group: "Lightning Bolts",
    prob: 54
  },
  {
    name: "B6 - 40",
    alg: [
      "(R' F) (R U R' U') F' U R"
    ],
    group: "Lightning Bolts",
    prob: 54
  },

  // No Edges Flipped Correctly
  {
    name: "O1 - 1",
    alg: [
      "(R U2') (R2' F R F') U2' (R' F R F')"
    ],
    group: "No Edges Flipped Correctly",
    prob: 108
  },
  {
    name: "O2 - 2",
    alg: [
      "F (R U R' U') F' f (R U R' U') f'",
      "y (r U r') U2 R U2' R' U2 (r U' r')"
    ],
    group: "No Edges Flipped Correctly",
    prob: 54
  },
  {
    name: "O3 - 3",
    alg: [
      "f (R U R' U') f' U' F (R U R' U') F'"
    ],
    group: "No Edges Flipped Correctly",
    prob: 54
  },
  {
    name: "O4 - 4",
    alg: [
      "f (R U R' U') f' U F (R U R' U') F'"
    ],
    group: "No Edges Flipped Correctly",
    prob: 54
  },
  {
    name: "O6 - 18",
    alg: [
      "y R U2' (R2' F R F') U2' M' (U R U' r')",
      "(r U R' U R U2 r') (r' U' R U' R' U2 r)"
    ],
    group: "No Edges Flipped Correctly",
    prob: 54
  },
  {
    name: "O7 - 19",
    alg: [
      "M U (R U R' U') M' (R' F R F')"
    ],
    group: "No Edges Flipped Correctly",
    prob: 54
  },
  {
    name: "O5 - 17",
    alg: [
      "(R U R' U) (R' F R F') U2' (R' F R F')"
    ],
    group: "No Edges Flipped Correctly",
    prob: 54
  },
  {
    name: "O8 - 20",
    alg: [
      "M U (R U R' U') M2' (U R U' r')",
      "(r U R' U') M2' (U R U' R') U' M'"
    ],
    group: "No Edges Flipped Correctly",
    prob: 216
  }
];
