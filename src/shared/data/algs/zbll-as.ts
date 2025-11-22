import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

export const ZBLL_AS_ALGS: AlgorithmCollection[] = [
  {
    name: 'ZBLL AS 1',
    group: 'AS1',
    setup: "R U2' R' U2' B' U R U R' U' B R U' R' y",
    algs: [
      "y' R2 D R' U2 R D' R' U' R' U R U' R' U R U2 R'",
      "y' R U R' U R' D R2 U' R' U R2 D' R' U2 R'",
      "y' R U R' U' L' U2 R U' R' U2 L U' R U2 R'",
      "y R U R2 F' U' F U R F R' F' R2 U2 R'"
    ]
  },
  {
    name: 'ZBLL AS 2',
    group: 'AS1',
    setup: "R' U' F2' U' R2' U R2' U F2' R2' U2' R'",
    algs: [
      "y2 R' U2 F' R U R' U' R' F R2 U R' U R",
      "R U2 R2 F2 U' R2 U' R2 U F2 U R",
      "y2 R' U2 R U R' U' R U R' U' R' D' R U2 R' D R2",
      "R U2 R2 F2 D' F2 U' F2 D F2 U R"
    ]
  },
  {
    name: 'ZBLL AS 3',
    group: 'AS1',
    setup: "R' U2' R U' L U' R2' U L' U' R2' U' R' U R",
    algs: [
      "y2 R' U R U R' U R U2 R' U' R2 D R' U2 R D' R'",
      "D R2 U' R U' R2 U R' U R2 D' R U2 R'",
      "R' U' R U' R D' R U2 R' D R U2 R U2 R",
      "R U R' U' R' F R U2 F' U' F U' R U R' U' F'"
    ]
  },
  {
    name: 'ZBLL AS 4',
    group: 'AS1',
    setup: "F' U2' F' R2' u' L F2' L' u R2' F2'",
    algs: [
      "y' R' D' R U2 R' D R2 U' R' U2 R U R' U R U R'",
      "y2 R' U2 R' U2 F' R U R U' R' F R' U2 R U2 R",
      "y2 r U' r' U2 R' F R U2 F2 U' R U' R' F'",
      "y' R U2 R U2 R' U' R' U R F' R U2 R' U2 R' F"
    ]
  },
  {
    name: 'ZBLL AS 5',
    group: 'AS1',
    setup: "F R' U2' R F' R' F U2' F' R y2'",
    algs: [
      "y2 R' F U2 F' R F R' U2 R F'",
      "y2 R' F U2 R' D' R U2 R' D R F' R",
      "y2 x R' U B2 U' R U R' B2 R U' x'",
      "y' R U R2 D R2 D' R2 U' R2 D R2 D' R"
    ]
  },
  {
    name: 'ZBLL AS 6',
    group: 'AS1',
    setup: "z' D U R2' U' L' U R2' z R2' U L' U' R",
    algs: [
      "y2 R' F U' F' U' R F U' R' U' R F'",
      "y2 R U R' U R' U' R U' R D R' U R D' U' R2 U2 R",
      "y2 R' F U' F' U' R F U' R' U' R F' U",
      "L' R' D2 R U R' D2 R2 U' L U R'"
    ]
  },
  {
    name: 'ZBLL AS 7',
    group: 'AS1',
    setup: "F R2' F' U2' R' U2' R2' U2' R U2' R F R F' R y'",
    algs: [
      "y2 R2 D r' U2 r R' U' R D' R' U R' U' R U' R'",
      "R B' r2 R2 U2 r' U' r U2 R' r2 B R2",
      "y R' U' R U' R' U R' D' R U' R' r U2 r' D R2",
      "y R' F R' F' R' U2 R' U2 R2 U2 R U2 F R2 F'"
    ]
  },
  {
    name: 'ZBLL AS 8',
    group: 'AS1',
    setup: "L' U' L U' R U2' L' U' R' U2' L U' R U' R' y'",
    algs: [
      "y' R U2 R' U' R2 D R' U2 R D' R' U' R' U R U R'",
      "y2 R' U' R U' R U R' U' R' U2 F R U R U' R' F'",
      "y' R2 U R2 U R U2 R' U2 R' U' D R' U R D'",
      "y' R2 F' R2 U R2 D' F' U' D F' U F2 R2"
    ]
  },
  {
    name: 'ZBLL AS 9',
    group: 'AS1',
    setup: "L' U2' R L U' L' U2' R' U2' L U2' R U' R' y'",
    algs: [
      "y2 R' U' R U' R D R' U' R D' R' U R' U2 R",
      "y2 R' U' R U' R' U R' D' R U' R' D R U2 R",
      "y R U R D' R' U2 R D R' D' R' U2 R U' D R'",
      "y R U R' U2 L' U2 R U2 L U L' R' U2 L"
    ]
  },
  {
    name: 'ZBLL AS 10',
    group: 'AS1',
    setup: "L U2' R' U L' U' L R U R' U L' U' R y'",
    algs: [
      "y R U2 R D R' U' R D' R' U R' U' R U' R'",
      "y R U2 R' U R' D' R U' R' D R U' R U' R'",
      "y R' U L U' R U' R' L' U L U' R U2 L'",
      "y R U2 R D R' U' R D' R' U R' U' R U' R' U2"
    ]
  },
  {
    name: 'ZBLL AS 11',
    group: 'AS1',
    setup: "R U R' U R U' R D R' U' R D' R2' y2'",
    algs: [
      "y2 R2 D R' U R D' R' U R' U' R U' R'",
      "y2 L' U R U' L2 U2 R' U R U2 L' R'",
      "U R U R' U' D R' U' R U R2 U' R U R2 D'",
      "y2 R' F' r U R U' r' F r' F' r U' r' F2 r"
    ]
  },
  {
    name: 'ZBLL AS 12',
    group: 'AS1',
    setup: "R2' D' R U' R' D R U' R U R' U R y'",
    algs: [
      "y R' U' R U' R' U R' D' R U R' D R2",
      "y' r U2 R' U' R U' r' F R' F' R U R U' R'",
      "y' R U' L' U R' U' L R' U2 R U R' U R"
    ]
  },
  {
    name: 'ZBLL AS 13',
    group: 'AS2',
    setup: "R' D' R U R' D R2' U R' U2' R U R'",
    algs: [
      "R U' R' U2 R U' R2 D' R U' R' D R",
      "y' L U' R' U L' U R2 U R2 U R2 U2 R'",
      "y R' U' R U2 R D R' U R D' R2 U2 R",
      "y R' U' R U' R2 D' R U R' D R U R"
    ]
  },
  {
    name: 'ZBLL AS 14',
    group: 'AS2',
    setup: "R U R2' F' R U R U' R' F U R U2' R' y'",
    algs: [
      "y R U2 R' U' F' R U R' U' R' F R2 U' R'",
      "S U2 R U2 R' U2 R' F R f'",
      "y2 R U2 R' U2 R U' R' L U' R U R' L'",
      "y2 R U' R U F' U2 R' U2 R F U' R2"
    ]
  },
  {
    name: 'ZBLL AS 15',
    group: 'AS2',
    setup: "x M U R' U' L U2' R U2' R' y2'",
    algs: [
      "y' F U2 F' U' R' F U' F' U R",
      "y2 R U2 R' U2 L' U R U' R' L",
      "y2 R U2 R' U2 r' F R F' r R'",
      "y2 R U2 R' U2 L' U R U' M' x'"
    ]
  },
  {
    name: 'ZBLL AS 16',
    group: 'AS2',
    setup: "L' R' U2' R U R' U2' L U R U R' U R",
    algs: ["y' R' U2 R' D' R U R' D R2 U' R' U2 R", "R' U' R U' R' U' L' U2 R U' R' U2 R L"]
  },
  {
    name: 'ZBLL AS 17',
    group: 'AS2',
    setup: "R' U' F U' R2' U R2' U F' R U' R U' R' y'",
    algs: [
      "y R U R' U R' F U' R2 U' R2 U F' U R",
      "y R U R' U2 R' D' R U' R' D U' R2 U' R2 U2 R",
      "y R U R' U' R U' R' F' R U R' U R U' R' U' R' F R",
      "F R U R' F R' F' U2 R2 U R2 U R F'"
    ]
  },
  {
    name: 'ZBLL AS 18',
    group: 'AS2',
    setup: "L U' R' U L' U2' R U L U' R' U L' R",
    algs: [
      "y R2 D R' U R D' R2 U' r' F R F' M'",
      "y R2 D R' U R D' R2 U' L' U R U' R' L",
      "y2 R L' U' L U R' U' L' U2 R U' L U R'",
      "y2 F2 D F' U F D' F2 R' F U' F' U R"
    ]
  },
  {
    name: 'ZBLL AS 19',
    group: 'AS2',
    setup: "L U L' U L U2' R U2' R' U' R U2' L' U R'",
    algs: [
      "y2 S R U R' U' R' F R S' R U R' U' F'",
      "y2 S R U R' U' R' F R f' F R U R' U' F'",
      "F R' F' U2 R U F' R' U R U F R U' R'",
      "R U' L U2 R' U R U2 R' U2 L' U' L U' L'"
    ]
  },
  {
    name: 'ZBLL AS 20',
    group: 'AS2',
    setup: "R2' D' r U2' r' D R2' U R' U R y2'",
    algs: ["y2 R' U' R U' R2 D' r U2 r' D R2", "R D' R U' R D R' U R2 D' R U2 D R' U2 R"]
  },
  {
    name: 'ZBLL AS 21',
    group: 'AS2',
    setup: "R2' D' R U2' R' D R2' U R' U R y2'",
    algs: ["y2 R' U' R U' R2 D' R U2 R' D R2"]
  },
  {
    name: 'ZBLL AS 22',
    group: 'AS2',
    setup: "R U R2' F' r U R U' r' F U R U2' R' y'",
    algs: [
      "y2 R U2 R' U' R U R' U2 R' F R U R U' R' F'",
      "y R U2 R' U' F' r U R' U' r' F R2 U' R'",
      "y L U L' U L U2 L2 R U R' U' L U2 R U2 R'"
    ]
  },
  {
    name: 'ZBLL AS 23',
    group: 'AS2',
    setup: "R' F' R U R' U' R' F R U' R U R' U' R U R' U R y'",
    algs: [
      "R' U2 R' D' R U2 R' D R U' R U' R' U2 R",
      "y R' U' R U' R' U R U' R' U R' F' R U R U' R' F R",
      "y R' U' R U' R' U y' R' U2 R U' R' U' R B",
      "F R U R2 U' R U' R U R2 U R2 U' R' U F'"
    ]
  },
  {
    name: 'ZBLL AS 24',
    group: 'AS2',
    setup: "R2' F R U R U' R' F' R U' R' U R",
    algs: [
      "R' U' R U R' F R U R' U' R' F' R2",
      "y L U2 L' U2 R' U L2 U' R U L' U' L'",
      "y R U2 R' U2 R' F R2 U' R' U' R U R' F'"
    ]
  },
  {
    name: 'ZBLL AS 25',
    group: 'AS3',
    setup: "R2' D R' U2' R D' R' U' R' U R U2' R' y",
    algs: ["y' R U2 R' U' R U R D R' U2 R D' R2"]
  },
  {
    name: 'ZBLL AS 26',
    group: 'AS3',
    setup: "R' U2' F' R U R' U' R' F R U2' R y2'",
    algs: ["y2 R' U2 R' F' R U R U' R' F U2 R", "U2 R' U2 R' F' R U R U' R' F U2 R U2"]
  },
  {
    name: 'ZBLL AS 27',
    group: 'AS3',
    setup: "R' U2' R U R' U' R' D' R U2' R' D R2'",
    algs: [
      "R2 D' R U2 R' D R U R U' R' U2 R",
      "R' F' R U R' U' R' F R2 U' R' U R U' R' U2 R",
      "y2 L' U' L U F R U2 R' U' x U2 L U r'"
    ]
  },
  {
    name: 'ZBLL AS 28',
    group: 'AS3',
    setup: "R2' D R2' U2' R U R' U R2' D' R' U2' R' y'",
    algs: [
      "y2 F U R U' R' U R U' R2 F' R U2 R U2 R'",
      "y2 R U2 R2 D' R U' R' D R2 U R' U' R U' R'",
      "y R U2 R D R2 U' R U' R' U2 R2 D' R2",
      "y' L U2 F L' U' L U L F' L' U2 L'"
    ]
  },
  {
    name: 'ZBLL AS 29',
    group: 'AS3',
    setup: "R' U2' R2' U R D' R U R' D R2' U' R U' R' y2'",
    algs: [
      "y F U R U' R' U R U' R' U R2 D R' U' R D' R2 F'",
      "y' R' U2 R U R2 D' R U' R' D R2 U R' U' R U R' U R",
      "y2 R U R' U R2 D' R U' R' D R' U' R2 U2 R",
      "R U' R' F D U R U' R' U R U' R' D' R' F' R"
    ]
  },
  {
    name: 'ZBLL AS 30',
    group: 'AS3',
    setup: "L U' R' U L' U' R",
    algs: ["y2 L' U R U' L U R'", "y2 r' F R F' r U R'", "R' U L U' R U L'", "z D' R U R' D R U' z'"]
  },
  {
    name: 'ZBLL AS 31',
    group: 'AS3',
    setup: "L' U' L U' L' U' R U' L U' R' U' R U' R' y2'",
    algs: [
      "y2 R' U R U R' U' R' D' R U R' D R U R U' R' U2 R",
      "y' L' U R' U' R L U2 R' U' R2 U2 R' U' R U' R'",
      "y R U2 R' U' R U R D R' U R D' R' U' R' U R U R'",
      "y2 R U R' U R U L' U R' U L U L' U L"
    ]
  },
  {
    name: 'ZBLL AS 32',
    group: 'AS3',
    setup: "R' U2' R' D' R U' R' D R U R U' R' U R U R' U R",
    algs: [
      "y R U R2 F' R U R U R' U' R U' R' F R U' R'",
      "y2 D R' U' R D' R U' R' U R2 U R' U' R2",
      "y R2 U' R' U R2 U R' U' R D' R U' R' D",
      "R' U' R U' R' U' R U R' U' R' D' R U R' D R U2 R"
    ]
  },
  {
    name: 'ZBLL AS 33',
    group: 'AS3',
    setup: "R2' U R U R' U' R' U' R' L' U R' U' L y2'",
    algs: [
      "y' R U2 R' U' R U R D r' U2 r D' R2",
      "y2 R' U2 R' D' R U R' D R U' R U R' U' R U R' U R",
      "y2 L' U R U' L R U R U R U' R' U' R2"
    ]
  },
  {
    name: 'ZBLL AS 34',
    group: 'AS3',
    setup: "R2' F2' R2' U R U' R F2' R' U2' R' U R U2' R' y'",
    algs: [
      "y' R U R U' R2 D U2 R' U' R U D' R",
      "y R U2 R' U' R U2 R F2 R' U R' U' R2 F2 R2",
      "S U' R U R U' R2 U R F R' f'"
    ]
  },
  {
    name: 'ZBLL AS 35',
    group: 'AS3',
    setup: "L' U' L' U L2' D' U2' L U L' D U' L' y",
    algs: [
      "y R D' U R U' R' U2 D R2 U' R U R",
      "y' L U D' L U' L' U2 D L2 U' L U L",
      "y' F' U' f R U R2 U' R U R U' S'"
    ]
  },
  {
    name: 'ZBLL AS 36',
    group: 'AS3',
    setup: "F2' R U' R' U' R U2' R2' U' R F2' R' U R y2'",
    algs: [
      "y2 F R U' R' U R U R2 F' R U R U R' U' R U' R'",
      "R2 D' r U2 r' D R U R U' R' U2 R",
      "y2 R' U' R F2 R' U R2 U2 R' U R U R' F2"
    ]
  },
  {
    name: 'ZBLL AS 37',
    group: 'AS4',
    setup: "R U R' U R U L U2' R' U R U2' R' L'",
    algs: [
      "R U R' F' R U R' U' R' F R2 U R' U' R U' R'",
      "y' R U2 R' U' R2 D R' U R D' R' U2 R'",
      "L R U2 R' U' R U2 L' U' R' U' R U' R'"
    ]
  },
  {
    name: 'ZBLL AS 38',
    group: 'AS4',
    setup: "R U R' U' R U R2' D' R U2' R' D R2' U2' R' y",
    algs: [
      "y L' R' U R U' L R' U' R U2 R' U2 R",
      "y2 f' L F L' U2 L' U2 L U2 S",
      "y2 R2 U' R U' R2 D' R U R' D R U R U' R",
      "y' R U2 R2 D' R U2 R' D R2 U' R' U R U' R'"
    ]
  },
  {
    name: 'ZBLL AS 39',
    group: 'AS4',
    setup: "R' U2' R U2' L U' R' U M x",
    algs: [
      "y2 L' R U' L U R' U2 L' U2 L",
      "x' M' U' R U L' U2 R' U2 R",
      "y' F U R' U' R F' U' R' U2 R",
      "y2 x M U' L U R' U2 L' U2 L"
    ]
  },
  {
    name: 'ZBLL AS 40',
    group: 'AS4',
    setup: "R' U R U2' R' U R2' D R' U R D' R' y",
    algs: [
      "y R U R D R' U R D' R2 U' R U' R'",
      "R' U' F' R U R' U' R' F R2 U' R' U R",
      "y R U2 R2 D' R U R' D R U2 R U' R'",
      "y' R U' R' U2 L' U R U' L2 U' R' U L'"
    ]
  },
  {
    name: 'ZBLL AS 41',
    group: 'AS4',
    setup: "R' U2' R' D R' U R D' R U R U' R U' R' y'",
    algs: [
      "y R U R' U2 R U R' U' F' R U2 R' U' R U' R' F",
      "y2 R2 D R' U2 R D' R U' R2 U' R' U R' U R",
      "y' L' U R U' L U' R D R' U2 R D' R2",
      "y R U R' U R' U' R' D R' U' R D' R U2 R"
    ]
  },
  {
    name: 'ZBLL AS 42',
    group: 'AS4',
    setup: "R L' U R' U' L U R U2' L' U R' U' L y'",
    algs: [
      "R2 D' R U' R' D F R U R U' R' F' R",
      "F U R' U' R F' R2 D' R U R' D R2",
      "y L' U R U' L U2 R' U' L' U R U' L R'",
      "R U2 R' U' R U' R D r' U2 r D' R' U2 R'"
    ]
  },
  {
    name: 'ZBLL AS 43',
    group: 'AS4',
    setup: "R U R' U R2' D r' U2' r D' R2' y2'",
    algs: ["y2 R2 D r' U2 r D' R2 U' R U' R'"]
  },
  {
    name: 'ZBLL AS 44',
    group: 'AS4',
    setup: "L' U R' U2' L U' L' U2' L U2' R U R' U R",
    algs: [
      "R U R' U' R' U2 R U R' U R2 U r' F R' F' r",
      "y R U R' U R U' R2 F R F' r U' r' U r U r'",
      "R D' R U' R' D U' R' U R U R2 U' R' U R",
      "R' U' R U' R' U2 L' U2 L U L' U2 R U' L"
    ]
  },
  {
    name: 'ZBLL AS 45',
    group: 'AS4',
    setup: "R U R' U' L U' R U L' U' R' U' R U2' R'",
    algs: ["R U2 R' U' R U' R D R' U2 R D' R' U2 R'", "R U2 R' U R U L U' R' U L' U R U' R'"]
  },
  {
    name: 'ZBLL AS 46',
    group: 'AS4',
    setup: "R' U2' L U' R2' U L' R' U2' R U R' U' R' U R y",
    algs: [
      "y' R' U' R U' R' F' R U R' U' R' F R U R U' R' U2 R",
      "R U2 R' U' R' D' R U' R' D R2 U' R' U R U' R'",
      "y' R' U' R U' R U R D R' U' R D' R U2 R",
      "y' R' U' R U R U' R' U2 R L U' R2 U L' U2 R"
    ]
  },
  {
    name: 'ZBLL AS 47',
    group: 'AS4',
    setup: "R U R' U R2' D R' U2' R D' R2' y2'",
    algs: ["y2 R2 D R' U2 R D' R2 U' R U' R'"]
  },
  {
    name: 'ZBLL AS 48',
    group: 'AS4',
    setup: "F R' U' R2' U' R2' U2' R2' U' R' F' y'",
    algs: [
      "R U' R' U2 R U' R' U R' D' R U2 R' D R",
      "R U R' F' R U2 R' U2 R' F R2 U' R'",
      "y F R U R2 U2 R2 U R2 U R F'"
    ]
  },
  {
    name: 'ZBLL AS 49',
    group: 'AS5',
    setup: "R U R' U L' U R U' L U2' R'",
    algs: [
      "y R U' R' F' R U R' U' R' F R2 U' R' U2 R U' R'",
      "R U2 L' U R' U' L U' R U' R'",
      "R U' R' U2 R U' R' U2 R' D' R U R' D R"
    ]
  },
  {
    name: 'ZBLL AS 50',
    group: 'AS5',
    setup: "F U' R' U R U F' R U R2' U R2' U2' R' y",
    algs: [
      "y' R U2 R2 U' R2 U' R' F U' R' U' R U F'",
      "y' R U2 R2 U' R2 F' R U R' U' R' F U' R'",
      "y' R U2 R2 U' R2 U' R' U2 R' F' R U R' U' R' F R2",
      "y' R U2 R' D R' U' R D' R2 U R' U' R' U' R'"
    ]
  },
  {
    name: 'ZBLL AS 51',
    group: 'AS5',
    setup: "F R U' R2' U2' R U R' U R2' U R' F' y2'",
    algs: [
      "R U R' F' R U2 R' U' R U' R' F R U' R'",
      "y2 R' F R F' U2 R U' R' U' F R' F' R",
      "y2 F R U' R2 U' R U' R' U2 R2 U R' F'"
    ]
  },
  {
    name: 'ZBLL AS 52',
    group: 'AS5',
    setup: "R' U2' L U' R U L' U R' U R y2'",
    algs: [
      "y2 R' U' R U' L U' R' U L' U2 R",
      "L' U' L U' R U' L' U R' U2 L",
      "y' R D R' U R D' R' U2 R' U' R U2 R' U' R",
      "y2 R' F R f' U2 R U' R' U' f R' F' R"
    ]
  },
  {
    name: 'ZBLL AS 53',
    group: 'AS5',
    setup: "R' U2' L R2' U2' R' U' R U2' L' U R2' U R y2'",
    algs: [
      "y2 F R' F' R U R U' R2 F R U R' U' F' U R",
      "y' L' U R U' L U L' U R' U' L U R U' R'",
      "y' r R D R' U R U' D' L' U R' U' x'",
      "R' U2 R' D' R U R' D F R U R U' R' F' R"
    ]
  },
  {
    name: 'ZBLL AS 54',
    group: 'AS5',
    setup: "L' U2' L U R U2' L' U' L U' R' U R U2' R'",
    algs: [
      "y2 F R2 U R2 U R2 U2 R' U2 R' U' R U' R' F'",
      "F' U2 R' D R U' R' D' R f R' F R f'",
      "R U2 R' U' F2 R U2 R' U2 R' F2 R2 U' R'",
      "R U2 R' U' R U L' U L U2 R' U' L' U2 L"
    ]
  },
  {
    name: 'ZBLL AS 55',
    group: 'AS5',
    setup: "R' U2' R U R' U' R L U' R' U L' U2' R y'",
    algs: [
      "y' F U' R' U R U F' R' U R U' R' U2 R",
      "y R' U2 L U' R U L' R' U R U' R' U2 R",
      "y' R U R' U R U' R' U r' F R F' r U2 R'"
    ]
  },
  {
    name: 'ZBLL AS 56',
    group: 'AS5',
    setup: "R U2' L' U R' U' L R U' R' U R U2' R' y",
    algs: [
      "y' F R U' R' U R U2 R' U' F' R U R' U' R' F R F'",
      "y' R U2 R' U' R U R' r' F R F' r U2 R'",
      "y' R U2 R' U' R U R' L' U R U' L U2 R'",
      "y R' F' U' F U R F R U R' U' R U R' U' F'"
    ]
  },
  {
    name: 'ZBLL AS 57',
    group: 'AS5',
    setup: "L' U2' R L U2' L' U2' R' U2' L U' R U' R' y'",
    algs: [
      "y' R2 U R2 F' R U R' U R U2 R' F R2 U' R2",
      "y R U R' U L' U2 R U2 L U2 L' R' U2 L",
      "y' R U2 R' F' R U R' U F U F' U R' F R2 U' R'",
      "R U' R D R2 U2 R U R' U R2 D' R' U R'"
    ]
  },
  {
    name: 'ZBLL AS 58',
    group: 'AS5',
    setup: "F U R' F R F' R U' R' U R U' R' F' y",
    algs: ["y' F R U R' U' R U R' F R' F' R U' F'", "y L' U2 R U' R' U2 L R U R' U' R U R' U' R U' R'"]
  },
  {
    name: 'ZBLL AS 59',
    group: 'AS5',
    setup: "R2' U2' R U' R' U R' U L' U R' U' L U' R' y2'",
    algs: [
      "y2 R' U F' R U R' U' R' F R U2 R U2 R' U' R",
      "y' R2 U' R2 B R' U2 R U R' U R B' R2 U R2",
      "y2 R' U R' D' R2 U R' U R U2 R2 D R U' R",
      "y2 R U L' U R U' L U' R U' R U R' U2 R2"
    ]
  },
  {
    name: 'ZBLL AS 60',
    group: 'AS5',
    setup: "L U' R U' R2' U L' U' R U2' L U R U2' R' L' y'",
    algs: [
      "y' R U' R2 D' U' R U' R' U2 D R2 U R'",
      "y R' U R2 U2 D R' U' R D' U' R2 U' R",
      "y L R U2 R' U' L' U2 R' U L U' R2 U R' U L'"
    ]
  },
  {
    name: 'ZBLL AS 61',
    group: 'AS6',
    setup: "R2' U' R2' U' R U R2' U' R2' U R' U R2' y",
    algs: [
      "y R2 U R2 U R' U2 R' U R U R' U' R2",
      "R' U' R U' R' U R U' R U R2 U R U' R U' R'",
      "y' F R U R' U F' U' F U' R U R' U' F'",
      "R' U' R U' R2 U' R' U' R' U R U R U' R"
    ]
  },
  {
    name: 'ZBLL AS 62',
    group: 'AS6',
    setup: "R' U2' R U R U R U R' U' R U R U' R U' R' y2'",
    algs: [
      "y R' U' R U R U2 R' U' R U' R' U R' U R",
      "y R2 U R2 U R U2 R' U R U R U' R2",
      "y R U2 R' U' R U' R' U' R U' R U R U R U' R' U' R2",
      "y2 S' l' U' L U' L' U2 l U2 S"
    ]
  },
  {
    name: 'ZBLL AS 63',
    group: 'AS6',
    setup: "R2' U' R' U' R U R U R U R U R' U R",
    algs: [
      "y2 R U R' U R' U' R U' R' U2 R U R U' R'",
      "R' U' R U' R' U' R' U' R' U' R' U R U R2",
      "y R2 U' R U R U R' U2 R U R2 U R2",
      "y' R2 F2 R' U2 R' U' R U' R F2 R2"
    ]
  },
  {
    name: 'ZBLL AS 64',
    group: 'AS6',
    setup: "R' U' R U' R U R' U' R U R2' U R2' U' R' U R U' R' y'",
    algs: [
      "y' R' U' R U' R U R2 U R U' R U R' U' R U' R'",
      "y R U R' U' R U R2 U' R2 U' R' U R U' R' U R' U R",
      "y R U2 R' U' R U' R2 U R' U' R3 U' R' U R U R2",
      "y R2 U' R' U R U R' U2 R' U R2 U R2"
    ]
  },
  {
    name: 'ZBLL AS 65',
    group: 'AS6',
    setup: "R' U2' R2' U2' R2' U' R2' U' R2' U R",
    algs: [
      "R' U' R2 U R2 U R2 U2 R2 U2 R",
      "y R U2 R' U' R U' R' U R U' R U R U R U' R' U' R2",
      "y2 R U R2 U' R' U' R U R' U' R2 U2 R",
      "y' R' U2 R U2 R U2 R' U' R U' R2 U2 R"
    ]
  },
  {
    name: 'ZBLL AS 66',
    group: 'AS6',
    setup: "R U R' U R U2' R' y'",
    algs: ["y R U2 R' U' R U' R'", "y' L U2 L' U' L U' L'", "y' M' U2 R U2 M R' U' R U' R' U2"]
  },
  {
    name: 'ZBLL AS 67',
    group: 'AS6',
    setup: "R U R2' U' R2' U' R2' U2' R2' U2' R'",
    algs: [
      "R U2 R2 U2 R2 U R2 U R2 U' R'",
      "R U2 R2 U' R U' R' U2 R U2 R U2 R'",
      "R' U' R U' R' U2 R U' R U' R U R U R U' R' U' R2",
      "y R U2 R2 U' R' U R U' R' U' R2 U R"
    ]
  },
  {
    name: 'ZBLL AS 68',
    group: 'AS6',
    setup: "R' U2' R U R' U R",
    algs: [
      "R' U' R U' R' U2 R",
      "y2 r' F' r U' r' F2 r",
      "y R U' R' U' R U R' U R U' R' U R U2 R' U2 R U' R'",
      "y2 L' U' L U' L' U2 L"
    ]
  },
  {
    name: 'ZBLL AS 69',
    group: 'AS6',
    setup: "R' U' R U R U R' U' R' U R U R U' R' y'",
    algs: ["y R U R' U' R' U' R U R U' R' U' R' U R", "y R U2 R2 U' R' U' R' U R U R2 U' R'"]
  },
  {
    name: 'ZBLL AS 70',
    group: 'AS6',
    setup: "R2' U' R' U' R2' U R U R2' U R' U R",
    algs: [
      "y R' U' R U R U2 R' U' R' U R U' R U' R'",
      "R' U' R U' R U R' U' R' U2 R U R U' R'",
      "y R2 U R U R2 U' R' U' R2 U' R U' R'",
      "R' U' R U' R2 U' R' U' R2 U R U R2"
    ]
  },
  {
    name: 'ZBLL AS 71',
    group: 'AS6',
    setup: "R' U2' R2' U R2' U R U' R U' R' y2'",
    algs: [
      "y2 R U R' U R' U' R2 U' R2 U2 R",
      "y R U2 R2 U' R2 U' R' U R' U R",
      "y2 r U R' U R' U' R2 U' r' R' U2 R",
      "y' R U' R' U' R U' R' U R U' R' U R U R' U' R U2 R'"
    ]
  },
  {
    name: 'ZBLL AS 72',
    group: 'AS6',
    setup: "R2' U R' U R U2' R U2' R U R' U R2' U R' y'",
    algs: [
      "y' R2 D' R U2 R' D R U R' F R U R U' R' F' R",
      "R' F2 R D R' D' F2 U' R2 U R' U' R2",
      "R2 U' S R2 S' R2 U R U' R U' R' U2 R",
      "y R U' R U R' U R U2 R' U' R' U' R U' R' U R U' R'"
    ]
  }
]
