import { AlgorithmCollection } from '@/interfaces/AlgorithmCollection'

export const ZBLL_S_ALGS: AlgorithmCollection[] = [
  {
    name: 'ZBLL S 1',
    group: 'S1',
    setup: "L' R U' L U R' U2' L' U2' L",
    algs: [
      "y2 R' U2 R U F R' U R U' F'",
      "L' U2 L U2 R U' L' U R' L",
      "U2 R' U2 R U F R' U R U' F' U'",
      "R U R' U R U2 R' l' U R' D2 R U' R' D2 R2"
    ]
  },
  {
    name: 'ZBLL S 2',
    group: 'S1',
    setup: "R U2' R' U' R2' D R' U R D' R' U2' R' y'",
    algs: [
      "R U R' U R U' R2 F' R U R U' R' F R U' R'",
      "y R U2 R D R' U' R D' R2 U R U2 R'",
      "R U R' U R U L U2 R' U R U2 R' L'"
    ]
  },
  {
    name: 'ZBLL S 3',
    group: 'S1',
    setup: "R D R' U' R D' R2' U' R U2' R' U' R",
    algs: [
      "R' U R U2 R' U R2 D R' U R D' R'",
      "y' R U R' U R2 D R' U' R D' R' U' R'",
      "y' R' U' R U R2 F' R U R U' R' F U R",
      "y' R U R' U2 R' D' R U' R' D R2 U2 R'"
    ]
  },
  {
    name: 'ZBLL S 4',
    group: 'S1',
    setup: "R U2' R2' D' R U2' R' D R2' U' R' U R U' R' y2'",
    algs: [
      "y2 S' U2 L' U2 L U2 L F' L' f",
      "R' U2 R D R D' R' U' R D R' D' U2 R' U R",
      "y2 R' U2 R U2 R' U R L' U R' U' R L",
      "y L' U2 L U F L' U' L U L F' L2 U L"
    ]
  },
  {
    name: 'ZBLL S 5',
    group: 'S1',
    setup: "L' U R U' L U2' R' U' L' U R U' R' L",
    algs: [
      "y R' F R U R' U' R' F' D' R U R' D R2",
      "y' R2 D' R U' R' D R2 F R' U R U' F'",
      "U' R2 D' R U' R' D R2 F R' U R U' F'",
      "y2 R U R' U' R U R2 D' r U2 r' D R2 U2 R'"
    ]
  },
  {
    name: 'ZBLL S 6',
    group: 'S1',
    setup: "R U B' U R2' U' R2' U' B R' U R' U R y",
    algs: [
      "F' R U R' U R U2 R' F U R U' R' U2 R U' R'",
      "y' R U' R2 U2 R2 U R' D' U R U R' D U' R' U R",
      "y' R' U2 R' D R' U R D' R U R U' R U' R'",
      "F' U' F U' F R' D R2 U R2 D' R U' F'"
    ]
  },
  {
    name: 'ZBLL S 7',
    group: 'S1',
    setup: "R2' F2' U' R F2' R' U F' R U R U' R' F' U R y'",
    algs: [
      "y' R' U' R U R2 U' R' U' R U D' R U R' D R'",
      "R' U L' U2 R U' R' U2 R U2 L U L' U L",
      "y' R' U2 R U R' U R2 U R' F' R U R' U' R' F R2 U' R'",
      "S' r' F' r U r U' r' S L' U' L U F"
    ]
  },
  {
    name: 'ZBLL S 8',
    group: 'S1',
    setup: "U' R2' D r' U2' r D' R2' U' R U' R' y2'",
    algs: [
      "y2 R U R' U R2 D r' U2 r D' R2",
      "y2 R U R' U R2 D r' U2 r D' R2 U",
      "y2 F R U R2 U' R2 U' R2 U2 R U R U R' F'"
    ]
  },
  {
    name: 'ZBLL S 9',
    group: 'S1',
    setup: "R' U' R U' R U R D R' U' R D' R U2' R y",
    algs: [
      "y R U R' U' R U R2 D' R U R' D R U R U2 R'",
      "y' R' U2 R' D R' U R D' R' U' R' U R' U R",
      "y' R' U2 R U R' U' R' F' R U R U' R' F R U R' U R"
    ]
  },
  {
    name: 'ZBLL S 10',
    group: 'S1',
    setup: "R2' D R' U2' R D' R2' U' R U' R' y2'",
    algs: ["y2 R U R' U R2 D R' U2 R D' R2"]
  },
  {
    name: 'ZBLL S 11',
    group: 'S1',
    setup: "R U R' F' R U2' R' U2' R' F R2' U' R'",
    algs: [
      "y' R' D' R U2 R' D R U' R U R' U2 R U R'",
      "R U R2 F' R U2 R U2 R' F R U' R'",
      "F R' U' R2 U' R2 U2 R2 U' R' F'",
      "R U R' U' R B' R' U' R U R B R2"
    ]
  },
  {
    name: 'ZBLL S 12',
    group: 'S1',
    setup: "R U2' R' U R U L U' R' U L' U R U' R'",
    algs: ["R U2 R D R' U2 R D' R' U R' U R U2 R'", "R U R' U' L U' R U L' U' R' U' R U2 R'"]
  },
  {
    name: 'ZBLL S 13',
    group: 'S2',
    setup: "R' D' R U2' R' D R2' U' R' U2' R U R' U R U R' y2'",
    algs: [
      "R U R' U' R2 U' L' U R2 U' L U' R U2 R'",
      "y2 R U' R' U' R U' R' U2 R U R2 D' R U2 R' D R",
      "R2 u R' U R2 U' R u' R2 U F' U2 F",
      "D' R2 U R' U R2 U' R U' R2 D R' U2 R"
    ]
  },
  {
    name: 'ZBLL S 14',
    group: 'S2',
    setup: "x' R U' R' D R2' U l' U R' U' R U R' U' F' y'",
    algs: [
      "R U R' U R' F R F' R U' R' F' U F R U' R'",
      "y F U R U' R' U l F' R U' R2 D' R U l'",
      "f R2 f' U R2 u' R U' R2 U R' u R2",
      "y R D R' U2 R D' R2 U R U2 R' U' R U' R' U' R"
    ]
  },
  {
    name: 'ZBLL S 15',
    group: 'S2',
    setup: "R' U2' F' R U R' U' R' F R2' U R' U R y'",
    algs: [
      "y R' U' F2 U' R2 U R2 U F2 R2 U2 R'",
      "y R' U' R U' R2 F' R U R U' R' F U2 R",
      "y R2 D' R U2 R' D R U R U' R' U R U' R' U2 R",
      "y R' U' R U L U2 R' U R U2 L' U R' U2 R"
    ]
  },
  {
    name: 'ZBLL S 16',
    group: 'S2',
    setup: "R U R' U' L' U2' R U' R' U2' L U' R U2' R' y2'",
    algs: [
      "y2 R U2 R' U' R U R' U' R U R D R' U2 R D' R2",
      "y2 R U2 R D R2 U' R U R2 D' R U' R U' R'",
      "R U R' U R U2 R' U R U R' U' R' F R2 U' R' U' R U R' F'",
      "U2 R U2 R' U' R U R' U' R U R D R' U2 R D' R2"
    ]
  },
  {
    name: 'ZBLL S 17',
    group: 'S2',
    setup: "R U2' R' L' U2' R U' R' U2' R L U2' R' y'",
    algs: [
      "y' F R' U R U F' R' U F U F' R",
      "R U' L' U R2 D2 R U' R' D2 R L",
      "R U R' U R U2 R2 U2 R U2 R' F R U R' U' R' F' R2",
      "R U R' U R U2 R2 U2 R' D' R U' R' D R U R U' R' U' R"
    ]
  },
  {
    name: 'ZBLL S 18',
    group: 'S2',
    setup: "R U R2' D R2' D' R2' U' R2' D R2' D' R",
    algs: [
      "y' F R' U2 R F' R' F U2 F' R",
      "R' D R2 D' R2 U R2 D R2 D' R2 U' R'",
      "y' x U R' B2 R U' R' U B2 U' R x'",
      "y' R' F R' D' R U2 R' D R U2 F' R"
    ]
  },
  {
    name: 'ZBLL S 19',
    group: 'S2',
    setup: "R U2' R' U' R U2' R' U R U' R' U' R U R2' D' R U' R' D R",
    algs: [
      "y' R U R' U R U' R D R' U R r' U2 r D' R2",
      "R' F r2 R2 U2 r U r' U2 R r2 F' R2",
      "y2 R2 D' r U2 r' R U R' D R U' R U R' U R",
      "y2 r' U r' F' r' U' r' U2 R' F' R U2 r U r'"
    ]
  },
  {
    name: 'ZBLL S 20',
    group: 'S2',
    setup: "R U R' U L' U2' R U L U2' R' U L' U L y'",
    algs: [
      "R U' R' U' R U R D R' U2 R D' R2 U R U2 R'",
      "y' F R U R' U' R' F' U2 R U R U' R' U R' U R",
      "y R' U2 R U R2 D' R U2 R' D R U R U' R' U' R",
      "y R2 U' R2 U' R' U2 R U2 R U D' R U' R' D"
    ]
  },
  {
    name: 'ZBLL S 21',
    group: 'S2',
    setup: "R' U' R U' R' U R' D' R U' R' D R U2' R y",
    algs: [
      "y' R' U2 R' D' R U R' D R U' R U R' U R",
      "y' R' U2 R U' R D R' U R D' R' U R' U R",
      "y2 R U R' L' U2 R U2 R' U2 L U2 R U' R'",
      "y R' B2 R U R U R' U2 R U R2 B2 R"
    ]
  },
  {
    name: 'ZBLL S 22',
    group: 'S2',
    setup: "R2' D' R2' U2' R' F2' U F2' U R2' D R' y'",
    algs: [
      "y2 R U R' U R U' R D R' U R D' R' U2 R'",
      "y2 R U R' U R' D' R U R' D R U' R U2 R'",
      "y R D' R2 U' F2 U' F2 R U2 R2 D R2"
    ]
  },
  {
    name: 'ZBLL S 23',
    group: 'S2',
    setup: "R2' D R' U R D' R' U R' U' R U' R' y",
    algs: [
      "y' R U R' U R U' R D R' U' R D' R2",
      "y2 L R U2 R' U' R U2 L2 U R' U' L",
      "y' L' U R U' L U R' L U2 L' U' L U' L'"
    ]
  },
  {
    name: 'ZBLL S 24',
    group: 'S2',
    setup: "R' U' R U' R' U R' D' R U R' D R2' y2'",
    algs: [
      "y2 R2 D' R U' R' D R U' R U R' U R",
      "R U R' U' R' F R F' r U R' U R U2 r'",
      "y R' U' R U' R' U2 R L' U R U' L U R'",
      "R U' L' U R2 U2 L U' L' U2 L R"
    ]
  },
  {
    name: 'ZBLL S 25',
    group: 'S3',
    setup: "R U2' R' U' R U R D R' U2' R D' R2'",
    algs: ["R2 D R' U2 R D' R' U' R' U R U2 R'", "R U R' U' F' L' U2 L U x U2 R' U' l"]
  },
  {
    name: 'ZBLL S 26',
    group: 'S3',
    setup: "R' U2' R' F' R U R U' R' F U2' R y",
    algs: ["y' R' U2 F' R U R' U' R' F R U2 R"]
  },
  {
    name: 'ZBLL S 27',
    group: 'S3',
    setup: "L U2' R' U L' U L U' R U2' L' R' U2' R",
    algs: [
      "y R' U2 R U R' U' R' D' R U2 R' D R2",
      "R' U2 R U R' U' R U R2 F' R U R U' R' F R",
      "R' U2 R L U2 R' U L' U' L U' R U2 L'"
    ]
  },
  {
    name: 'ZBLL S 28',
    group: 'S3',
    setup: "L U2' F L' U' L U L F' L' U2' L'",
    algs: [
      "y R U R' U R U' R2 D' R U R' D R2 U2 R'",
      "y R U2 R' U2 R' F R2 U R' U' R U R' U' F'",
      "L U2 L F L' U' L' U L F' U2 L'",
      "z U R2 U F U' R' U' R U F' R2 U'"
    ]
  },
  {
    name: 'ZBLL S 29',
    group: 'S3',
    setup: "L' U R U' L U R'",
    algs: ["R U' L' U R' U' L", "R U' r' F R' F' r", "y2 L U' R' U L' U' R", "y' F R' F' R y' r' U' R U M'"]
  },
  {
    name: 'ZBLL S 30',
    group: 'S3',
    setup: "R2' U' R U' R U R' U R2' D' U R U R' U' R U' R' D",
    algs: [
      "y' R' U2 R2 U R D' R U R' D R2 U' R U' R'",
      "F R2 D R' U R D' R2 U' R U R' U' R U R' U' F'",
      "R U R' U R U' R' U' D R2 U' R U' R' U R' U R2 D'",
      "D' R U R' U R U' R' U' D R2 U' R U' R' U R' U R2"
    ]
  },
  {
    name: 'ZBLL S 31',
    group: 'S3',
    setup: "R U R' U R U L' U R' U L U L' U L",
    algs: [
      "y' R U R' U R U2 R2 U R U2 L' R' U R U' L",
      "R U' R' U R U' R' F R' F' R U' F' U F",
      "L' U' L U' L' U' R U' L U' R' U' R U' R'",
      "y' R U R' U R U2 R2 U R U2 R' L' U R U' L"
    ]
  },
  {
    name: 'ZBLL S 32',
    group: 'S3',
    setup: "D R' U' R D' R U' R' U R2' U R' U' R2' y",
    algs: [
      "y2 R U R' F' R U R' U R U' R' U' R' F R2 U' R'",
      "y' D' R2 U R U' R2 U' R U R' D R' U R",
      "R U R' U R U R' U' R U R D R' U' R D' R' U2 R'",
      "y' R2 U R U' R2 U' R U R' D R' U R D'"
    ]
  },
  {
    name: 'ZBLL S 33',
    group: 'S3',
    setup: "R' U' R2' U2' R2' D U' R2' U' R2' U R2' D' R2' U' R y'",
    algs: [
      "y R' U' R' U R2 D' U2 R U R' U' D R'",
      "R' L' U2 R L2 U' R' U L2 U2 R U' L",
      "y' R' U2 R y R U' R' U' R U2 R' U' y' R' U' R",
      "y R' U' R' U R2 U2 D' R U R' U' D R'"
    ]
  },
  {
    name: 'ZBLL S 34',
    group: 'S3',
    setup: "F R U' R' U R U R2' F' R U R U R' U' R U' R'",
    algs: [
      "y2 L U' R' U L' R' U' R' U' R' U R U R2",
      "y R' U2 R U R' U' R' D' r U2 r' D R2",
      "y R' D' L D R' D' L' D' F2 R2 B2 U R2 F2 L2 D' R2 U'",
      "R U' L' U R' L' U' L' U' L' U L U L2"
    ]
  },
  {
    name: 'ZBLL S 35',
    group: 'S3',
    setup: "L' U R U' L R U R U R U' R' U' R2'",
    algs: [
      "R2 D r' U2 r D' R' U' R' U R U2 R'",
      "y R' U' R U' R' U R U' R D R' U' R D' R' U R' U2 R",
      "R2 U R U R' U' R' U' R' L' U R' U' L",
      "y2 z U2 R U R U' R' U' R' D' U' R U' R' D"
    ]
  },
  {
    name: 'ZBLL S 36',
    group: 'S3',
    setup: "R U R U' R2' D U2' R' U' R D' U R y",
    algs: [
      "y' R' U' D R' U R D' U2 R2 U R' U' R'",
      "y' R' U' D R' U R U2 D' R2 U R' U' R'",
      "y2 R U' R' y' U' R' U2 R U' R' U' R y R U2 R'",
      "y2 R U' R' U' y' R' U2 R U' R' U' R y R U2 R'"
    ]
  },
  {
    name: 'ZBLL S 37',
    group: 'S4',
    setup: "R U2' R' U2' L' U R U' R' L",
    algs: ["L' R U R' U' L U2 R U2 R'", "M F R' F' r U2 R U2 R'", "r' R F R' F' r U2 R U2 R'"]
  },
  {
    name: 'ZBLL S 38',
    group: 'S4',
    setup: "R U' R' U2' R U' R2' D' R U' R' D R y'",
    algs: [
      "y R' D' R U R' D R2 U R' U2 R U R'",
      "y' R' U2 R2 D R' U' R D' R' U2 R' U R",
      "R U2 R2 U' R2 U' R2 U' L U' R U L'",
      "U R' D' R U R' D R2 U R' U2 R U R'"
    ]
  },
  {
    name: 'ZBLL S 39',
    group: 'S4',
    setup: "R' U2' R' D' R U R' D R2' U' R' U2' R y'",
    algs: [
      "y R' U2 R U R2 D' R U' R' D R U2 R",
      "F R U' R' U' R U R' U R U' R2 F' R U R U' R'",
      "L' R' U2 R U R' U2 L U R U R' U R"
    ]
  },
  {
    name: 'ZBLL S 40',
    group: 'S4',
    setup: "S U2' R U2' R' U2' R' F R f'",
    algs: [
      "f R' F' R U2 R U2 R' U2 S'",
      "y R U R2 F' R U R U' R' F U R U2 R'",
      "y' L R U' R' U L' R U R' U2 R U2 R'",
      "y R U R' F' R U R' U' R' F R2 U' R' L U' R' U L' U' R"
    ]
  },
  {
    name: 'ZBLL S 41',
    group: 'S4',
    setup: "L' R U' L U R' U' L' U2' R U' L U R' y'",
    algs: [
      "y' L' R U R' U' L U R2 D R' U' R D' R2",
      "y' M F R' F' r U R2 D R' U' R D' R2",
      "y R U' L' U R' U2 L U R U' L' U R' L",
      "R' U2 R U R' U R' D' r U2 r' D R U2 R"
    ]
  },
  {
    name: 'ZBLL S 42',
    group: 'S4',
    setup: "F R U R' F R' F' U2' R2' U R2' U R F' y'",
    algs: [
      "y' R' U' F U' R2 U R2 U F' R U' R U' R'",
      "y L U' R' U L' U R' D' R U2 R' D R2",
      "y' R' U2 R2 U R2 U D' R U R' D R U2 R U' R'",
      "R' F' R U R U R' U' R U' R' F R U R' U R U' R'"
    ]
  },
  {
    name: 'ZBLL S 43',
    group: 'S4',
    setup: "R' U' R U' R2' D' r U2' r' D R2' y2'",
    algs: ["y2 R2 D' r U2 r' D R2 U R' U R", "y2 L U2 L' U R' U2 L U' L' R U R' U R"]
  },
  {
    name: 'ZBLL S 44',
    group: 'S4',
    setup: "R U R' U' R2' U R U R' U' D R' U' R D' R",
    algs: [
      "R' D R' U R D' U R U' R' U' R2 U R U' R'",
      "F U R U' R' S R' F' R U R U' R' S'",
      "F U R U' R' S R' F' R U R U' R' S' U'",
      "y' R' U' L U' R2 U L' R U' R2 U2 R' U' R2"
    ]
  },
  {
    name: 'ZBLL S 45',
    group: 'S4',
    setup: "R U R' U R U2' R2' L U L' U' R U2' L U2' L' y'",
    algs: [
      "F R U R' U' R' F' R U2 R U' R' U R U2 R'",
      "y R U R2 F' r U R U' r' F U R U2 R'",
      "R' U2 R U R D R' U R D' R2 U R U' R' U R",
      "R' U2 R U2 R2 D' R U R' D R2 U' R' U R"
    ]
  },
  {
    name: 'ZBLL S 46',
    group: 'S4',
    setup: "R' U2' R' D' R U2' R' D R U' R U' R' U2' R",
    algs: [
      "R' U2 R U R' U R' D' R U2 R' D R U2 R",
      "R U R' U R U2 R' U2 R U R' U' R' F R2 U' R' U' R U R' F'",
      "R U R' U R U2 R' L' U' L U L F' L2 U L U L' U' L F",
      "y R U' L U' R2 D' F2 D R2 U2 L' R'"
    ]
  },
  {
    name: 'ZBLL S 47',
    group: 'S4',
    setup: "R' U' R U R' F R U R' U' R' F' R2'",
    algs: [
      "R2 F R U R U' R' F' R U' R' U R",
      "R U R' U' R' F R2 U' R' U' R U R' F' R U R' U R U2 R'",
      "R' U R U R' U' R' D' R U R' D R2 U R' U R",
      "y z F' U' R' U2 R2 U2 R' U2 R' U' F z'"
    ]
  },
  {
    name: 'ZBLL S 48',
    group: 'S4',
    setup: "R' U' R U' R2' D' R U2' R' D R2' y2'",
    algs: ["y2 R2 D' R U2 R' D R2 U R' U R", "R U R' U R U2 x R D2 R U R' D2 R U' R"]
  },
  {
    name: 'ZBLL S 49',
    group: 'S5',
    setup: "R U R' U L' U2' R U2' R' U2' R L U2' R' y'",
    algs: [
      "y R2 U R2 F' R U2 R' U' R U' R' F R2 U' R2",
      "y2 R U' R D R2 U' R U' R' U2 R2 D' R' U R'",
      "y2 R U' R' U' R U' R' U2 R U R' U R' D' R U R' D R",
      "y' z R' U' R' U R U R F' R' U2 R U R' U' R U F z'"
    ]
  },
  {
    name: 'ZBLL S 50',
    group: 'S5',
    setup: "L' U2' R U' R' U2' L R U R' U' R U R' U' R U' R' y",
    algs: [
      "y F U R' F R F' R U' R' U R U' R' F'",
      "y' F' L' U' L U L' U' L F' L F L' U F",
      "y' R U R' U R U' R' U R U' R' L' U2 R U R' U2 L"
    ]
  },
  {
    name: 'ZBLL S 51',
    group: 'S5',
    setup: "R U' R2' D' U' R U' R' D U2' R2' U R' y",
    algs: [
      "y' R U' R2 U2 D' R U R' U D R2 U R'",
      "U R' U R2 U D R' U R D' U2 R2 U' R",
      "y2 R' U' R U R' F' R U R' U' R' F R U2 R U R' U R",
      "y' R U' R2 U2 R F' U R' U' R F R' U2 R2 U R'"
    ]
  },
  {
    name: 'ZBLL S 52',
    group: 'S5',
    setup: "R' U2' R L U2' R' U2' R U2' L' U R' U R y",
    algs: [
      "y F' R U R' D R U R' U' D' R U' R' F",
      "R' U R U2 R' U2 R' F' R U R U' R' F U' R",
      "R' U R' D' R2 U2 R' U' R U' R2 D R U' R",
      "y R2 U' R2 B R' U' R U' R' U2 R B' R2 U R2"
    ]
  },
  {
    name: 'ZBLL S 53',
    group: 'S5',
    setup: "L' U' L U R U' L' U R' U R U' L U R' y",
    algs: [
      "y' R' U2 R2 U R' F' R U R' U' R' F R2 U' R2 U R",
      "y' R' U' F U R U' R' F' R2 U R' U' R' F R F'",
      "y' R U' L' U R' U' R U' L U R' U' L' U L",
      "R U R' U' L' U R U' L U' L' U R' U' L"
    ]
  },
  {
    name: 'ZBLL S 54',
    group: 'S5',
    setup: "R U2' R' U2' L' U' L U' R U L' U R' U2' L y2'",
    algs: [
      "F R U R' U R U2 R U2 R2 U' R2 U' R2 F'",
      "R' U2 R U R' U' L U' L' U2 R U L U2 L'",
      "R U R2 F2 R U2 R U2 R' F2 U R U2 R'",
      "y' f R' F' R f' R' D R U R' D' R U2 F"
    ]
  },
  {
    name: 'ZBLL S 55',
    group: 'S5',
    setup: "R' U2' L U' R U L' R' U R U' R' U2' R y'",
    algs: [
      "R' U2 R U R' U' R F U' R' U' R U F'",
      "R U R' U R U2 R' F R U' R' U' R U R' F' R U R' U' R' F R F'",
      "y' R U2 R' U' R U R' U' F' R U2 R' U' R U' R' F R U' R'",
      "y R' U2 R U R' U' R L U' R' U L' U2 R"
    ]
  },
  {
    name: 'ZBLL S 56',
    group: 'S5',
    setup: "R U2' R' U' R U L' R' U R U' L U2' R' y",
    algs: [
      "L' U2 R U' R' U2 L U R U' R' U R U2 R'",
      "y2 r F' U2 F r' U2 R' U' R' U R' U R2",
      "y' R' U' R f R' U R U' F' R U R' U' R' F R f'",
      "F R' F' R U R U' R' F U R U2 R' U' R U R' F'"
    ]
  },
  {
    name: 'ZBLL S 57',
    group: 'S5',
    setup: "R U2' L' U R' U' L U' R U' R' y2'",
    algs: [
      "y2 R U R' U L' U R U' L U2 R'",
      "U2 R U R' U r' F R F' r U2 R'",
      "F' R U2 R' U2 R' F2 R U R U' R' F'",
      "y2 R U R' F' r U R' U R U2 r' F R U' R'"
    ]
  },
  {
    name: 'ZBLL S 58',
    group: 'S5',
    setup: "R U2' R2' U' R2' U' R' F U' R' U' R U F'",
    algs: [
      "F U' R' U R U F' R U R2 U R2 U2 R'",
      "R U R' D' R2 U R U' R2 D R' U R2 U2 R'",
      "R U R U R U' R2 D R' U R D' R U2 R'",
      "R U R' U R U' R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'"
    ]
  },
  {
    name: 'ZBLL S 59',
    group: 'S5',
    setup: "R' U' R U' L U' R' U L' U2' R",
    algs: [
      "R' U2 L U' R U L' U R' U R",
      "R' U R U2 R' U R U2 R D R' U' R D' R'",
      "U2 r' F2 R F' r U R' U r' F r",
      "y2 L' U2 R U' L U R' U L' U L"
    ]
  },
  {
    name: 'ZBLL S 60',
    group: 'S5',
    setup: "F R U' R2' U' R U' R' U2' R2' U R' F'",
    algs: [
      "F R U' R2 U2 R U R' U R2 U R' F'",
      "R' F R F' U R U R' U2 F R' F' R",
      "y2 R U R' F' R U R' U R U2 R' F R U' R'"
    ]
  },
  {
    name: 'ZBLL S 61',
    group: 'S6',
    setup: "R U' R' U2' R U' R' U2' R U2' R' U R U R' y2'",
    algs: [
      "y' R U R' U' R' U2 R U R' U R U' R U' R'",
      "y' R' U2 R U R' U R U R' U R' U' R3 U' R' U R U R2",
      "y L' R u R2 u' R2 U R U' L",
      "S r U R' U R U2 r' U2 S'"
    ]
  },
  {
    name: 'ZBLL S 62',
    group: 'S6',
    setup: "R2' U' R' U R U R' U2' R' U R2' U R2' y",
    algs: [
      "R U R' U R U' R' U R' U' R2 U' R' U R' U R",
      "y' R2 U' R2 U' R U2 R U' R' U' R U R2",
      "R U R' U R U2 R U' R' U' R U R U R U' R"
    ]
  },
  {
    name: 'ZBLL S 63',
    group: 'S6',
    setup: "R U2' R2' U2' R2' U R2' U R2' U' R'",
    algs: [
      "R U R2 U' R2 U' R2 U2 R2 U2 R'",
      "y' R' U2 R U R' U R U' R' U R' U' R3 U' R' U R U R2",
      "y2 R' U' R2 U R U R' U' R U R2 U2 R' U'",
      "y R U2 R' U2 R' U2 R U R' U R2 U2 R'"
    ]
  },
  {
    name: 'ZBLL S 64',
    group: 'S6',
    setup: "R' U' R U' R' U2' R y",
    algs: ["y' R' U2 R U R' U R", "y L' U2 L U L' U L"]
  },
  {
    name: 'ZBLL S 65',
    group: 'S6',
    setup: "R' U' R U R U2' R' U' R U' R' U R' U R y2'",
    algs: [
      "R U R' U R U R U R U R U' R' U' R2",
      "y' R2 U R' U' R' U' R U2 R' U' R2 U' R2",
      "y2 R' U' R U' R U R' U R U2 R' U' R' U R",
      "R U' R' U R U R2 U' R U' R U R2 U R"
    ]
  },
  {
    name: 'ZBLL S 66',
    group: 'S6',
    setup: "R' U' R U' R' U R U' R U R2' U R U' R U' R' y'",
    algs: [
      "R U R2 F' R U2 R U' R' U' R' F R2 U' R'",
      "y R U R' U R' U' R2 U' R' U R' U' R U R' U R",
      "y' R' U2 R U R' U R2 U' R U R U R U' R' U' R2",
      "y' R2 U R U' R' U' R U2 R U' R2 U' R2"
    ]
  },
  {
    name: 'ZBLL S 67',
    group: 'S6',
    setup: "R U2' R' U' R U' R'",
    algs: ["R U R' U R U2 R'", "R U R2 U' R2 U R' S R2 S'"]
  },
  {
    name: 'ZBLL S 68',
    group: 'S6',
    setup: "R' U' R2' U R2' U R2' U2' R2' U2' R",
    algs: [
      "R' U2 R2 U2 R2 U' R2 U' R2 U R",
      "R' U2 R2 U R' U R U2 R' U2 R' U2 R",
      "R U R' U R U2 R' U R' U R' U' R3 U' R' U R U R2",
      "y' R' U2 R2 U R U' R' U R U R2 U' R'"
    ]
  },
  {
    name: 'ZBLL S 69',
    group: 'S6',
    setup: "R2' U R U R2' U' R' U' R2' U' R U' R'",
    algs: [
      "y' R U R' U' R' U2 R U R U' R' U R' U R",
      "R U R' U R2 U R U R2 U' R' U' R2",
      "y' R2 U' R' U' R2 U R U R2 U R' U R",
      "R U R' U R U' R' U' R' U2 R U R U' R2 U2 R"
    ]
  },
  {
    name: 'ZBLL S 70',
    group: 'S6',
    setup: "R U R' U' R' U' R U R U' R' U' R' U R y",
    algs: [
      "y' R' U' R U R U R' U' R' U R U R U' R'",
      "R' F' U' F U R F U R U' R' F'",
      "y F' L' U' L U F U' F U R U' R' F'",
      "y' R' U2 R2 U R U R U' R' U' R2 U R"
    ]
  },
  {
    name: 'ZBLL S 71',
    group: 'S6',
    setup: "R U2' R2' U' R2' U' R' U R' U R y2'",
    algs: [
      "y' R' U2 R2 U R2 U R U' R U' R'",
      "y2 R' U' R U' R U R2 U R2 U2 R'",
      "z U' R' U R' U R U2 R U2 R2 U'",
      "L' U' L U' L U L2 U L2 U2 L'"
    ]
  },
  {
    name: 'ZBLL S 72',
    group: 'S6',
    setup: "R2' D' R2' U2' L F2' L' R' D R U' R U' R'",
    algs: [
      "R U R' U' R U R' U R U R U2 R' U' R U' R' U R'",
      "y' R' F R U R' U' R' F' R U' R' D' R U2 R' D R2",
      "R U R' U R U2 R' U R U R' U R' U' R2 U' R' U R' U R",
      "y2 R' U' R U' R U R2 U' R2 U2 R' S R2 S'"
    ]
  }
]
