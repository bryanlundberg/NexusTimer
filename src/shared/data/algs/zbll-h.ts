import { AlgorithmCollection } from '@/interfaces/AlgorithmCollection'

export const ZBLL_H_ALGS: AlgorithmCollection[] = [
  {
    name: 'ZBLL H 1',
    group: 'H1',
    setup: "R U R' U R U2' R2' F' r U R U' r' F y'",
    algs: [
      "y F' r U R' U' r' F R2 U2 R' U' R U' R'",
      "R U2 R' U' R U' R' F R U' R' U' R U2 R' U' F'",
      "y R' U' F' U F R U R U R' U' R' F R F'",
      "y2 R U R' U' R' F R U R U' R' F' R U R' U R U2 R'"
    ]
  },
  {
    name: 'ZBLL H 2',
    group: 'H1',
    setup: "R U R D R' U' R D' R2' U R U2' R' U' R U' R' y",
    algs: [
      "y' F R' F' r U R U' r2 F2 r U L' U L",
      "y' R U R' U R U2 R' U' R2 D R' U R D' R' U' R'",
      "y2 L' R U R' U R U' R' U2 L U' R U2 R'",
      "y2 R U R' U' R' F R U R U' R' F' U' R' U2 R U R' U R"
    ]
  },
  {
    name: 'ZBLL H 3',
    group: 'H1',
    setup: "R' U' R' D' R U R' D R' U R' U R U2' R'",
    algs: [
      "y' R U2 R' U' R U R' U2 R' F R2 U' R' U' R U R' F'",
      "y R U R D R' U R' U' R U R2 D' R U' R U' R'",
      "R U2 R' U' R U' R D' R U' R' D R U R",
      "y' R' U2 R2 B' U R2 U R2 U' B U' R'"
    ]
  },
  {
    name: 'ZBLL H 4',
    group: 'H1',
    setup: "R' U' F U' R2' U R2' U F' R2' U2' R' y",
    algs: [
      "y F' R U2 R' U2 R' F U' R U R U' R' U' R' U R",
      "y2 R' U2 R U R' U R' D R' U R D' R' U' R'",
      "y R' D R2 U' R2 D' R U' R' D R2 U2 R2 D' R",
      "y' R U2 R2 F U' R2 U' R2 U F' U R"
    ]
  },
  {
    name: 'ZBLL H 5',
    group: 'H1',
    setup: "R2' F2' r U r' F R2' U2' B' R B R' y",
    algs: [
      "y2 R' U2 R2 U R2 U R U2 R' F R U R U' R' F'",
      "R U R' U R U' R' U R U' R2 F' R U R U' R' F R U' R'",
      "R' F' R U R' U' R' F D' R U' R' D R U2 R",
      "y R U2 R' U L' U2 R U2 R' U2 L R U' R'"
    ]
  },
  {
    name: 'ZBLL H 6',
    group: 'H1',
    setup: "R U2' R' U F2' R U2' R' U2' R' F2' R2' U R' y",
    algs: [
      "y' R U2 R' U' R U R' U' F' R U R' U' R' F R2 U' R'",
      "y' r U2 R' U' R U' r' U R U2 R' U2 R' F R F'",
      "y R' U2 R U' L U2 R' U2 R U2 L' R' U R",
      "L F L' U' L U L F' D L' U L D' L' U2 L' U'"
    ]
  },
  {
    name: 'ZBLL H 7',
    group: 'H1',
    setup: "R U2' R2' U' R U' R' U2' F R U R U' R' F' y",
    algs: [
      "R U R' U R U' R2 F' R U2 R U2 R' F R U' R'",
      "y R' D' R U2 R' D R U R U2 R' U R U' R' U' R U' R'",
      "y' F R U R' U' R' F' U2 R U R' U R2 U2 R'",
      "y2 F R U' R' U' R U2 R' U' F' R U2 R' U' R U' R'"
    ]
  },
  {
    name: 'ZBLL H 8',
    group: 'H1',
    setup: "F U R U' R' U R U2' R' U' R U R' F' y2'",
    algs: ["y2 F R U' R' U R U2 R' U' R U R' U' F'", "y2 f R U R' U' f' R U R' U' R' F R F'"]
  },
  {
    name: 'ZBLL H 9',
    group: 'H1',
    setup: "R' U' F R' F' R U' R U R' F U R U' R' F' R",
    algs: [
      "y2 F R' F' R2 U2 R' U R U2 R' U R U' R2 F R F'",
      "R F R2 U' R2 U' R2 U2 R2 U' F' R'",
      "y' R' U R D' R U R' U2 R U R' U D R' U' R",
      "R' F R U R' U' F' R U' R' U R' F R F' U R"
    ]
  },
  {
    name: 'ZBLL H 10',
    group: 'H1',
    setup: "R' U' F' R U R' U' R' F R2' U2' R' U2' R y",
    algs: [
      "y' R' U2 R U2 R2 F' R U R U' R' F U R",
      "y L' U2 M' x' D R2 U R2 u' R2 B",
      "y l F l2 U2 F l U2 l2 U' l2 U2 l' U2 l",
      "F' B L2 B' L2 U L2 U L2 U' L2 F"
    ]
  },
  {
    name: 'ZBLL H 11',
    group: 'H1',
    setup: "R U R' U R U' R' U' R' F' R U2' R U2' R' F y'",
    algs: [
      "y F' R U2 R' U2 R' F R U R U R' U' R U' R'",
      "y2 f R2 S' U' R2 U' R2 U R2 F'",
      "F B' R2 B R2 U' R2 U' R2 U R2 F'",
      "U L U2 L' U2 L2 F L' U' L' U L F' U' L'"
    ]
  },
  {
    name: 'ZBLL H 12',
    group: 'H1',
    setup: "F U' R U' R' U R U R' U2' R U2' R' U F'",
    algs: [
      "F U' R U2 R' U2 R U' R' U' R U R' U F'",
      "y' R D' R U2 R' U2 R U' R' U' R U R' D R'",
      "y f U2 R F R' F' R U2 R U2 R2 U2 f'",
      "L' F' L2 U L2 U L2 U2 L2 U F L"
    ]
  },
  {
    name: 'ZBLL H 13',
    group: 'H2',
    setup: "R2' D R' U2' R D' R2' U' R2' D R' U' R D' R2' y2'",
    algs: [
      "y' R' U2 R U R' U' F' R U R' U' R' F R U2 R",
      "y2 R2 D R' U R D' R2 U R2 D R' U2 R D' R2",
      "y r U R' U R U2 r2 F' r U' L' U L U L F' L' F",
      "L2 D L' U L D' L2 U L2 D L' U2 L D' L2"
    ]
  },
  {
    name: 'ZBLL H 14',
    group: 'H2',
    setup: "R U R' U R2' D R' U' R D' R2' U R U2' R' y",
    algs: [
      "y' R U2 R' U' R2 D R' U R D' R2 U' R U' R'",
      "y R' U2 R2 U R D' R U R' D R' U2 R'",
      "y' L' U2 L2 U L D' L U L' D L' U2 L'",
      "y2 R2 D R' U2 R D' R U' R2 U' R2 U2 R"
    ]
  },
  {
    name: 'ZBLL H 15',
    group: 'H2',
    setup: "R2' D' R U2' R' D R2' U R2' D' R U R' D R2' y2'",
    algs: [
      "y2 R2 D' R U' R' D R2 U' R2 D' R U2 R' D R2",
      "R' U2 R U R' U R2 y R U' R' U' R U2 R' U' F'",
      "y' R' U L' U' R U2 L U' L' U' L U L' U' L",
      "y L' U R' U' L U2 R U' R' U' R U R' U' R"
    ]
  },
  {
    name: 'ZBLL H 16',
    group: 'H2',
    setup: "R' U2' R' D R' U R D' R U R2' U2' R' y",
    algs: [
      "y R' U2 R U R2 D' R U' R' D R2 U R' U R",
      "y2 R2 D' R U2 R' D R' U R2 U R2 U2 R'",
      "y' R U2 R2 U' R' D R' U' R D' R U2 R",
      "y L U2 L2 U' L' D L' U' L D' L U2 L"
    ]
  },
  {
    name: 'ZBLL H 17',
    group: 'H2',
    setup: "L U' R' U L' U R2' U R2' U R U' R U' R' y2'",
    algs: [
      "F R' F' R U2 R U2 R' U' R' F2 r U r' F R",
      "y2 R U R' U R' U' R2 U' R2 U' L U' R U L'",
      "y R' D' R U R' D R2 U R' U2 R U2 R' U R U2 R'",
      "R' U2 R' D' R2 D2 R' U R D2 R' U R' D R2"
    ]
  },
  {
    name: 'ZBLL H 18',
    group: 'H2',
    setup: "L' U R U' L U' R2' U' R2' U' R' U R' U R y2'",
    algs: [
      "y2 R' U' R U' R' U F' R U R' U' R' F R2 U' R' U R",
      "y2 R' U' R U' R U R2 U R2 U L' U R' U' L",
      "U' R' U' R F D R' U R U' R' U R D' R' U' R F'",
      "R U2 R D R2 D2 R U' R' D2 R U' R D' R2 U"
    ]
  },
  {
    name: 'ZBLL H 19',
    group: 'H2',
    setup: "R2' U R' U' R' U2' R' U2' R U R' D R' U R D'",
    algs: [
      "y' F R U' R' U' R U2 R' U' F' U R U R' U R U2 R'",
      "y' R' U' R f U R U2 R' U2 R' U2 R2 U R' f'",
      "y R U R' U' R' U2 R2 D R' U R D' R2 U R2 U2 R'",
      "R' U' R D' R U' R' U2 R U2 R U R U' R2 D"
    ]
  },
  {
    name: 'ZBLL H 20',
    group: 'H2',
    setup: "F U R U2' R' U R U R' F' R U2' R' U' R U' R' y'",
    algs: [
      "y R U R' U R U2 R' F R U' R' U' R U2 R' U' F'",
      "y2 R2 D' r U2 r' D R' U R2 U R2 U2 R'",
      "y R U' L U L2 R' U2 L U L' U L U L U' L'",
      "y' L U' R U R2 L' U2 R U R' U R U R U' R'"
    ]
  },
  {
    name: 'ZBLL H 21',
    group: 'H2',
    setup: "L U' R' U L' U R U R' U R",
    algs: [
      "R' F' R U2 R U2 R' F U' R U' R'",
      "R' U' R U' R' U' L U' R U L'",
      "R' U' R2 D R' U2 R D' R' U R' U2 R",
      "y2 L' U' L U' L' U' R U' L U R'"
    ]
  },
  {
    name: 'ZBLL H 22',
    group: 'H2',
    setup: "L' U R U' L U' R' U' R U' R'",
    algs: [
      "R U R' U R U r' F R' F' r",
      "R U R' U R U L' U R' U' L",
      "y R' F R U R' U' R' F' R U' R U R' U R",
      "R U R2 D' R U2 R' D R U' R U2 R'"
    ]
  },
  {
    name: 'ZBLL H 23',
    group: 'H2',
    setup: "r' U r U r' U' r U R2' F R F' R y'",
    algs: [
      "y R' F R' F' R2 U' r' U r U' r' U' r",
      "y R U R' U R U2 R D' R U' R' D R U R",
      "y R U' L' U R2 U' R L U2 R' U' R",
      "y l' U R' U' x' R2 U' r' U r U' r' U' r"
    ]
  },
  {
    name: 'ZBLL H 24',
    group: 'H2',
    setup: "r U' r' U' r U r' U' l R U' R' U l' y",
    algs: [
      "y' R U R2 F R F' r U' r' U r U r'",
      "y' l U' R U R' l' U r U' r' U r U r'",
      "y R U2 R' U' R U' R' U L' U R U' L U R'",
      "y' R' U' R U' R' U2 R' D R' U R D' R' U' R'"
    ]
  },
  {
    name: 'ZBLL H 25',
    group: 'H3',
    setup: "F R' U R U2' R2' U' R U2' R' U' R2' U F'",
    algs: [
      "y' R' U' R y U' R U' R' U R l U' R' U l'",
      "F' U' F U' R U' R' U R l U' R' U l'",
      "F U' R2 U R U2 R' U R2 U2 R' U' R F'",
      "y2 R' F R' F' R2 U R' U' R U' f R' f'"
    ]
  },
  {
    name: 'ZBLL H 26',
    group: 'H3',
    setup: "R U R' L' U2' R U R' U2' L R U2' R' U' R U' R' y",
    algs: [
      "y R U' R2 U' F2 U' R2 U R2 U F2 R2 U R'",
      "y r U2 R2 F R F' R U2 r' L' U2 L U L' U L",
      "y' F R U R' U' R U R' U' F' U R' F' U' F U R",
      "y r U2 R2 F R F' R U2 r' U2 R' U2 R U R' U R"
    ]
  },
  {
    name: 'ZBLL H 27',
    group: 'H3',
    setup: "F U R U' R' U R U' R' U R U' R' F' y'",
    algs: [
      "y F R U R' U' R U R' U' R U R' U' F'",
      "y F U R U' R' U R U' R' U R U' R' F'",
      "y f U R U' R' U R U' R' U R U' R' f'",
      "y f R U R' U' R U R' U' R U R' U' f'"
    ]
  },
  {
    name: 'ZBLL H 28',
    group: 'H3',
    setup: "x' U' R U' R' U R' F2' R U' R U R' U x",
    algs: [
      "x' U' R U' R' U R' F2 R U' R U R' U x",
      "R U' L' U R' U' L R U' L' U R' U' L",
      "R U' r' F R' F' r R U' r' F R' F' r",
      "F R' F R F' R U2 R' F R' F' R F'"
    ]
  },
  {
    name: 'ZBLL H 29',
    group: 'H3',
    setup: "R' U' R U' L U' R' U L' U2' R2' U2' R' U' R U' R'",
    algs: [
      "R' U2 R U R' U R U R' U' R U R' F' R U R' U' R' F R2",
      "R' U2 R U R' U R U' r U2 R2 F R F' R U2 r'",
      "L' U L U' L' U' L U R' U' R U L' U' L U2 R' U' R",
      "R U R' U R U2 R2 U2 L U' R U L' U R' U R"
    ]
  },
  {
    name: 'ZBLL H 30',
    group: 'H3',
    setup: "R U R' U L' U R U' L U2' R2' U2' R U R' U R",
    algs: [
      "R' U' R U' R' U2 R2 U2 L' U R' U' L U' R U' R'",
      "R U' R' U R U R' U' L U L' U' R U R' U2 L U L'",
      "R' F2 r2 U' r' F r' F2 R2 U R' U R U2 R'",
      "r D r2 U' F2 r U2 L' U2 r' D' r F L2"
    ]
  },
  {
    name: 'ZBLL H 31',
    group: 'H3',
    setup: "L U2' R' U R U2' L' R' U R U' R' U2' R U R' U R y",
    algs: [
      "R' U' F' U F R U' F U R U' R' U R U' R' F'",
      "y' R' U' R U' R' U2 R U R' U' R U R' F' R U R' U' R' F R2",
      "y R U' R2 F2 U' R2 U' R2 U F2 U R2 U R'",
      "y R' U2 R F' r' F r U F U' R' U2 F R F'"
    ]
  },
  {
    name: 'ZBLL H 32',
    group: 'H3',
    setup: "R' F R' F' R2' U R' U' R y U' R U' R' y",
    algs: [
      "y' R U R' U y' R' U R U' R2 F R F' R",
      "F R' U R U2 R2 U' R U2 R' U' R2 U F'",
      "y2 f R f' U R' U R U' R2 F R F' R",
      "y' F U F' U2 L2 U' L2 U' L2 U2 L2 F U' F'"
    ]
  },
  {
    name: 'ZBLL H 33',
    group: 'H4',
    setup: "R U2' R' U' R U R' U' R U' R'",
    algs: ["R U R' U R U' R' U R U2 R'"]
  },
  {
    name: 'ZBLL H 34',
    group: 'H4',
    setup: "R' U2' R U R' U' R U R' U R",
    algs: ["R' U' R U' R' U R U' R' U2 R", "y2 L' U' L U' L' U L U' L' U2 L"]
  },
  {
    name: 'ZBLL H 35',
    group: 'H4',
    setup: "R' U' R U' R' U R U' R' U2' R y",
    algs: ["y' R' U2 R U R' U' R U R' U R", "y L' U2 L U L' U' L U L' U L"]
  },
  {
    name: 'ZBLL H 36',
    group: 'H4',
    setup: "R U R' U R U' R' U R U2' R' y",
    algs: ["y' R U2 R' U' R U R' U' R U' R'"]
  },
  {
    name: 'ZBLL H 37',
    group: 'H4',
    setup: "R U2' R' U' R U' R' U' R' U' R U' R' U2' R y",
    algs: [
      "y' R' U2 R U R' U R U R U R' U R U2 R'",
      "y' R U2 R2 U2 R' U2 R U2 R' U2 R2 U2 R",
      "R U R2 U' R2 U R2 U2 R2 U2 R' U R' U R",
      "y R' U R U R' U R U R U R' U R' U' R2 U' R'"
    ]
  },
  {
    name: 'ZBLL H 38',
    group: 'H4',
    setup: "R' U2' R U R' U R U R U R' U R U2' R' y'",
    algs: [
      "y R U2 R' U' R U' R' U' R' U' R U' R' U2 R",
      "y R U2 R' U' R U' R' U r' F' r U' r' F2 r",
      "r R U2 r' R U2 R' l' U2 y U' R2 U' R2 U' R2 U' R2 U",
      "R L F2 L' R U2 R2 F U2 y' R' U2 R' U2 R' U2 R"
    ]
  },
  {
    name: 'ZBLL H 39',
    group: 'H4',
    setup: "R' U' R U' R' U2' R U R U2' R' U' R U' R'",
    algs: [
      "R U R' U R U2 R' U' R' U2 R U R' U R",
      "y2 R' U' R U' R' U2 R U R U2 R' U' R U' R'",
      "R' U' R' r2 U' R' U R' r2 U' r' U2 r",
      "R' U' R U' R' U2 R U R U2 R' U' R U' R'"
    ]
  },
  {
    name: 'ZBLL H 40',
    group: 'H4',
    setup: "R' U' R U' R U R2' U R U' R U R' U' R U R' U' R U' R'",
    algs: [
      "R U R' U R U' R' U R U' R' U R' U' R2 U' R' U R' U R",
      "F U R' F R F' R U' R' U R' F R F' R U' R' F'",
      "R U R' U R U' R' U R2 U R U R U' R' U' R' U R'",
      "R' F R U R' F R U' R' F' R U' R' F R U R' F R U' R' F' R"
    ]
  }
]
