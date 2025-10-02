import { AlgorithmCollection } from "@/interfaces/AlgorithmCollection";

export const EG_2_ALGS: AlgorithmCollection[] = [
  {
    name: "AS1",
    alg: [
      "F R2 U R' U2 R U R2 U F'",
      "U2 R' U2 R2 U' R' U R' F R F R2",
      "x U' R2 F R2 F' U R' U2 R' U x'",
      "R U2 R' F R' F' R U' R U' R F2 R2"
    ],
    group: "AS",
    prob: null
  },
  {
    name: "AS2",
    alg: [
      "y2 L' U' L U' L' U2 L' F2 R2",
      "U2 R' F' R U' R' F2 R' F2 R2",
      "y R U2 R' U' R U' R B2 R2",
      "R' U' R U' R' U2 R' F2 R2"
    ],
    group: "AS",
    prob: null
  },
  {
    name: "AS3",
    alg: [
      "U2 R' F R F' R U R B2 R2",
      "U2 L' U R U' L U R B2 R2",
      "y2 L' U L F' R U R B2 R2",
      "U2 L' U L F2 L2 F R U R'"
    ],
    group: "AS",
    prob: null
  },
  {
    name: "AS4",
    alg: [
      "U2 F' L F L' U2 L' U2 L' B2 L2",
      "y' R' U R' F R2 F R2 F'",
      "y2 F' R U R' U2 R' F2 R' F2 R2",
      "y' R' U L' U R2 U R2 U'"
    ],
    group: "AS",
    prob: null
  },
  {
    name: "AS5",
    alg: [
      "y2 F R F' U R2 F' R U' R",
      "R' U' R U' R' U' R' F2 R F' R",
      "y2 R U2 R' U2 R' F R F R2 F2"
    ],
    group: "AS",
    prob: null
  },
  {
    name: "AS6",
    alg: [
      "y2 R2 F2 R F R F' R U R'",
      "R2 F2 R U L U' R U L'",
      "y R U2 R' U' R U' R F2 R U R' F2 R F' R' F2 R2",
      "y2 L' U' L U L F' L' F L' U' L U' L' U2 L' B2 L2"
    ],
    group: "AS",
    prob: null
  },
  {
    name: "H1",
    alg: [
      "R2 F U2 F2 R2 F' R2",
      "R U' R' F R' F' R2 U' R' F R' F' R' F2 R2",
      "U F R U R' U' R U R' U' R U R' U' F' R2 F2 R2 U'",
      "y F2 R U2 R2 F2 R' F2"
    ],
    group: "H",
    prob: null
  },
  {
    name: "H2",
    alg: [
      "y R2 B2 U2 R' U2 R2",
      "y R2 U2 R U2 B2 R2",
      "y R2 U2 R U2 F2 R2",
      "U R2 U2 R' U2 F2 R2"
    ],
    group: "H",
    prob: null
  },
  {
    name: "H3",
    alg: [
      "R' U' R U2 R2 F' R U' F R",
      "y R' U' F R U' R U R' U2 R' F",
      "y2 R U R' U R U R' F R' F' R' F2 R2",
      "U2 R U R' U R U R' F R' F' R' F2 R2"
    ],
    group: "H",
    prob: null
  },
  {
    name: "H4",
    alg: [
      "y' R U2 B2 R' U R U' B R'",
      "y2 F R2 U' R2 U' R2 U R2 F R2 F2",
      "U2 F R2 U' R2 U' R2 U R2 F B2 R2 F2 R2 U2",
      "y R U' R' F U2 R2 F' R F' R"
    ],
    group: "H",
    prob: null
  },
  {
    name: "L1",
    alg: [
      "U L2 B2 L U' L' U L F' L F",
      "y R2 B2 R2 F R' F' R U R U' R'",
      "y R' U' R' F' R U' R U' R' F R",
      "y F R' F' R U R U' R' U' R' F R' F2 R U' R"
    ],
    group: "L",
    prob: null
  },
  {
    name: "L2",
    alg: [
      "y2 F2 R2 F R U R' U' R' F R",
      "y2 R2 B2 R' U R U' R' F R' F'",
      "U2 F' R U R' U' R' F R U R' F R' F2 R U' R",
      "y2 R2 F2 R2 F' R U R' U' R' F R"
    ],
    group: "L",
    prob: null
  },
  {
    name: "L3",
    alg: [
      "y2 R2 U' R U2 R' U2 R U' F2 R2",
      "y R' U' F2 R U2 R' U2 F R",
      "y2 R2 F2 R U R' U2 R U' R' U R U' R2",
      "U2 F' R U R' U' R' F2 R' F2 R U' R"
    ],
    group: "L",
    prob: null
  },
  {
    name: "L4",
    alg: [
      "y' R' U L' U2 R' F R U' R' U' F' x2",
      "y R U2 R2 F R F' R U2 R B2 R2",
      "y' R' U' R U R' F' R U R' U' R' F' R2"
    ],
    group: "L",
    prob: null
  },
  {
    name: "L5",
    alg: [
      "y F R' F' R U R U' R B2 R2"
    ],
    group: "L",
    prob: null
  },
  {
    name: "L6",
    alg: [
      "y2 F' R U R' U' R' F R' F2 R2",
      "R U R U' R' F R' F R2 B2",
      "y F R U' R' U' R U R' F R2 B2"
    ],
    group: "L",
    prob: null
  },
  {
    name: "Pi1",
    alg: [
      "F U' R U2 R U' R' U R' F'",
      "y' R' U' R' F R F' R U' R' U2 R' F2 R2",
      "y' F2 U' F2 R U2 R F2 U' R2",
      "R' F' U' F U' R U R' U R' F2 R2 U'"
    ],
    group: "Pi",
    prob: null
  },
  {
    name: "Pi2",
    alg: [
      "R U2 R2 U R' F2 R2 F'",
      "R U' R2 U R2 U R2 U' R' F2 R2",
      "R' U2 R2 U' R' F2 R2 F'",
      "F R U R' U' R U R' U' F R2 B2"
    ],
    group: "Pi",
    prob: null
  },
  {
    name: "Pi3",
    alg: [
      "U F R2 U' R2 U R2 U R2 F R2 F2 U2",
      "y2 R' F' U R' F R2 U2 R' U R",
      "y' R U' R U' R' U R' F R2 F R2 F2",
      "y' R U' R U' R' U R' F R2 F' R2 F2 R2"
    ],
    group: "Pi",
    prob: null
  },
  {
    name: "Pi4",
    alg: [
      "y2 R' F R F' R U' R' U' R U' R F2 R2",
      "U R U' F U' F' R F2 U2 R' U",
      "R U' R' F L' U L U R' F R' F2 R2",
      "R U' R' F R' F R U R' F R' F2 R2 U2"
    ],
    group: "Pi",
    prob: null
  },
  {
    name: "Pi5",
    alg: [
      "U' R' F' R' F2 R2 U R' U2 R U",
      "y' R' F' R' F2 R2 U R' U2 R",
      "U F U R U' R' U R U' R2 F' R U R U' R F2 R2 U'",
      "y2 L' U2 L U L' U' L U2 L F' L' F' L2 B2"
    ],
    group: "Pi",
    prob: null
  },
  {
    name: "Pi6",
    alg: [
      "U R' U2 R U' R2 F2 R F R U'",
      "y R' U2 R U' R2 F2 R F R",
      "R U2 R' U' R U R' U2 R' F R F' R2 F2 R2",
      "R U2 R' U' R U R' U2 R' F R F' R2 B2 R2"
    ],
    group: "Pi",
    prob: null
  },
  {
    name: "S1",
    alg: [
      "R2 F2 R U R U' R' F R' F' R2 U R' U' R",
      "y' R' F R2 F' U' R' U' R2 U R B2 R2",
      "y' R' F R2 F' U' R' U' R2 U R F2 R2",
      "y' R' F R2 F' R U2 R' U' F2 R2"
    ],
    group: "S",
    prob: null
  },
  {
    name: "S2",
    alg: [
      "R U R' U R U2 R B2 R2",
      "y' R2 F2 R U2 R U R' U R",
      "R2 B2 R' U R' U R U2 R'",
      "y' R' U2 R U R' U R' F2 R2"
    ],
    group: "S",
    prob: null
  },
  {
    name: "S3",
    alg: [
      "R U' R' F R' F' R' F2 R2",
      "R U' R' F2 R2 F' L' U' L"
    ],
    group: "S",
    prob: null
  },
  {
    name: "S4",
    alg: [
      "F R' F' R U2 R U2 R B2 R2",
      "y F R2 F' R2 F' R U' R"
    ],
    group: "S",
    prob: null
  },
  {
    name: "S5",
    alg: [
      "R' U R' F R2 U' F R' F'",
      "y2 R' F R' F2 R U R U R' U R",
      "R' U R' F R2 D' R U' R'",
      "R' F2 R U2 R U' R' F R2 F2 R2"
    ],
    group: "S",
    prob: null
  },
  {
    name: "S6",
    alg: [
      "R2 B2 R' U' R' F R' F' R",
      "R2 B2 R' U' L' U R' U' L",
      "y2 R U' R U' R' U R' U' F R' F' R2 B2 R2",
      "R U R' U' R' F R F' R U R' U R U2 R B2 R2"
    ],
    group: "S",
    prob: null
  },
  {
    name: "T1",
    alg: [
      "U R' F' R U R U' R' F' R2 B2 U",
      "R U R' U' F' U' F' L2 B2",
      "y R' F' R U R U' R' F' R2 F2",
      "y' F R F' R U R' U' R B2 R2"
    ],
    group: "T",
    prob: null
  },
  {
    name: "T2",
    alg: [
      "y' F U' R2 U' R' U R2 F'",
      "y F R' U2 R' U' R U2 F'",
      "y' R U R' U' R' F R F' R2 F2 R2",
      "U F R' U2 R' U' R U2 F' U"
    ],
    group: "T",
    prob: null
  },
  {
    name: "T3",
    alg: [
      "R' U R U2 R2 F' R U' R",
      "y R' U R' F U' R U R2",
      "R U2 R' U' R U' R2 U2 R U R' U R' F2 R2 U'",
      "y2 R' U R' U2 R U2 R' U R2 U' R B2 R2"
    ],
    group: "T",
    prob: null
  },
  {
    name: "T4",
    alg: [
      "R2 F2 R U' F R' F' R U R",
      "U R U2 R2 F R F' R U' R' U R U2 R F2 R2 U",
      "y2 R2 B2 R2 F R U R' U' F'",
      "F2 R2 F U' R' F R F"
    ],
    group: "T",
    prob: null
  },
  {
    name: "T5",
    alg: [
      "y' R' U2 R U' R' F R' F R F' R",
      "R' U R U2 R2 F R F' R' F2 R2",
      "y R' F2 R U' R' U R' F R U' R"
    ],
    group: "T",
    prob: null
  },
  {
    name: "T6",
    alg: [
      "y R' U2 R' F2 R F2 R",
      "U R' U2 R' F2 R F2 R U",
      "y z' U' R2 U' R2 U R2 U R2 z",
      "U R' U' F R U2 R' U' F R"
    ],
    group: "T",
    prob: null
  },
  {
    name: "U1",
    alg: [
      "R2 U2 R U R' U F' R U' R",
      "y' F U' R U2 R U' R' U2 R' U' F'",
      "y' R' U R' F U' R U' R U2 R2",
      "y' R' U R' F U' R U' R' U2 R2"
    ],
    group: "U",
    prob: null
  },
  {
    name: "U2",
    alg: [
      "y' F R U R' U' F R2 B2",
      "U' F R U R' U' F R2 B2 U'",
      "y F U R U' R' F R2 F2",
      "y' F R U R' U' F R2 F2"
    ],
    group: "U",
    prob: null
  },
  {
    name: "U3",
    alg: [
      "R' F' U' R U2 R' U F R",
      "y2 R' U' R U R' F2 R U' R' U R",
      "R U R' U' R B2 R' U R U' R'",
      "y' F R' F' R U' R U' R' U2 R U' R F2 R2"
    ],
    group: "U",
    prob: null
  },
  {
    name: "U4",
    alg: [
      "R' F' U' F U2 L' U2 R U' L",
      "y' R2 F2 R U R U2 R2 F R F' R",
      "y' z' U2 R' U' R2 U' R' U' R U' R B2 R2",
      "F R U R' U' F R U R' U' F R U R F2 R2 U2"
    ],
    group: "U",
    prob: null
  },
  {
    name: "U5",
    alg: [
      "y2 R2 B2 R' U R' U' R' F R F'",
      "U2 R2 B2 R' U R' U' R' F R F' U2",
      "R' U R' F R F' R U2 R' U R' F2 R2",
      "R' F R2 U' R' F R' F' R U R' F' R' F2 R2"
    ],
    group: "U",
    prob: null
  },
  {
    name: "U6",
    alg: [
      "y2 R2 F2 R F' R U L F' L' F",
      "y2 R2 B2 R2 F R F' R U R' U' R'",
      "R U' R2 F R F' R U R' U' R U R F2 R2",
      "U2 R2 F2 R F' R U R U' R' F U2"
    ],
    group: "U",
    prob: null
  }
];
