import { AlgorithmCollection } from "@/interfaces/AlgorithmCollection";

export const ZBLL_AS_ALGS: AlgorithmCollection[] = [
  {
    name: "AS1",
    alg: [
      "y' R2 D R' U2 R D' R' U' R' U R U' R' U R U2 R'",
      "y' R U R' U R' D R2 U' R' U R2 D' R' U2 R'",
      "y' R U R' U' L' U2 R U' R' U2 L U' R U2 R'",
      "y R U R2 F' U' F U R F R' F' R2 U2 R'"
    ],
    group: "ZBLL AS1",
    prob: null,
    setup: "R U2' R' U2' B' U R U R' U' B R U' R' y"
  },
  {
    name: "AS2",
    alg: [
      "y2 R' U2 F' R U R' U' R' F R2 U R' U R",
      "R U2 R2 F2 U' R2 U' R2 U F2 U R",
      "y2 R' U2 R U R' U' R U R' U' R' D' R U2 R' D R2",
      "R U2 R2 F2 D' F2 U' F2 D F2 U R"
    ],
    group: "ZBLL AS1",
    prob: null,
    setup: "R' U' F2' U' R2' U R2' U F2' R2' U2' R'"
  },
  {
    name: "AS3",
    alg: [
      "y2 R' U R U R' U R U2 R' U' R2 D R' U2 R D' R'",
      "D R2 U' R U' R2 U R' U R2 D' R U2 R'",
      "R' U' R U' R D' R U2 R' D R U2 R U2 R",
      "R U R' U' R' F R U2 F' U' F U' R U R' U' F'"
    ],
    group: "ZBLL AS1",
    prob: null,
    setup: "R' U2' R U' L U' R2' U L' U' R2' U' R' U R"
  },
  {
    name: "AS4",
    alg: [
      "y' R' D' R U2 R' D R2 U' R' U2 R U R' U R U R'",
      "y2 R' U2 R' U2 F' R U R U' R' F R' U2 R U2 R",
      "y2 r U' r' U2 R' F R U2 F2 U' R U' R' F'",
      "y' R U2 R U2 R' U' R' U R F' R U2 R' U2 R' F"
    ],
    group: "ZBLL AS1",
    prob: null,
    setup: "F' U2' F' R2' u' L F2' L' u R2' F2'"
  },
  {
    name: "AS5",
    alg: [
      "y2 R' F U2 F' R F R' U2 R F'",
      "y2 R' F U2 R' D' R U2 R' D R F' R",
      "y2 x R' U B2 U' R U R' B2 R U' x'",
      "y' R U R2 D R2 D' R2 U' R2 D R2 D' R"
    ],
    group: "ZBLL AS1",
    prob: null,
    setup: "F R' U2' R F' R' F U2' F' R y2'"
  },
  {
    name: "AS6",
    alg: [
      "y2 R' F U' F' U' R F U' R' U' R F'",
      "y2 R U R' U R' U' R U' R D R' U R D' U' R2 U2 R",
      "y2 R' F U' F' U' R F U' R' U' R F' U",
      "L' R' D2 R U R' D2 R2 U' L U R'"
    ],
    group: "ZBLL AS1",
    prob: null,
    setup: "z' D U R2' U' L' U R2' z R2' U L' U' R"
  },
  {
    name: "AS7",
    alg: [
      "y2 R2 D r' U2 r R' U' R D' R' U R' U' R U' R'",
      "R B' r2 R2 U2 r' U' r U2 R' r2 B R2",
      "y R' U' R U' R' U R' D' R U' R' r U2 r' D R2",
      "y R' F R' F' R' U2 R' U2 R2 U2 R U2 F R2 F'"
    ],
    group: "ZBLL AS1",
    prob: null,
    setup: "F R2' F' U2' R' U2' R2' U2' R U2' R F R F' R y'"
  },
  {
    name: "AS8",
    alg: [
      "y' R U2 R' U' R2 D R' U2 R D' R' U' R' U R U R'",
      "y2 R' U' R U' R U R' U' R' U2 F R U R U' R' F'",
      "y' R2 U R2 U R U2 R' U2 R' U' D R' U R D'",
      "y' R2 F' R2 U R2 D' F' U' D F' U F2 R2"
    ],
    group: "ZBLL AS1",
    prob: null,
    setup: "L' U' L U' R U2' L' U' R' U2' L U' R U' R' y'"
  },
  {
    name: "AS9",
    alg: [
      "y2 R' U' R U' R D R' U' R D' R' U R' U2 R",
      "y2 R' U' R U' R' U R' D' R U' R' D R U2 R",
      "y R U R D' R' U2 R D R' D' R' U2 R U' D R'",
      "y R U R' U2 L' U2 R U2 L U L' R' U2 L"
    ],
    group: "ZBLL AS1",
    prob: null,
    setup: "L' U2' R L U' L' U2' R' U2' L U2' R U' R' y'"
  },
  {
    name: "AS10",
    alg: [
      "y R U2 R D R' U' R D' R' U R' U' R U' R'",
      "y R U2 R' U R' D' R U' R' D R U' R U' R'",
      "y R' U L U' R U' R' L' U L U' R U2 L'",
      "y R U2 R D R' U' R D' R' U R' U' R U' R' U2"
    ],
    group: "ZBLL AS1",
    prob: null,
    setup: "L U2' R' U L' U' L R U R' U L' U' R y'"
  },
  {
    name: "AS11",
    alg: [
      "y2 R2 D R' U R D' R' U R' U' R U' R'",
      "y2 L' U R U' L2 U2 R' U R U2 L' R'",
      "U R U R' U' D R' U' R U R2 U' R U R2 D'",
      "y2 R' F' r U R U' r' F r' F' r U' r' F2 r"
    ],
    group: "ZBLL AS1",
    prob: null,
    setup: "R U R' U R U' R D R' U' R D' R2' y2'"
  },
  {
    name: "AS12",
    alg: [
      "y R' U' R U' R' U R' D' R U R' D R2",
      "y' r U2 R' U' R U' r' F R' F' R U R U' R'",
      "y' R U' L' U R' U' L R' U2 R U R' U R"
    ],
    group: "ZBLL AS1",
    prob: null,
    setup: "R2' D' R U' R' D R U' R U R' U R y'"
  },
  {
    name: "AS13",
    alg: [
      "R U' R' U2 R U' R2 D' R U' R' D R",
      "y' L U' R' U L' U R2 U R2 U R2 U2 R'",
      "y R' U' R U2 R D R' U R D' R2 U2 R",
      "y R' U' R U' R2 D' R U R' D R U R"
    ],
    group: "ZBLL AS2",
    prob: null,
    setup: "R' D' R U R' D R2' U R' U2' R U R'"
  },
  {
    name: "AS14",
    alg: [
      "y R U2 R' U' F' R U R' U' R' F R2 U' R'",
      "S U2 R U2 R' U2 R' F R f'",
      "y2 R U2 R' U2 R U' R' L U' R U R' L'",
      "y2 R U' R U F' U2 R' U2 R F U' R2"
    ],
    group: "ZBLL AS2",
    prob: null,
    setup: "R U R2' F' R U R U' R' F U R U2' R' y'"
  },
  {
    name: "AS15",
    alg: [
      "y' F U2 F' U' R' F U' F' U R",
      "y2 R U2 R' U2 L' U R U' R' L",
      "y2 R U2 R' U2 r' F R F' r R'",
      "y2 R U2 R' U2 L' U R U' M' x'"
    ],
    group: "ZBLL AS2",
    prob: null,
    setup: "x M U R' U' L U2' R U2' R' y2'"
  },
  {
    name: "AS16",
    alg: [
      "y' R' U2 R' D' R U R' D R2 U' R' U2 R",
      "R' U' R U' R' U' L' U2 R U' R' U2 R L"
    ],
    group: "ZBLL AS2",
    prob: null,
    setup: "L' R' U2' R U R' U2' L U R U R' U R"
  },
  {
    name: "AS17",
    alg: [
      "y R U R' U R' F U' R2 U' R2 U F' U R",
      "y R U R' U2 R' D' R U' R' D U' R2 U' R2 U2 R",
      "y R U R' U' R U' R' F' R U R' U R U' R' U' R' F R",
      "F R U R' F R' F' U2 R2 U R2 U R F'"
    ],
    group: "ZBLL AS2",
    prob: null,
    setup: "R' U' F U' R2' U R2' U F' R U' R U' R' y'"
  },
  {
    name: "AS18",
    alg: [
      "y R2 D R' U R D' R2 U' r' F R F' M'",
      "y R2 D R' U R D' R2 U' L' U R U' R' L",
      "y2 R L' U' L U R' U' L' U2 R U' L U R'",
      "y2 F2 D F' U F D' F2 R' F U' F' U R"
    ],
    group: "ZBLL AS2",
    prob: null,
    setup: "L U' R' U L' U2' R U L U' R' U L' R"
  },
  {
    name: "AS19",
    alg: [
      "y2 S R U R' U' R' F R S' R U R' U' F'",
      "y2 S R U R' U' R' F R f' F R U R' U' F'",
      "F R' F' U2 R U F' R' U R U F R U' R'",
      "R U' L U2 R' U R U2 R' U2 L' U' L U' L'"
    ],
    group: "ZBLL AS2",
    prob: null,
    setup: "L U L' U L U2' R U2' R' U' R U2' L' U R'"
  },
  {
    name: "AS20",
    alg: [
      "y2 R' U' R U' R2 D' r U2 r' D R2",
      "R D' R U' R D R' U R2 D' R U2 D R' U2 R"
    ],
    group: "ZBLL AS2",
    prob: null,
    setup: "R2' D' r U2' r' D R2' U R' U R y2'"
  },
  {
    name: "AS21",
    alg: [
      "y2 R' U' R U' R2 D' R U2 R' D R2"
    ],
    group: "ZBLL AS2",
    prob: null,
    setup: "R2' D' R U2' R' D R2' U R' U R y2'"
  },
  {
    name: "AS22",
    alg: [
      "y2 R U2 R' U' R U R' U2 R' F R U R U' R' F'",
      "y R U2 R' U' F' r U R' U' r' F R2 U' R'",
      "y L U L' U L U2 L2 R U R' U' L U2 R U2 R'"
    ],
    group: "ZBLL AS2",
    prob: null,
    setup: "R U R2' F' r U R U' r' F U R U2' R' y'"
  },
  {
    name: "AS23",
    alg: [
      "R' U2 R' D' R U2 R' D R U' R U' R' U2 R",
      "y R' U' R U' R' U R U' R' U R' F' R U R U' R' F R",
      "y R' U' R U R U' R' U2 R L U' R2 U L' U2 R",
      "F R U R2 U' R U' R U R2 U R2 U' R' U F'"
    ],
    group: "ZBLL AS2",
    prob: null,
    setup: "R' F' R U R' U' R' F R U' R U R' U' R U R' U R y'"
  },
  {
    name: "AS24",
    alg: [
      "R' U' R U R' F R U R' U' R' F' R2",
      "y L U2 L' U2 R' U L2 U' R U L' U' L'",
      "y R U2 R' U2 R' F R2 U' R' U' R U R' F'"
    ],
    group: "ZBLL AS2",
    prob: null,
    setup: "R2' F R U R U' R' F' R U' R' U R"
  },
  {
    name: "AS25",
    alg: [
      "y' R U2 R' U' R U R D R' U2 R D' R2"
    ],
    group: "ZBLL AS3",
    prob: null,
    setup: "R2' D R' U2' R D' R' U' R' U R U2' R' y"
  },
  {
    name: "AS26",
    alg: [
      "y2 R' U2 R' F' R U R U' R' F U2 R",
      "U2 R' U2 R' F' R U R U' R' F U2 R U2"
    ],
    group: "ZBLL AS3",
    prob: null,
    setup: "R' U2' F' R U R' U' R' F R U2' R y2'"
  },
  {
    name: "AS27",
    alg: [
      "R2 D' R U2 R' D R U R U' R' U2 R",
      "R' F' R U R' U' R' F R2 U' R' U R U' R' U2 R",
      "y2 L' U' L U F R U2 R' U' x U2 L U r'"
    ],
    group: "ZBLL AS3",
    prob: null,
    setup: "R' U2' R U R' U' R' D' R U2' R' D R2'"
  },
  {
    name: "AS28",
    alg: [
      "y2 F U R U' R' U R U' R2 F' R U2 R U2 R'",
      "y2 R U2 R2 D' R U' R' D R2 U R' U' R U' R'",
      "y R U2 R D R2 U' R U' R' U2 R2 D' R2",
      "y' L U2 F L' U' L U L F' L' U2 L'"
    ],
    group: "ZBLL AS3",
    prob: null,
    setup: "R2' D R2' U2' R U R' U R2' D' R' U2' R' y'"
  },
  {
    name: "AS29",
    alg: [
      "y F U R U' R' U R U' R' U R2 D R' U' R D' R2 F'",
      "y' R' U2 R U R2 D' R U' R' D R2 U R' U' R U R' U R",
      "y2 R U R' U R2 D' R U' R' D R' U' R2 U2 R",
      "R U' R' F D U R U' R' U R U' R' D' R' F' R"
    ],
    group: "ZBLL AS3",
    prob: null,
    setup: "R' U2' R2' U R D' R U R' D R2' U' R U' R' y2'"
  },
  {
    name: "AS30",
    alg: [
      "y2 L' U R U' L U R'",
      "y2 r' F R F' r U R'",
      "R' U L U' R U L'",
      "z D' R U R' D R U' z'"
    ],
    group: "ZBLL AS3",
    prob: null,
    setup: "L U' R' U L' U' R"
  },
  {
    name: "AS31",
    alg: [
      "y2 R' U R U R' U' R' D' R U R' D R U R U' R' U2 R",
      "y' L' U R' U' R L U2 R' U' R2 U2 R' U' R U' R'",
      "y R U2 R' U' R U R D R' U R D' R' U' R' U R U R'",
      "y2 R U R' U R U L' U R' U L U L' U L"
    ],
    group: "ZBLL AS3",
    prob: null,
    setup: "L' U' L U' L' U' R U' L U' R' U' R U' R' y2'"
  },
  {
    name: "AS32",
    alg: [
      "y R U R2 F' R U R U R' U' R U' R' F R U' R'",
      "y2 D R' U' R D' R U' R' U R2 U R' U' R2",
      "y R2 U' R' U R2 U R' U' R D' R U' R' D",
      "R' U' R U' R' U' R U R' U' R' D' R U R' D R U2 R"
    ],
    group: "ZBLL AS3",
    prob: null,
    setup: "R' U2' R' D' R U' R' D R U R U' R' U R U R' U R"
  },
  {
    name: "AS33",
    alg: [
      "y' R U2 R' U' R U R D r' U2 r D' R2",
      "y2 R' U2 R' D' R U R' D R U' R U R' U' R U R' U R",
      "y2 L' U R U' L R U R U R U' R' U' R2"
    ],
    group: "ZBLL AS3",
    prob: null,
    setup: "R2' U R U R' U' R' U' R' L' U R' U' L y2'"
  },
  {
    name: "AS34",
    alg: [
      "y' R U R U' R2 D U2 R' U' R U D' R",
      "y R U2 R' U' R U2 R F2 R' U R' U' R2 F2 R2",
      "S U' R U R U' R2 U R F R' f'"
    ],
    group: "ZBLL AS3",
    prob: null,
    setup: "R2' F2' R2' U R U' R F2' R' U2' R' U R U2' R' y'"
  },
  {
    name: "AS35",
    alg: [
      "y R D' U R U' R' U2 D R2 U' R U R",
      "y' L U D' L U' L' U2 D L2 U' L U L",
      "y' F' U' f R U R2 U' R U R U' S'"
    ],
    group: "ZBLL AS3",
    prob: null,
    setup: "L' U' L' U L2' D' U2' L U L' D U' L' y"
  },
  {
    name: "AS36",
    alg: [
      "y2 F R U' R' U R U R2 F' R U R U R' U' R U' R'",
      "R2 D' r U2 r' D R U R U' R' U2 R",
      "y2 R' U' R F2 R' U R2 U2 R' U R U R' F2"
    ],
    group: "ZBLL AS3",
    prob: null,
    setup: "F2' R U' R' U' R U2' R2' U' R F2' R' U R y2'"
  },
  {
    name: "AS37",
    alg: [
      "R U R' F' R U R' U' R' F R2 U R' U' R U' R'",
      "y' R U2 R' U' R2 D R' U R D' R' U2 R'",
      "L R U2 R' U' R U2 L' U' R' U' R U' R'"
    ],
    group: "ZBLL AS4",
    prob: null,
    setup: "R U R' U R U L U2' R' U R U2' R' L'"
  },
  {
    name: "AS38",
    alg: [
      "y L' R' U R U' L R' U' R U2 R' U2 R",
      "y2 f' L F L' U2 L' U2 L U2 S",
      "y2 R2 U' R U' R2 D' R U R' D R U R U' R",
      "y' R U2 R2 D' R U2 R' D R2 U' R' U R U' R'"
    ],
    group: "ZBLL AS4",
    prob: null,
    setup: "R U R' U' R U R2' D' R U2' R' D R2' U2' R' y"
  },
  {
    name: "AS39",
    alg: [
      "y2 L' R U' L U R' U2 L' U2 L",
      "x' M' U' R U L' U2 R' U2 R",
      "y' F U R' U' R F' U' R' U2 R",
      "y2 x M U' L U R' U2 L' U2 L"
    ],
    group: "ZBLL AS4",
    prob: null,
    setup: "R' U2' R U2' L U' R' U M x"
  },
  {
    name: "AS40",
    alg: [
      "y R U R D R' U R D' R2 U' R U' R'",
      "R' U' F' R U R' U' R' F R2 U' R' U R",
      "y R U2 R2 D' R U R' D R U2 R U' R'",
      "y' R U' R' U2 L' U R U' L2 U' R' U L'"
    ],
    group: "ZBLL AS4",
    prob: null,
    setup: "R' U R U2' R' U R2' D R' U R D' R' y"
  },
  {
    name: "AS41",
    alg: [
      "y R U R' U2 R U R' U' F' R U2 R' U' R U' R' F",
      "y2 R2 D R' U2 R D' R U' R2 U' R' U R' U R",
      "y' L' U R U' L U' R D R' U2 R D' R2",
      "y R U R' U R' U' R' D R' U' R D' R U2 R"
    ],
    group: "ZBLL AS4",
    prob: null,
    setup: "R' U2' R' D R' U R D' R U R U' R U' R' y'"
  },
  {
    name: "AS42",
    alg: [
      "R2 D' R U' R' D F R U R U' R' F' R",
      "F U R' U' R F' R2 D' R U R' D R2",
      "y L' U R U' L U2 R' U' L' U R U' L R'",
      "R U2 R' U' R U' R D r' U2 r D' R' U2 R'"
    ],
    group: "ZBLL AS4",
    prob: null,
    setup: "R L' U R' U' L U R U2' L' U R' U' L y'"
  },
  {
    name: "AS43",
    alg: [
      "y2 R2 D r' U2 r D' R2 U' R U' R'"
    ],
    group: "ZBLL AS4",
    prob: null,
    setup: "R U R' U R2' D r' U2' r D' R2' y2'"
  },
  {
    name: "AS44",
    alg: [
      "R U R' U' R' U2 R U R' U R2 U r' F R' F' r",
      "y R U R' U R U' R2 F R F' r U' r' U r U r'",
      "R D' R U' R' D U' R' U R U R2 U' R' U R",
      "R' U' R U' R' U2 L' U2 L U L' U2 R U' L"
    ],
    group: "ZBLL AS4",
    prob: null,
    setup: "L' U R' U2' L U' L' U2' L U2' R U R' U R"
  },
  {
    name: "AS45",
    alg: [
      "R U2 R' U' R U' R D R' U2 R D' R' U2 R'",
      "R U2 R' U R U L U' R' U L' U R U' R'"
    ],
    group: "ZBLL AS4",
    prob: null,
    setup: "R U R' U' L U' R U L' U' R' U' R U2' R'"
  },
  {
    name: "AS46",
    alg: [
      "y' R' U' R U' R' F' R U R' U' R' F R U R U' R' U2 R",
      "R U2 R' U' R' D' R U' R' D R2 U' R' U R U' R'",
      "y' R' U' R U' R U R D R' U' R D' R U2 R",
      "y' R' U' R U R U' R' U2 R L U' R2 U L' U2 R"
    ],
    group: "ZBLL AS4",
    prob: null,
    setup: "R' U2' L U' R2' U L' R' U2' R U R' U' R' U R y"
  },
  {
    name: "AS47",
    alg: [
      "y2 R2 D R' U2 R D' R2 U' R U' R'"
    ],
    group: "ZBLL AS4",
    prob: null,
    setup: "R U R' U R2' D R' U2' R D' R2' y2'"
  },
  {
    name: "AS48",
    alg: [
      "R U' R' U2 R U' R' U R' D' R U2 R' D R",
      "R U R' F' R U2 R' U2 R' F R2 U' R'",
      "y F R U R2 U2 R2 U R2 U R F'"
    ],
    group: "ZBLL AS4",
    prob: null,
    setup: "F R' U' R2' U' R2' U2' R2' U' R' F' y'"
  },
  {
    name: "AS49",
    alg: [
      "y R U' R' F' R U R' U' R' F R2 U' R' U2 R U' R'",
      "R U2 L' U R' U' L U' R U' R'",
      "R U' R' U2 R U' R' U2 R' D' R U R' D R"
    ],
    group: "ZBLL AS5",
    prob: null,
    setup: "R U R' U L' U R U' L U2' R'"
  },
  {
    name: "AS50",
    alg: [
      "y' R U2 R2 U' R2 U' R' F U' R' U' R U F'",
      "y' R U2 R2 U' R2 F' R U R' U' R' F U' R'",
      "y' R U2 R2 U' R2 U' R' U2 R' F' R U R' U' R' F R2",
      "y' R U2 R' D R' U' R D' R2 U R' U' R' U' R'"
    ],
    group: "ZBLL AS5",
    prob: null,
    setup: "F U' R' U R U F' R U R2' U R2' U2' R' y"
  },
  {
    name: "AS51",
    alg: [
      "R U R' F' R U2 R' U' R U' R' F R U' R'",
      "y2 R' F R F' U2 R U' R' U' F R' F' R",
      "y2 F R U' R2 U' R U' R' U2 R2 U R' F'"
    ],
    group: "ZBLL AS5",
    prob: null,
    setup: "F R U' R2' U2' R U R' U R2' U R' F' y2'"
  },
  {
    name: "AS52",
    alg: [
      "y2 R' U' R U' L U' R' U L' U2 R",
      "L' U' L U' R U' L' U R' U2 L",
      "y' R D R' U R D' R' U2 R' U' R U2 R' U' R",
      "y2 R' F R f' U2 R U' R' U' f R' F' R"
    ],
    group: "ZBLL AS5",
    prob: null,
    setup: "R' U2' L U' R U L' U R' U R y2'"
  },
  {
    name: "AS53",
    alg: [
      "y2 F R' F' R U R U' R2 F R U R' U' F' U R",
      "y' L' U R U' L U L' U R' U' L U R U' R'",
      "y' r R D R' U R U' D' L' U R' U' x'",
      "R' U2 R' D' R U R' D F R U R U' R' F' R"
    ],
    group: "ZBLL AS5",
    prob: null,
    setup: "R' U2' L R2' U2' R' U' R U2' L' U R2' U R y2'"
  },
  {
    name: "AS54",
    alg: [
      "y2 F R2 U R2 U R2 U2 R' U2 R' U' R U' R' F'",
      "F' U2 R' D R U' R' D' R f R' F R f'",
      "R U2 R' U' F2 R U2 R' U2 R' F2 R2 U' R'",
      "R U2 R' U' R U L' U L U2 R' U' L' U2 L"
    ],
    group: "ZBLL AS5",
    prob: null,
    setup: "L' U2' L U R U2' L' U' L U' R' U R U2' R'"
  },
  {
    name: "AS55",
    alg: [
      "y' F U' R' U R U F' R' U R U' R' U2 R",
      "y R' U2 L U' R U L' R' U R U' R' U2 R",
      "y' R U R' U R U' R' U r' F R F' r U2 R'"
    ],
    group: "ZBLL AS5",
    prob: null,
    setup: "R' U2' R U R' U' R L U' R' U L' U2' R y'"
  },
  {
    name: "AS56",
    alg: [
      "y' F R U' R' U R U2 R' U' F' R U R' U' R' F R F'",
      "y' R U2 R' U' R U R' r' F R F' r U2 R'",
      "y' R U2 R' U' R U R' L' U R U' L U2 R'",
      "y R' F' U' F U R F R U R' U' R U R' U' F'"
    ],
    group: "ZBLL AS5",
    prob: null,
    setup: "R U2' L' U R' U' L R U' R' U R U2' R' y"
  },
  {
    name: "AS57",
    alg: [
      "y' R2 U R2 F' R U R' U R U2 R' F R2 U' R2",
      "y R U R' U L' U2 R U2 L U2 L' R' U2 L",
      "y' R U2 R' F' R U R' U F U F' U R' F R2 U' R'",
      "R U' R D R2 U2 R U R' U R2 D' R' U R'"
    ],
    group: "ZBLL AS5",
    prob: null,
    setup: "L' U2' R L U2' L' U2' R' U2' L U' R U' R' y'"
  },
  {
    name: "AS58",
    alg: [
      "y' F R U R' U' R U R' F R' F' R U' F'",
      "y L' U2 R U' R' U2 L R U R' U' R U R' U' R U' R'"
    ],
    group: "ZBLL AS5",
    prob: null,
    setup: "F U R' F R F' R U' R' U R U' R' F' y"
  },
  {
    name: "AS59",
    alg: [
      "y2 R' U F' R U R' U' R' F R U2 R U2 R' U' R",
      "y' R2 U' R2 B R' U2 R U R' U R B' R2 U R2",
      "y2 R' U R' D' R2 U R' U R U2 R2 D R U' R",
      "y2 R U L' U R U' L U' R U' R U R' U2 R2"
    ],
    group: "ZBLL AS5",
    prob: null,
    setup: "R2' U2' R U' R' U R' U L' U R' U' L U' R' y2'"
  },
  {
    name: "AS60",
    alg: [
      "y' R U' R2 D' U' R U' R' U2 D R2 U R'",
      "y R' U R2 U2 D R' U' R D' U' R2 U' R",
      "y L R U2 R' U' L' U2 R' U L U' R2 U R' U L'"
    ],
    group: "ZBLL AS5",
    prob: null,
    setup: "L U' R U' R2' U L' U' R U2' L U R U2' R' L' y'"
  },
  {
    name: "AS61",
    alg: [
      "y R2 U R2 U R' U2 R' U R U R' U' R2",
      "R' U' R U' R' U R U' R U R2 U R U' R U' R'",
      "y' F R U R' U F' U' F U' R U R' U' F'",
      "R' U' R U' R2 U' R' U' R' U R U R U' R"
    ],
    group: "ZBLL AS6",
    prob: null,
    setup: "R2' U' R2' U' R U R2' U' R2' U R' U R2' y"
  },
  {
    name: "AS62",
    alg: [
      "y R' U' R U R U2 R' U' R U' R' U R' U R",
      "y R2 U R2 U R U2 R' U R U R U' R2",
      "y R U2 R' U' R U' R' U' R U' R U R U R U' R' U' R2",
      "y2 S' l' U' L U' L' U2 l U2 S"
    ],
    group: "ZBLL AS6",
    prob: null,
    setup: "R' U2' R U R U R U R' U' R U R U' R U' R' y2'"
  },
  {
    name: "AS63",
    alg: [
      "y2 R U R' U R' U' R U' R' U2 R U R U' R'",
      "R' U' R U' R' U' R' U' R' U' R' U R U R2",
      "y R2 U' R U R U R' U2 R U R2 U R2",
      "y' R2 F2 R' U2 R' U' R U' R F2 R2"
    ],
    group: "ZBLL AS6",
    prob: null,
    setup: "R2' U' R' U' R U R U R U R U R' U R"
  },
  {
    name: "AS64",
    alg: [
      "y' R' U' R U' R U R2 U R U' R U R' U' R U' R'",
      "y R U R' U' R U R2 U' R2 U' R' U R U' R' U R' U R",
      "y R U2 R' U' R U' R2 U R' U' R3 U' R' U R U R2",
      "y R2 U' R' U R U R' U2 R' U R2 U R2"
    ],
    group: "ZBLL AS6",
    prob: null,
    setup: "R' U' R U' R U R' U' R U R2' U R2' U' R' U R U' R' y'"
  },
  {
    name: "AS65",
    alg: [
      "R' U' R2 U R2 U R2 U2 R2 U2 R",
      "y R U2 R' U' R U' R' U R U' R U R U R U' R' U' R2",
      "y2 R U R2 U' R' U' R U R' U' R2 U2 R",
      "y' R' U2 R U2 R U2 R' U' R U' R2 U2 R"
    ],
    group: "ZBLL AS6",
    prob: null,
    setup: "R' U2' R2' U2' R2' U' R2' U' R2' U R"
  },
  {
    name: "AS66",
    alg: [
      "y R U2 R' U' R U' R'",
      "y' L U2 L' U' L U' L'",
      "y' M' U2 R U2 M R' U' R U' R' U2"
    ],
    group: "ZBLL AS6",
    prob: null,
    setup: "R U R2' U' R2' U' R2' U2' R2' U2' R'"
  },
  {
    name: "AS67",
    alg: [
      "R U2 R2 U2 R2 U R2 U R2 U' R'",
      "R U2 R2 U' R U' R' U2 R U2 R U2 R'",
      "R' U' R U' R' U2 R U' R U' R U R U R U' R' U' R2",
      "y R U2 R2 U' R' U R U' R' U' R2 U R"
    ],
    group: "ZBLL AS6",
    prob: null,
    setup: "R U R2' U' R2' U' R2' U2' R2' U2' R'"
  },
  {
    name: "AS68",
    alg: [
      "R' U' R U' R' U2 R",
      "y2 r' F' r U' r' F2 r",
      "y R U' R' U' R U R' U R U' R' U R U2 R' U2 R U' R'",
      "y2 L' U' L U' L' U2 L"
    ],
    group: "ZBLL AS6",
    prob: null,
    setup: "R' U2' R U R' U R"
  },
  {
    name: "AS69",
    alg: [
      "y R U R' U' R' U' R U R U' R' U' R' U R",
      "y R U2 R2 U' R' U' R' U R U R2 U' R'"
    ],
    group: "ZBLL AS6",
    prob: null,
    setup: "R' U' R U R U R' U' R' U R U R U' R' y'"
  },
  {
    name: "AS70",
    alg: [
      "y R' U' R U R U2 R' U' R' U R U' R U' R'",
      "R' U' R U' R U R' U' R' U2 R U R U' R'",
      "y R2 U R U R2 U' R' U' R2 U' R U' R'",
      "R' U' R U' R2 U' R' U' R2 U R U R2"
    ],
    group: "ZBLL AS6",
    prob: null,
    setup: "R2' U' R' U' R2' U R U R2' U R' U R"
  },
  {
    name: "AS71",
    alg: [
      "y2 R U R' U R' U' R2 U' R2 U2 R",
      "y R U2 R2 U' R2 U' R' U R' U R",
      "y2 r U R' U R' U' R2 U' r' R' U2 R",
      "y' R U' R' U' R U' R' U R U' R' U R U R' U' R U2 R'"
    ],
    group: "ZBLL AS6",
    prob: null,
    setup: "R' U2' R2' U R2' U R U' R U' R' y2'"
  },
  {
    name: "AS72",
    alg: [
      "y' R2 D' R U2 R' D R U R' F R U R U' R' F' R",
      "R' F2 R D R' D' F2 U' R2 U R' U' R2",
      "R2 U' S R2 S' R2 U R U' R U' R' U2 R",
      "y R U' R U R' U R U2 R' U' R' U' R U' R' U R U' R'"
    ],
    group: "ZBLL AS6",
    prob: null,
    setup: "R2' U R' U R U2' R U2' R U R' U R2' U R' y'"
  }
];
