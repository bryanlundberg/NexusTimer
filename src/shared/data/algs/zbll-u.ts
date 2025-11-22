import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

export const ZBLL_U_ALGS: AlgorithmCollection[] = [
  {
    name: 'ZBLL U 1',
    group: 'U1',
    setup: "L' U R U' L U R2' U2' R U R' U R",
    algs: [
      "R U' R' U' R U2 R' U' R' D' R U2 R' D R",
      "R' U' R U' R' U2 R2 U' L' U R' U' L",
      "y F R' F' U' F R S U R2 U' R' f'",
      "R' U' R U' R' U2 R2 U' r' F R' F' r"
    ]
  },
  {
    name: 'ZBLL U 2',
    group: 'U1',
    setup: "R U R' U R U2' R D R' U2' R D' R' U2' R' y",
    algs: [
      "y' R U2 R D R' U2 R D' R' U2 R' U' R U' R'",
      "z U R' D' R U' R' D U' R' U R' U' R2 U z'",
      "y2 R U' L' U R' U' L R' U' R U' R' U2 R",
      "y2 S R U' R' U' F' U2 F U R U' R' S'"
    ]
  },
  {
    name: 'ZBLL U 3',
    group: 'U1',
    setup: "R U2' R D r' U2' r D' R2' y2'",
    algs: [
      "y2 R2 D r' U2 r D' R' U2 R'",
      "R' U r' F R F' r U2 R' U R",
      "R' U2 R U R2 F' R U R U' R' F R",
      "L2 D l' U2 l D' L' U2 L'"
    ]
  },
  {
    name: 'ZBLL U 4',
    group: 'U1',
    setup: "R U2' R' U' R2' D R' U' R D' R2' y'",
    algs: [
      "y R U R2 D' R U R' D R2 U2 R'",
      "y R U R' U R U' R' U' R' F R U R U' R' F'",
      "y R2 D R' U R D' R2 U R U2 R'",
      "U R U R2 D' R U R' D R2 U2 R'"
    ]
  },
  {
    name: 'ZBLL U 5',
    group: 'U1',
    setup: "R U2' R' U2' R U R2' D' R U2' R' D R2' U2' R' y",
    algs: [
      "y' R U2 R2 D' R U2 R' D R2 U' R' U2 R U2 R'",
      "r U R' U R' D' R U R' D R U r' F R F'",
      "y2 S R2 S' D R' U2 R D' R U2 R2 U2 R",
      "y2 x' R U L' U2 R D' R' U R D R2 U L U' x"
    ]
  },
  {
    name: 'ZBLL U 6',
    group: 'U1',
    setup: "R U2' R D R' U2' R D' R2' y2'",
    algs: [
      "y2 R2 D R' U2 R D' R' U2 R'",
      "L2 D L' U2 L D' L' U2 L'",
      "U2 R2 D R' U2 R D' R' U2 R' U2",
      "x' R U' R' D R U2 R' D' R U' R' x"
    ]
  },
  {
    name: 'ZBLL U 7',
    group: 'U1',
    setup: "D R' U' R U2' R' U' R D' U' R U2' R' U R U R' y",
    algs: [
      "y2 R' D' r U2 r' D R U2 R U' R' U' R U' R'",
      "R U R' U' R U R2 D' R U R' D R2 U R' U' R U' R'",
      "R U R' F' U' F2 D R' U R' U' R D' F'",
      "y' R U' R' U' R U2 R' U D R' U R U2 R' U R D'"
    ]
  },
  {
    name: 'ZBLL U 8',
    group: 'U1',
    setup: "F R U R' U' R' F' U' R U R U' R' U' R' U R",
    algs: [
      "R' U' R U R U R' U' R' U F R U R U' R' F'",
      "U R' F' R U2 R' F R2 D2 r' U r D2 R'",
      "y2 R' U R D' R U R' D R2 U' R U R U2 R",
      "y R' F' R U2 R' F R2 u2 R' F R u2 R'"
    ]
  },
  {
    name: 'ZBLL U 9',
    group: 'U1',
    setup: "R' U' R U R' U R U' L U' R' U L' U R y'",
    algs: [
      "y' R U R' U R U' R' U F' R U2 R' U2 R' F R",
      "y2 R2 F2 R2 U R U2 R' U' R U R F2 R' U2 R'",
      "R D' R' U R2 D' r' D2 r' U' r2 D' R2",
      "y R U R2 D' R U' M' U2 r' D R2 U2 R'"
    ]
  },
  {
    name: 'ZBLL U 10',
    group: 'U1',
    setup: "R' U R' D' R U R' U2' R U R' D U R U' R y'",
    algs: [
      "y' R2 D' R U' R' D R2 U R' U R U2 R' U R U2 R' U' R",
      "y R2 U F' R2 U' R2 U' R2 U2 R2 U' F U' R2",
      "y R' U R' U' D' R U' R' U2 R U' R' D R U' R",
      "y2 R U2 R' U R U R2 D' r U2 r' D R2 U' R'"
    ]
  },
  {
    name: 'ZBLL U 11',
    group: 'U1',
    setup: "L U2' L' U R' U2' L U2' R U L' U R' U R y",
    algs: [
      "y R U R' U R U' R' U R U' R' U' L' U R U' R' L",
      "y R U R' U R U' R' U R U2 R' r U R' U' r' F R F'",
      "y R U R' U R U' R' U R U' R' U' r' F R F' M'",
      "y R' F R F' U R' D' r U' r' D U' F' U F R"
    ]
  },
  {
    name: 'ZBLL U 12',
    group: 'U1',
    setup: "R U' R2' D' R U' R' D R U2' R U' R' U' R U R' y",
    algs: [
      "y' R U' R' U R U R' U2 R' D' R U R' D R2 U R'",
      "R' U2 R U F' R' D U' R U R' D' U R F",
      "R F2 U' R2 U' R U2 R' U' R U' R U F2 R'",
      "y2 F U R F R' F R D R' D' F2 U' R' F'"
    ]
  },
  {
    name: 'ZBLL U 13',
    group: 'U2',
    setup: "R' U2' R' D' r U2' r' D R2'",
    algs: [
      "R2 D' r U2 r' D R U2 R",
      "y F U R U' R2 F' R2 U' R' F' U' F R U R'",
      "R2 D' L F2 L' D R U2 R",
      "R U R' U2 F U' F' U' R U' R' F U' F'"
    ]
  },
  {
    name: 'ZBLL U 14',
    group: 'U2',
    setup: "R' U2' R U R2' D' R U R' D R2' y'",
    algs: [
      "y R2 D' R U' R' D R2 U' R' U2 R",
      "R' U R U2 R D r' U2 r D' R'",
      "y R' U' R2 D R' U' R D' R2 U2 R",
      "R2 F' R U R' U' R' F R2 U' R' U2 R U2 R"
    ]
  },
  {
    name: 'ZBLL U 15',
    group: 'U2',
    setup: "R D R' U2' R D' R' U' R' U2' R U' R' U' R y2'",
    algs: [
      "y2 R' U R U R' U2 R U R D R' U2 R D' R'",
      "L U L' U L U2 L2 U R U' L U R'",
      "y2 R U R' U R U2 R2 U L U' R U L'",
      "y2 R' F R U R' F' M U' F2 U F r"
    ]
  },
  {
    name: 'ZBLL U 16',
    group: 'U2',
    setup: "R' U' R U' R' U2' R' D' R U2' R' D R U2' R y",
    algs: [
      "y' R' U2 R' D' R U2 R' D R U2 R U R' U R",
      "R U' R' U' R U R' U R U R2 F' R U R U' R' F",
      "y2 L' U R U' L U R' L U L' U L U2 L'",
      "R' U L U' R U L' R U R' U R U2 R'"
    ]
  },
  {
    name: 'ZBLL U 17',
    group: 'U2',
    setup: "R' U2' R' D' R U2' R' D R2'",
    algs: ["R2 D' R U2 R' D R U2 R", "y' F x R2 D2 R U R' D2 R U' R x' F'", "y2 L2 D' L U2 L' D L U2 L"]
  },
  {
    name: 'ZBLL U 18',
    group: 'U2',
    setup: "R' U2' R U2' R' U' R2' D R' U2' R D' R2' U2' R y",
    algs: [
      "y' R' U2 R2 D R' U2 R D' R2 U R U2 R' U2 R",
      "R' F' r U2 R' D R U' R' D' R2 U' r' F",
      "S R2 S' D' R U2 R' D R' U2 R2 U2 R'",
      "y F U R U2 R' U R U2 R2 F R F' R U' R' F'"
    ]
  },
  {
    name: 'ZBLL U 19',
    group: 'U2',
    setup: "D' R U R' U2' R U R' D U R' U2' R U' R' U' R y",
    algs: [
      "y' R' U R U R' U2 R y U2 R U' R' U2 R U' R'",
      "R D r' U2 r D' R' U2 R' U R U R' U R",
      "y' R' U R U R' U2 R U' D' R U' R' U2 R U' R' D",
      "R2 F2 r U' R U R' U M F R' F R2"
    ]
  },
  {
    name: 'ZBLL U 20',
    group: 'U2',
    setup: "R U2' R U R U' R2' D R' U R D' R U R'",
    algs: [
      "y2 F R U R' U' R2 D R' U' R D' R2 U' R U R' F'",
      "y R B R' U2 R B' R2 D2 r U' r' D2 R",
      "y2 F R U R2 D' R U' R' D R2 U' R' U' R U R' F'",
      "R U' R2 U' R2 F' R U R' U' R' F U2 R'"
    ]
  },
  {
    name: 'ZBLL U 21',
    group: 'U2',
    setup: "R2' U R U R2' U2' R2' D R' U R D' R U R'",
    algs: [
      "R2 D' R U2 R' U' D R' U' R2 U R U R2",
      "y' R2 D R' U R D' R2 U' R U' R' U2 R U' R' U2 R U R'",
      "R' U2 F U F' R F U2 R' U' R U F'",
      "R' U2 R U' R' U' R2 D r' U2 r D' R2 U R"
    ]
  },
  {
    name: 'ZBLL U 22',
    group: 'U2',
    setup: "L U L' U' L U' L' U R' U L U' R U' L' y",
    algs: [
      "y' R2 F' R U2 R U2 R' F U' R U R' U' R",
      "y R U L' U R' U' L U' R U R' U R U' R'",
      "R2 D' R U2 R' D R U' R' U' R' U' R' U R U R2",
      "r' B r U' r2 U R B2 R U R2 U r2"
    ]
  },
  {
    name: 'ZBLL U 23',
    group: 'U2',
    setup: "R' U R2' D R' U R D' R' U2' R' U R U R' U' R y",
    algs: [
      "y' R' U R U' R' U' R U2 R D R' U' R D' R2 U' R",
      "y R' U' R U' R' U R F U' R' U' R U F' R' U2 R",
      "R D R' U2 R D' R' U R' U R U' R' U' R U R' U' R",
      "y2 f U2 r F' R U R' U' R' F M U2 f'"
    ]
  },
  {
    name: 'ZBLL U 24',
    group: 'U2',
    setup: "R U' R2' F2' R U2' R U2' R' F2' U2' R U' R' y",
    algs: [
      "F U R U' R D R' U' R D' R2 U R U R' F'",
      "y R2 U' R2 U' R U2 D' R U' R' U' D R U R2",
      "y' R U R' U2 F2 R U2 R' U2 R' F2 R2 U R'",
      "y R' U' R U' R' U R U' R' U R U L U' R' U R L'"
    ]
  },
  {
    name: 'ZBLL U 25',
    group: 'U3',
    setup: "R' F R' F' R U R U' R' F R U' R' U R U R' F' R",
    algs: [
      "R' F R U' R' U' R U R' F' R U R' U' R' F R F' R",
      "R U' R2 U' R2 U R2 D' R2 U R2 U' R2 D R'",
      "R U' R2 U' R2 U R' F' R U R2 U' R' F R2",
      "R U' R' U F' r U' r' F2 R' F R F'"
    ]
  },
  {
    name: 'ZBLL U 26',
    group: 'U3',
    setup: "R U2' R D r' U2' r D' R2' U R' U2' R U R' U R y2'",
    algs: [
      "r2 F2 r U2 r U' L' U R' U R U' L",
      "y2 R' U' R U' R' U2 R U' R2 D r' U2 r D' R' U2 R'",
      "R2 D' R U2 R' D R U2 R' F R U R U' R' F' R U2 R' U2 R",
      "R' L' U2 L U2 R U' L' U R' U R U' L"
    ]
  },
  {
    name: 'ZBLL U 27',
    group: 'U3',
    setup: "F2' R' F' R U R U' R' F R U' R' U R U R' F2' y",
    algs: [
      "y' F2 R U' R' U' R U R' F' R U R' U' R' F R F2",
      "y R U R' U R U2 R2 F' R U R' U' R' F R2 U' R' U2 R",
      "y2 R' U R U' x' U L' U L U2 R U' R' U x",
      "y' F2 R U r U2 R2 F R F' R U2 r' R' F2"
    ]
  },
  {
    name: 'ZBLL U 28',
    group: 'U3',
    setup: "x' R2' U2' R' U2' l' U R U' L U' L' U R' y'",
    algs: [
      "R2 B2 R' B2 R' U R U' L U' L' U R'",
      "Lw2 F2 Lw' U2 Lw' U R U' L U' L' U R'",
      "R U R' U R U2 R' U R2 D' r U2 r' D R U2 R",
      "R2 D' R U2 R' D R U2 R2 U R' F' R U R' U' R' F R2 U' R'"
    ]
  },
  {
    name: 'ZBLL U 29',
    group: 'U3',
    setup: "R' U' R F R2' D' R U R' D R2' U' F' y",
    algs: [
      "y' F U R2 D' R U' R' D R2 F' R' U R",
      "y' R U R' B' R2 D R' U' R D' R2 U B",
      "R U R D R' U' R D' R2 U' R2 D' R U' R' D R U R",
      "R U R' U R U2 R' U2 R' U' R2 D R' U' R D' R2 U2 R"
    ]
  },
  {
    name: 'ZBLL U 30',
    group: 'U3',
    setup: "F U R2' D' R U' R' D R2' F' R' U R y",
    algs: [
      "y' R' U' R F R2 D' R U R' D R2 U' F'",
      "y' B' U' R2 D R' U R D' R2 B R U' R'",
      "y l' U' L U l F' L' F R U R' U' R' F R U R U' R' F'",
      "y' R' U' R F R' U R U' R' F' r U R U' r'"
    ]
  },
  {
    name: 'ZBLL U 31',
    group: 'U3',
    setup: "R' U2' R U R' U2' R U R2' F' R U R U' R' F R U' R' U' R y'",
    algs: [
      "y R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R' U2 R",
      "F U R U' R' S U f' R' f R U' R' f' R",
      "R' U2 F' R U R' U' R' F R2 F U' R' U' R U F'",
      "r2 U' r U r2 F2 R U R' F2 r F' U r2"
    ]
  },
  {
    name: 'ZBLL U 32',
    group: 'U3',
    setup: "R' U' R U' R2' U2' R U R2' F' R U R U' R' F R2' y",
    algs: [
      "y' R2 F' R U R' U' R' F R2 U' R' U2 R2 U R' U R",
      "R U' R' U R U' L U L' U x' U2 R U2 R2 x",
      "R2 D' R U2 R' D R U2 R2 U R' U' R' F R2 U' R' U' R U R' F'",
      "f R' F2 R S' R' U' F U r U2 R U' r'"
    ]
  },
  {
    name: 'ZBLL U 33',
    group: 'U3',
    setup: "R2' D' R U2' R' D R U2' R U R' U2' R U R' U R y'",
    algs: [
      "y F U R U2 R' U R U R2 F' r U R U' r'",
      "y R' U' R U' R' U2 R U' R' U2 R' D' R U2 R' D R2",
      "y' R' U2 R2 L U2 L' U' L U2 R2 U L' R",
      "y' R' U2 R' U' F' U F R2 U' R' F R' F' R2"
    ]
  },
  {
    name: 'ZBLL U 34',
    group: 'U3',
    setup: "R2' D R' U2' R D' R' U2' R' U' R U2' R' U' R U' R' y'",
    algs: [
      "y' R U2 R' U2 R' F R U R U2 R' U' R U2 R' U' F'",
      "y R U R' U R U2 R' U R U2 R D R' U2 R D' R2",
      "y2 F R2 U R' D R2 D' R U' R2 F' R U' R'",
      "y R2 D' R U' R' D R2 U R' F R U R' U' R' F' R2"
    ]
  },
  {
    name: 'ZBLL U 35',
    group: 'U3',
    setup: "F U R U2' R' U R U R2' F' r U R U' r' y",
    algs: [
      "y' r U R' U' r' F R2 U' R' U' R U2 R' U' F'",
      "L U L' F U' R U2 L U2 L' U2 R' U F'",
      "y' R2 F R F' R U R2 F' U' F U R U2 R",
      "y' R2 D' R U2 R' D R U2 R U R' U2 R U R' U R"
    ]
  },
  {
    name: 'ZBLL U 36',
    group: 'U3',
    setup: "R U R' U R U2' R' U R U2' R D R' U2' R D' R2' y",
    algs: [
      "R2 F R U R U' R' F' R U' R2 D' R U R' D R2",
      "y F U R U2 R' U R U2 R' U' R' F' R U2 R U2 R'",
      "y' R2 D R' U2 R D' R' U2 R' U' R U2 R' U' R U' R'",
      "U' S' U F R' F' R2 U' R' U2 R B U2 B' R' S"
    ]
  },
  {
    name: 'ZBLL U 37',
    group: 'U4',
    setup: "R U R' L' U2' R U' R' U2' L U R U' R' y2'",
    algs: [
      "y2 R U R' U R U R' U2 R U' R2 D' R U' R' D R",
      "y2 R U R' U' L' U2 R U R' U2 L R U' R'",
      "L U L' F' U L U L' U' F U' L U' L'",
      "y2 F U R U' R' S' R U' R' S U R U2 R' U' F'"
    ]
  },
  {
    name: 'ZBLL U 38',
    group: 'U4',
    setup: "R' U2' R' D' R U2' R' D R' U R' U R U2' R' y",
    algs: [
      "R U R' U R U' R' U2 R' D' R U2 R' D R2 U' R'",
      "y' R U2 R' U' R U' R D' R U2 R' D R U2 R",
      "y f R' f' R' f' R U R' S U' R' F R2",
      "R2 B2 R' U2 R' U' R2 B2 R2 U' R B2 R'"
    ]
  },
  {
    name: 'ZBLL U 39',
    group: 'U4',
    setup: "R' U' R U' F U' R' U R U F' R' U R",
    algs: [
      "R' U' R U2 R' F' R U R' U' R' F R2 U2 R' U R",
      "R' U' R F U' R' U' R U F' U R' U R",
      "R' U' R U' R' U' R U2 R' U R2 D R' U R D' R'",
      "R' U' R U L U2 R' U' L' U' L R U2 L'"
    ]
  },
  {
    name: 'ZBLL U 40',
    group: 'U4',
    setup: "R U2' R D R' U2' R D' R U' R U' R' U2' R y",
    algs: [
      "y R2 D' R U2 R' D R U2 R U R' U' R U' R' U2 R",
      "y' R' U2 R U R' U R' D R' U2 R D' R' U2 R'",
      "y2 R' U' R U' R' U R U2 R D R' U2 R D' R2 U R",
      "y2 R U R' U' R' U' F U R2 U' R2 F' R U R U' R'"
    ]
  },
  {
    name: 'ZBLL U 41',
    group: 'U4',
    setup: "x' R U2' R D2' R' U2' R D2' R2' x",
    algs: [
      "x' R2 D2 R' U2 R D2 R' U2 R' x",
      "y2 R U' D' R' D' R U2 R' D R U' D R'",
      "y2 x L2 D2 L' U2 L D2 L' U2 L'",
      "y' F U2 R' D' R U2 R' D R F'"
    ]
  },
  {
    name: 'ZBLL U 42',
    group: 'U4',
    setup: "x R' U2' R' D2' R U2' R' D2' R2' x' y2'",
    algs: [
      "y2 x R2 D2 R U2 R' D2 R U2 R x'",
      "y2 R' F2 R U2 R U2 R' F2 R U2 R'",
      "R' U D R D R' U2 R D' R' U D' R",
      "U R U R2 U' R' F R U R2 U' R' F'"
    ]
  },
  {
    name: 'ZBLL U 43',
    group: 'U4',
    setup: "F R U R' U' R U' R' U' R U R' F'",
    algs: [
      "F R U' R' U R U R' U R U' R' F'",
      "R U R' U' R' F2 R2 U' R' U' R U R' F2",
      "R' U' R f R' U R U' R U R' U' f'",
      "y2 R U R' U' R' F R F' R' U' F' U F R"
    ]
  },
  {
    name: 'ZBLL U 44',
    group: 'U4',
    setup: "F' U' F U R' F R2' U R' U' R' F' R2' U R' y2'",
    algs: [
      "y2 R U' R2 F R U R U' R2 F' R U' F' U F",
      "y F' R U R' U' R' F R2 U R' U2 R U R' U2 R U' R'",
      "y R U2 F R U R U' R U R2 U' F' U2 R'",
      "y' R U' R' U R' D' R U' R' D F R f' R U R' S"
    ]
  },
  {
    name: 'ZBLL U 45',
    group: 'U4',
    setup: "R' U R2' D R' U R D' R' U R' U' R U' R' U' R y",
    algs: [
      "R U R' U R' D' R U2 R' D R2 U' R' U2 R U2 R'",
      "y' R' U2 R U R' U R' D r' U2 r D' R' U2 R'",
      "y' R' U R U R' U R U' R D R' U' R D' R2 U' R",
      "y R' U' R U' R' U2 R F l' U' L U R U' r'"
    ]
  },
  {
    name: 'ZBLL U 46',
    group: 'U4',
    setup: "R U' R2' D' R U' R' D R U' R U R' U R U R' y",
    algs: [
      "y' R U' R' U' R U' R' U R' D' R U R' D R2 U R'",
      "y F' r U R' U' r' F R2 U R' U R U2 R'",
      "y R U R' U R U2 R' U' R2 D' R U' R' D R U R",
      "y' R U2 R' U' R U' R D' r U2 r' D R U2 R"
    ]
  },
  {
    name: 'ZBLL U 47',
    group: 'U4',
    setup: "R' U' R' D' R U R' D R U' R U' R' U2' R",
    algs: [
      "R' U2 R U R' U R' D' R U' R' D R U R",
      "R' U2 R U R D R' U' R D' R' U R' U R",
      "R' U2 R U R' U R U' F' r U R' U' r' F R",
      "y2 R U2 r' F R' F' r U2 r' F R F' M'"
    ]
  },
  {
    name: 'ZBLL U 48',
    group: 'U4',
    setup: "R F R' U R U2' R' U R U F' R'",
    algs: [
      "y2 R U2 R' U' R U' R D R' U R D' R' U' R'",
      "R F U' R' U' R U2 R' U' R F' R'",
      "L U2 L' U' L U' L' R U R' U' R' F R U R U' R' F'",
      "y2 R U2 R' U' R U' R' U' F R' F' r U R U' r'"
    ]
  },
  {
    name: 'ZBLL U 49',
    group: 'U5',
    setup: "R2' D R' U' R D' R' U' R' U R U R'",
    algs: [
      "R U' R' U' R U R D R' U R D' R2",
      "y F' U L U' L' U' F L U2 L'",
      "R U' R' U' R U2 R2 D' R U R' D R",
      "R' D R2 U' R' U' R U2 R2 D' R"
    ]
  },
  {
    name: 'ZBLL U 50',
    group: 'U5',
    setup: "R' U' F' U F R U F U R U' R' U R U' R' F' y",
    algs: [
      "y' F R U R' U' R U R' U' F' U' R' F' U' F U R",
      "y' R U2 R2 D' R U' R' D R U' R' F R U R U' R' F'",
      "y S' R' U R S R' U2 R' F R F' U R",
      "y2 M U' M' F U R U' R' F' M U M'"
    ]
  },
  {
    name: 'ZBLL U 51',
    group: 'U5',
    setup: "L' R U R' U R U R' U2' L R U' R'",
    algs: [
      "R U R' L' U2 R U' R' U' R U' R' L",
      "R U R' U L' U R U' R' L U' R U' R'",
      "S' R' U' R S R' U F' U' F U R",
      "R U R' U R' F R F' U' S' R U' R' S"
    ]
  },
  {
    name: 'ZBLL U 52',
    group: 'U5',
    setup: "F U' R' U R U F' R' U2' R",
    algs: [
      "R2 D' R U R' D R U R U' R' U' R",
      "R' U2 R F U' R' U' R U F'",
      "R' U2 R U2 R' F' R U R' U' R' F R2",
      "R D' R2 U2 R U' R' U' R2 D R' U"
    ]
  },
  {
    name: 'ZBLL U 53',
    group: 'U5',
    setup: "F U R U2' R' U R U R' U R U2' R' U R U R' F'",
    algs: [
      "F U R U2 R' U R U R' U R U2 R' U R U R' F'",
      "F R U' R' U' R U2 R' U' R U' R' U' R U2 R' U' F'",
      "y2 f U2 R2 U2 R2 U' S R2 S' U' R2 f'",
      "y2 F U2 R2 U2 R2 U' S R2 S' U' R2 F'"
    ]
  },
  {
    name: 'ZBLL U 54',
    group: 'U5',
    setup: "F U R U' R' F' R U R' U' M' U R U' r' y",
    algs: [
      "y' r U R' U' M U R U' R' F R U R' U' F'",
      "R' F' M U' M' F M U r",
      "R' F' U' F U F R S R' F' R S'",
      "S' R U R' S R U' R2 F' U' F U R"
    ]
  },
  {
    name: 'ZBLL U 55',
    group: 'U5',
    setup: "M' U' R U R' U M F R' F' R2' U2' R' y",
    algs: [
      "y' r U2 R2 F R F' U2 r' R U R U' R'",
      "y R U R' U' M' U R2 B' R' B U' r'",
      "y' R U2 R2 F R F' M' U' R U' R' U M",
      "y' F R U R' U' f' R U R' S R U' R'"
    ]
  },
  {
    name: 'ZBLL U 56',
    group: 'U5',
    setup: "L' U' L U' L' R U' R' U2' L R U' R' y'",
    algs: [
      "y' R' U2 R F U' R' U R U R' U R U' F'",
      "y R' D R2 U' R' U R U2 R' U' R U R2 D' R",
      "y R' U' R U' R' L U' R U R' L' U2 R",
      "y' R' U' F R' F' R2 S' R' U R S"
    ]
  },
  {
    name: 'ZBLL U 57',
    group: 'U5',
    setup: "F' U L U' L' U' F L U2' L'",
    algs: [
      "y' R' D' R U' R' D R2 U2 R' U R U R'",
      "y2 R2 D R' U' R D' R' U' R' U R U R'",
      "y2 R' D R2 U2 R' U R U R2 D' R",
      "L U2 L' F' U L U L' U' F"
    ]
  },
  {
    name: 'ZBLL U 58',
    group: 'U5',
    setup: "R B' R2' F R2' B R2' F' R F U R U' R' F' y'",
    algs: [
      "M' U R' U' F' U F R2 U R' U R U2 r'",
      "F U R U2 R2 U2 R U R' U R U2 R U R' F'",
      "M U' M' F R U R' U' F' M U M'",
      "y F' U' L' U L F2 U R U' R' U R U' R' F'"
    ]
  },
  {
    name: 'ZBLL U 59',
    group: 'U5',
    setup: "R' U2' R U L U2' R' U' R U2' L'",
    algs: [
      "y2 R' U R U R' U' R' D' R U' R' D R2",
      "y' F U' R' U R U F' R' U2 R",
      "y2 R' U R U R' U2 R2 D R' U' R D' R'",
      "L' U L U L' U2 L2 D L' U' L D' L'"
    ]
  },
  {
    name: 'ZBLL U 60',
    group: 'U5',
    setup: "R U R' U L' U R U' R' L U' R U' R' y2'",
    algs: [
      "y2 R' U' F' U F U' R S' R' U R S",
      "y2 L' R U R' U R U R' U2 R L U' R'",
      "y2 R' U' R U' F U' R' U R U R' U R U' F'",
      "L' U' L R U2 L' U L U L' U L R'"
    ]
  },
  {
    name: 'ZBLL U 61',
    group: 'U6',
    setup: "R U R' U R U2' R' U' R U2' R' U' R U' R' y2'",
    algs: [
      "y' R' U' R U R' U R U2 R' U R U2 R' U' R",
      "y2 R U R' U R U2 R' U R U2 R' U' R U' R'",
      "L U L' U L U2 L' U L U2 L' U' L U' L'",
      "U2 R U R' U R U2 R' U R U2 R' U' R U' R'"
    ]
  },
  {
    name: 'ZBLL U 62',
    group: 'U6',
    setup: "R U' R' U2' R U R' U2' R U R' U R U' R' y",
    algs: [
      "y' R U R' U' R U' R' U2 R U' R' U2 R U R'",
      "R' U' R U' R' U2 R U' R' U2 R U R' U R",
      "y2 L' U' L U' L' U2 L U' L' U2 L U L' U L",
      "y L U L' U' L U' L' U2 L U' L' U2 L U L'"
    ]
  },
  {
    name: 'ZBLL U 63',
    group: 'U6',
    setup: "R U2' R' U' R U' R' U R U R' U R U2' R' y'",
    algs: ["y R U2 R' U' R U' R' U' R U R' U R U2 R'"]
  },
  {
    name: 'ZBLL U 64',
    group: 'U6',
    setup: "R U R' U R U' R' U R' U' R2' U' R2' U2' R y'",
    algs: [
      "y R' U2 R2 U R2 U R U' R U R' U' R U' R'",
      "y' r' F2 r2 U' r' F r' F U' F U r",
      "U R' U2 R2 U R2 U R U' R U R' U' R U' R'",
      "y2 R' U' R U R U' R' U' R U' R' U R' U R2 U R'"
    ]
  },
  {
    name: 'ZBLL U 65',
    group: 'U6',
    setup: "R' U2' R U R' U R U' R' U' R U' R' U2' R y'",
    algs: [
      "y R' U2 R U R' U R U R' U' R U' R' U2 R",
      "y' L' U2 L U L' U L U' R' U' R U' R' U2 R",
      "y' L' U2 L U L' U L U L' U' L U' L' U2 L"
    ]
  },
  {
    name: 'ZBLL U 66',
    group: 'U6',
    setup: "R' U' R U' R' U R U' R U R2' U R2' U2' R' y'",
    algs: [
      "y R U2 R2 U' R2 U' R' U R' U' R U R' U R",
      "U' L U2 L2 U' L2 U' L' U L' U' L U L' U L",
      "y R U2 R2 F R F' R U' B U' B' R'",
      "y R' U R U' R' U R U' R' U R' U' R2 U' R2 U2 R2"
    ]
  },
  {
    name: 'ZBLL U 67',
    group: 'U6',
    setup: "R U R2' U' R2' U' R2' U2' R U' R U' R' y2'",
    algs: [
      "y2 R U R' U R' U2 R2 U R2 U R2 U' R'",
      "y2 R U R' U R' U' R U' R' U2 R U2 R U2 R'",
      "y2 R U R' U R' U' R U R U2 R' U2 R' U2 R",
      "y2 R U R' U' L' U' L U' R U2 R' L' U2 L"
    ]
  },
  {
    name: 'ZBLL U 68',
    group: 'U6',
    setup: "R' U' R2' U R2' U R2' U2' R' U R' U R",
    algs: [
      "R' U' R U' R U2 R2 U' R2 U' R2 U R",
      "R' U' R U' R U R' U' R' U2 R U2 R U2 R'",
      "R' U' R U' R U R' U R U2 R' U2 R' U2 R",
      "R' U' R U' R U R2 U' R2 U R2 U R2 U' R'"
    ]
  },
  {
    name: 'ZBLL U 69',
    group: 'U6',
    setup: "R U2' R' U' R U' R2' U2' R U R' U R",
    algs: [
      "R' U' R U' R' U2 R2 U R' U R U2 R'",
      "y2 L' U' L U' L' U2 L U2 R U R' U R U2 R'",
      "y2 L' U' L U' L' U2 L2 U L' U L U2 L'"
    ]
  },
  {
    name: 'ZBLL U 70',
    group: 'U6',
    setup: "R' U2' R U R' U R2' U2' R' U' R U' R' y2'",
    algs: [
      "y2 R U R' U R U2 R2 U' R U' R' U2 R",
      "L U L' U L U2 L2 U' L U' L' U2 L",
      "R U R' U' R U' R' U2 R U' R' U2 R U' R' U' R U' R'"
    ]
  },
  {
    name: 'ZBLL U 71',
    group: 'U6',
    setup: "R2' U R2' U R U' R' U R2' U2' R' U R' U R U' R'",
    algs: [
      "R U R' U' R U' R U2 R2 U' R U R' U' R2 U' R2",
      "x' R2 D2 R' U' R D2 R2 D R U R' D' x",
      "y2 R' U2 R U R' U R U2 R U2 R2 U' R2 U' R2 U2 R",
      "y2 R' U' R U R U' R' U' R' U R U' R U' R' U2 R U R'"
    ]
  },
  {
    name: 'ZBLL U 72',
    group: 'U6',
    setup: "R' U' R U' R' U2' R U2' R U R' U R U2' R' y'",
    algs: [
      "y R U2 R' U' R U' R' L' U2 L U L' U L",
      "y R U2 R' U' R U' R' U2 R' U2 R U R' U R",
      "y R' F' R U R' U' R' F D' R U R' D R2",
      "F R' F' r U R U' R' U R U' r' F R' F' R"
    ]
  }
]
