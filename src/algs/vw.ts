import { AlgorithmCollection } from "@/interfaces/AlgorithmCollection";

export const WV_ALGS: AlgorithmCollection[] = [
  {
    name: 'WV 1',
    group: '',
    setup: "L' U2' R U' R' U2' L U'",
    algs: [
      "U L' U2 R U R' U2 L",
      "f' L U L' U' L' f",
      "U R' D' R U R' D R U' R U' R'",
      "L' U2 R U2 R' U2 L"
    ]
  },
  {
    name: 'WV 2',
    group: '',
    setup: "R U R' U'",
    algs: [
      "U R U' R'",
      "R U R' U' R U R' U' R U R' U' R U R' U' R U R' U'",
      "U l F' l'",
      "R' U2 R U R U' R2 U2 R"
    ]
  },
  {
    name: 'WV 3',
    group: '',
    setup: "F R U R' U' R' F' R",
    algs: [
      "R' F R U R U' R' F'",
      "U' L U' R U L' U R'",
      "R' F R F' U L U F U' F' L'",
      "U R U' R' U F R' F' r U R U' r'"
    ]
  },
  {
    name: 'WV 4',
    group: '',
    setup: "R2' D R' U R D' R2' U'",
    algs: [
      "U R2 D R' U' R D' R2",
      "U2 R' D' R U' R' D R2 U' R'",
      "U2 R U' R' L' U2 R U R' U2 L",
      "U R U' R' U' r U R' U' r' F R F'"
    ]
  },
  {
    name: 'WV 5',
    group: '',
    setup: "R' U2' R U R' U R U' R U R' U'",
    algs: [
      "U R U' R' U R' U' R U' R' U2 R",
      "y' U2 S R2 F R F' R S'",
      "U R U' R' U2 R U2 R' U' R U' R'",
      "U R U R' U' R U R D R' U2 R D' R2"
    ]
  },
  {
    name: 'WV 6',
    group: '',
    setup: "R U' R' U2' R U R' U2' R U R'",
    algs: [
      "R U' R' U2 R U' R' U2 R U R'",
      "U' R' D' R U2 R' D R2 U' R'",
      "U R U' R' U' R2 D R' U2 R D' R' U2 R'"
    ]
  },
  {
    name: 'WV 7',
    group: '',
    setup: "R U R' U R U' R' U'",
    algs: [ "U R U R' U' R U' R'", "R' U' R U R U' R' U' R' U R" ]
  },
  {
    name: 'WV 8',
    group: '',
    setup: "R U2' R' U' R U R' U2'",
    algs: [ "U2 R U' R' U R U2 R'", "U2 R U L' U R' U' L" ]
  },
  {
    name: 'WV 9',
    group: '',
    setup: "R' F' R U2' R U2' R' F U2'",
    algs: [
      "U2 F' R U2 R' U2 R' F R",
      "y2 U2 r B2 U R' U' r' F R F'",
      "U2 F2 R U2 R' U2 R' F2 R",
      "U2 L' R U R' U' R U R' U' L U' R U' R'"
    ]
  },
  {
    name: 'WV 10',
    group: '',
    setup: "F U R U' R' U R U' R2' F' R",
    algs: [
      "U R U R2 U' R2 U' R2 U2 R",
      "R' F R2 U R' U' R U R' U' F'",
      "R' U2 R U R' U R2 U2 R'",
      "U2 F2 L' U L U L' U' L F2"
    ]
  },
  {
    name: 'WV 11',
    group: '',
    setup: "R' U2' R2' U R2' U R U2'",
    algs: [
      "U2 R' U' R2 U' R2 U2 R",
      "U R U' R' L' U' L U' L' U2 L",
      "U R U' R' U' R U2 R' U' R U' R'",
      "U R U R' U' R U R' U2 R' F R U R U' R' F'"
    ]
  },
  {
    name: 'WV 12',
    group: '',
    setup: "L' U' L U' F2' R' F2' R",
    algs: [
      "Lw' U2 Lw F2 U L' U L",
      "R' F2 R F2 U L' U L",
      "U R U' R2 U' R' D' R U R' D R2",
      "U R U' R' U' l' U' L U R U' r' F"
    ]
  },
  {
    name: 'WV 13',
    group: '',
    setup: "R' U2' R U R' U R2' U2' R' U2'",
    algs: [
      "U2 R U2 R2 U' R U' R' U2 R",
      "R' F R F' R' U' F' U F R",
      "U R U' R D R' U2 R D' R' U2 R'",
      "R2 D R' U' R D' R2 U R U' R'"
    ]
  },
  {
    name: 'WV 14',
    group: '',
    setup: "R2' D R' U2' R D' R2' U2'",
    algs: [
      "U2 R2 D R' U2 R D' R2",
      "M' U2 R' F R F' R U2 r'",
      "U2 L' U R U' L U2 R'",
      "U R U' R' U2 R U R' U R U2 R'"
    ]
  },
  {
    name: 'WV 15',
    group: '',
    setup: "L' R U R' U' L",
    algs: [ "L' U R U' R' L", "r' F R F' M'", "L' U R U' M' x'" ]
  },
  {
    name: 'WV 16',
    group: '',
    setup: "R U2' R2' D' R U' R' D R U'",
    algs: [
      "U R' D' R U R' D R2 U2 R'",
      "U2 R U' R' U' R' F R U R U' R' F'",
      "U R U' R' U' R2 D' R U2 R' D R U2 R",
      "U2 L' R U R' U' L R U2 R'"
    ]
  },
  {
    name: 'WV 17',
    group: '',
    setup: "F' R U2' R' U2' R' F R",
    algs: [
      "R' F' R U2 R U2 R' F",
      "y2 U L U' F l' U' r' F R F'",
      "U R U' R' l' U' L U l F' L' F",
      "U L' U2 R U' R' U2 L U R U' R'"
    ]
  },
  {
    name: 'WV 18',
    group: '',
    setup: "R U2' R' U2'",
    algs: [ "U2 R U2 R'", "U2 l F2 l'", "U R U' U R' U R U2 R'" ]
  },
  {
    name: 'WV 19',
    group: '',
    setup: "F2' R U' R' U R U R2' F2' R",
    algs: [
      "R' F2 R2 U' R' U' R U R' F2",
      "U L' U2 R U' R' U' R U' R' L",
      "U2 L' U R U' R' L U' R U' R'",
      "U R U' R D' R U2 R' D R U2 R"
    ]
  },
  {
    name: 'WV 20',
    group: '',
    setup: "R U2' R' U' R U' R' U R U R' U'",
    algs: [
      "U R U' R' U' R U R' U R U2 R'",
      "U L' U2 L R U R' U L' U L",
      "U R U R' U' R U R2 U' R2 U' R2 U2 R"
    ]
  },
  {
    name: 'WV 21',
    group: '',
    setup: "R' U' R U' R' U2' R2' U R' U'",
    algs: [
      "U R U' R2 U2 R U R' U R",
      "U2 R U' R D R' U' R D' R2",
      "U R U' R' U R U R' U R U2 R'"
    ]
  },
  {
    name: 'WV 22',
    group: '',
    setup: "R2' D R' U2' R D' R' U' R' U'",
    algs: [
      "U R U R D R' U2 R D' R2",
      "U R2 D R' U R D' R' U2 R'",
      "U R U' R' F R' F' r U R U' r'",
      "U2 R U2 R' U R' U' R U' R' U2 R"
    ]
  },
  {
    name: 'WV 23',
    group: '',
    setup: "R2' U2' R' U' R' U R U' R U' R2'",
    algs: [
      "R2 U R' U R' U' R U R U2 R2",
      "U2 R U2 R D' R U2 R' D R U2 R",
      "U F' L U2 L2 U' L2 U' L' U F",
      "U2 R' D' R U' R' D R2 U' R2 U' R U' R' U2 R"
    ]
  },
  {
    name: 'WV 24',
    group: '',
    setup: "R U2' R' U' R U R' U' R U R' U2'",
    algs: [
      "U2 R U' R' U R U' R' U R U2 R'",
      "U R U' R' U' F' r U R' U' r' F R"
    ]
  },
  {
    name: 'WV 25',
    group: '',
    setup: "R' U' R U' R' U2' R2' U2' R' U2'",
    algs: [
      "U2 R U2 R2 U2 R U R' U R",
      "U2 R U2 R' U R U R' U R U2 R'",
      "U2 R U' R' U R U' R D R' U' R D' R2",
      "U R U' R' U' R' U2 R2 U R2 U R2 U2 R'"
    ]
  },
  {
    name: 'WV 26',
    group: '',
    setup: "R' U2' R U R' U R2' U R' U'",
    algs: [
      "U R U' R2 U' R U' R' U2 R",
      "U R U R' U F2 L' U L U' L' U' L F2",
      "U R' D' R U' R' D R2 U' r' l' U R U' R' L",
      "U R U' R' U R U2 R' U' R U' R'"
    ]
  },
  {
    name: 'WV 27',
    group: '',
    setup: "R U R' U R U' R' U R U' R' U'",
    algs: [
      "U R U R' U' R U R' U' R U' R'",
      "U R U' R' F R U R' U' R U R' U' R U R' U' F'",
      "U R U' R' U' R U R' U R U' R' U R U2 R'"
    ]
  }
]
