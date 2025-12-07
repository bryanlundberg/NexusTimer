import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

export const ZBLL_T_ALGS: AlgorithmCollection[] = [
  {
    name: 'ZBLL T 1',
    group: 'T1',
    setup: "L' U L U2' R' L' U L U R U R' U R y'",
    algs: [
      "y R' U' R U' R' U' R U2 L' R' U R U' L",
      "y' R' U2 R' U' D R' U' R D' R U R U R2",
      "y2 S R U' R2 U B' U' R2 U B R' S'",
      "y R' U2 R2 U R2 U R F' R U2 R' U2 R' F R"
    ]
  },
  {
    name: 'ZBLL T 2',
    group: 'T1',
    setup: "L' U R' U' L U' R' U2' R' U R' U' R U2' R2'",
    algs: [
      "y R' U2 R2 U R' U' R' U2 F' R U2 R U2 R' F",
      "M U R' F' r U r U' r' F M U' M'",
      "R' U2 R U' R' D R' U R U R' U2 R U' D' R",
      "R2 U2 R' U R U' R U2 R U L' U R U' L"
    ]
  },
  {
    name: 'ZBLL T 3',
    group: 'T1',
    setup: "R' U' R U R' F2' R U2' R' U2' R' F2' R2'",
    algs: [
      "y2 R' U' R' D' R U' M' U2 r' D R2",
      "R2 F2 R U2 R U2 R' F2 R U' R' U R",
      "R U R' U' D R' U R' U' R' U R2 D'",
      "y2 R' U' R' D' R U' R' r U2 r' D R2"
    ]
  },
  {
    name: 'ZBLL T 4',
    group: 'T1',
    setup: "R' D R' U R D' R' U R2' U' R2' U' R2' y'",
    algs: [
      "y2 F R2 D R' U' R D' R2 U' R U2 R' U' F'",
      "y' R D R' U' R D' R2 U R U' R' U' R U R' U' R",
      "R U R' U' R' U' F R f' R' U R S",
      "y R2 U R2 U R2 U' R D R' U' R D' R"
    ]
  },
  {
    name: 'ZBLL T 5',
    group: 'T1',
    setup: "R U L' U R' U' L U' R U R' U2' R U2' R' y",
    algs: [
      "y F R U R' U' R U R' U' F' R U R' U' R' F R F'",
      "y' R U2 R' U2 R U' R' U r' F R F' r U' R'",
      "y' R U2 R' U2 R U' R' U L' U R U' L U' R'",
      "y r' D' r U' r' F r U' r' F D r2 U r' U' r' F r F'"
    ]
  },
  {
    name: 'ZBLL T 6',
    group: 'T1',
    setup: "F' r U R' U' L' U l y'",
    algs: ["y2 R' U' R' D' R U R' D R2", "y' F R F' r U R' U' r'", "y R' F' r U R U' r' F", "y l' U' L U R U' r' F"]
  },
  {
    name: 'ZBLL T 7',
    group: 'T1',
    setup: "R' U' R F U' R' U' R U F' R' U2' R",
    algs: [
      "R' U2 R F U' R' U R U F' R' U R",
      "R U2 D' R U' R U R U' R2 D U' R'",
      "R' U2 R U' R2 F' R U R U' R' F R U2 R' U R",
      "R' U' R' D' R U2 R' D R U R U' R' U R U R' U R"
    ]
  },
  {
    name: 'ZBLL T 8',
    group: 'T1',
    setup: "L' R' U R U' L R' U' R U' R' U R y",
    algs: [
      "y' R' U' R U R' U R L' U R' U' R L",
      "R U R' U' R U' R' U' F R U R' U' R' F' R",
      "y' R' U' R U R' U R r' F R' F' r R",
      "y' R' U' S' R U R' S R2 f' U' f"
    ]
  },
  {
    name: 'ZBLL T 9',
    group: 'T1',
    setup: "F R U' R' U' R U2' R' U' F' y'",
    algs: [
      "y F U R U2 R' U R U R' F'",
      "L U2 R' U2 R U2 L' U' R' U R",
      "y2 R U2 r' F2 r U2 R' U' L' U L",
      "y F U R U2 R' U' F' L' U L"
    ]
  },
  {
    name: 'ZBLL T 10',
    group: 'T1',
    setup: "F' R U2' R' U2' R' F R U R U' R' y'",
    algs: [
      "y R U R' U' R' F' R U2 R U2 R' F",
      "y L' U2 L U2 L F' L' U' L' U L F",
      "y r' F2 r U2 r U' r' U' r' F r F",
      "y R U R' U2 R U R' y' R' U' R U2 R' U' R"
    ]
  },
  {
    name: 'ZBLL T 11',
    group: 'T1',
    setup: "R' U' R U' R' U R U L U' R' U M x",
    algs: [
      "y' F U R' U' R F' R' U' R U R' U R",
      "y R U R' U' R U R2 D' R U2 R' D R U' R U' R'",
      "x' M' U' R U L' U' R' U' R U R' U R",
      "L R' U' R U L' U' R' U' R U R' U R"
    ]
  },
  {
    name: 'ZBLL T 12',
    group: 'T1',
    setup: "R' U' R' D' R U2' R' D R U R U' R' U' R y",
    algs: [
      "y' R' U R U R' U' R' D' R U2 R' D R U R",
      "F' U f U2 R U2 R' U2 S'",
      "y r' F R U2 F U2 F' U2 M'",
      "y' R' U r U2 B U2 B' U2 M"
    ]
  },
  {
    name: 'ZBLL T 13',
    group: 'T2',
    setup: "R U R' U' R B2' R' U2' R U2' R B2' R2' y2'",
    algs: [
      "y2 R' U' R U D' R U' R U R U' R2 D",
      "R U R D R' U R r' U2 r D' R2",
      "y2 R2 B2 R' U2 R' U2 R B2 R' U R U' R'",
      "R U R D R' U M U2 r D' R2"
    ]
  },
  {
    name: 'ZBLL T 14',
    group: 'T2',
    setup: "R D' R U2' R2' U R2' U R2' U' R D R'",
    algs: [
      "y' R' D' R U R' D R2 U' R' U R U R' U' R U R'",
      "R' D R2 U' R' U R U R' U' R U R2 D' R",
      "y2 R' U' R U R U f' U' F R U' R' S",
      "R D' R' U R2 U' R2 U' R2 U2 R' D R'"
    ]
  },
  {
    name: 'ZBLL T 15',
    group: 'T2',
    setup: "L U' R U R' L' U2' R U' R' U' R U' R' y'",
    algs: [
      "y R U R' U R U R' U2 L R U' R' U L'",
      "y2 R' U' R U F U' R' U2 R U F' R' U2 R U2",
      "y' L U L' U L U L' U2 L R U' L' U R'",
      "S R' U R2 U' F U R2 U' F' R S'"
    ]
  },
  {
    name: 'ZBLL T 16',
    group: 'T2',
    setup: "R' U2' R2' U R' U' R' U2' F R U R U' R' F' y2'",
    algs: [
      "y2 F R U R' U' R' F' U2 R U R U' R2 U2 R",
      "M U' r U R' U' R' F R F' M U M'",
      "y' F U2 F' U F U' R U' R' U' R U2 R' U2 F'",
      "L2 U2 L U' L' U L' U2 L' U' R U' L' U R'"
    ]
  },
  {
    name: 'ZBLL T 17',
    group: 'T2',
    setup: "F R' F' r U R U' r' y",
    algs: ["y' r U R' U' r' F R F'", "R U R D R' U' R D' R2", "R' F' R U R' U' R' F R U R", "x R' U' R D' R' U R D x'"]
  },
  {
    name: 'ZBLL T 18',
    group: 'T2',
    setup: "R' U' L U' R U L' U R' U' R U2' R' U2' R y",
    algs: [
      "R' U' R U' R2 F' R U R U' R' F U R U' R' U2 R",
      "y' R F R' U R U' R' U R U' F' R2 F' R U R U' R' F",
      "R U R D R' U' R D' r2 U' M2 U2 M2 U' M2",
      "R2 D' R U2 R' D R U R U' R' U R U' R' U R U' R' U2 R"
    ]
  },
  {
    name: 'ZBLL T 19',
    group: 'T2',
    setup: "R U R' B' U R U R' U' B R U2' R' y2'",
    algs: [
      "y R2 U R' U' R' U R' U2 D R' U2 R D'",
      "L U2 r' D' F r U' r' F' D r U' L'",
      "U2 R U R D R' U2 R D' R' U' R' U R U' R' U' R U' R'",
      "y2 R U2 R' f' L U L' U' L' f R U' R'"
    ]
  },
  {
    name: 'ZBLL T 20',
    group: 'T2',
    setup: "L R U' R' U L' R U R' U R U' R' y",
    algs: [
      "y' R U R' U' R U' R' L U' R U R' L'",
      "y' R U S' R' U' R S R2 F R F'",
      "y' R F U R' U' R U' R' U' R U F' R'",
      "y R U R' F' U2 F U R' U' R U' R' U2 F R F'"
    ]
  },
  {
    name: 'ZBLL T 21',
    group: 'T2',
    setup: "F R U R' U' R' F' R U2' R U2' R' y",
    algs: [
      "y' R U2 R' U2 R' F R U R U' R' F'",
      "y R' U' R U2 R' F R U R' U' R' F' R U' R",
      "y R' U' R U2 R' U' R y R U R' U2 R U R'",
      "y' L' U' L U L F L' U2 L' U2 L F'"
    ]
  },
  {
    name: 'ZBLL T 22',
    group: 'T2',
    setup: "F' L' U L U L' U2' L U F y",
    algs: [
      "y' F' U' r' F2 r U F R U' R'",
      "y' F' U' L' U2 L U' L' U' L F",
      "y2 R' U' R U' R' U R' F' R U R U' R' F R",
      "y B' U' R' U2 R U' R' U' R B"
    ]
  },
  {
    name: 'ZBLL T 23',
    group: 'T2',
    setup: "R U R D R' U2' R D' R' U' R' U R U R' y",
    algs: [
      "y' R U' R' U' R U R D R' U2 R D' R' U' R'",
      "F U' B' R2 U' R2 U R2 F' B",
      "y2 f R' F' U2 R' U2 R U2 S'",
      "y' R U' r' U2 F' U2 F U2 M'"
    ]
  },
  {
    name: 'ZBLL T 24',
    group: 'T2',
    setup: "R U R' U R U' R' U' L' U R U' L R' y2'",
    algs: [
      "y2 R L' U R' U' L U R U R' U' R U' R'",
      "y R' U' R U R' U' R2 D R' U2 R D' R' U R' U R",
      "y' f' L' U L U' f R U R' U' R U' R'",
      "y2 r' F R F' r U' R' U' R U R' U' R U' R'"
    ]
  },
  {
    name: 'ZBLL T 25',
    group: 'T3',
    setup: "L' U R' U' R L U2' R' U' R",
    algs: [
      "R' U R U2 L' R' U R U' L",
      "R' U' R' U' R U R' F' R U R' U' R' F R'",
      "R' U R U2 r' R' F R F' r",
      "y2 L' U R' U' L R U2 R' U' R"
    ]
  },
  {
    name: 'ZBLL T 26',
    group: 'T3',
    setup: "R U R' U R U2' R D R' U R D' R' U' R' y",
    algs: [
      "y' R U R D R' U' R D' R' U2 R' U' R U' R'",
      "y R U R2 F R F' R U' R' F' U F",
      "L' U2 L U L' U L U' L' U R U' L U R'",
      "R U R' U R U2 R D R' U R D' R' U' R'"
    ]
  },
  {
    name: 'ZBLL T 27',
    group: 'T3',
    setup: "L U' R U R' L' U2' R U R' y2'",
    algs: [
      "y2 R U' R' U2 L R U' R' U L'",
      "y2 R' F R U R' U' R' F' R2 U' R' U2 R",
      "r U R2 F R F' R U2 r' U r U r' U2",
      "R' U2 R U R2 F R U R U' R' F' R"
    ]
  },
  {
    name: 'ZBLL T 28',
    group: 'T3',
    setup: "R' U' R U' R' U2' R' D' R U' R' D R U R y",
    algs: [
      "y' R' U' R' D' R U R' D R U2 R U R' U R",
      "R U2 R' U' R' F R2 U' R' U' R U R' F' R U' R'",
      "y R' F R' F' R2 U' R' U R f R' f'",
      "y f R f' R' U' R U R2 F R F' R"
    ]
  },
  {
    name: 'ZBLL T 29',
    group: 'T3',
    setup: "R' U2' R U R' U R F U R U2' R' U R U R' F'",
    algs: [
      "F R U' R' U' R U2 R' U' F' R' U' R U' R' U2 R",
      "r' U' R' F2 R F' R' F2 R2 U' R' U2 r",
      "r' U' l' U2 R U' R' U2 l R U' R' U2 r",
      "y' R U R' U R' D' R U R' D R U R' F R U R U' R' F'"
    ]
  },
  {
    name: 'ZBLL T 30',
    group: 'T3',
    setup: "F R U' R' U' R U2' R' U' F' R' U' R U' R' U2' R",
    algs: [
      "R' U2 R U R' U R F U R U2 R' U R U R' F'",
      "r' U2 R U R2 F2 R F R' F2 R U r",
      "y2 F R U R' U' R' F' R U' R' D' R U' R' D R U' R U' R'",
      "y2 L F R U2 R' U R U2 R2 F R F2 L'"
    ]
  },
  {
    name: 'ZBLL T 31',
    group: 'T3',
    setup: "F' r2' U2' R' F' R U2' r' U r' y2'",
    algs: [
      "y2 r U' r U2 R' F R U2 r2 F",
      "R' U R U2 R' U' F' R U R' U R U2 R' F R",
      "y2 F' r2 U2 R' F' R U2 r' U r'",
      "r' U r' U2 l U' R' F2 r2 U' x"
    ]
  },
  {
    name: 'ZBLL T 32',
    group: 'T3',
    setup: "R' U' R U R U R2' F' R U R U' R' F R U' R2' U R y2'",
    algs: [
      "y2 R' U' R2 U R' F' R U R' U' R' F R2 U' R' U' R' U R",
      "y' r U R' U' r' F R F' U R U R' U' R' F R2 U' R' U' R U R' F'",
      "y2 F R U' R' S U' R U f' U R2 F R F' R",
      "R U R2 U2 R U R' U2 L U' R U L' R U' R'"
    ]
  },
  {
    name: 'ZBLL T 33',
    group: 'T3',
    setup: "R U R' D U R2' U2' R2' U R2' U R2' D' R U' R'",
    algs: [
      "R U' R' U R U R' U' R U R' U' R' D' R U' R' D R",
      "y2 R' U' R U' R' U R F U' R' U2 R U F'",
      "y2 R' U' R U' R' U R U L U2 R' U2 R U2 L'",
      "R U R D R' U' R D' U R' U R' U' R U' R2 U' D R' U R D'"
    ]
  },
  {
    name: 'ZBLL T 34',
    group: 'T3',
    setup: "L' U2' R U2' R' U2' L U R U R' U' R U' R'",
    algs: [
      "R U R' U R U' R' U' L' U2 R U2 R' U2 L",
      "R U R' U R U' R' F' U' L' U2 L U F",
      "R U R' U R U' R' U' R' F2 R F2 L' U2 L",
      "y2 R' U R U' R' U' R U R' U' R U R D R' U R D' R'"
    ]
  },
  {
    name: 'ZBLL T 35',
    group: 'T3',
    setup: "R' U' R U' R' U R F U' R' U2' R U F'",
    algs: [
      "F U' R' U2 R U F' R' U' R U R' U R",
      "y2 R' D' R U R' D R U R U' R' U R U' R' U' R U R'",
      "y' R U2 L' U2 L U2 R' U' L' U' L U L' U L",
      "y L U2 R' U2 R U2 L' U' R' U' R U R' U R"
    ]
  },
  {
    name: 'ZBLL T 36',
    group: 'T3',
    setup: "R U R' U R U' R' U' L' U2' R U2' R' U2' L y'",
    algs: [
      "y L' U2 R U2 R' U2 L U R U R' U' R U' R'",
      "R D R' U' R D' R' U' R' U R U' R' U R U R' U' R",
      "y2 F' U' L' U2 L U F R U R' U' R U' R'",
      "F' U L U2 L' U' F L U L' U' L U' L'"
    ]
  },
  {
    name: 'ZBLL T 37',
    group: 'T4',
    setup: "R U R' U' L' U2' R U R' U2' L R U' R' y'",
    algs: [
      "R' D' R U R' D R2 U R' U2 R U' R' U' R U' R'",
      "y R U R' L' U2 R U' R' U2 L U R U' R'",
      "y S2 R U R' S' U R' U' F R' f' R2 U R",
      "y R U R' r' F2 R F' R' F2 r U R U' R'"
    ]
  },
  {
    name: 'ZBLL T 38',
    group: 'T4',
    setup: "R U2' R' U' R U' R D' R U2' R' D R U2' R",
    algs: [
      "R' U2 R' D' R U2 R' D R' U R' U R U2 R'",
      "y' R U R2 D' R U2 R' D R U2 R U R' U' R U' R'",
      "y' R2 F' R U S' R U' R' f R f R f'",
      "R' U2 R' D' R U2 R' D R3 U R' U R U2 R'"
    ]
  },
  {
    name: 'ZBLL T 39',
    group: 'T4',
    setup: "R' U' R F U' R' U' R U F' U R' U R y'",
    algs: [
      "y R' U' R U' F U' R' U R U F' R' U R",
      "y2 R D R' U' R D' R2 U' R U2 R' U R U R' U R",
      "y R D' R2 U' R U2 R' U R U R' U R U' R D R'",
      "y R' U' R U2 R2 F' R U R U' R' F R U2 R' U R"
    ]
  },
  {
    name: 'ZBLL T 40',
    group: 'T4',
    setup: "R' U2' R U R' U R' D R' U2' R D' R' U2' R' y2'",
    algs: [
      "R' U2 R' D' R U2 R' D R2 U' R' U2 R U R' U R",
      "y2 R U2 R D R' U2 R D' R U' R U' R' U2 R",
      "y' R' F2 R U' R2 F2 R2 U' R' U2 R' F2 R2",
      "F R U R' U' F' R U R' U R U' R' U' R' F R F'"
    ]
  },
  {
    name: 'ZBLL T 41',
    group: 'T4',
    setup: "x R2' D2' R U2' R' D2' R U2' l y",
    algs: [
      "y' l' U2 R' D2 R U2 R' D2 R2 x'",
      "y2 R U2 R' U R U R' y' R' U' R U2 R' U' R",
      "y' x R' U2 R' D2 R U2 R' D2 R2 x'",
      "y' l' U2 R' D2 R U2 R' D2 l2"
    ]
  },
  {
    name: 'ZBLL T 42',
    group: 'T4',
    setup: "x' R2' D2' R' U2' R D2' R' U2' l' y",
    algs: [
      "y' l U2 R D2 R' U2 R D2 R2 x",
      "y' x' R U2 R D2 R' U2 R D2 R2 x",
      "R' U2 R U' R' U' R y R U R' U2 R U R'",
      "y r U2 L D2 L' U2 L D2 L2"
    ]
  },
  {
    name: 'ZBLL T 43',
    group: 'T4',
    setup: "F R U' R' U R U R' U R U' R' F' y2'",
    algs: [
      "y2 F R U R' U' R U' R' U' R U R' F'",
      "f U R U' R' U R' U' R f' R' U R",
      "y R' F' U' F U R F R' F' R U R U' R'"
    ]
  },
  {
    name: 'ZBLL T 44',
    group: 'T4',
    setup: "L' R' U R U' L R' U' R U2' R U R2' U R2' U2' R' y2'",
    algs: [
      "y' R U R' U2 R U' R' U2 R U' R2 F' R U R U' R' F",
      "y R U R' U2 R D' R U' R' U' R U2 R' U D R'",
      "r U2 R2 F R F' U2 r' F R U R U' R' F'",
      "F' U' F U R' F R2 U R' U' R' F' R2 U R'"
    ]
  },
  {
    name: 'ZBLL T 45',
    group: 'T4',
    setup: "R' U2' R U R' U R' D' R U' R' D R U R y'",
    algs: [
      "y R' U' R' D' R U R' D R U' R U' R' U2 R",
      "y2 r' D' r U' r' F2 r U' r' F' D r",
      "y2 F U' R' U2 R' U2 R U' R' U' R U R U F'",
      "y2 f R f' R2 u' R U' R' U R' u R3 U R' U R U2 l' L' B' L B' L' B2 L B2 x'"
    ]
  },
  {
    name: 'ZBLL T 46',
    group: 'T4',
    setup: "R U' R' U' R U2' R' U2' R' D' R U' R' D R",
    algs: [
      "y R U R' U R' D' R U' R' D R U R U2 R'",
      "y2 R F R' U R U2 R' U R U F' R'",
      "y R U R D R' U' R D' R' U R' U R U2 R'",
      "R' D' R U R' D R U2 R U2 R' U R U R'"
    ]
  },
  {
    name: 'ZBLL T 47',
    group: 'T4',
    setup: "x M U' L U2' R' U R U2' R' U L' U L",
    algs: [
      "r U R' U' r' F R F' R' U2 R U R' U R",
      "R' U R2 D R' U R D' R' U R' U' R U' R' U' R",
      "y f R' F' R U2 R' F R F' R U2 R' S'",
      "M' f' U' f r' U' R U' R U R' U R"
    ]
  },
  {
    name: 'ZBLL T 48',
    group: 'T4',
    setup: "R U' R' U' R U' R' U R' D' R U R' D R2' U R' y2'",
    algs: [
      "y2 R U' R2 D' R U' R' D R U' R U R' U R U R'",
      "y2 R U2 R' U' R U' R2 F' r U R U' r' F",
      "y2 F R U R' U' R' F' R U F' R U R' U' R' F R2 U' R'",
      "y2 M F R F' r U R' U R' U' R U' R'"
    ]
  },
  {
    name: 'ZBLL T 49',
    group: 'T5',
    setup: "R' U' R U2' R D R' U' R D' R2' U R U' R' U R y'",
    algs: [
      "y R' U' R U R' U' R2 D R' U R D' R' U2 R' U R",
      "R' U' R U R2 D' R U2 R' D R2 U2 R' U2 R",
      "y' R2 U2 R U2 R' U L' R U R' U' R2 L",
      "F U R' D' r U2 r' D R2 U' R' U F'"
    ]
  },
  {
    name: 'ZBLL T 50',
    group: 'T5',
    setup: "R2' U R U2' R' U R D' R U2' R' D U' R",
    algs: [
      "R U' R' U R U R' U' R U R' U R' D' R U R' D R",
      "R' U D' R U2 R' D R' U' R U2 R' U' R2",
      "F U' R2 U R' U R U2 R2 U' R U2 R' F'",
      "y R D R' U R D' R' U R' U R U' R' U R U R' U' R"
    ]
  },
  {
    name: 'ZBLL T 51',
    group: 'T5',
    setup: "R U R' U R U R2' D' r U2' r' D R2' U R' y'",
    algs: [
      "y R U' R2 D' r U2 r' D R2 U' R' U' R U' R'",
      "y R' U' R U' R' U' R2 D r' U2 r D' R2 U' R",
      "y2 R U2 R' U2 R U R2 D' R U' R' D R U2 R U' R'",
      "R U R' U' R' U R D R' U' R2 D' R D R2 D' R"
    ]
  },
  {
    name: 'ZBLL T 52',
    group: 'T5',
    setup: "R2' U R2' U R D' R U' R' D R U' R2'",
    algs: [
      "y2 R U R' U2 R' D' R U R' D R2 U' R' U R U' R'",
      "R2 U R' D' R U R' D R' U' R2 U' R2",
      "y2 R' U F' R' U2 R U2 F U' R' U R2",
      "y2 R U2 R' U2 R2 D R' U2 R D' R2 U R U' R'"
    ]
  },
  {
    name: 'ZBLL T 53',
    group: 'T5',
    setup: "F R' F' r U R U' F R' F' r U R U' r2' y2'",
    algs: [
      "y2 r2 U R' U' r' F R F' U R' U' r' F R F'",
      "y2 F U R' D' R U R' D R U' R' D' R U' R' D R F'",
      "y R U R D R' U R D' R' U L' U R' U' L",
      "y2 R2 D' R U' R' D R U R U R' U2 R' D' R U2 R' D R2"
    ]
  },
  {
    name: 'ZBLL T 54',
    group: 'T5',
    setup: "R' U2' R' U2' R2' U R F R U R U' R' F' R2' y2'",
    algs: [
      "y2 R2 F R U R' U' R' F' R' U' R2 U2 R U2 R",
      "y r U r' R U R' U' R U R' U' r U' r' F R U R' U' F'",
      "f' U' F R' D' R U2 R' D R U' f R' F' R",
      "R U R' U R U' R' U R L' U L U2 R' U' L' U2 L"
    ]
  },
  {
    name: 'ZBLL T 55',
    group: 'T5',
    setup: "R U' R2' D' r U2' r' D R2' U R' y2'",
    algs: [
      "y2 R U' R2 D' r U2 r' D R2 U R'",
      "R U R' U R U' R' L' U2 R U R' U2 L",
      "y R U R' U' R2 D R' U2 R D' R2 U R U' R'",
      "L' U2 R U' R' U2 L R U R' U' R U' R'"
    ]
  },
  {
    name: 'ZBLL T 56',
    group: 'T5',
    setup: "R' U R2' D r' U2' r D' R2' U' R",
    algs: [
      "R' U R2 D r' U2 r D' R2 U' R",
      "y R' U' R U R2 D' R U2 R' D R2 U' R' U R",
      "y2 R' U' R U' R' U R U R' F' R U R' U' R' F R2",
      "L' U' L U' L' U L R U2 L' U' L U2 R'"
    ]
  },
  {
    name: 'ZBLL T 57',
    group: 'T5',
    setup: "R2' U' R2' U' R' D R' U R D' R' U R2' y2'",
    algs: [
      "R' U' R U2 R D R' U' R D' R2 U R U' R' U R",
      "y2 R2 U' R D R' U' R D' R U R2 U R2",
      "R' U2 R U2 R2 D' R U2 R' D R2 U' R' U R",
      "y F U' R U R2 D' r U2 r' D R U' F'"
    ]
  },
  {
    name: 'ZBLL T 58',
    group: 'T5',
    setup: "R2' F2' R U2' R U2' R' F' R U R' U' R' F' R2' y'",
    algs: [
      "y R' D' R U' R' D R U' R U' R' U R U' R' U' R U R'",
      "y' R2 U R U2 R' U R D' R U2 R' D U' R",
      "y2 R' U R U' R' U' R U R' U' R U' R D R' U' R D' R'",
      "F R U2 R' U R2 U2 R' U' R U' R2 U F'"
    ]
  },
  {
    name: 'ZBLL T 59',
    group: 'T5',
    setup: "R U R' U2' R' D' R U R' D R2' U' R' U R U' R' y'",
    algs: [
      "y R U R' U' R U R2 D' R U' R' D R U2 R U' R'",
      "y2 R U R' U' R2 D R' U2 R D' R2 U2 R U2 R'",
      "y' R2 U' R U F' U2 R' U2 R F U' R",
      "L U L' U' L2 D L' U2 L D' L2 U2 L U2 L'"
    ]
  },
  {
    name: 'ZBLL T 60',
    group: 'T5',
    setup: "F R U R' U' R' F' R U R' F' R U R U' R' F R U' R' y2'",
    algs: [
      "y2 R U R' F' R U R' U' R' F R U' R' F R U R U' R' F'",
      "y R U R' U R U R2 D' r U2 r' D R2 U R'",
      "y R' U R2 D r' U2 r D' R2 U R U R' U R",
      "y2 D' R' D x' U2 r U r' U2 x R2 U' R' U R2"
    ]
  },
  {
    name: 'ZBLL T 61',
    group: 'T6',
    setup: "R' U' R U' R' U2' R U' R' U2' R U R' U R y",
    algs: [
      "y2 R U' R' U2 R U R' U2 R U R' U R U' R'",
      "y' R' U' R U' R' U2 R U R' U2 R U R' U R",
      "y' r U R' U' r' F R F' R2 x F R F' R U2 r' U r U2 x' U2",
      "L U' L' U2 L U L' U2 L U L' U L U' L'"
    ]
  },
  {
    name: 'ZBLL T 62',
    group: 'T6',
    setup: "R U R' U R U2' R' U R U2' R' U' R U' R' y",
    algs: [
      "y' R U R' U R U2 R' U' R U2 R' U' R U' R'",
      "R' U R U2 R' U' R U2 R' U' R U' R' U R",
      "y2 L' U L U2 L' U' L U2 L' U' L U' L' U L",
      "y L U L' U L U2 L' U' L U2 L' U' L U' L'"
    ]
  },
  {
    name: 'ZBLL T 63',
    group: 'T6',
    setup: "R' U2' R2' U R2' U R U' R U R' U' R U' R' y",
    algs: [
      "y' R U R' U R U' R' U R' U' R2 U' R2 U2 R",
      "R U' R U2 R U2 R' U R U R' U' R' U R' U'",
      "y R' U R U2 R' U' R U' R U R' U' R' U' R U2 R U2 R'",
      "y R' F' U' F U' R U R2 F R F' U R"
    ]
  },
  {
    name: 'ZBLL T 64',
    group: 'T6',
    setup: "R U2' R' U' R U' R' U' R U R' U R U2' R'",
    algs: ["R U2 R' U' R U' R' U R U R' U R U2 R'", "y2 L U2 L' U' L U' L' U L U L' U L U2 L'"]
  },
  {
    name: 'ZBLL T 65',
    group: 'T6',
    setup: "R U2' R2' U' R2' U' R' U R' U' R U R' U R y",
    algs: [
      "y' R' U' R U' R' U R U' R U R2 U R2 U2 R'",
      "R' U R2 U R' U R' U' R U' R' U' R U R U' R'",
      "y L' U' L U' L' U L U' L U L2 U L2 U2 L'",
      "y z D R' U R' D' R U' R U' R D R' U D' z'"
    ]
  },
  {
    name: 'ZBLL T 66',
    group: 'T6',
    setup: "R' U2' R U R' U R U R' U' R U' R' U2' R y2'",
    algs: [
      "y2 R' U2 R U R' U R U' R' U' R U' R' U2 R",
      "L' U2 L U L' U L U' L' U' L U' L' U2 L",
      "y2 R' U2 R U R' U R U L' U' L U' L' U2 L",
      "R U2 R2 U R' U2 R2 U R U' R U' R U' R2"
    ]
  },
  {
    name: 'ZBLL T 67',
    group: 'T6',
    setup: "R' U' R U' R U2' R2' U' R2' U' R2' U R y",
    algs: [
      "y' R' U' R2 U R2 U R2 U2 R' U R' U R",
      "R U2 R' U2 R' U2 R U R U' R' U R' U R",
      "y L' U' L2 U L2 U L2 U2 L' U L' U L",
      "y2 R' U2 R U2 R U2 R' U' R U' R' U R' U R"
    ]
  },
  {
    name: 'ZBLL T 68',
    group: 'T6',
    setup: "R U R' U R' U2' R2' U R2' U R2' U' R' y",
    algs: [
      "y' R U R2 U' R2 U' R2 U2 R U' R U' R'",
      "y2 R' U2 R U2 R U2 R' U' R' U R U' R U' R'",
      "R U' R2 F R F' R U' B U' B' U' R'",
      "R U2 R' U2 R' U' F U R U' R U R' U' F'"
    ]
  },
  {
    name: 'ZBLL T 69',
    group: 'T6',
    setup: "R' U' R U' R' U2' R2' U R' U R U2' R'",
    algs: [
      "R U2 R' U' R U' R2 U2 R U R' U R",
      "y2 L U2 L' U' L U' L2 U2 L U L' U L",
      "R U2 R' U' R U' R' U2 L' U2 L U L' U L"
    ]
  },
  {
    name: 'ZBLL T 70',
    group: 'T6',
    setup: "R U R' U R U2' R2' U' R U' R' U2' R y2'",
    algs: [
      "y2 R' U2 R U R' U R2 U2 R' U' R U' R'",
      "L' U2 L U L' U L2 U2 L' U' L U' L'",
      "L' U2 L U L' U L U2 R U2 R' U' R U' R'"
    ]
  },
  {
    name: 'ZBLL T 71',
    group: 'T6',
    setup: "R U R' U' R' U R U R U' R' U R' U R U2' R' U' R",
    algs: [
      "R' U R U2 R' U' R U' R U R' U' R' U' R U R U' R'",
      "x D' R' U R D R2 D2 R U' R' D2 R l",
      "y' R U R' U R U' R2 U' R' U' R U R' U' R2 U2 R",
      "y R B r' U' R' U2 R2 U' r B R2 B2"
    ]
  },
  {
    name: 'ZBLL T 72',
    group: 'T6',
    setup: "R' U2' R U R' U R U2' R U2' R' U' R U' R' y",
    algs: [
      "y' R U R' U R U2 R' U2 R' U' R U' R' U2 R",
      "y' R U R' U R U2 R' L' U' L U' L' U2 L",
      "y L' U' L U' L' U2 L R U R' U R U2 R'",
      "y2 R U R' U' R' F D' R U R' D R2 U' R' F'"
    ]
  }
]
