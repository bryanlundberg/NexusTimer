import { AlgorithmCollection } from '@/interfaces/AlgorithmCollection';

export const PLL_ALGS: AlgorithmCollection[] = [
  {
    name: 'Aa',
    group: 'Adj Swap',
    setup: "x R2' D2' R U R' D2' R U' R x'",
    algs: [
      "x R' U R' D2 R U' R' D2 R2 x'",
      "y' x L2 D2 L' U' L D2 L' U L'",
      "l' U R' D2 R U' R' D2 R2 x'",
      "y x' R2 D2 R' U' R D2 R' U R' x"
    ]
  },
  {
    name: 'Ab',
    group: 'Adj Swap',
    setup: "x R' U R' D2' R U' R' D2' R2' x'",
    algs: [
      "x R2 D2 R U R' D2 R U' R x'",
      "y' x L U' L D2 L' U L D2 L2",
      "y x' R U' R D2 R' U R D2 R2 x",
      "R' B' R U' R D R' U R D' R2 B R"
    ]
  },
  {
    name: 'E',
    group: 'Opp Swap',
    setup: "x' D R U R' D' R U' R' D R U' R' D' R U R' x y'",
    algs: [
      "y x' R U' R' D R U R' D' R U R' D R U' R' D' x",
      "y R' U' R' D' R U' R' D R U R' D' R U R' D R2",
      "R2 U F' R' U R U' R' U R U' R' U R U' F U' R2",
      "y x' L' U L D' L' U' L D L' U' L D' L' U L D"
    ]
  },
  {
    name: 'F',
    group: 'Adj Swap',
    setup: "R' U' R U' R' U R U R2' F' R U R U' R' F U R y'",
    algs: [
      "y R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R",
      "R' U R U' R2 F' U' F U R F R' F' R2",
      "y R' F R f' R' F R2 U R' U' R' F' R2 U R' S",
      "y R2 F R F' R' U' F' U F R2 U R' U' R"
    ]
  },
  {
    name: 'Ga',
    group: 'Adj Swap',
    setup: "R' U' R D' U R2' U R' U R U' R U' R2' D",
    algs: [
      "R2 U R' U R' U' R U' R2 D U' R' U R D'",
      "R2 u R' U R' U' R u' R2 F' U F",
      "y R U R' F' R U R' U' R' F R U' R' F R2 U' R' U' R U R' F'",
      "R2 u R' U R' U' R u' R2 y' R' U R"
    ]
  },
  {
    name: 'Gb',
    group: 'Adj Swap',
    setup: "R2' U R' U R' U' R U' R2' D U' R' U R D'",
    algs: [
      "D R' U' R U D' R2 U R' U R U' R U' R2",
      "R' U' R U D' R2 U R' U R U' R U' R2 D",
      "y F' U' F R2 u R' U R U' R u' R2",
      "R' d' F R2 u R' U R U' R u' R2"
    ]
  },
  {
    name: 'Gc',
    group: 'Adj Swap',
    setup: "D' R U R' U' D R2' U' R U' R' U R' U R2'",
    algs: [
      "D R2 U' R U' R U R' U R2 D' U R U' R'",
      "R2 U' R U' R U R' U R2 D' U R U' R' D",
      "y2 R2 F2 R U2 R U2 R' F R U R' U' R' F R2",
      "R2 u' R U' R U R' u R2 f R' f'"
    ]
  },
  {
    name: 'Gd',
    group: 'Adj Swap',
    setup: "R2' U' R U' R U R' U R2' D' U R U' R' D",
    algs: [
      "R U R' U' D R2 U' R U' R' U R' U R2 D'",
      "D' R U R' U' D R2 U' R U' R' U R' U R2",
      "R U R' y' R2 u' R U' R' U R' u R2",
      "y R2 F' R U R U' R' F' R U2 R' U2 R' F2 R2"
    ]
  },
  {
    name: 'H',
    group: 'EPLL',
    setup: "M2' U' M2' U2' M2' U' M2'",
    algs: [
      "M2 U' M2 U2 M2 U' M2",
      'M2 U M2 U2 M2 U M2',
      "R2 S2 R2 U' R2 S2 R2",
      'M2 U2 M2 U M2 U2 M2'
    ]
  },
  {
    name: 'Ja',
    group: 'Adj Swap',
    setup: "L' R' U2' R U R' U2' L U' R y'",
    algs: [
      "y2 x R2 F R F' R U2 r' U r U2 x'",
      "y R' U L' U2 R U' R' U2 R L",
      "L' U' L F L' U' L U L F' L2 U L",
      "R U' L' U R' U2 L U' L' U2 L"
    ]
  },
  {
    name: 'Jb',
    group: 'Adj Swap',
    setup: "R U R2' F' R U R U' R' F R U' R'",
    algs: [
      "R U R' F' R U R' U' R' F R2 U' R'",
      "R U2 R' U' R U2 L' U R' U' L",
      "r' F R F' r U2 R' U R U2 R'",
      "L' U R U' L U2 R' U R U2 R'"
    ]
  },
  {
    name: 'Na',
    group: 'Opp Swap',
    setup: "R U R' U2' R U R2' F' R U R U' R' F R U' R' U' R U' R'",
    algs: [
      "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'",
      "F' R U R' U' R' F R2 F U' R' U' R U F' R'",
      "R F U' R' U R U F' R2 F' R U R U' R' F",
      "r' D r U2 r' D r U2 r' D r U2 r' D r U2 r' D r"
    ]
  },
  {
    name: 'Nb',
    group: 'Opp Swap',
    setup: "F r' F' r U r U' r2' D' F r U r' F' D r",
    algs: [
      "R' U R U' R' F' U' F R U R' F R' F' R U' R",
      "r' D' F r U' r' F' D r2 U r' U' r' F r F'",
      "R' U L' U2 R U' L R' U L' U2 R U' L",
      "L' U' L U' L' U' L F L' U' L U L F' L2 U L U2 L' U L"
    ]
  },
  {
    name: 'Ra',
    group: 'Adj Swap',
    setup: "R U2' R D R' U R D' R' U' R' U R U R' y'",
    algs: [
      "y R U' R' U' R U R D R' U' R D' R' U2 R'",
      "y R U R' F' R U2 R' U2 R' F R U R U2 R'",
      "L U2 L' U2 L F' L' U' L U L F L2",
      "y R U' R' U' R U R' U R' D' R U' R' D R2 U R'"
    ]
  },
  {
    name: 'Rb',
    group: 'Adj Swap',
    setup: "R' U R U R' U' R' D' R U R' D R U2' R",
    algs: [
      "R' U2 R U2 R' F R U R' U' R' F' R2",
      "y R2 F R U R U' R' F' R U2 R' U2 R",
      "R' U2 R' D' R U' R' D R U R U' R' U' R",
      "y R' U R U R' U' R' D' R U R' D R U2 R"
    ]
  },
  {
    name: 'T',
    group: 'Adj Swap',
    setup: "F R U' R' U R U R2' F' R U R U' R'",
    algs: [
      "R U R' U' R' F R2 U' R' U' R U R' F'",
      "l b d' L' U' F U2 L' U' L' U L U' f' S M r u E U' R'",
      "R U R' U' R' F R2 U' R' U F' L' U L",
      "R2 u R2 u' R2 F2 u' F2 u F2"
    ]
  },
  {
    name: 'Ua',
    group: 'EPLL',
    setup: "M2' U' M' U2' M U' M2'",
    algs: [
      "y2 M2 U M U2 M' U M2",
      "R U R' U R' U' R2 U' R' U R' U R",
      "y R2 U' S' U2 S U' R2",
      "y2 R U' R U R U R U' R' U' R2"
    ]
  },
  {
    name: 'Ub',
    group: 'EPLL',
    setup: "M2' U M' U2' M U M2'",
    algs: [
      "y2 M2 U' M U2 M' U' M2",
      "R' U R' U' R' U' R' U R U R2",
      "R2' U R U R' U' R3 U' R' U R'",
      "y2 R2 U R U R' U' R' U' R' U R'"
    ]
  },
  {
    name: 'V',
    group: 'Opp Swap',
    setup: "D2' R' U R D' R2' U' R' U R' U R' D' R U2' R'",
    algs: [
      "R' U R' U' R D' R' D R' U D' R2 U' R2 D R2",
      "R' U R U' R' f' U' R U2 R' U' R U' R' f R",
      "y R U' R U R' D R D' R U' D R2 U R2 D' R2",
      "R' U R' U' y R' F' R2 U' R' U R' F R F"
    ]
  },
  {
    name: 'Y',
    group: 'Opp Swap',
    setup: "F R' F' R U R U' R' F R U' R' U R U R' F'",
    algs: [
      "F R U' R' U' R U R' F' R U R' U' R' F R F'",
      "F R' F R2 U' R' U' R U R' F' R U R' U' F'",
      "R2 U' R2 U' R2 U F U F' R2 F U' F'",
      "F R' F' R U R U' R2 U' R U R f' U' f"
    ]
  },
  {
    name: 'Z',
    group: 'EPLL',
    setup: "M U2' M2' U2' M U' M2' U' M2'",
    algs: [
      "M' U' M2 U' M2 U' M' U2 M2",
      "M2 U M2 U M' U2 M2 U2 M'",
      "y M2 U' M2 U' M' U2 M2 U2 M'",
      "y M' U M2 U M2 U M' U2 M2"
    ]
  }
]
