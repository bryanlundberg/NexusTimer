import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

export const ZBLL_PI_ALGS: AlgorithmCollection[] = [
  {
    name: 'ZBLL Pi 1',
    group: 'Pi 1',
    setup: "L R' U' R U' R' U R U2' L' U R' U2' R",
    algs: [
      "y' R U R' U R U2 R2 F' r U R U' r' F",
      "y' R U R' U R U2 R2 U' R' F R U R U' R' F' R",
      "R' U2 R U' L U2 R' U' R U R' U R L'",
      "y F U R U2 R' U R U R' F' R U R' U R U2 R'"
    ]
  },
  {
    name: 'ZBLL Pi 2',
    group: 'Pi 1',
    setup: "L' R U R' U R U' R' U2' L U' R U2' R'",
    algs: [
      "y' r' F' r U' r' F2 r2 U R' U' r' F R F'",
      "y R' U' R U' R' U2 R U' R U R D R' U' R D' R2",
      "y' L' U' L U' L' U2 L r U R' U' r' F R F'",
      "R U2 R' U' R U' r' F' r U R' U2 r' F2 r"
    ]
  },
  {
    name: 'ZBLL Pi 3',
    group: 'Pi 1',
    setup: "R U2' R' U' R U' R D' R U' R' D R U R y2'",
    algs: [
      "y2 R' U' R' D' R U R' D R3 U R' U R U2 R'",
      "F R U' R' U R U R2 F' R U2 R U' R' U R U2 R' U'",
      "y2 R' U' R' D' R U R' D R' U R' U R U2 R'",
      "S R U R U' R' F U R' U' R U R' U' f'"
    ]
  },
  {
    name: 'ZBLL Pi 4',
    group: 'Pi 1',
    setup: "R' U2' R U R' U R' D R' U R D' R' U' R' y2'",
    algs: [
      "y2 R U R D R' U' R D' R U' R U' R' U2 R",
      "y' R' U' F U' R2 U R2 U F' R2 U2 R'",
      "y' R' D R2 U2 R2 D' R U R' D R2 U R2 D' R",
      "y2 R U R D R' U' R D' R3' U' R U' R' U2 R"
    ]
  },
  {
    name: 'ZBLL Pi 5',
    group: 'Pi 1',
    setup: "R U R2' F' U2' R U R' U R2' U2' R' U F R U' R'",
    algs: [
      "F R' F' R U2 R U2 R' U' r U R' U R U2 r'",
      "R U R' U R' F R F' R' U' F' U F R2 U' R'",
      "y R U R2 F' R U R U' R' F U R U' R' U R U2 R'",
      "y R U R2 D' R U R' D R2 U2 R' U R U R' U R U2 R'"
    ]
  },
  {
    name: 'ZBLL Pi 6',
    group: 'Pi 1',
    setup: "R' U2' R2' U R2' U R U2' R' F R U R U' R' F'",
    algs: [
      "F R U R' U' R' F' R U2 R' U' R2 U' R2 U2 R",
      "y R' U2 R' D' R U R' D F' R U R U' R' F R U'",
      "y R2 F2 r U r' F R2 U2 x' U' R U l'",
      "y' R U L' R' U2 R U2 R' U2 L U' R U2 R'"
    ]
  },
  {
    name: 'ZBLL Pi 7',
    group: 'Pi 1',
    setup: "R' U' R U' R' U R U R' F R U R' U' R' F' R2'",
    algs: [
      "R2 F R U R U' R' F' R U' R' U' R U R' U R",
      "y R U2 R2 U' R U' R' U2 F R U R U' R' F'",
      "y' R U R' U R U2 R' F U R U2 R' U R U R' F'",
      "R U2 R2 U' R' D R' U' R D2 L F2 L' D R2"
    ]
  },
  {
    name: 'ZBLL Pi 8',
    group: 'Pi 1',
    setup: "F R U' R' U R U2' R' U' R U R' U' F' y'",
    algs: [
      "y F U R U' R' U R U2 R' U' R U R' F'",
      "R' U R U R' U R U' R2 D' R U' R' D R U' R",
      "R U y R U' R' U R U2 R' U' R U R' F'",
      "U R' U2 R2 F' R2 F R2 U2 R' U2 F' R F U2 R2 U'"
    ]
  },
  {
    name: 'ZBLL Pi 9',
    group: 'Pi 1',
    setup: "F' R U2' R' U2' R' F R U R U R' U' R U' R' y",
    algs: [
      "y' R U R' U R U' R' U' R' F' R U2 R U2 R' F",
      "y F R2 U' R2 U R2 U S R2 f'",
      "y F R2 U' R2 U R2 U F' B U2 B'",
      "R U R' U L' U2 R U R' U2 L R U2 R'"
    ]
  },
  {
    name: 'ZBLL Pi 10',
    group: 'Pi 1',
    setup: "F U' R U2' R' U2' R U' R' U' R U R' U F' y",
    algs: [
      "y' F U' R U' R' U R U R' U2 R U2 R' U F'",
      "y R' B' U' R2 U2 R2 U' R2 U' R2 B R",
      "y R' F' R U R U' R' F U R2 U R2 U R U' R U' R2",
      "R U' L U' R' U L' U' R' U' R2 U' R2 U2 R"
    ]
  },
  {
    name: 'ZBLL Pi 11',
    group: 'Pi 1',
    setup: "R' U R U R' U' R' D' R U' R' D R U' R' D' R U R' D R2' y'",
    algs: [
      "y' R F U R2 U2 R2 U R2 U R2 F' R'",
      "y R2 D' R U' R' D R U R' D' R U R' D R U R U' R' U' R",
      "y2 R' U R U' D' R U' R' U2 R U' R' D R' U' R",
      "y L U L2 R U2 L2 U L2 U L2 U R' U' L'"
    ]
  },
  {
    name: 'ZBLL Pi 12',
    group: 'Pi 1',
    setup: "R' U2' R U2' R2' F' R U R U' R' F U R",
    algs: [
      "R' U' F' R U R' U' R' F R2 U2 R' U2 R",
      "R' U' R U' L U2 R' U' L' U2 L R U2 L'",
      "y' B' R2 U R2 U' R2 U' S R2 F z'"
    ]
  },
  {
    name: 'ZBLL Pi 13',
    group: 'Pi 2',
    setup: "R2' D' R U' R' D R2' U' R2' D' R U2' R' D R2' y'",
    algs: [
      "y R2 D' R U2 R' D R2 U R2 D' R U R' D R2",
      "y R2 U' R2 F U R2 U' R2 F' U' R2 U R2",
      "y2 R' U R U' R' U R U R' U2 L' U R U' L",
      "L' U L U' L' U L U L' U2 R' U L U' R"
    ]
  },
  {
    name: 'ZBLL Pi 14',
    group: 'Pi 2',
    setup: "R2' D R' U R D' R2' U R2' D R' U2' R D' R2' y",
    algs: [
      "y' R2 D R' U2 R D' R2 U' R2 D R' U' R D' R2",
      "y' R2 U R2 B' U' R2 U R2 B U R2 U' R2",
      "R' U2 R2 U R2 U R2 U' R' U' R' F R2 U' R' U' R U R' F'",
      "L U2 R' U L' U L U' L' U' L U' R U2 L'"
    ]
  },
  {
    name: 'ZBLL Pi 15',
    group: 'Pi 2',
    setup: "R' U2' R U R2' D' R U' R' D R2' U R' U R",
    algs: [
      "R' U' R U' R2 D' R U R' D R2 U' R' U2 R",
      "R' U2 R' D R' U R D' R U R2 U2 R'",
      "y2 L' U2 L' D L' U L D' L U L2 U2 L' U2"
    ]
  },
  {
    name: 'ZBLL Pi 16',
    group: 'Pi 2',
    setup: "R U2' R' U' R2' D R' U R D' R2' U' R U' R'",
    algs: [
      "R U R' U R2 D R' U' R D' R2 U R U2 R'",
      "R U2 R D' R U' R' D R' U' R2 U2 R",
      "y2 L U L' U L2 D L' U' L D' L2 U L U2 L'"
    ]
  },
  {
    name: 'ZBLL Pi 17',
    group: 'Pi 2',
    setup: "R2' D' R U2' R' D R2' U R' U R U R' U2' R U R' U R",
    algs: [
      "R' U' R U R2 F' R U R U' R' F U' R U R' U R",
      "R' U' R U' R' U2 R U' R' U' R U' R2 D' R U2 R' D R2",
      "R U2 R2 U' R2 U' R' U R' U2 L U' R U L'",
      "y' R' U2 R U R' U2 R U2 R' U R2 D R' U R D' R'"
    ]
  },
  {
    name: 'ZBLL Pi 18',
    group: 'Pi 2',
    setup: "R' F' R U2' R U2' R' F R' U' R2' U' R' U R' U R y'",
    algs: [
      "y R U2 R' U' R U2 R' U2 R U' R2 D' R U' R' D R",
      "y' R' U' F' R U2 R' U' R U' R' F U R U R' U2 R",
      "R' U2 R2 U R2 U R U' R U2 L' U R' U' L",
      "y R' U' R U' R U R2 U R F' R U2 R' U2 R' F R"
    ]
  },
  {
    name: 'ZBLL Pi 19',
    group: 'Pi 2',
    setup: "R U R' U R U2' R' F R U' R' U' R U2' R' U' F' y",
    algs: [
      "y' F U R U2 R' U R U R' F' R U2 R' U' R U' R'",
      "y' R2 D R' U R D' R2 U R U2 R2 U' R U' R' U2 R",
      "y R U2 R2 U' R2 U' R D' r U2 r' D R2",
      "y R' U' R U' R' U2 R2 U R' U' R' F' R U2 R U2 R' F"
    ]
  },
  {
    name: 'ZBLL Pi 20',
    group: 'Pi 2',
    setup: "r' F' r U R U2' r' F2' r U' R' U R U2' R' y2'",
    algs: [
      "y2 R U2 R' U' R U r' F2 r U2 R' U' r' F r",
      "y2 R U2 R' U' R U' R' U' F U R U2 R' U R U R' F'",
      "L' U2 L U L' U' R U2 R' U2 L U R U' R'",
      "R2 U R' U' R' U2 R' U2 R U R' D R' U R D'"
    ]
  },
  {
    name: 'ZBLL Pi 21',
    group: 'Pi 2',
    setup: "R U R' U R U L' U R' U' L y2'",
    algs: [
      "y2 L' U R U' L U' R' U' R U' R'",
      "y' R U2 R' U R' D' R U2 R' D R2 U' R'",
      "y R' U' R U' R' U R' F R U R U' R' F' R",
      "R' U L U' R U' L' U' L U' L'"
    ]
  },
  {
    name: 'ZBLL Pi 22',
    group: 'Pi 2',
    setup: "R U R' U R U2' R D' R U' R' D R U R",
    algs: [
      "r' U r U r' U' r U R2 F R F' R",
      "r' U r U r' U' r U l' R' U R U' R",
      "R' U' R' D' R U R' D R' U2 R' U' R U' R'",
      "y2 L' U R U' L U R' U' R' U' R U' R' U2 R"
    ]
  },
  {
    name: 'ZBLL Pi 23',
    group: 'Pi 2',
    setup: "R' U' R U' R' U2' R' D R' U R D' R' U' R'",
    algs: [
      "r U' r' U' r U r' U' R2 B' R' B R' U",
      "r U' r' U' r U r' U' l R U' R' U l'",
      "r U' r' U' r U r' F R' F' R2 U' R'",
      "R U R D R' U' R D' R U2 R U R' U R"
    ]
  },
  {
    name: 'ZBLL Pi 24',
    group: 'Pi 2',
    setup: "L' U' L U' L' U' R U' L U R'",
    algs: [
      "y' R U R' U F' R U2 R' U2 R' F R",
      "R U' L' U R' U L U L' U L",
      "l F' r' x F l' U L U L' U L",
      "R U' r' F R' F r U r' F r"
    ]
  },
  {
    name: 'ZBLL Pi 25',
    group: 'Pi 3',
    setup: "R' U' R U' R' U R U' R2' D' R U R' D R U R",
    algs: [
      "R' U' R' D' R U' R' D R2 U R' U' R U R' U R",
      "R' U2 R U R' U' R U2 L U' R' U R L'",
      "R' U2 R U R' U' R U F R' U R U' F'",
      "y2 L' U2 L U L' U' L U2 R U' L' U M' x'"
    ]
  },
  {
    name: 'ZBLL Pi 26',
    group: 'Pi 3',
    setup: "F' R U R' U' R' F R U' R U' R' U' R U R' U R U R'",
    algs: [
      "R U' R' U' R U' R' U R U R' U R' F' R U R U' R' F",
      "y R2 F R U R U' R' F' R U2 R U R2 U R2 U2 R'",
      "y' R U2 R' U L U' R' U' R2 U' R2 U2 R L'",
      "y' R U2 R F2 R2 U' R U' R' U R2 F2 R2"
    ]
  },
  {
    name: 'ZBLL Pi 27',
    group: 'Pi 3',
    setup: "R U2' R' U' R U R' U2' L' U R U' R' L y'",
    algs: [
      "y R U R' U R U' R' U R2 D R' U' R D' R' U' R'",
      "y L' R U R' U' L U2 R U' R' U R U2 R'",
      "y M F R' F' r U2 R U' R' U R U2 R'",
      "F' U' L U L' F U L U' L' U L U2 L' U"
    ]
  },
  {
    name: 'ZBLL Pi 28',
    group: 'Pi 3',
    setup: "R' F R U R' U' R' F' R2' U' R' U R U' R' U2' R y2'",
    algs: [
      "y2 R' U2 R U R' U' R U R2 F R U R U' R' F' R",
      "L' R U2 R2 U' R2 U' R' U' L U R' U2 R",
      "y R2 B2 R2 U R' U' R U' R2 B2 R U2 R",
      "y F' U R' F U' R' F' R2 F2 R' F' U R"
    ]
  },
  {
    name: 'ZBLL Pi 29',
    group: 'Pi 3',
    setup: "R U2' R' U2' R' F R2' U' R' U2' R U2' R' U' F' y'",
    algs: [
      "R U' L' U R' U' L U' R U' L' U R' U' L",
      "y F U R U2 R' U2 R U R2 F' R U2 R U2 R'",
      "L U' R U R' L' U2 R U2 R' U R U2 R'",
      "L' U2 R U' L U' R' U' R U2 L' U M' x'"
    ]
  },
  {
    name: 'ZBLL Pi 30',
    group: 'Pi 3',
    setup: "R U R' U' R' F R2' U R' U' R U R' U' F' y'",
    algs: [
      "y F U R U' R' U R U' R2 F' R U R U' R'",
      "y' R U' R U2 R U2 R2 U R' F2 R' U R' U' R2 F2",
      "R U R' U R' F R2 U' R' U' R U R' F' U R U' R'",
      "y2 L' U' L U L F' L2 U' L U L' U' L U F"
    ]
  },
  {
    name: 'ZBLL Pi 31',
    group: 'Pi 3',
    setup: "x U R' U' R U2' L U L' U x' U' R U' R' U' R U' R' y2'",
    algs: [
      "F U R U' R2 F' R2 U R' F' U' F U2 R U' R'",
      "y R U R' U' R U R2 D' R U R' D R U R U' R' U R U2 R'",
      "F U' R2 U R U' R' U R2 U2 R' U' R' U R U' R F'",
      "y R U R' U R U2 R' U' R U R' U R2 D R' U2 R D' R2"
    ]
  },
  {
    name: 'ZBLL Pi 32',
    group: 'Pi 3',
    setup: "r' F' r U r U2' r' F2' U' R U R' U' R U' R' y",
    algs: [
      "y' R U R' U R U' R2 F R F' R U' R' F' U F",
      "f R U R2 D' R U' R' D R S' R U R' U' F'",
      "y' F' U' L' U L S' L D L' U' L D' L2 U L f U2",
      "y2 R' D' R U R' D R U2 R U2 R' U R U' R' U' R U' R'"
    ]
  },
  {
    name: 'ZBLL Pi 33',
    group: 'Pi 3',
    setup: "l U2' l' U2' R' U2' R B2' U R' U R y'",
    algs: [
      "y R' U' R U' B2 R' U2 R U2 l U2 l'",
      "y r' F R F' r U R' U R U2 R' U' R U' R'",
      "y R' F R F' r U R' U R U2 r' U' R U' R'",
      "y' L' U' L U' F2 L' U2 L U2 L F2 L'"
    ]
  },
  {
    name: 'ZBLL Pi 34',
    group: 'Pi 3',
    setup: "R2' D' R U' R' D R U' R U R' U' R U R' U R y",
    algs: [
      "y' R' U' R U' R' U R U' R' U R' D' R U R' D R2",
      "y L' U R U' L U R2 U' R U' R' U2 R",
      "y R B2 R' U R2 B2 R' U' R' U' R2 B2 R2"
    ]
  },
  {
    name: 'ZBLL Pi 35',
    group: 'Pi 3',
    setup: "R' F2' R U' R2' F2' R U R U R2' F2' R2' y'",
    algs: [
      "y2 R2 D R' U R D' R' U R' U' R U R' U' R U' R'",
      "y R U2 R' U' R U' R2 U r f' U f r'",
      "y' L U2 L' U' L U' L2 U l F' L F l'",
      "y R U2 R' U' R U' R' U2 r' F R F' r U R'"
    ]
  },
  {
    name: 'ZBLL Pi 36',
    group: 'Pi 3',
    setup: "R U R' U F2' R U2' R' U2' R' F2' R",
    algs: [
      "R' U' R U' R' U2 R U' L' U R U' L U R'",
      "R' F2 R U2 R U2 R' F2 U' R U' R'",
      "y2 L' U' L U' L' U2 L U L' U R U' L U R'"
    ]
  },
  {
    name: 'ZBLL Pi 37',
    group: 'Pi 4',
    setup: "R' U2' R U R' U' R U R2' F R U R U' R' F' R",
    algs: [
      "R' F R U R' U' R' F' R2 U' R' U R U' R' U2 R",
      "y' R U R' U R2 F2 R' U2 R' U2 R2 F2 R2",
      "y F' R U R' U R U' R' U' R' F R U' R U' R' U R U R'",
      "y R' U' F R F2 R2 F R U F' R U' F"
    ]
  },
  {
    name: 'ZBLL Pi 38',
    group: 'Pi 4',
    setup: "R U R' U R U' R' U R2' D R' U' R D' R' U' R'",
    algs: [
      "R U R D R' U R D' R2 U' R U R' U' R U' R'",
      "R U2 R' U' R U R' U2 r' F R F' M'",
      "R U2 R' U' R U R' U2 L' U R U' M' x'"
    ]
  },
  {
    name: 'ZBLL Pi 39',
    group: 'Pi 4',
    setup: "R U2' R' U L U' R' U' R2' U' R2' U2' R L'",
    algs: [
      "y' R2 F2 R2 U' R U R' U R2 F2 R' U2 R'",
      "R U2 R2 U' R2 U' R' U2 R' F R U R' U' R' F' R2",
      "y F' R U R' U' R' F R U' R U' R' U' R U R' U R U R'",
      "R' U2 R U R U2 R' U2 R' F' R U2 R U2 R' F R' U R"
    ]
  },
  {
    name: 'ZBLL Pi 40',
    group: 'Pi 4',
    setup: "R' U' R' D' R U' R' D R2' U R' U' R U R' U R y",
    algs: [
      "y' R' U' R U' R' U R U' R2 D' R U R' D R U R",
      "y2 F U R' U' R F' U' R' U R U' R' U2 R",
      "y' R' U R' F R2 U R' U' R U R' U' F' R U2 R' U R",
      "y' R' U' R U' R' U R U2 R D R' U R D' R2 U2 R"
    ]
  },
  {
    name: 'ZBLL Pi 41',
    group: 'Pi 4',
    setup: "F U R U' R' U R U' R2' F' R U R U' R'",
    algs: ["R U R' U' R' F R2 U R' U' R U R' U' F'", "R U R' U' l' U R2 x' U R' U' R U R' U' F'"]
  },
  {
    name: 'ZBLL Pi 42',
    group: 'Pi 4',
    setup: "L U' R U R' L' U2' R U2' R' U R U2' R' y2'",
    algs: [
      "y2 R U2 R' U2 R' F R2 U' R' U2 R U2 R' U' F'",
      "y2 R' U' R' D' R U' D R' D' R U2 R' D R D' R' D R2",
      "y2 R U2 R' U2 l' U R' z' R' U' R U' r'",
      "y2 R U2 R' U2 R' F R2 l U' R' U R' D' x"
    ]
  },
  {
    name: 'ZBLL Pi 43',
    group: 'Pi 4',
    setup: "R2' F2' U R U R2' U' R' U' F2' R2' U' R U' R' y",
    algs: [
      "y R U2 R' U' R U R' U' R' D' R U' R' D R2 U' R' U R U' R'",
      "R U2 R' U R2 D R' U2 R D' R2 U' R U2 R' U' R U R'",
      "y R' U2 R U' D' R2 D R2 U' R' D' R D R' U R2",
      "y' R U R' U R2 F2 U R U R2 U' R' U' F2 R2"
    ]
  },
  {
    name: 'ZBLL Pi 44',
    group: 'Pi 4',
    setup: "R U R' U R U' R' U F2' r U2' r' U' r' F r",
    algs: [
      "r' F' r U r U2 r' F2 U' R U R' U' R U' R'",
      "y' F U R U' R' S R' D' R U R' D R2 U' R' f'",
      "y2 R U R' U R U R' U' R U2 R' U2 R' D' R U' R' D R",
      "U' F' U' F R U R' F R' F' R2 U R' U' R U' R'"
    ]
  },
  {
    name: 'ZBLL Pi 45',
    group: 'Pi 4',
    setup: "R' U' R U' B2' R' U2' R U2' l U2' l'",
    algs: [
      "R U R' U R U2 R' U' R U' L' U R' U' L",
      "R B2 R' U2 R' U2 R B2 U R' U R",
      "y2 R U2 R' U2 R' F2 R F2 U L' U L",
      "l U2 l' U2 R' U2 R B2 U R' U R"
    ]
  },
  {
    name: 'ZBLL Pi 46',
    group: 'Pi 4',
    setup: "R' U' R U' R' U R U' R' U R' D' R U R' D R2' y2'",
    algs: [
      "y' R' U2 R U R' U R2 U' r' F R' F' r",
      "y' R' U2 R U R' U R2 U' L' U R' U' L",
      "y2 R2 D' R U' R' D R U' R U R' U' R U R' U R",
      "y' R2 B2 R2 U R U R B2 R2 U' R B2 R'"
    ]
  },
  {
    name: 'ZBLL Pi 47',
    group: 'Pi 4',
    setup: "R2' D R' U R D' R' U R' U' R U R' U' R U' R' y'",
    algs: [
      "y R U R' U R U' R' U R U' R D R' U' R D' R2",
      "y' L U' R' U L' U' R2 U R' U R U2 R'",
      "y' R' F2 R U' R2 F2 R U R U R2 F2 R2",
      "y R U' L' U R' U' L U2 R U R' U R U2 R'"
    ]
  },
  {
    name: 'ZBLL Pi 48',
    group: 'Pi 4',
    setup: "R' F2' R U2' R U2' R' F2' U' R U' R' y",
    algs: [
      "y' R U R' U F2 R U2 R' U2 R' F2 R",
      "y2 R U R' U R U' R' U R' D' R U2 R' D R2 U' R' U2 R U2 R'",
      "U' R U R' F' R U' r' F R' F r U F",
      "y R U' L' U R' U' L U R' U2 R U R' U R"
    ]
  },
  {
    name: 'ZBLL Pi 49',
    group: 'Pi 5',
    setup: "R' U2' R2' U R U R2' D' R U' R' D U' R'",
    algs: [
      "y R U2 R' U2 R' U' F U R2 U' R' U R U' R' F'",
      "R U D' R U R' D R2 U' R' U' R2 U2 R",
      "y2 R' U2 R U' R D R' U' R D' R2 U R U' R' U R",
      "y2 R F' U' R2 U' F U F' R2 U F R'"
    ]
  },
  {
    name: 'ZBLL Pi 50',
    group: 'Pi 5',
    setup: "R U2' R' U' F' R U2' R' U' R U' R' F R U' R' y",
    algs: [
      "R' F' U' F U' R U S' R' U R S",
      "y' R U R' F' R U R' U R U2 R' F U R U2 R'",
      "r' U' R U' R' U R U' R' U R' F R F' U r",
      "y2 S' R U R' S U R U' B U' B' R'"
    ]
  },
  {
    name: 'ZBLL Pi 51',
    group: 'Pi 5',
    setup: "F R2' U' R U' R U' R' U2' R' U R2' F' y2'",
    algs: [
      "y2 R F U' R2 U2 R U R' U R2 U F' R'",
      "y2 R2 D R' U2 R D' R' U' R' U R2 D R' U2 R D' R2",
      "S' R U R' S R U' R2 F' U' F U' R U R' U R",
      "B' R2 U R' U R' U R U2 R U' R2 f z'"
    ]
  },
  {
    name: 'ZBLL Pi 52',
    group: 'Pi 5',
    setup: "R U2' R' U R' D' R U R' D R2' U' R' U R U' R' y'",
    algs: [
      "y R U R' U' R U R2 D' R U' R' D R U' R U2 R'",
      "R' U R U F R' U R U' F' U' R' U' R",
      "F' L' U' L U L' U' L2 U F U' L' U2 L' U2 L",
      "y' R U2 R2 U' R' U' R2 D R' U R U D' R"
    ]
  },
  {
    name: 'ZBLL Pi 53',
    group: 'Pi 5',
    setup: "F R U' R' U2' R' U2' R2' U R2' U R U' F'",
    algs: [
      "F U R' U' R2 U' R2 U2 R U2 R U R' F'",
      "y2 R U' R2 D' R U2 R' D U2 R2 U R2 U R",
      "F U R' U' R2 U' R2 U2 R F' L' U L",
      "y' R' U' R' F R F' R U' R' U2 R S R' F' R S' R' F R U' M' U2 M"
    ]
  },
  {
    name: 'ZBLL Pi 54',
    group: 'Pi 5',
    setup: "R2' D' R U2' R' D R U2' R' D' R U' R' D R U R y'",
    algs: [
      "y R' U' R' D' R U R' D R U2 R' D' R U2 R' D R2",
      "R U2 R2 F R F' R' F R F' R' F R F' R U2 R'",
      "y R2 D' R U2 R' D R U2 R' D' R U' R' D R U R",
      "y' R' F2 D R U2 R' D' R2 U2 R' F2 R U2 R'"
    ]
  },
  {
    name: 'ZBLL Pi 55',
    group: 'Pi 5',
    setup: "R U R' U R U R' U' R U R D R' U R D' R2'",
    algs: [
      "R2 D R' U' R D' R' U' R' U R U' R' U' R U' R'",
      "R U R' U L' U2 R U2 R' U2 L U' R U' R'",
      "R U R' U2 B' U R U2 R' U' B U2 R U' R'",
      "y2 R U R' U R U R' U' R U R D R' U R D' R2"
    ]
  },
  {
    name: 'ZBLL Pi 56',
    group: 'Pi 5',
    setup: "R' U' R U' R' U' R U R' U' R' D' R U' R' D R2'",
    algs: [
      "R2 D' R U R' D R U R U' R' U R U R' U R",
      "R' U' R U2 F U' R' U2 R U F' U2 R' U R",
      "U2 L' U' L U' R U2 L' U2 L U2 R' U L' U L",
      "L U L' U R' U L U R U R' U M x"
    ]
  },
  {
    name: 'ZBLL Pi 57',
    group: 'Pi 5',
    setup: "R U R' U' R U R2' D' R U' R' D R U' R U2' R' y2'",
    algs: [
      "y2 R U2 R' U R' D' R U R' D R2 U' R' U R U' R'",
      "y2 R' U R U F U R' U' R F' U' R' U' R",
      "y L' U2 L U2 L U F' U' L2 U L U' L' U L F",
      "y' F' R U F2 U R' U' R F2 U' R' F"
    ]
  },
  {
    name: 'ZBLL Pi 58',
    group: 'Pi 5',
    setup: "F R2' U' R U2' R U R' U R' U R2' F'",
    algs: [
      "R2 D R' U2 R D' R2 U' R U R D R' U2 R D' R2",
      "R F U' R2 U' R U' R' U2 R2 U F' R'",
      "F R2 U' R U' R U' R' U2 R' U R2 F'",
      "y2 R2 U R' U2 R' U' R U R D R' U R D' R' U R U' R2"
    ]
  },
  {
    name: 'ZBLL Pi 59',
    group: 'Pi 5',
    setup: "R' U2' R U' R D R' U' R D' R2' U R U' R' U R y",
    algs: [
      "y' r U R' U R' F R F' R U' R' U R U2 r'",
      "R F' U' R2 F U' F' U R2 U F R'",
      "y' R' U' R U R' U' R2 D R' U R D' R' U R' U2 R",
      "y2 F R U R' U' R U R2 U' F' U R U2 R U2 R'"
    ]
  },
  {
    name: 'ZBLL Pi 60',
    group: 'Pi 5',
    setup: "R U R' F' R U R' U R U2' R' F U R U2' R' y'",
    algs: [
      "y R U2 R' U' F' R U2 R' U' R U' R' F R U' R'",
      "y2 S' R' U' R S U' R' U F' U F R",
      "r U R' U R U' R' U x' R F' R U' R' U F' L'",
      "y R U2 R2 U' R2 U' M' x' U' R' U L' U2 R"
    ]
  },
  {
    name: 'ZBLL Pi 61',
    group: 'Pi 6',
    setup: "R' U2' R2' U R2' U R2' U2' R'",
    algs: ["R U2 R2 U' R2 U' R2 U2 R"]
  },
  {
    name: 'ZBLL Pi 62',
    group: 'Pi 6',
    setup: "R' U' R U' R' U2' R2' U2' R' U' R U' R' y'",
    algs: [
      "y' R' U2 R U R' U R2 U R' U R U2 R'",
      "S' r' U r2 U' r2 U' r2 U r' S",
      "y R U R' U R U2 R2 U2 R U R' U R",
      "R U2 R' U' R U' R' U2 R' U' R U' R' U2 R"
    ]
  },
  {
    name: 'ZBLL Pi 63',
    group: 'Pi 6',
    setup: "R U' R' U2' R U R' U2' R U R' U2' R U2' R' y",
    algs: [
      "y' R U2 R' U2 R U' R' U2 R U' R' U2 R U R'",
      "y2 R U R' U' R2 U R' U R' U' R U R U2 R2",
      "y R U2 L' U R' U' R U R' U' R L U2 R'",
      "S R2 S' R U2 R2 U R2 U' R2 U2 R"
    ]
  },
  {
    name: 'ZBLL Pi 64',
    group: 'Pi 6',
    setup: "R' U R U2' R' U' R U2' R' U' R U2' R' U2' R y'",
    algs: [
      "y R' U2 R U2 R' U R U2 R' U R U2 R' U' R",
      "y2 R U R' U' R2 U R' U R U2 R2 U' R U R'",
      "y2 S' U2 S R U2 R2 U' R2 U R2 U2 R'",
      "y L' U2 R U' L U L' U' L U L' R' U2 L"
    ]
  },
  {
    name: 'ZBLL Pi 65',
    group: 'Pi 6',
    setup: "R U2' R' U2' R U' R' U2' R U' R' U2' R U R' y2'",
    algs: [
      "y2 R' U R U' R2 U2 R U R' U R2 U' R' U R",
      "y' r U2 R2 F R F' R' F R F' R U2 r'",
      "R' U2 R2 U R2 U' R2 U2 R' S R2 S'",
      "y2 R U' R' U2 R U R' U2 R U R' U2 R U2 R'"
    ]
  },
  {
    name: 'ZBLL Pi 66',
    group: 'Pi 6',
    setup: "R' U2' R U2' R' U R U2' R' U R U2' R' U' R y2'",
    algs: [
      "y2 R U' R' U R2 U2 R' U' R U' R2 U R U' R'",
      "R U2 R2 U' R2 U R2 U2 R S R2 S'",
      "y2 R2 U2 R U R U' R' U R' U R2 U' R' U R",
      "y2 R' U R U2 R' U' R U2 R' U' R U2 R' U2 R"
    ]
  },
  {
    name: 'ZBLL Pi 67',
    group: 'Pi 6',
    setup: "R' U2' R U R' U R2' U R' U R U2' R' y'",
    algs: [
      "y R U2 R' U' R U' R2 U' R U' R' U2 R",
      "S' r U' r2 U r2 U r2 U' r S",
      "y' R' U' R U' R' U2 R2 U2 R' U' R U' R'",
      "R' U2 R U R' U R U2 R U R' U R U2 R'"
    ]
  },
  {
    name: 'ZBLL Pi 68',
    group: 'Pi 6',
    setup: "R U2' R2' U' R2' U' R2' U2' R",
    algs: ["R' U2 R2 U R2 U R2 U2 R'", "y2 L' U2 L2 U L2 U L2 U2 L'"]
  },
  {
    name: 'ZBLL Pi 69',
    group: 'Pi 6',
    setup: "R' U2' R2' U R' U R U2' R' U' R' U R",
    algs: [
      "R U R' U R U2 R' U' R U R' U R U2 R'",
      "R' U' R U R U2 R' U' R U' R2 U2 R",
      "F' U' L' U L S' U' L' U L f",
      "y2 f' L' U' L U f F' L' U' L U F"
    ]
  },
  {
    name: 'ZBLL Pi 70',
    group: 'Pi 6',
    setup: "R U2' R2' U' R U' R' U2' R U R U' R'",
    algs: [
      "R' U' R U' R' U2 R U R' U' R U' R' U2 R",
      "R U R' U' R' U2 R U R' U R2 U2 R'",
      "y2 F U R U' R' S U R U' R' f'",
      "R U2 R2 U' R U' R' U2 R U R U' R'"
    ]
  },
  {
    name: 'ZBLL Pi 71',
    group: 'Pi 6',
    setup: "R U2' R' U' R U' R' U' R U2' R' U' R U' R' y'",
    algs: [
      "y R U R' U R U2 R' U R U R' U R U2 R'",
      "R' U2 R U R' U R U R' U2 R U R' U R",
      "y' R' U' R U' R' U2 R U' R' U' R U' R' U2 R",
      "y R2 D' R U' R' D R U R' D' R U2 R' D R U2 R"
    ]
  },
  {
    name: 'ZBLL Pi 72',
    group: 'Pi 6',
    setup: "R U2' R' U' R U R2' U2' R2' U R2' U R2' U' R'",
    algs: [
      "R U R2 U' R2 U' R2 U2 R2 U' R' U R U2 R'",
      "R U R' U' R' U' R U R U R' U' R' U R U' R U' R'",
      "F R U R' U' R U R' U' F' R U R' U' M' U R U' r'",
      "y' R' U2 R U R' U' R2 U2 R2 U' R2 U' R2 U R"
    ]
  }
]
