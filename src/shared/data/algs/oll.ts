import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

export const OLL_ALGS: AlgorithmCollection[] = [
  {
    name: 'OLL 1',
    group: 'Dot Case',
    setup: "F R' F' R U2' F R' F' R2' U2' R'",
    algs: [
      "R U2 R2 F R F' U2 R' F R F'",
      "y R U' R2 D' r U' r' D R2 U R'",
      "f R U R' U' R f' U' r' U' R U M'",
      "R' U' F R' F' R2 U R f' U' f"
    ]
  },
  {
    name: 'OLL 2',
    group: 'Dot Case',
    setup: "f U R U' R' f' F U R U' R' F'",
    algs: [
      "y' R U' R2 D' r U r' D R2 U R'",
      "F R U R' U' S R U R' U' f'",
      "F R U R' U' F' f R U R' U' f'",
      "y r U r' U2 R U2 R' U2 r U' r'"
    ]
  },
  {
    name: 'OLL 3',
    group: 'Dot Case',
    setup: "F U R U' R' F' U f U R U' R' f' y",
    algs: [
      "y R' F2 R2 U2 R' F R U2 R2 F2 R",
      "y' f R U R' U' f' U' F R U R' U' F'",
      "r' R2 U R' U r U2 r' U M'",
      "M R U R' U r U2 r' U M'"
    ]
  },
  {
    name: 'OLL 4',
    group: 'Dot Case',
    setup: "F U R U' R' F' U' f U R U' R' f' y",
    algs: [
      "y' R' F2 R2 U2 R' F' R U2 R2 F2 R",
      "y' f R U R' U' f' U F R U R' U' F'",
      "R' F R F' U' S R' U' R U R S'",
      "y F U R U' R' F' U' F R U R' U' F'"
    ]
  },
  {
    name: 'OLL 5',
    group: 'Square Shapes',
    setup: "r' U' R U' R' U2' r",
    algs: ["r' U2 R U R' U r", "y2 l' U2 L U L' U l", "y2 R' F2 r U r' F R", "y2 R' F2 L F L' F R"]
  },
  {
    name: 'OLL 6',
    group: 'Square Shapes',
    setup: "r U R' U R U2' r'",
    algs: ["r U2 R' U' R U' r'", "F U' R2 D R' U' R D' R2 U F'", "y2 l U2 L' U' L U' l'", "y' x' D R2 U' R' U R' D' x"]
  },
  {
    name: 'OLL 7',
    group: 'Lightning Shapes',
    setup: "r U2' R' U' R U' r'",
    algs: ["r U R' U R U2 r'", "L' U2 L U2 L F' L' F", "y2 l U L' U L U2 l'", "r U r' U R U' R' r U' r'"]
  },
  {
    name: 'OLL 8',
    group: 'Lightning Shapes',
    setup: "r' U2' R U R' U r y2'",
    algs: ["y2 r' U' R U' R' U2 r", "l' U' L U' L' U2 l", "R U2 R' U2 R' F R F'", "R' F' r U' r' F2 R"]
  },
  {
    name: 'OLL 9',
    group: 'Fish Shapes',
    setup: "F U R U' R2' F' R U R U' R' y'",
    algs: [
      "y R U R' U' R' F R2 U R' U' F'",
      "R U2 R' U' S' R U' R' S",
      "y2 F' U' F r U' r' U r U r'",
      "y' L' U' L U' L F' L' F L' U2 L"
    ]
  },
  {
    name: 'OLL 10',
    group: 'Fish Shapes',
    setup: "R U2' R' F R' F' R U' R U' R'",
    algs: [
      "R U R' U R' F R F' R U2 R'",
      "y F U F' R' F R U' R' F' R",
      "y M' R' U2 R U R' U R U M",
      "y2 L' U' L U L F' L2 U' L U F"
    ]
  },
  {
    name: 'OLL 11',
    group: 'Lightning Shapes',
    setup: "M U' R U2' R' U' R U' R2' r",
    algs: [
      "r' R2 U R' U R U2 R' U M'",
      "y2 r U R' U R' F R F' R U2 r'",
      "S R U R' U R U2 R' U2 S'",
      "M R U R' U R U2 R' U M'"
    ]
  },
  {
    name: 'OLL 12',
    group: 'Lightning Shapes',
    setup: "F U R U' R' F' U' F U R U' R' F'",
    algs: [
      "y' M' R' U' R U' R' U2 R U' M",
      "F R U R' U' F' U F R U R' U' F'",
      "y' S R' U' R U' R' U2 R U2 S'",
      "y l L2 U' L U' L' U2 L U' M'"
    ]
  },
  {
    name: 'OLL 13',
    group: 'Knight Move Shapes',
    setup: "F' U' F r U' r' U r U r'",
    algs: [
      "F U R U2 R' U' R U R' F'",
      "F U R U' R2 F' R U R U' R'",
      "r U' r' U' r U r' F' U F",
      "r U' r' U' r U r' y L' U L"
    ]
  },
  {
    name: 'OLL 14',
    group: 'Knight Move Shapes',
    setup: "F U F' R' F R U' R' F' R",
    algs: [
      "R' F R U R' F' R F U' F'",
      "r U R' U' r' F R2 U R' U' F'",
      "F' U' L' U L2 F L' U' L' U L",
      "l' U l U l' U' l F U' F'"
    ]
  },
  {
    name: 'OLL 15',
    group: 'Knight Move Shapes',
    setup: "r' U' r U' R' U R r' U r",
    algs: [
      "r' U' r R' U' R U r' U r",
      "y2 l' U' l L' U' L U l' U l",
      "r' U' M' U' R U r' U r",
      "y2 R' F' R L' U' L U R' F R"
    ]
  },
  {
    name: 'OLL 16',
    group: 'Knight Move Shapes',
    setup: "r U r' U R U' R' r U' r'",
    algs: [
      "r U r' R U R' U' r U' r'",
      "r U M U R' U' r U' r'",
      "y2 R' F R U R' U' F' R U' R' U2 R",
      "y2 l U l' L U L' U' l U' l'"
    ]
  },
  {
    name: 'OLL 17',
    group: 'Dot Case',
    setup: "F R' F' R U2' F R' F' R U' R U' R'",
    algs: [
      "R U R' U R' F R F' U2 R' F R F'",
      "y2 F R' F' R U S' R U' R' S",
      "y2 F R' F' R2 r' U R U' R' U' M'",
      "y' F' r U r' U' S r' F r S'"
    ]
  },
  {
    name: 'OLL 18',
    group: 'Dot Case',
    setup: "r' U2' R U R' U r2' U2' R' U' R U' r'",
    algs: [
      "y R U2 R2 F R F' U2 M' U R U' r'",
      "y F S' R U' R' S R U2 R' U' F'",
      "r U R' U R U2 r2 U' R U' R' U2 r",
      "R D r' U' r D' R' U' R2 F R F' R"
    ]
  },
  {
    name: 'OLL 19',
    group: 'Dot Case',
    setup: "F R' F' R M U R U' R' U' M'",
    algs: [
      "y S' R U R' S U' R' F R F'",
      "M U R U R' U' M' R' F R F'",
      "R' U2 F R U R' U' F2 U2 F R",
      "r' R U R U R' U' r R2 F R F'"
    ]
  },
  {
    name: 'OLL 20',
    group: 'Dot Case',
    setup: "r U R' U' M2' U R U' R' U' M'",
    algs: [
      "r U R' U' M2 U R U' R' U' M'",
      "M' U2 M U2 M' U M U2 M' U2 M",
      "S' R U R' S U' M' U R U' r'",
      "S R' U' R U R U R U' R' S'"
    ]
  },
  {
    name: 'OLL 21',
    group: 'OCLL',
    setup: "R U R' U R U' R' U R U2' R' y'",
    algs: [
      "R U R' U R U' R' U R U2 R'",
      "y R U2 R' U' R U R' U' R U' R'",
      "y F R U R' U' R U R' U' R U R' U' F'",
      "R' U' R U' R' U R U' R' U2 R"
    ]
  },
  {
    name: 'OLL 22',
    group: 'OCLL',
    setup: "R' U2' R2' U R2' U R2' U2' R'",
    algs: [
      "R U2 R2 U' R2 U' R2 U2 R",
      "R' U2 R2 U R2 U R2 U2 R'",
      "f R U R' U' S' R U R' U' F'",
      "f R U R' U' f' F R U R' U' F'"
    ]
  },
  {
    name: 'OLL 23',
    group: 'OCLL',
    setup: "R U2' R D R' U2' R D' R2'",
    algs: [
      "R2 D R' U2 R D' R' U2 R'",
      "y2 R2 D' R U2 R' D R U2 R",
      "R U R' U R U2 R2 U' R U' R' U2 R",
      "y' R U2 R' U' R U' R' L' U2 L U L' U L"
    ]
  },
  {
    name: 'OLL 24',
    group: 'OCLL',
    setup: "F R' F' r U R U' r'",
    algs: ["r U R' U' r' F R F'", "y' x' R U R' D R U' R' D' x", "y R U R D R' U' R D' R2", "L F R' F' L' F R F'"]
  },
  {
    name: 'OLL 25',
    group: 'OCLL',
    setup: "R' F' r U R U' r' F y'",
    algs: ["R U2 R D R' U2 R D' R2", "y F' r U R' U' r' F R", "F R' F' r U R U' r'", "x R' U R D' R' U' R D x'"]
  },
  {
    name: 'OLL 26',
    group: 'OCLL',
    setup: "R U R' U R U2' R' y'",
    algs: ["y R U2 R' U' R U' R'", "R' U' R U' R' U2 R", "y2 L' U' L U' L' U2 L", "y2 L' U R U' L U R'"]
  },
  {
    name: 'OLL 27',
    group: 'OCLL',
    setup: "R U2' R' U' R U' R'",
    algs: ["R U R' U R U2 R'", "y' R' U2 R U R' U R", "y L' U2 L U L' U L", "y2 L U L' U L U2 L'"]
  },
  {
    name: 'OLL 28',
    group: 'All Corners Oriented',
    setup: "R U R' U' M' U R U' r'",
    algs: ["r U R' U' M U R U' R'", "R' F R S R' F' R S'", "r U R' U' r' R U R U' R'", "y2 M' U M U2 M' U M"]
  },
  {
    name: 'OLL 29',
    group: 'Awkward Shapes',
    setup: "M F R' F' R U R U' R' U' M'",
    algs: [
      "r2 D' r U r' D r2 U' r' U' r",
      "y R U R' U' R U' R' F' U' F R U R'",
      "y S' R U R' U' R' F R F' U S",
      "M U R U R' U' R' F R F' M'"
    ]
  },
  {
    name: 'OLL 30',
    group: 'Awkward Shapes',
    setup: "F U R U2' R' U R U2' R' U' F' y2'",
    algs: [
      "y' r' D' r U' r' D r2 U' r' U r U r'",
      "y2 F U R U2 R' U' R U2 R' U' F'",
      "y2 F R' F R2 U' R' U' R U R' F2",
      "y S' R' U' R f R' U R U' F'"
    ]
  },
  {
    name: 'OLL 31',
    group: 'P Shapes',
    setup: "R' F R U R' U' F' U R",
    algs: [
      "R' U' F U R U' R' F' R",
      "y S R U R' U' f' U' F",
      "y2 S' L' U' L U L F' L' f",
      "y' F R' F' R U R U R' U' R U' R'"
    ]
  },
  {
    name: 'OLL 32',
    group: 'P Shapes',
    setup: "f R' F' R U R U' R' S'",
    algs: [
      "S R U R' U' R' F R f'",
      "y2 L U F' U' L' U L F L'",
      "R U B' U' R' U R B R'",
      "y' R' F R F' U' r U' r' U r U r'"
    ]
  },
  {
    name: 'OLL 33',
    group: 'T Shapes',
    setup: "F R' F' R U R U' R'",
    algs: ["R U R' U' R' F R F'", "y2 L' U' L U L F' L' F", "y2 r' F' r U r U' r' F", "R U R' F' U' F R U' R'"]
  },
  {
    name: 'OLL 34',
    group: 'C Shapes',
    setup: "F U R' U' R' F' R U R2' U' R' y2'",
    algs: [
      "y f R f' U' r' U' R U M'",
      "y2 R U R2 U' R' F R U R U' F'",
      "F R U R' U' R' F' r U R U' r'",
      "y2 R U R' U' B' R' F R F' B"
    ]
  },
  {
    name: 'OLL 35',
    group: 'Fish Shapes',
    setup: "R U2' R' F R' F' R2' U2' R'",
    algs: [
      "R U2 R2 F R F' R U2 R'",
      "f R U R' U' f' R U R' U R U2 R'",
      "y L' U2 L2 F' L' F L' U2 L",
      "R U2 R' d' R' F R U' R' F' R"
    ]
  },
  {
    name: 'OLL 36',
    group: 'W Shapes',
    setup: "F' L F L' U' L' U' L U L' U L y2'",
    algs: [
      "y R U R2 F' U' F U R2 U2 R'",
      "y2 L' U' L U' L' U L U L F' L' F",
      "y2 R U R' F' R U R' U' R' F R U' R' F R F'",
      "y2 R' F' U' F2 U R U' R' F' R"
    ]
  },
  {
    name: 'OLL 37',
    group: 'Fish Shapes',
    setup: "F R U' R' U R U R' F'",
    algs: ["F R' F' R U R U' R'", "F R U' R' U' R U R' F'", "y F' r U r' U' r' F r", "y2 r2 D' r U' r' D r U r"]
  },
  {
    name: 'OLL 38',
    group: 'W Shapes',
    setup: "F R' F' R U R U R' U' R U' R'",
    algs: [
      "R U R' U R U' R' U' R' F R F'",
      "y F R U' R' S U' R U R' f'",
      "r U R' U' r' F R U R U' R' F'",
      "y2 L' U2 l' D' l U2 l' D l L"
    ]
  },
  {
    name: 'OLL 39',
    group: 'Lightning Shapes',
    setup: "L U F' U' L' U L F L' y'",
    algs: [
      "y' f' r U r' U' r' F r S",
      "y' R U R' F' U' F U R U2 R'",
      "y L F' L' U' L U F U' L'",
      "y' f' L F L' U' L' U L S"
    ]
  },
  {
    name: 'OLL 40',
    group: 'Lightning Shapes',
    setup: "R' U' F U R U' R' F' R y'",
    algs: [
      "y R' F R U R' U' F' U R",
      "y' f R' F' R U R U' R' S'",
      "R r D r' U r D' r' U' R'",
      "y' L' U' L F U F' U' L' U2 L"
    ]
  },
  {
    name: 'OLL 41',
    group: 'Awkward Shapes',
    setup: "F U R U' R' F' R U2' R' U' R U' R' y2'",
    algs: [
      "y2 R U R' U R U2 R' F R U R' U' F'",
      "y2 F U R2 D R' U' R D' R2 F'",
      "y' S U' R' F' U' F U R S'",
      "M U' F' L' U' L U F M'"
    ]
  },
  {
    name: 'OLL 42',
    group: 'Awkward Shapes',
    setup: "F U R U' R' F' R' U2' R U R' U R",
    algs: [
      "R' U' R U' R' U2 R F R U R' U' F'",
      "y F S' R U R' U' F' U S",
      "y R' F R F' R' F R F' R U R' U' R U R'",
      "y R' U' F2 u' R U R' D R2 B"
    ]
  },
  {
    name: 'OLL 43',
    group: 'P Shapes',
    setup: "f' U' L' U L f",
    algs: ["y R' U' F' U F R", "y2 F' U' L' U L F", "f' L' U' L U f", "B' U' R' U R B"]
  },
  {
    name: 'OLL 44',
    group: 'P Shapes',
    setup: "f U R U' R' f'",
    algs: ["f R U R' U' f'", "y2 F U R U' R' F'", "y R U B U' B' R'", "y' L U F U' F' L'"]
  },
  {
    name: 'OLL 45',
    group: 'T Shapes',
    setup: "F U R U' R' F'",
    algs: ["F R U R' U' F'", "y R' F' U' F U R", "y2 f U R U' R' f'", "y2 F' L' U' L U F"]
  },
  {
    name: 'OLL 46',
    group: 'C Shapes',
    setup: "R' U' F R' F' R U R",
    algs: [
      "R' U' R' F R F' U R",
      "R' F' U' F R U' R' U2 R",
      "y F R U R' U' F' U' R U R' U R U2 R'",
      "l' U2 L2 F' L' F U L' U l"
    ]
  },
  {
    name: 'OLL 47',
    group: 'L Shapes',
    setup: "F' U' L' U L U' L' U L F",
    algs: [
      "y' F R' F' R U2 R U' R' U R U2 R'",
      "F' L' U' L U L' U' L U F",
      "R' U' R' F R F' R' F R F' U R",
      "y' R' F' U' F U F' U' F U R"
    ]
  },
  {
    name: 'OLL 48',
    group: 'L Shapes',
    setup: "F U R U' R' U R U' R' F'",
    algs: [
      "F R U R' U' R U R' U' F'",
      "y2 f U R U' R' U R U' R' f'",
      "R U2 R' U' R U R' U2 R' F R F'",
      "F R' F' U2 R U R' U R2 U2 R'"
    ]
  },
  {
    name: 'OLL 49',
    group: 'L Shapes',
    setup: "r' U r2' U' r2' U' r2' U r' y2'",
    algs: [
      "y2 r U' r2 U r2 U r2 U' r",
      "l U' l2 U l2 U l2 U' l",
      "R B' R2 F R2 B R2 F' R",
      "y2 R' F R' F' R2 U2 B' R B R'"
    ]
  },
  {
    name: 'OLL 50',
    group: 'L Shapes',
    setup: "r U' r2' U r2' U r2' U' r",
    algs: [
      "r' U r2 U' r2 U' r2 U r'",
      "y2 R' F R2 B' R2 F' R2 B R'",
      "y' R U2 R' U' R U' R' F R U R' U' F'",
      "y2 l' U l2 U' l2 U' l2 U l'"
    ]
  },
  {
    name: 'OLL 51',
    group: 'Line Shapes',
    setup: "f U R U' R' U R U' R' f'",
    algs: [
      "y2 F U R U' R' U R U' R' F'",
      "f R U R' U' R U R' U' f'",
      "y' R' U' R' F R F' R U' R' U2 R",
      "y r' F' U' F U F' U' F U r"
    ]
  },
  {
    name: 'OLL 52',
    group: 'Line Shapes',
    setup: "F R U R' d R' U' R U' R'",
    algs: [
      "y2 R' F' U' F U' R U R' U R",
      "R U R' U R U' B U' B' R'",
      "R U R' U R d' R U' R' F'",
      "R U R' U R U' y R U' R' F'"
    ]
  },
  {
    name: 'OLL 53',
    group: 'L Shapes',
    setup: "r' U2' R U R' U' R U R' U r",
    algs: [
      "r' U' R U' R' U R U' R' U2 r",
      "y2 l' U' L U' L' U L U' L' U2 l",
      "y r' U2 R U R' U' R U R' U r",
      "y' l' U2 L U L' U' L U L' U l"
    ]
  },
  {
    name: 'OLL 54',
    group: 'L Shapes',
    setup: "r U2' R' U' R U R' U' R U' r'",
    algs: [
      "r U R' U R U' R' U R U2 r'",
      "y' r U2 R' U' R U R' U' R U' r'",
      "y2 l U L' U L U' L' U L U2 l'",
      "y' r U r' R U R' U' R U R' U' r U' r'"
    ]
  },
  {
    name: 'OLL 55',
    group: 'Line Shapes',
    setup: "F R' F' U2' R U R' U R2' U2' R'",
    algs: [
      "y R' F U R U' R2 F' R2 U R' U' R",
      "y R' F R U R U' R2 F' R2 U' R' U R U R'",
      "R U2 R2 U' R U' R' U2 F R F'",
      "r U2 R2 F R F' U2 r' F R F'"
    ]
  },
  {
    name: 'OLL 56',
    group: 'Line Shapes',
    setup: "r U r' R U R' U' R U R' U' r U' r'",
    algs: [
      "r U r' U R U' R' U R U' R' r U' r'",
      "r U r' U R U' R' M' U R U2 r'",
      "F R U R' U' R F' r U R' U' r'",
      "r' U' r U' R' U R U' R' U R r' U r"
    ]
  },
  {
    name: 'OLL 57',
    group: 'All Corners Oriented',
    setup: "r U R' U' M U R U' R'",
    algs: ["R U R' U' M' U R U' r'", "y R U' R' S' R U R' S", "y R U R' S' R U' R' S", "R U R' U' R' r U R U' r'"]
  }
]
