import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

export const COLL_ALGS: AlgorithmCollection[] = [
  {
    name: 'AS 1',
    group: 'Anti Sune',
    setup: "R' U2' R U R' U R",
    algs: ["y R U2 R' U' R U' R'", "R' U' R U' R' U2 R", "y2 L' U' L U' L' U2 L", "y' L U2 L' U' L U' L'"]
  },
  {
    name: 'AS 2',
    group: 'Anti Sune',
    setup: "R2' D' R U' R' D R U' R U R' U R y'",
    algs: [
      "y2 R2 D R' U R D' R' U R' U' R U' R'",
      "y R' U' R U' R' U R' D' R U R' D R2",
      "U2 R2 D R' U R D' R' U R' U' R U' R'",
      "R U R' f' U' R U2 R' U' R U' R' f R U' R'"
    ]
  },
  {
    name: 'AS 3',
    group: 'Anti Sune',
    setup: "R' U2' R U2' L U' R' U R L'",
    algs: [
      "y2 R2 D R' U2 R D' R2 U' R U' R'",
      "R' U' F' R U R' U' R' F R2 U' R' U R",
      "y2 M F' r U R' U2 r' F2 r",
      "U2 f' L F L' U2 L' U2 L U2 S"
    ]
  },
  {
    name: 'AS 4',
    group: 'Anti Sune',
    setup: "R2' F R U R U' R' F' R U' R' U R",
    algs: [
      "y2 R' U' R U' R2 D' R U2 R' D R2",
      "y2 R U2 R' U2 r' F R F' M'",
      "y2 R U2 R' U2 L' U R U' R' L",
      "R' U' R U R' F R U R' U' R' F' R2"
    ]
  },
  {
    name: 'AS 5',
    group: 'Anti Sune',
    setup: "L U' R' U L' U' R",
    algs: ["y2 r' F R F' r U R'", "R' U L U' R U L'", "y2 L' U R U' L U R'", "U2 R' F R F' r U R' U' M"]
  },
  {
    name: 'AS 6',
    group: 'Anti Sune',
    setup: "R' D' R U' R' D R U2' R U R' U2' R U R'",
    algs: [
      "R U' R' U2 R U' R' U2 R' D' R U R' D R",
      "R U2 r' F R' F' r U' R U' R'",
      "R U R' F' R U2 R' U' R U' R' F R U' R'",
      "y2 L U2 R' U L' U' R U' L U' L'"
    ]
  },
  {
    name: 'S 1',
    group: 'Sune',
    setup: "R U2' R' U' R U' R'",
    algs: ["R U R' U R U2 R'", "y' R' U2 R U R' U R", "y L' U2 L U L' U L", "y2 L U L' U L U2 L'"]
  },
  {
    name: 'S 2',
    group: 'Sune',
    setup: "R L' U' L U R' U2' L' U2' L",
    algs: [
      "y2 R U R' U R2 D R' U2 R D' R2",
      "r' F2 r U2 R U' r' F M'",
      "L' U2 L U2 R U' L' U L R'",
      "L' U2 L U2 l F' L' F M'"
    ]
  },
  {
    name: 'S 3',
    group: 'Sune',
    setup: "R U2' R' U2' L' U R U' R' L",
    algs: [
      "L' R U R' U' L U2 R U2 R'",
      "y2 R2 D' R U2 R' D R2 U R' U R",
      "f R' F' R U2 R U2 R' U2 S'",
      "M F R' F' r U2 R U2 R'"
    ]
  },
  {
    name: 'S 4',
    group: 'Sune',
    setup: "R2' D R' U R D' R' U R' U' R U' R' y",
    algs: [
      "y' R U R' U R U' R D R' U' R D' R2",
      "y' F R' U2 R F' R' F U2 F' R",
      "R U R' U' R' F R F' r U R' U R U2 r'",
      "r U R' U' r' F R F' R U R' U R U2 R'"
    ]
  },
  {
    name: 'S 5',
    group: 'Sune',
    setup: "L' U R U' L U R'",
    algs: ["R U' L' U R' U' L", "R U' r' F R' F' r", "r U' r' F R' F' r U M", "y2 L U' R' U L' U' R"]
  },
  {
    name: 'S 6',
    group: 'Sune',
    setup: "F R U R' U' R' F2' R U2' R U2' R' F",
    algs: [
      "y2 R U R' F' R U R' U R U2 R' F R U' R'",
      "y2 R U R' U r' F R F' r U2 R'",
      "y2 R U R' U L' U R U' L U2 R'",
      "F' R U2 R' U2 R' F2 R U R U' R' F'"
    ]
  },
  {
    name: 'L 1',
    group: 'L',
    setup: "R U R' U R U' R' U R U' R' U R U2' R' y",
    algs: [
      "y' R U R' U R U' R' U R U' R' U R U2 R'",
      "y' R U2 R' U' R U R' U' R U R' U' R U' R'",
      "y2 R' U2 R U R' U' R U R' U' R U R' U R",
      "R' U' R U' R' U2 R U' R U R' U R U2 R'"
    ]
  },
  {
    name: 'L 2',
    group: 'L',
    setup: "R2' D' R U2' R' D R U2' R",
    algs: [
      "R' U2 R' D' R U2 R' D R2",
      "R U R' U2 L U' R U L' U R'",
      "y2 L' U2 L' D' L U2 L' D L2",
      "y' R' U2 R U R2 D' R U R' D R2"
    ]
  },
  {
    name: 'L 3',
    group: 'L',
    setup: "R2' D R' U2' R D' R' U2' R' y'",
    algs: [
      "y R U2 R D R' U2 R D' R2",
      "R' F' R U R' U' R' F R2 U' R' U2 R",
      "U2 R U2 R2 D' R U' R' D R2 U' R'",
      "y R' U' R U2 L' U R' U' L U' R"
    ]
  },
  {
    name: 'L 4',
    group: 'L',
    setup: "R U R D R' U' R D' R2' y2'",
    algs: [
      "y F R' F' r U R U' r'",
      "y2 R2 D R' U R D' R' U' R'",
      "R U R' U' R' F R U R U' R' F'",
      "y F l' U' L U R U' r'"
    ]
  },
  {
    name: 'L 5',
    group: 'L',
    setup: "R' F' r U R U' r' F y2'",
    algs: ["y2 F' r U R' U' r' F R", "y x R' U R D' R' U' R D x'", "y' R2 D' R U' R' D R U R", "r U R U' r' F R' F'"]
  },
  {
    name: 'L 6',
    group: 'L',
    setup: "R2' F' R U R U' R' F R U' R' U R y",
    algs: [
      "y r U2 R2 F R F' R U2 r'",
      "y' R' U' R U R' F' R U R' U' R' F R2",
      "y F R U R2 F R F' R U' R' F'",
      "y' R' U' R U' F U' R' U' R U F'"
    ]
  },
  {
    name: 'U 1',
    group: 'U',
    setup: "R U2' R' U' R U' R2' U2' R U R' U R",
    algs: [
      "R' U' R U' R' U2 R2 U R' U R U2 R'",
      "y2 R U R' U R U2 R2 U' R U' R' U2 R",
      "y' R U R' U' R U' R' U2 R U' R' U2 R U R'",
      "y2 R U R' U R U2 R' U R U2 R' U' R U' R'"
    ]
  },
  {
    name: 'U 2',
    group: 'U',
    setup: "R' F R' F' R U R U' R' F R U' R' U R U R' F' R",
    algs: [
      "R' F R U' R' U' R U R' F' R U R' U' R' F R F' R",
      "y' R' U' R F R2 D' R U R' D R2 U' F'",
      "y F U R U2 R' U R U R2 F' r U R U' r'",
      "y' r U R' U' r' F R2 U' R' U' R U2 R' U' F'"
    ]
  },
  {
    name: 'U 3',
    group: 'U',
    setup: "R U2' R D R' U2' R D' R2' y2'",
    algs: [
      "y2 R2 D R' U2 R D' R' U2 R'",
      "R' U R U R' F' R U R' U' R' F R2 U' R' U' R",
      "L2 D L' U2 L D' L' U2 L'",
      "R U' R' U' R U2 R' U' R' D' R U2 R' D R"
    ]
  },
  {
    name: 'U 4',
    group: 'U',
    setup: "F R U R' U' R U' R' U' R U R' F'",
    algs: [
      "F R U' R' U R U R' U R U' R' F'",
      "y2 R' F2 R U2 R U2 R' F2 R U2 R'",
      "y' F U2 R' D' R U2 R' D R F'",
      "y2 R U2 R' U2 L' U2 R U2 R' U2 L"
    ]
  },
  {
    name: 'U 5',
    group: 'U',
    setup: "R' U2' R' D' R U2' R' D R2'",
    algs: [
      "R2 D' R U2 R' D R U2 R",
      "y2 L2 D' L U2 L' D L U2 L",
      "R2 F' R U R' U' R' F R' U' R2 U2 R2 U R' U R",
      "L U' R U' L' U R' U2 L U' L'"
    ]
  },
  {
    name: 'U 6',
    group: 'U',
    setup: "F U' R' U R U F' R' U2' R",
    algs: [
      "R2 D' R U R' D R U R U' R' U' R",
      "R' U2 R F U' R' U' R U F'",
      "R U' R' U' R U R D R' U R D' R2",
      "R' U2 R U2 R' F' R U R' U' R' F R2"
    ]
  },
  {
    name: 'T 1',
    group: 'T',
    setup: "R' U' R U' R' U2' R2' U R' U R U2' R'",
    algs: [
      "R U2 R' U' R U' R2 U2 R U R' U R",
      "y' R U R2 U' R2 U' R2 U2 R U' R U' R'",
      "R U2 R' r' F2 r U' R U' R' U' r' F r",
      "y' R U R' U R U2 R' L' U' L U' L' U2 L"
    ]
  },
  {
    name: 'T 2',
    group: 'T',
    setup: "L' U R' U' L R U2' R' U' R",
    algs: [
      "R' U R U2 R' L' U R U' L",
      "R' U R U2 r' R' F R F' r",
      "y2 R' F R U R' U' R' F' R2 U' R' U2 R",
      "y2 R U' R' U2 L R U' R' U L'"
    ]
  },
  {
    name: 'T 3',
    group: 'T',
    setup: "F' r U R' U' L' U l y'",
    algs: ["y R' F' r U R U' r' F", "y l' U' L U R U' r' F", "y2 R' U' R' D' R U R' D R2", "y l' U' L U l F' L' F"]
  },
  {
    name: 'T 4',
    group: 'T',
    setup: "F R U' R' U R U R' U R U' R' F' y2'",
    algs: [
      "y2 F R U R' U' R U' R' U' R U R' F'",
      "y2 F R' D' R U2 R' D R U2 F'",
      "y2 R F R' U R U2 R' U R U F' R'",
      "y R U2 R' F2 R U2 R' U2 R' F2 R"
    ]
  },
  {
    name: 'T 5',
    group: 'T',
    setup: "F R' F' r U R U' r' y",
    algs: [
      "y' r U R' U' r' F R F'",
      "R U R D R' U' R D' R2",
      "y2 x' D R U' R' D' R U R' x",
      "y' R U R' U' L' U R U' R' L"
    ]
  },
  {
    name: 'T 6',
    group: 'T',
    setup: "R' U R2' D r' U2' r D' R2' U' R",
    algs: [
      "R' U R2 D r' U2 r D' R2 U' R",
      "y2 R U' R2 D' r U2 r' D R2 U R'",
      "y R' U' R U R2 D' R U2 R' D R2 U' R' U R",
      "y R U R' U' R2 D R' U2 R D' R2 U R U' R'"
    ]
  },
  {
    name: 'Pi 1',
    group: 'Pi',
    setup: "R' U2' R2' U R2' U R2' U2' R'",
    algs: [
      "R U2 R2 U' R2 U' R2 U2 R",
      "R' U2 R2 U R2 U R2 U2 R'",
      "y2 L' U2 L2 U L2 U L2 U2 L'",
      "R U R' U R U2 R' U' R U R' U R U2 R'"
    ]
  },
  {
    name: 'Pi 2',
    group: 'Pi',
    setup: "R U R' U F2' R U2' R' U2' R' F2' R",
    algs: [
      "y F U R U' R' U R U' R2 F' R U R U' R'",
      "R' F2 R U2 R U2 R' F2 U' R U' R'",
      "y2 L' U' L U L F' L2 U' L U L' U' L U F",
      "y M F R' F' r U2 R U' R' U R U2 R'"
    ]
  },
  {
    name: 'Pi 3',
    group: 'Pi',
    setup: "R' U2' R U2' R2' F' R U R U' R' F U R",
    algs: [
      "R' U' F' R U R' U' R' F R2 U2 R' U2 R",
      "y F U R U' R' U R U2 R' U' R U R' F'",
      "y F R2 U' R2 U R2 U S R2 f'",
      "y' R U R' U R U2 R2 F' r U R U' r' F"
    ]
  },
  {
    name: 'Pi 4',
    group: 'Pi',
    setup: "F U R U' R' U R U' R2' F' R U R U' R'",
    algs: [
      "R U R' U' R' F R2 U R' U' R U R' U' F'",
      "R U2 R' U' R U R' U2 r' F R F' M'",
      "y' R' U2 R U R' U R2 U' L' U R' U' L",
      "R B2 R' U2 R' U2 R B2 U R' U R"
    ]
  },
  {
    name: 'Pi 5',
    group: 'Pi',
    setup: "L' U' L U' L' U' R U' L U R'",
    algs: [
      "R U' L' U R' U L U L' U L",
      "y' R U2 R' U R' D' R U2 R' D R2 U' R'",
      "y' R U R' U F' R U2 R' U2 R' F R",
      "y2 L' U R U' L U' R' U' R U' R'"
    ]
  },
  {
    name: 'Pi 6',
    group: 'Pi',
    setup: "R' U2' R2' U R U R2' D' R U' R' D U' R'",
    algs: [
      "R' F' U' F U' R U S' R' U R S",
      "y' r U R' U R' F R F' R U' R' U R U2 r'",
      "R U D' R U R' D R2 U' R' U' R2 U2 R",
      "R2 D' R U R' D R U R U' R' U R U R' U R"
    ]
  },
  {
    name: 'H 1',
    group: 'H',
    setup: "R U2' R' U' R U R' U' R U' R'",
    algs: [
      "R U R' U R U' R' U R U2 R'",
      "y' R U2 R' U' R U R' U' R U' R'",
      "y R U2 R' U' R U R' U' R U' R'",
      "y' R' U2 R U R' U' R U R' U R"
    ]
  },
  {
    name: 'H 2',
    group: 'H',
    setup: "F U R U' R' U R U2' R' U' R U R' F'",
    algs: [
      "F R U' R' U R U2 R' U' R U R' U' F'",
      "f R2 S' U' R2 U' R2 U R2 F'",
      "y2 f R U R' U' R F' R U R' U' R' S'",
      "f R U R' U' f' R U R' U' R' F R F'"
    ]
  },
  {
    name: 'H 3',
    group: 'H',
    setup: "L' U R U' L U' R' U' R U' R'",
    algs: [
      "R U R' U R U L' U R' U' L",
      "R U R' U R U r' F R' F' r",
      "R' F' R U2 R U2 R' F U' R U' R'",
      "R U R2 D' R U2 R' D R U' R U2 R'"
    ]
  },
  {
    name: 'H 4',
    group: 'H',
    setup: "F U R U' R' U R U' R' U R U' R' F' y'",
    algs: [
      "y F R U R' U' R U R' U' R U R' U' F'",
      "y F U R U' R' U R U' R' U R U' R' F'",
      "U F R U R' U' R U R' U' R U R' U' F'",
      "y' F R U R' U' R U R' U' R U R' U' F'"
    ]
  }
]
