import { AlgorithmCollection } from '@/interfaces/AlgorithmCollection'

export const ZBLL_L_ALGS: AlgorithmCollection[] = [
  {
    name: 'ZBLL L 1',
    group: 'L1',
    setup: "R U R' U R U2' R2' U2' R' D' R U2' R' D R2' y'",
    algs: [
      "y' R' U' R U' R' U2 R' D' R U2 R' D R U2 R",
      "S R' U' R U f R2 f' U' R' U' R S'",
      "y F' R U R' U' R' F R2 U' R' U' R U' R' U R U R'",
      "y r' F' r U' r' F2 r' U' r F2 r' U r F2 r"
    ]
  },
  {
    name: 'ZBLL L 2',
    group: 'L1',
    setup: "R' U R U R' U2' R U R D R' U2' R D' R' y'",
    algs: [
      "y R D R' U2 R D' R' U' R' U2 R U' R' U' R",
      "y' L U' R' U L' U' R2 U2 R' U' R U' R'",
      "y2 L' U' L U' L' U2 L U R U' L' U R' U' L",
      "U R2 D' R U2 R' D R U2 R U' R' U' R U' R' U2 R"
    ]
  },
  {
    name: 'ZBLL L 3',
    group: 'L1',
    setup: "R' U' R2' D R' U' R D' R2' U2' R y",
    algs: [
      "y' R' U2 R U R2 D' R U R' D R2",
      "y R D r' U2 r D' R' U2 R' U' R",
      "R U2 R' U' R U' R' U' R2 D' R U2 R' D R U2 R",
      "y' R' U2 R2 D R' U R D' R2 U R"
    ]
  },
  {
    name: 'ZBLL L 4',
    group: 'L1',
    setup: "R2' D' r U2' r' D R U2' R",
    algs: [
      "R' U2 R' D' r U2 r' D R2",
      "y2 R U' R' F' U F R U R2 F R2 U R' U' F'",
      "R U R' U2 L U' R U L' U R'",
      "y2 R U R' U' z' y' R U R' F' R U R' U' R' F R2 U' R' U' F"
    ]
  },
  {
    name: 'ZBLL L 5',
    group: 'L1',
    setup: "R' U2' R2' D R' U2' R D' R2' U R U2' R' U2' R",
    algs: [
      "R' U2 R U2 R' U' R2 D R' U2 R D' R2 U2 R",
      "y2 F' r U R2 D R U R' D' R U2 r' F R",
      "R U2 R2 U2 R D' R U2 R' D S R2 S'",
      "y' R' D' L U' D R' D R U R' D2 L' D R2"
    ]
  },
  {
    name: 'ZBLL L 6',
    group: 'L1',
    setup: "R2' D' R U2' R' D R U2' R",
    algs: ["R' U2 R' D' R U2 R' D R2", "y2 z U' R2 U' L' U R2 U' L U2"]
  },
  {
    name: 'ZBLL L 7',
    group: 'L1',
    setup: "R' U R U R' U2' R y U2' R U' R' U2' R U' R'",
    algs: [
      "y' R' U' R U' R' U' R U2 R D r' U2 r D' R'",
      "R U R' U2 R U R' U2 F' U2 y' R U' R' U' R",
      "R U R' U2 R U R' U D R' U2 R U' R' U' R D'",
      "y' R' U' R U' R' U R2 D R' U R D' R2 U R U' R' U R"
    ]
  },
  {
    name: 'ZBLL L 8',
    group: 'L1',
    setup: "R U2' F U F' R' U F U2' F' R U2' R' y'",
    algs: [
      "y' F R U' R' U R U R2 D' R U R' D R2 U' R' F'",
      "y' F R U' R' U R2 D R' U R D' R2 U R U' R' F'",
      "y R U2 R U R U' R2 D R' U R D' R U R'",
      "y R U2 R' F U2 F' U' R F U' F' U2 R'"
    ]
  },
  {
    name: 'ZBLL L 9',
    group: 'L1',
    setup: "R U' R U D R' U R U2' R' U R D' R' U R'",
    algs: [
      "y' R' U' R2 D r' U2 r D' R2 U R U R' U2 R",
      "R' U2 R' D' R' F2 R2 U2 R2 F2 R D R2",
      "R2 U' R' U' R2 U R U D' R U2 R' D R2",
      "R U' R D R' U' R U2 R' U' R D' U' R' U R'"
    ]
  },
  {
    name: 'ZBLL L 10',
    group: 'L1',
    setup: "R U L' U R' U' L U' R U R' U R U' R'",
    algs: [
      "R' U R U' R' U F' R U2 R' U2 R' F R2",
      "y' R' U2 R U R2 D' R U' R' r U2 r' D R2",
      "R U R' U' R U' R' U L' U R U' L U' R'",
      "y' L2 D' R' B2 R' D2 L' D R2 D2 L'"
    ]
  },
  {
    name: 'ZBLL L 11',
    group: 'L1',
    setup: "R' U R U' R' U' R U2' R D R' U' R D' R2' U' R",
    algs: [
      "R' U R2 D R' U R D' R' U2 R' U R U R' U' R",
      "R' U R U' R' U R U R' U' R U' R D R' U2 R D' R'",
      "y2 f U' R2 U' R' F R' F' U' R U' R' U' f'",
      "y' R' U2 R F U' R' U R U F' R' U' R U R' U R"
    ]
  },
  {
    name: 'ZBLL L 12',
    group: 'L1',
    setup: "R U R' U2' F2' R U2' R' U2' R' F2' R2' U R' y",
    algs: [
      "y' F R U' R' U' R2 D R' U R D' R' U R' U' F'",
      "y' R U' R2 F2 R U2 R U2 R' F2 U2 R U' R'",
      "y2 F U R' U' R F' R' U' R U R' U' R U R' U R",
      "y' F U R U' R' F' R B' R' U' R B R' f' L f"
    ]
  },
  {
    name: 'ZBLL L 13',
    group: 'L2',
    setup: "R2' B2' R' U2' R' U2' R B2' R' U R U' R' y2'",
    algs: [
      "R2 D' R U2 R' D R2 U R2 F' R U R U' R' F R",
      "y2 R2 D r' U2 r R' U' R D' R' U' R'",
      "R2 U R' U' R' U R' D U' R' U R D'",
      "R' F2 R U2 R U2 R' F2 R U' R' U R U2 R'"
    ]
  },
  {
    name: 'ZBLL L 14',
    group: 'L2',
    setup: "R' D' R U R' D R2' U' R' U R U R' U' R U R' y'",
    algs: [
      "y R U' R' U R U' R' U' R U R2 D' R U' R' D R",
      "S' R U R' F' U f U' R' U' R' U R",
      "y R' D R2 U' R' U R U' R' U' R U R2 D' R",
      "y' R' D' R U2 R' D R2 U' R' U R U' R' U' R U R'"
    ]
  },
  {
    name: 'ZBLL L 15',
    group: 'L2',
    setup: "R U R' U R U R' U2' L R U' R' U L'",
    algs: [
      "L U' R U R' L' U2 R U' R' U' R U' R'",
      "R' U2 R F U' R' U2 R U F' U' R' U R",
      "y R2 U R U R D' R U' R' D U' R' U2 R'",
      "y R U R' U' R U R2 D' R U R' D R2 U R' U' R U R' U' R U' R'"
    ]
  },
  {
    name: 'ZBLL L 16',
    group: 'L2',
    setup: "F R U R' U' R' F' U2' R U R U' R2' U2' R",
    algs: [
      "R' U2 R2 U R' U' R' U2 F R U R U' R' F'",
      "R' U' R' D' R U' R' U' D R' U' R2 U R U R2",
      "L U' R U L' U R U2 R U' R U R' U2 R2",
      "y2 M U' M' F R' F' R U R U' r' U M'"
    ]
  },
  {
    name: 'ZBLL L 17',
    group: 'L2',
    setup: "R L U2' L' U' R' U2' R' L U L' U' R2' U2' R' y",
    algs: [
      "R' U' R U' R' U R U' R' U R U' R2 D' R U2 R' D R2",
      "R' U2 R U R' U' F' R U R' U' R' F R2 U R' U R",
      "R' F R U R' U' F' R' F R F' R' F R F' U R",
      "y S R F R2 F' R U2 S U' R2 S2 U' R2"
    ]
  },
  {
    name: 'ZBLL L 18',
    group: 'L2',
    setup: "x' D R U' R' D' R U R' x",
    algs: [
      "y F R' F' r U R U' r'",
      "x' R U' R' D R U R' D' x",
      "y2 R2 D R' U R D' R' U' R'",
      "y2 x' U' R' D' R U R' D R x"
    ]
  },
  {
    name: 'ZBLL L 19',
    group: 'L2',
    setup: "D' R2' U R' U' R' U R' D U2' R' U2' R y",
    algs: [
      "y' R' U2 R U2 D' R U' R U R U' R2 D",
      "R U R' U R U R' U' R U R D R' U2 R D' R' U' R'",
      "y2 x' r U r' D' F r U r' F' D r U2 L'",
      "R U R' B' U R U R' U' f D R2 D' z'"
    ]
  },
  {
    name: 'ZBLL L 20',
    group: 'L2',
    setup: "R F U R' U' R U' R' U' R U F' R'",
    algs: [
      "L R U' R' U L' R U R' U R U' R'",
      "R F U' R' U R U R' U R U' F' R'",
      "L R U' R' U R L' U R' U R U' R'",
      "y R' U R S' R' U' R f R' F' R U R U' R'"
    ]
  },
  {
    name: 'ZBLL L 21',
    group: 'L2',
    setup: "R U' R' U' R U R D R' U2' R D' R' U' R' y'",
    algs: ["y R U R D R' U2 R D' R' U' R' U R U R'", "y S U2 R' U2 R U2 F R f'", "y' U M' U2 y R' U2 R U2 F l U' z'"]
  },
  {
    name: 'ZBLL L 22',
    group: 'L2',
    setup: "x M U R' U' L U R U R' U' R U' R'",
    algs: [
      "R U R' U R U' R' U' L' U R U' R' L",
      "y R U' R' U' R' D' r U2 r' D R U' R U R'",
      "R' U' R U' R D R' U2 R D' R2 U R U' R' U R",
      "R U R' U R U' R' U' L' U R U' M' x'"
    ]
  },
  {
    name: 'ZBLL L 23',
    group: 'L2',
    setup: "R U2' R' U2' R' F R U R U' R' F' y'",
    algs: [
      "y F R U R' U' R' F' R U2 R U2 R'",
      "y' x' M' U L' U2 R U2 L U' L' U' R' U R",
      "y F R' F' r U2 R' U' R2 U' r' U R' U R",
      "R U' R' U2 R U' R' F' U F U2 F' U F"
    ]
  },
  {
    name: 'ZBLL L 24',
    group: 'L2',
    setup: "F' U' r' F2' r U' r' F' r F",
    algs: [
      "y2 R U R' F' U' r' F2 r U F",
      "y' R' F' R U R' U' R' F R U' R U R' U R",
      "U2 R U R' U' R' F R F' l' U2 L U L' U l",
      "F' r' F r U r' F2 r U F"
    ]
  },
  {
    name: 'ZBLL L 25',
    group: 'L3',
    setup: "R2' F2' R U2' R U2' R' F2' R U' R' U R y",
    algs: [
      "y' R2 D' r U2 r' R U R' D R U R",
      "y' r U2 r' U2 r' F2 r F2 L' U L U' L' U2 L",
      "y' R2 D' r U2 M U R' D R U R",
      "y' R' U' R U R' F2 R U2 R' U2 R' F2 R2"
    ]
  },
  {
    name: 'ZBLL L 26',
    group: 'L3',
    setup: "L' U' L U' L' U' L U2' R' L' U L U' R y",
    algs: [
      "y' R' U R U2 R' L' U R U L U r' F r",
      "y' S R B' U' R2 U B U' R2 U R' S'",
      "y L' U R' U' L R U2 R' U R U R' U R",
      "R' F' R U2 R U2 R' F R' U' R2 U' R2 U2 R"
    ]
  },
  {
    name: 'ZBLL L 27',
    group: 'L3',
    setup: "R D R' U' R D' R2' U R U' R' U' R U R' U' R",
    algs: [
      "R' D R' U R D' R' U R2 U' R2 U' R2",
      "y R U R' U R' D' r U2 r' D R2 U' R' U R U' R'",
      "y S' R' U' R f R' F' U R U R U' R'",
      "R D' R2 U R U' R' U R U R' U' R2 D R'"
    ]
  },
  {
    name: 'ZBLL L 28',
    group: 'L3',
    setup: "R' U2' R2' U R' U' R' U2' F' R U2' R U2' R' F y2'",
    algs: [
      "y2 F' R U2 R' U2 R' F U2 R U R U' R2 U2 R",
      "y M U M' F' L F L' U' L' U l U' M'",
      "y R' D U R' U2 R U' R' U' R D' R U R' U2 R",
      "y2 F R U2 R' F' S R' F R S' U2 R' F' R"
    ]
  },
  {
    name: 'ZBLL L 29',
    group: 'L3',
    setup: "R' F' r U R U' r' F y2'",
    algs: ["y2 F' r U R' U' r' F R", "y' R2 D' R U' R' D R U R", "x' U' R U L' U' R' U r", "r U R U' L' U R' U' x'"]
  },
  {
    name: 'ZBLL L 30',
    group: 'L3',
    setup: "R U2' R' U2' R U' R' U L' U R U' L U' R' y",
    algs: [
      "y R U R' U R U' R' U R U' R' U R2 D R' U2 R D' R2",
      "F R' F' R U R U' R' F U R U' R' U R U' R' F'",
      "y' R U r' F R' F' r U' R U R' U2 R U2 R'",
      "y' R U L' U R' U' L U' R U R' U2 R U2 R'"
    ]
  },
  {
    name: 'ZBLL L 31',
    group: 'L3',
    setup: "R' U' R U R' U L' R U R' U' L R y'",
    algs: [
      "y' R' F R U R U' R' F' U R U R' U R U' R'",
      "y R' L' U R U' L R' U' R U' R' U R",
      "y R' L' U R U' R' L U' R U' R' U R"
    ]
  },
  {
    name: 'ZBLL L 32',
    group: 'L3',
    setup: "R' U2' R F U' R' U R U F' R' U R y'",
    algs: [
      "y R' U' R U2 R' F' R U R' U' R' F R2 U R' U2 R",
      "y R' U' R F U' R' U' R U F' R' U2 R",
      "y2 R U2 R' U2 D R' U R' U' R' U R2 D'",
      "y2 D' R U2 R' U2 D R' U R' U' R' U R2"
    ]
  },
  {
    name: 'ZBLL L 33',
    group: 'L3',
    setup: "R U R' U' R' F' R U2' R U2' R' F y2'",
    algs: [
      "y2 F' R U2 R' U2 R' F R U R U' R'",
      "y2 F' L' U' L U L F L' U2 L' U2 L",
      "y2 F' r U R' U' r' F U R' U' R' U' R3 U R U R2",
      "y2 R U2 R' U' R U R D R' U' R D' R' U' R'"
    ]
  },
  {
    name: 'ZBLL L 34',
    group: 'L3',
    setup: "R U R' U' R U R2' D' R U2' R' D R U' R U' R' y'",
    algs: [
      "y R U R' U R' D' R U2 R' D R2 U' R' U R U' R'",
      "y R' U' R U' R' U R F R' U R U' F'",
      "y R' U' R U' R' U R U L U' R' U M x",
      "y' L' U' L U' L' U L U R U' L' U M' x'"
    ]
  },
  {
    name: 'ZBLL L 35',
    group: 'L3',
    setup: "R' U R U R' U' R' D' R U2' R' D R U R",
    algs: [
      "R' U' R' D' R U2 R' D R U R U' R' U' R",
      "y2 F B' R2 U R2 U' R2 F' U' B",
      "y2 S' R U2 R' S U2 F' U' F",
      "S U2 R U2 R' U2 f' U' F"
    ]
  },
  {
    name: 'ZBLL L 36',
    group: 'L3',
    setup: "F U R U2' R' U R U R' F' y",
    algs: [
      "y' F R U' R' U' R U2 R' U' F'",
      "y L' U' L F U R U2 R' U' F'",
      "y' R' U' R F U' R' U2 R U F'",
      "y L' U' L U R U2 R' F2 L F2 L'"
    ]
  },
  {
    name: 'ZBLL L 37',
    group: 'L4',
    setup: "R U2' R D R' U2' R D' R' U2' R' U' R U' R' y2'",
    algs: [
      "y2 R U R' U R U2 R D R' U2 R D' R' U2 R'",
      "R2 D R' U2 R D' R' U2 R2 U2 R U R' U R",
      "U S R U R' U' F' U2 F U R U R' S'",
      "x' M' U L' U L U2 L' U' L U' R U L'"
    ]
  },
  {
    name: 'ZBLL L 38',
    group: 'L4',
    setup: "R2' D R' U R D' R2' U R U2' R' y2'",
    algs: [
      "y2 R U2 R' U' R2 D R' U' R D' R2",
      "U2 R U2 R2 D' R U' R' D R2 U' R'",
      "y2 F R U R' U' R' F' R U R U R' U' R U' R'",
      "y2 R U R' U' R U R2 D' R U R' D R2 U' R'"
    ]
  },
  {
    name: 'ZBLL L 39',
    group: 'L4',
    setup: "R U' R' U' R U2' R' U' R' D' R U2' R' D R",
    algs: [
      "R' D' R U2 R' D R U R U2 R' U R U R'",
      "y2 L' U R U' L U R2 U2 R U R' U R",
      "f R U R2 U' S' R' F' U F R F'",
      "y' R U' R' F2 U2 F2 D R' U R U' R D'"
    ]
  },
  {
    name: 'ZBLL L 40',
    group: 'L4',
    setup: "R2' D r' U2' r D' R' U2' R' y'",
    algs: [
      "R' F' R U R' U' R' F R2 U' R' U2 R",
      "y R U2 R D r' U2 r D' R2",
      "y2 R' U M' U' R U' R' U' R U2 r' F R' F' R U' R"
    ]
  },
  {
    name: 'ZBLL L 41',
    group: 'L4',
    setup: "R2' D R' U2' R D' R' U2' R' y'",
    algs: ["y R U2 R D R' U2 R D' R2", "y' L U2 L D L' U2 L D' L2", "F' r U' L D2 L' U L D2 r2 D"]
  },
  {
    name: 'ZBLL L 42',
    group: 'L4',
    setup: "R U2' R2' D' R U2' R' D R2' U' R' U2' R U2' R' y'",
    algs: [
      "y R U2 R' U2 R U R2 D' R U2 R' D R2 U2 R'",
      "y2 l x' U L' U' z' R U L' U' R' U L2 z L U' l2",
      "y F R' F' r U' R' D' R U' R' D R U' R U' r'",
      "y2 S' r U2 R2 U' R2 U' r' S U2 f R f'"
    ]
  },
  {
    name: 'ZBLL L 43',
    group: 'L4',
    setup: "R' U' R U R U R' U' R' U F R U R U' R' F' y2'",
    algs: [
      "y2 F R U R' U' R' F' U' R U R U' R' U' R' U R",
      "R' U2 R' U' R' U R2 D' R U' R' D R' U' R",
      "y2 R U R' U2 R U R2 D' r U2 r' D R2 U' R'",
      "y R u2 R' F' R u2 R2 F' R U2 R' F R"
    ]
  },
  {
    name: 'ZBLL L 44',
    group: 'L4',
    setup: "R U2' R2' U' R F' U' R' U2' R U F R U' R' y",
    algs: [
      "y2 R U R' U R U R' U2 R' D' r U2 r' D R",
      "y2 R U R' U R U' R2 D' R U' R' D R2 U' R' U R U' R'",
      "y R' U' R U2 R' U' R D' U' R U2 R' U R U R' D",
      "y R u R' U R U' R u' R2 U R f R' f'"
    ]
  },
  {
    name: 'ZBLL L 45',
    group: 'L4',
    setup: "R U' R' U R U R' U2' R' D' R U R' D R2' U R' y'",
    algs: [
      "y R U' R2 D' R U' R' D R U2 R U' R' U' R U R'",
      "y2 S R' U' F R' F' R2 U F R F' U2 S'",
      "y L U' R U L' U' R' U R U' R' U R U' R' U' R U R'",
      "L U D' L U2 L' U2 D L2 U2 L U L2 U L"
    ]
  },
  {
    name: 'ZBLL L 46',
    group: 'L4',
    setup: "R' U' L U' R U L' U R' U' R U' R' U R y'",
    algs: [
      "y2 R' F' R U2 R U2 R' F U' R U R' U' R U' R'",
      "y R' U' R U R' U R U2 F R' U R U' F' U R' U R",
      "R2 D' R2 U R' D R2 U' D r2 D2 r2 D' R'",
      "y R' U' R U R' U R U' L U' R' U L' U R"
    ]
  },
  {
    name: 'ZBLL L 47',
    group: 'L4',
    setup: "R' U R' D' U' R U' R' U2' R U' R' D R U' R y'",
    algs: [
      "y R' U R U2 R' U' R U2 R' U' R U' R2 D' R U R' D R2",
      "y R' U R' D' R U R' U2 R U R' U D R U' R",
      "y2 R U R2 D' r U2 r' D R2 U' R' U' R U2 R'",
      "F2 U' F R2 u R' U R U' R u' R2 F"
    ]
  },
  {
    name: 'ZBLL L 48',
    group: 'L4',
    setup: "L' U' L U2' F2' L' U2' L U2' L F2' L2' U' L",
    algs: [
      "y' R' F' R U R' U' R' F D' R U' R' D R2 U R' U R",
      "y' F U' R U R' U R' U2 R U R' U R2 U' R' U F'",
      "y2 L' R U R' U' L U R U R' U' R U R' U' R U' R'",
      "y2 M F R' F' r U R U R' U' R U R' U' R U' R'"
    ]
  },
  {
    name: 'ZBLL L 49',
    group: 'L5',
    setup: "r U2' R r2' F R' F' r2' U2' r' y'",
    algs: [
      "y r U2 r2 F R F' r2 R' U2 r'",
      "y2 R' F2 R2 U' r' F R' M' F2 R",
      "y r U2 r2 F R F' R' r2 U2 r'",
      "y2 R' F2 R2 U' L' U R2 r U2 R x'"
    ]
  },
  {
    name: 'ZBLL L 50',
    group: 'L5',
    setup: "L' U' L U' x M U' R' U2' L U R U2' R'",
    algs: [
      "y R U' R' U R U' R' U' R U R' U2 R' D' R U R' D R",
      "R U2 R' U' L' U2 R U M' x' U L' U L",
      "U2 R U R' U R U' R' F2 R U2 R' U2 R' F2 R2 U' R' U2",
      "y F R U R' M' S R' F R f' R U' r' F'"
    ]
  },
  {
    name: 'ZBLL L 51',
    group: 'L5',
    setup: "R U R' U x M U L U2' R' U' L' U2' L y",
    algs: [
      "R' U R U' R' U R U R' U' R U2 R D R' U' R D' R'",
      "R' D' R U' R' D R U2 R U' R' U R U R' U' R U R'",
      "y' L' U2 L U R U2 L' U' M' x' U' R U' R'",
      "y' R U R2 F2 R U2 R U2 R' F2 R U R' U' R U' R'"
    ]
  },
  {
    name: 'ZBLL L 52',
    group: 'L5',
    setup: "r U2' r2' F R F' r2' R' U2' r'",
    algs: [
      "r U2 R r2 F R' F' r2 U2 r'",
      "r U2 r2 R F R' F' r2 U2 r'",
      "y2 R' U2 R U R2 F R F' R' F R F' R' F R F' U R",
      "y' R' F2 R2 r' F' r U R2 F2 R"
    ]
  },
  {
    name: 'ZBLL L 53',
    group: 'L5',
    setup: "F R U R' U' F' r U r' U R U' M' U' r'",
    algs: [
      "y2 F' r U R' U R' D R U' R' D' R U' r' F R",
      "y R U2 R2 F R F2 r' U' F2 U r F",
      "r U r' R U R' U' r U' r' F U R U' R' F'",
      "y R U2 R2 x U R U2 r' B' U2 B r U x'"
    ]
  },
  {
    name: 'ZBLL L 54',
    group: 'L5',
    setup: "r U M U R' U' r U' r' F U R U' R' F' y'",
    algs: [
      "r U R2 D' R U2 R' D R U r' F R F'",
      "y F R U R' U' F' r U r' U R U' R' r U' r'",
      "y L' U R2 D' R' U2 R D R' U L U R'",
      "y' Lw' U' Lw L' U' L U Lw' U Lw F' U' L' U L F"
    ]
  },
  {
    name: 'ZBLL L 55',
    group: 'L5',
    setup: "F2' R U' R' U R U R2' F' R U R U' R' F' y",
    algs: [
      "y2 x' r2 U' r U2 R' F R U2 r2 F L'",
      "y R' U R U' R' U' R U' R' U2 R' D' R U' R' D R2",
      "R D R' U R D' R2 U' R U R' U R U R' U' R",
      "y R U2 R' U' F' R U R' U R U2 R' F R U' R'"
    ]
  },
  {
    name: 'ZBLL L 56',
    group: 'L5',
    setup: "R' U' F R U' R' U R U R2' F' R U R U' R' U R y",
    algs: [
      "y2 B' R U R' U' R' F R2 U' R' U' R U R' S z'",
      "y M' U' r U2 R' F R U2 r2 F R",
      "R U' R' U R U R' U R U' R2 D' R U R' D R",
      "y R' F' r2 U2 R' F' R U2 r' U M"
    ]
  },
  {
    name: 'ZBLL L 57',
    group: 'L5',
    setup: "R2' F' R U R U' R' F R U' R' U R y",
    algs: [
      "y' R' U' R U R' F' R U R' U' R' F R2",
      "y r U2 R2 F R F' R U2 r'",
      "R U2 L' U R' U' L R U2 R'",
      "y2 B' R U R' F' R U R' U' R' F R2 U' R' U' B"
    ]
  },
  {
    name: 'ZBLL L 58',
    group: 'L5',
    setup: "F U R U2' R' U2' R U R' U R U' R' F'",
    algs: [
      "y F R U R2 F R F' R U' R' F'",
      "F R U R' U' R2 x' U' R' U R' D' x",
      "F R U R' U' R U' R' U2 R U2 R' U' F'",
      "F R U R' F R' F' R2 U' R' F'"
    ]
  },
  {
    name: 'ZBLL L 59',
    group: 'L5',
    setup: "R U R' L' U2' R U R' U2' L y",
    algs: [
      "y' L' U2 R U' R' U2 L R U' R'",
      "r' U2 R2 B' R' B R' U2 r",
      "y F R U R' U' F' r U R' U R U2 r'",
      "L U L' U' L F L' U' L U L F' L2"
    ]
  },
  {
    name: 'ZBLL L 60',
    group: 'L5',
    setup: "F U R U2' R D R' U R D' R' U' R' U R U R' F' y",
    algs: [
      "y2 R U R' U F' R U2 R' U' R' U' R' F R U R",
      "y F U' R' U R D R' U R U D' F' R' U R",
      "R' U2 R2 U R' F' R U R' U' R' F R2 U' R' U' R' U2 R",
      "y' F R U' R' U' R U R' U R' D' R U' R' D R2 U R' U' F'"
    ]
  },
  {
    name: 'ZBLL L 61',
    group: 'L6',
    setup: "R U2' R2' U2' R' U R' U' R U2' R U2' R U2' R' y",
    algs: [
      "y' R2 U R' U R' U' R U' R' U' R U R U' R2",
      "y' R' U' R U' R' U R U' R' U2 R2 U R' U R U2 R'",
      "R U R' U R U' R' U R U2 R' L' U' L U' L' U2 L",
      "y' R U R' U R U2 R' U R' U2 R U R' U' R U R' U R"
    ]
  },
  {
    name: 'ZBLL L 62',
    group: 'L6',
    setup: "R' U' R U' R' U2' R U' R U R' U R U2' R' y'",
    algs: ["y R U2 R' U' R U' R' U R' U2 R U R' U R", "y R U2 R' U' R U' R' y R' U2 R U R' U R"]
  },
  {
    name: 'ZBLL L 63',
    group: 'L6',
    setup: "R' U2' R U R' U R U' R U2' R' U' R U' R' y'",
    algs: ["y R U R' U R U2 R' U R' U' R U' R' U2 R"]
  },
  {
    name: 'ZBLL L 64',
    group: 'L6',
    setup: "R2' U' R U' R U R' U R U R' U' R' U R2' y'",
    algs: [
      "y R2 U' R U R U' R' U' R U' R' U R' U R2",
      "y2 R' U2 R U R' U R2 U2 R' U' R U R' U' R U' R'",
      "y' R' U2 R2 U2 R U' R U R' U2 R' U2 R' U2 R"
    ]
  },
  {
    name: 'ZBLL L 65',
    group: 'L6',
    setup: "R U R' U R U2' R' U R' U' R U' R' U2' R",
    algs: ["R' U2 R U R' U R U' R U2 R' U' R U' R'", "y2 L' U2 L U L' U L U' L U2 L' U' L U' L'"]
  },
  {
    name: 'ZBLL L 66',
    group: 'L6',
    setup: "R2' U' R U R U' R' U' R U' R' U R' U R2' y2'",
    algs: [
      "y2 R2 U' R U' R U R' U R U R' U' R' U R2",
      "y2 R U R' U R U' R' U R U2 R2 U' R U' R' U2 R",
      "y' F' R U2 R' U2 R' F2 R2 U R' U' R U R' U' F'",
      "y2 R' U' R U' R' U2 R U' R U2 R' U' R U R' U' R U' R'"
    ]
  },
  {
    name: 'ZBLL L 67',
    group: 'L6',
    setup: "R U2' R' U' R U' R' U R' U2' R U R' U R",
    algs: ["R' U' R U' R' U2 R U' R U R' U R U2 R'", "y2 L' U' L U' L' U2 L U R U R' U R U2 R'"]
  },
  {
    name: 'ZBLL L 68',
    group: 'L6',
    setup: "R2' U R' U R' U' R U' R' U' R U R U' R2'",
    algs: [
      "R2 U R' U' R' U R U R' U R U' R U' R2",
      "y' R U2 R' U' R U' R2 U2 R U R' U' R U R' U R",
      "U2 R' U2 R' U' R2 U' R U R' U' R U2 R U' R",
      "y2 R U2 R2 U2 R' U R' U' R U2 R U2 R U2 R'"
    ]
  },
  {
    name: 'ZBLL L 69',
    group: 'L6',
    setup: "R' U2' R U R' U R U2' R' U' R U' R' U2' R",
    algs: [
      "y R U2 R' U' R U' R' U2 R U R' U R U2 R'",
      "R' U2 R U R' U R L' U' L U' L' U2 L",
      "y R U2 R' U' R U' R' L U L' U L U2 L'",
      "R' U2 R U R' U R U2 R' U' R U' R' U2 R"
    ]
  },
  {
    name: 'ZBLL L 70',
    group: 'L6',
    setup: "R' U' R U' R' U2' R U2' R' U2' R U R' U R",
    algs: [
      "y R U R' U R U2 R' U2 R U2 R' U' R U' R'",
      "R' U' R U' R' U2 R U2 R' U2 R U R' U R",
      "y R U R' U R U2 R' L U2 L' U' L U' L'",
      "R' U' R U' R' U2 R L' U2 L U L' U L"
    ]
  },
  {
    name: 'ZBLL L 71',
    group: 'L6',
    setup: "R U2' R' U' R U R' U' R U R' U' R U' R' y",
    algs: [
      "y' R U R' U R U' R' U R U' R' U R U2 R'",
      "y2 R' U' R U' R' U R U' R' U R U' R' U2 R",
      "y2 R' U2 R U R' U' R U R' U' R U R' U R",
      "y' r U r' U R U' R' U R U' R' U R U' R' r U' r'"
    ]
  },
  {
    name: 'ZBLL L 72',
    group: 'L6',
    setup: "R U2' R' L' U' L U' L' U2' L R U R'",
    algs: [
      "R U R' U R U' R' U R U2 R' U' R U2 R' U' R U' R'",
      "R U' R' L' U2 L U L' U L R U2 R'",
      "y' R U2 R' U2 R' U' R U R U' R' U2 R' U2 R",
      "R' U' R' F D' R U R' D R2 U' R' F' R"
    ]
  }
]
