import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

export const CLL_ALGS: AlgorithmCollection[] = [
  {
    name: 'CLL AS 1',
    group: 'AS',
    setup: '',
    algs: ["y R U2 R' U' R U' R'", "y2 L' U' L U' L' U2 L", "R' U' R U' R' U2 R", "U2 L' U' L U' L' U2 L"]
  },
  {
    name: 'CLL AS 2',
    group: 'AS',
    setup: '',
    algs: [
      "R U2 R' F R' F' R U' R U' R'",
      "y2 R' U R U' R2 F R F' R U R' U' R",
      "L' U' L U' L F' L' F L' U2 L",
      "y' R U' R2 U R U B U2 B' R"
    ]
  },
  {
    name: 'CLL AS 3',
    group: 'AS',
    setup: '',
    algs: ["y2 F' L F L' U2 L' U2 L", "R' U L U' R U L'", "y2 F' R U R' U2 R' F2 R", "y R' F R F' R U2 R' U' R' F R F'"]
  },
  {
    name: 'CLL AS 4',
    group: 'AS',
    setup: '',
    algs: ["y2 R' F R F' R U R'", "U2 L' U R U' L U R'", "y2 L' U L F' R U R'", "x' R' F R U' R U R'"]
  },
  {
    name: 'CLL AS 5',
    group: 'AS',
    setup: '',
    algs: [
      "y2 R U2 R' U2 R' F R F'",
      "L U2 L' U2 x' L' U L U'",
      "x' R U2 R' F2 R' F R U'",
      "y' z F R2 F' R' U' R' U z' y' R U' R'"
    ]
  },
  {
    name: 'CLL AS 6',
    group: 'AS',
    setup: '',
    algs: [
      "y' R U2 R' U' R U' R' F R' F' R U R U' R' U'",
      "R2 F R U2 R U' R' U2 F' R",
      "y R U R2 F' R F R U' R2 F R",
      "R2 F' U' R2 F' R2 U F R2"
    ]
  },
  {
    name: 'CLL H 1',
    group: 'H',
    setup: '',
    algs: [
      "F R2 U' R2 U' R2 U R2 F'",
      "F R U' R' U R U2 R' U' R U R' U' F'",
      "y' R' U2 R y R' U R' U' R U' R",
      "y2 F R U R' U' R F' R U R' U' R'"
    ]
  },
  {
    name: 'CLL H 2',
    group: 'H',
    setup: '',
    algs: [
      "R U R' U R U R' F R' F' R",
      "y2 R' F' R U' R' F' R F' R U R'",
      "R U R' U R U L' U R' U' L",
      "y R U' R' F U2 R2 F R U' R"
    ]
  },
  {
    name: 'CLL H 3',
    group: 'H',
    setup: '',
    algs: [
      "y F R U R' U' R U R' U' R U R' U' F'",
      "y x' U2 R U2 R2 F2 R U2 x",
      "R U' R' F R' F' R2 U' R' F R' F' R",
      "R' F R F' R U R2 F R F' R U R'"
    ]
  },
  {
    name: 'CLL H 4',
    group: 'H',
    setup: '',
    algs: ["y R2 U2 R' U2 R2", 'y R2 U2 R U2 R2', "R U R' U R U' R' U R U2 R'", "y' R U2 R' U' R U R' U' R U' R'"]
  },
  {
    name: 'CLL L 1',
    group: 'L',
    setup: '',
    algs: [
      "y R U2 R' F' R U2 R' U R' F2 R",
      "y R' U' R U2 R' F R' F' R U' R",
      "R' F' R U R' U' R' F R2 U' R' U2 R",
      "y2 L' U2 L U y' R2 U R U' R2"
    ]
  },
  {
    name: 'CLL L 2',
    group: 'L',
    setup: '',
    algs: [
      "y2 R U2 R2 F2 R U R' F2 R F'",
      "R U' R' U R U' R' F R' F' R2 U R'",
      "R' U2 R' U' F R2 F' U R2",
      "y2 R' F2 R2 U2 R' U R' F2 R F'"
    ]
  },
  {
    name: 'CLL L 3',
    group: 'L',
    setup: '',
    algs: [
      "y2 R' U R' U2 R U' R' U R U' R2",
      "y2 R2 U' R U2 R' U2 R U' R2",
      "y' R U R' U R U' R' U R U' R' U R U2 R'",
      "y R U' R U' R U2 R' U R' U R'"
    ]
  },
  {
    name: 'CLL L 4',
    group: 'L',
    setup: '',
    algs: [
      "y R U2 R2 F R F' R U2 R'",
      "R U2 R' F R' F' R2 U2 R'",
      "y2 R U R' L' U2 R U R' U2 L",
      "y' R' U' R U R' F' R U R' U' R' F R2"
    ]
  },
  {
    name: 'CLL L 5',
    group: 'L',
    setup: '',
    algs: ["y F R' F' R U R U' R'", "y F R' F' U' R' U R", "y F' U R U' R' F2 R U' R'", "y' R' F' L' F R F' L F"]
  },
  {
    name: 'CLL L 6',
    group: 'L',
    setup: '',
    algs: ["y2 F' R U R' U' R' F R", "y F R U' R' U' R U R' F'", "R U R U' R' F R' F'", "y R' F R U F U' F'"]
  },
  {
    name: 'CLL Pi 1',
    group: 'Pi',
    setup: '',
    algs: [
      "y F R' F' R U2 R U' R' U R U2 R'",
      "R' F2 R F' U2 R U' R' U' F",
      "U F U R U' R' U R U' R2 F' R U R U' R'",
      "y2 L' U2 L U L' U' L U2 L F' L' F"
    ]
  },
  {
    name: 'CLL Pi 2',
    group: 'Pi',
    setup: '',
    algs: [
      "R U2 R' U' R U R' U2 R' F R F'",
      "y F' R U R' U2 R' F R U' R' F2 R",
      "R U R' U' R' F R2 U R' U' R U R' U' F'",
      "R2 U' R' U' F R2 U2 F' R2 F"
    ]
  },
  {
    name: 'CLL Pi 3',
    group: 'Pi',
    setup: '',
    algs: [
      "y F R2 U' R2 U R2 U R2 F'",
      "y' R U' R U' R' U R' F R2 F'",
      "y2 F R' F' R U2 F R' F' R2 U2 R'",
      "U' R' F R U F U' R U R' U' F'"
    ]
  },
  {
    name: 'CLL Pi 4',
    group: 'Pi',
    setup: '',
    algs: [
      "y2 R' F R F' R U' R' U' R U' R'",
      "R U' R' F R' F R U R' F R",
      "R U' R' F L' U L U L' U L",
      "y' R U' R2 D' R U R' D R2 U R'"
    ]
  },
  {
    name: 'CLL Pi 5',
    group: 'Pi',
    setup: '',
    algs: [
      "y' R' U' R' F R F' R U' R' U2 R",
      "R2 U R' U' F R F' R U' R2",
      "U' R' U' R' F R F' R U' R' U2 R",
      "y' R U R' U R' F R F' R U' R' U R U2 R'"
    ]
  },
  {
    name: 'CLL Pi 6',
    group: 'Pi',
    setup: '',
    algs: ["R U' R2 U R2 U R2 U' R", "F R U R' U' R U R' U' F'", "R' U R2 U' R2 U' R2 U R'", "R U2 R2 U' R2 U' R2 U2 R"]
  },
  {
    name: 'CLL Sune 1',
    group: 'Sune',
    setup: '',
    algs: ["L' U2 L U2 L F' L' F", "y2 R' U2 R U2 R B' R' B", "R' F2 R U2 R U' R' F", "R' F2 R U2 L F' L' F"]
  },
  {
    name: 'CLL Sune 2',
    group: 'Sune',
    setup: '',
    algs: [
      "R U R' U' R' F R F' R U R' U R U2 R'",
      "R U2 R' F R U2 R' U R U' R' F",
      "y2 R U' R U' R' U R' U' y R U' R'",
      "R2 F' U' R2 F R2 U F R2"
    ]
  },
  {
    name: 'CLL Sune 3',
    group: 'Sune',
    setup: '',
    algs: ["R U' R' F R' F' R", "R U' R' F L' U' L", "L F' L' F L' U' L", "R U' L' U R' U' L"]
  },
  {
    name: 'CLL Sune 4',
    group: 'Sune',
    setup: '',
    algs: [
      "F R' F' R U2 R U2 R'",
      "y2 x' U R' F' R F2 R U2 R'",
      "y R U' R' F R' F2 R U R U' R' F",
      "y' x' R U' R' U R' F2 R F R U' R' U x"
    ]
  },
  {
    name: 'CLL Sune 5',
    group: 'Sune',
    setup: '',
    algs: [
      "y2 R U R' U R' F R F' R U2 R'",
      "U2 R U R' U R' F R F' R U2 R'",
      "y' R' F R2 F' U' R' U' R2 U R'",
      "R U R' U' R' F R F' R U' R' F R' F' R"
    ]
  },
  {
    name: 'CLL Sune 6',
    group: 'Sune',
    setup: '',
    algs: ["R U R' U R U2 R'", "R U R2 U' R2 U R", "y' R' U2 R U R' U R", "y L' U2 L U L' U L"]
  },
  {
    name: 'CLL T 1',
    group: 'T',
    setup: '',
    algs: ["y' R U R' U' R' F R F'", "y2 R' U' R U F R F'", "U' x L U R' U' L' U R U' x'", "y R B R' U' R' U R F' z"]
  },
  {
    name: 'CLL T 2',
    group: 'T',
    setup: '',
    algs: ["y L' U' L U L F' L' F", "y R' F' R U R U' R' F", "R U R' U' y L' U' L", "y' F R U' R' U R U R' F'"]
  },
  {
    name: 'CLL T 3',
    group: 'T',
    setup: '',
    algs: [
      "F U' R U2 R' U' F2 R U R'",
      "y R U2 R2 F R F' R U' R' U R U2 R'",
      "y2 R U F R' F' R U2 R U2 R2",
      "y' R U' B U2 B' U' R2 F R F'"
    ]
  },
  {
    name: 'CLL T 4',
    group: 'T',
    setup: '',
    algs: [
      "R' U R U2 R2 F' R U' R' F2 R2",
      "y R' U R' F U' R U F2 R2",
      "y2 R' U R' U2 R U2 R' U R2 U' R'",
      "u' R U R' U R U2 R' L' U' L U' L' U2 L U"
    ]
  },
  {
    name: 'CLL T 5',
    group: 'T',
    setup: '',
    algs: [
      "y2 F R U R' U' R U' R' U' R U R' F'",
      "y' R U R' U' R U' R' F' U' F R U R'",
      "y R U R' U2 R U R' U R' F R F'",
      "y R2 F' R U' R' F2 R F R' F' R2"
    ]
  },
  {
    name: 'CLL T 6',
    group: 'T',
    setup: '',
    algs: [
      "R' U R U2 R2 F R F' R",
      "U2 y z R U R' U' R' F R2 U' R' U' R U R' F'",
      "y2 R U' R' U2 L2 F' L' U L'",
      "y2 R' F R U2 R2 F R U' R"
    ]
  },
  {
    name: 'CLL U 1',
    group: 'U',
    setup: '',
    algs: ["y' F R U R' U' F'", "y F U R U' R' F'", "R' F' U' F U R", "y' R' U' F R' F' R U R"]
  },
  {
    name: 'CLL U 2',
    group: 'U',
    setup: '',
    algs: [
      "R' U' R2 U R' U2 R U2 R' U R'",
      "y' R2 F2 R U R' F R2 U2 R' U' R",
      "R' F U' R U' R' U2 F2 R",
      "y2 R2 F2 R U R' F U' R U R2"
    ]
  },
  {
    name: 'CLL U 3',
    group: 'U',
    setup: '',
    algs: [
      "y2 F R U R' U2 F' R U' R' F",
      "R' F R U' R' U' R U R' F' R U R' U' R' F R F' R",
      "y' R U2 R U' R' F R' F2 U' F",
      "y' z' U2 R' U' R2 U' R' U' R U' R' U' x2"
    ]
  },
  {
    name: 'CLL U 4',
    group: 'U',
    setup: '',
    algs: [
      "y' F R' F' R U' R U' R' U2 R U' R'",
      "F R U' R' U R U R' U R U' R' F'",
      "R2 F R F' R' F2 R U R' F R2",
      "F' L' U' L U' L' U' L U L' U L F U'"
    ]
  },
  {
    name: 'CLL U 5',
    group: 'U',
    setup: '',
    algs: [
      "R U' R2 F R F' R U R' U' R U R'",
      "y2 R U2 R' U R' F2 R F' R' F2 R",
      "R2 D' R U2 R' D R U2 R",
      "y2 R2 U R2 F' R U R U' R' F R U' R2"
    ]
  },
  {
    name: 'CLL U 6',
    group: 'U',
    setup: '',
    algs: [
      "R' U R' F R F' R U2 R' U R",
      "L' U L2 F' L' F L' U' L U L' U' L",
      "y' R' U' R2 U' R' U2 R B' R2 F z'",
      "R F' U' R' U' R2 U R' U' R' F R"
    ]
  }
]
