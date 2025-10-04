import { AlgorithmCollection } from '@/interfaces/AlgorithmCollection';

export const L4E_ALGS: AlgorithmCollection[] = [
  {
    name: 'Sune',
    group: 'Last Layer',
    setup: "L' U' L U' L' U' L",
    algs: [
      "R U R' U R U R'",
      "L U L' U L U L'",
      "R' U R U R' U R",
      "L' U L U L' U L"
    ]
  },
  {
    name: 'AntiSune',
    group: 'Last Layer',
    setup: "R U R' U R U R'",
    algs: [
      "R U' R' U' R U' R'",
      "L' U' L U' L' U' L",
      "R' U' R U' R' U' R",
      "L U' L' U' L U' L'"
    ]
  },
  {
    name: 'Lefty Bars',
    group: 'Last Layer',
    setup: "R' L' U' L U R",
    algs: [ "R' U' L' U L R", "U L R U R' U' L'" ]
  },
  {
    name: 'Righty Bars',
    group: 'Last Layer',
    setup: "L R U R' U' L'",
    algs: [ "L U R U' R' L'", "U' R' L' U' L U R" ]
  },
  {
    name: 'Sledge',
    group: 'L3E',
    setup: "L R' L' R",
    algs: [
      "R' L R L'",
      "L U' R' L R L2'",
      "U' L R U' R' U L'",
      "U R' U L' U' L R",
      "U R2' L R L' U' R"
    ]
  },
  {
    name: 'Hedge',
    group: 'L3E',
    setup: "R' L R L'",
    algs: [
      "L R' L' R",
      "U' L U' R U R' L'",
      "U' L2 R' L' R U L'",
      "R' U L R' L' R2",
      "U R' L' U L U' R"
    ]
  },
  {
    name: 'Clockwise',
    group: 'L3E',
    setup: "L' U L U R U R'",
    algs: [
      "L R' L' R2 U' R'",
      "R U' R' U' L' U' L",
      "U' R U' R' L R' L' R",
      "U L' U' L2 R' L' R",
      "U' L2 R' L' R L'",
      "L U' R U' R' U' L'",
      "U R' L R' L' R2",
      "R' U' L' U' L U' R"
    ]
  },
  {
    name: 'Counterclockwise',
    group: 'L3E',
    setup: "R U' R' U' L' U' L",
    algs: [
      "R' L R L2' U L",
      "U L' U L R' L R L'",
      "U' R U R' L R' L' R",
      "U R' L R L' R U R'",
      "U' L R' L R L2'",
      "L U R U R' U L'",
      "U R2' L R L' R",
      "R' U L' U L U R",
      "R' U L' U L U R"
    ]
  },
  {
    name: 'Righty',
    group: 'L3E',
    setup: "U' R U R'",
    algs: [ "R U' R'", "L U' L'" ]
  },
  {
    name: 'Lefty',
    group: 'L3E',
    setup: "U L' U' L",
    algs: [ "L' U L", "R' U R" ]
  },
  {
    name: 'Sexy',
    group: 'L3E',
    setup: "R U' R' U",
    algs: [ "U' R U R'", "U' L U L'" ]
  },
  {
    name: 'Left Sexy',
    group: 'L3E',
    setup: "L' U L U'",
    algs: [ "U L' U' L", "U R' U' R" ]
  },
  {
    name: '2 Flip',
    group: 'Flipped Edges',
    setup: "U' R' U L' U L U' R",
    algs: [
      "L R' L' R U' R U R'",
      "R' L R L' U L' U' L",
      "R' U L' U' L U' R",
      "L U' R U R' U L'"
    ]
  },
  {
    name: 'DR Flip',
    group: 'Flipped Edges',
    setup: "U' R U R' U L' U' L",
    algs: [
      "L R' L' R L' U L",
      "L' U L U' R U' R'",
      "R U R' L R' L' R",
      "L U' L R' L' R L'",
      "L2 R' L' R2 U' R' U' L'",
      "R' U' L' U' L2 R' L' R2"
    ]
  },
  {
    name: 'DL Flip',
    group: 'Flipped Edges',
    setup: "U L' U' L U' R U R'",
    algs: [
      "R' L R L' R U' R'",
      "R U' R' U L' U L",
      "L' U' L R' L R L'",
      "L U R U R2' L R L2'",
      "R' U R' L R L' R",
      "R2' L R L2' U L U R"
    ]
  },
  {
    name: 'DB Flip',
    group: 'Flipped Edges',
    setup: "U L' U L U' R U' R'",
    algs: [
      "R U R' U L' U' L",
      "L' U' L U' R U R'",
      "L R' L R L' U L'",
      "R' L R' L' R U' R"
    ]
  },
  {
    name: '4 Flip',
    group: 'Flipped Edges',
    setup: "L' U' L R U R' L' U' L R U R'",
    algs: [
      "R U' R' L' U L R U' R' L' U L",
      "L' U L R U' R' L' U L R U' R'",
      "L R U' R' L' U L R U' R' L'",
      "R' L' U L R U' R' L' U L R"
    ]
  },
  {
    name: 'Right Polish Flip',
    group: 'Polish Flip',
    setup: "U L' U L R U R'",
    algs: [
      "R U' R' L' U' L",
      "U L' U' L U R U' R'",
      "U R U' R' U' L R' L' R",
      "U' L R' L' R U' L' U' L",
      "U' L R U' R' L' U' L U L'",
      "R' L' U L R U' R' U R"
    ]
  },
  {
    name: 'Left Polish Flip',
    group: 'Polish Flip',
    setup: "U' R U' R' L' U' L",
    algs: [
      "L' U L R U R'",
      "U' R U R' U' L' U L",
      "U' L' U L U R' L R L'",
      "U R' L R L' U R U R'",
      "L R U' R' L' U L U' L'",
      "U R' L' U L R U R' U' R"
    ]
  },
  {
    name: 'SUS',
    group: 'Polish Flip',
    setup: "U' L R' L' R U L R' L' R",
    algs: [
      "R' L R L' U' R' L R L'",
      "R U' R2' L R L2' U' L",
      "L' U' L R U' R2' L R L'",
      "L R U' R2' L R L2'",
      "R2' L R L2' U' L R"
    ]
  },
  {
    name: 'Anti SUS',
    group: 'Polish Flip',
    setup: "U R' L R L' U' R' L R L'",
    algs: [
      "L R' L' R U L R' L' R",
      "L' U L2 R' L' R2 U R'",
      "R U R' L' U L2 R' L' R",
      "L2 R' L' R2 U R' L'",
      "R' L' U L2 R' L' R2"
    ]
  },
  {
    name: 'Good Niky',
    group: 'Separated Bar',
    setup: "L' U' L R U R'",
    algs: [
      "R U' R' L' U L",
      "U R U R' L' U' L",
      "L' B' U B L",
      "R B U B' R'",
      "L R U R' L'",
      "R' L' U L R"
    ]
  },
  {
    name: 'Good Sochi',
    group: 'Separated Bar',
    setup: "R U R' L' U' L",
    algs: [
      "L' U L R U' R'",
      "U' L' U' L R U R'",
      "L' B' U' B L",
      "R B U' B' R'",
      "L R U' R' L'",
      "R' L' U' L R"
    ]
  },
  {
    name: 'Super Sledge',
    group: 'Separated Bar',
    setup: "U' L R' L' R2 U R'",
    algs: [
      "R U' R2' L R L'",
      "U' L R' L' R2 U R'",
      "R' L R2 U R' U' L'",
      "L U R U' R2' L' R",
      "L U R' L R L2'",
      "U L2 R' L' R U' L'",
      "R' L' U L2 R' L' R U' R"
    ]
  },
  {
    name: 'Super Hedge',
    group: 'Separated Bar',
    setup: "R' U' L' U L2 R L'",
    algs: [
      "L' U L2' R' L' R",
      "U R' L R L2' U' L",
      "R' U' L' U L2 R L'",
      "L R' L2' U' L U R",
      "L R U R2' L R L' U L'",
      "R' U' L R' L' R2"
    ]
  },
  {
    name: 'Bad Niky',
    group: 'Separated Bar',
    setup: "U' L' U' L U R U R'",
    algs: [
      "R U' R' U' L' U L",
      "U R U R' U' L' U' L",
      "U L U R U' R' U' L'",
      "R' U' L' U' L U R"
    ]
  },
  {
    name: 'Bad Sochi',
    group: 'Separated Bar',
    setup: "U R U R' U' L' U' L",
    algs: [
      "L' U L U R U' R'",
      "U' L' U' L U R U R'",
      "L U R U R' U' L'",
      "U' R' U' L' U L U R"
    ]
  },
  {
    name: 'Right Spam',
    group: 'Connected Bar',
    setup: "R U R' L' U' L R U R' U'",
    algs: [
      "R U R' U R' L R L'",
      "U R U' R' L' U L R U' R'",
      "U' L' U' L2 R' L' R2 U R'",
      "U' L R' L' R2 U R' L' U' L",
      "L U R U' R' U L'",
      "U L U' R U' R' L'",
      "R' L' U L2 R' L' R U R"
    ]
  },
  {
    name: 'Left Spam',
    group: 'Connected Bar',
    setup: "L' U' L R U R' L' U' L U",
    algs: [
      "L' U' L U' L R' L' R",
      "U' L' U L R U' R' L' U L",
      "U R U R2' L R L2' U' L",
      "U R' L R L2' U' L R U R'",
      "L R U' R2' L R L' U' L'",
      "R' U' L' U L U' R",
      "U' R' U L' U L R",
      "U' R' U' L R L' U' L' U L"
    ]
  },
  {
    name: 'Bad Sledge',
    group: 'Connected Bar',
    setup: "U R U R' U R' L R L'",
    algs: [
      "L R' L' R U' R U' R'",
      "U R U R' L' U' L R U R'",
      "R U' R2' L R L2' U L",
      "U' L R' L' R2 U R' U' L' U L",
      "L R U R' U L'",
      "U' L U' R U R' U' L'",
      "R' U' R' L R L2' U' L R",
      "U' R2' L R L2' U' L U' R"
    ]
  },
  {
    name: 'Bad Hedge',
    group: 'Connected Bar',
    setup: "U' L' U L R U R' L' U L U",
    algs: [
      "R' L R L' U L' U L",
      "U' L' U' L R U' R' L' U' L",
      "L' U L2 R' L' R2 U' R'",
      "U R' L R L2' U' L U R U' R'",
      "L U L R' L' R2 U R' L'",
      "U L2 R' L' R2 U R' U L'",
      "R' L' U' L U' R",
      "U R' U L' U' L U R"
    ]
  },
  {
    name: 'Bad Sexy',
    group: 'No Bar',
    setup: "R U R' U L' U L",
    algs: [
      "L' U' L U' R U' R'",
      "U L2 R' L' R2 U' R' L'",
      "R' L' U' L2 R' L' R2"
    ]
  },
  {
    name: 'Bad Ugly',
    group: 'No Bar',
    setup: "L' U' L U' R U' R'",
    algs: [ "R U R' U L' U L", "L R U R2' L R L2'", "U' R2' L R L2' U L R" ]
  },
  {
    name: 'Bad Righty',
    group: 'No Bar',
    setup: "U R U' R' U L' U' L",
    algs: [
      "L' U L U' R U R'",
      "R' L R L' U R' L R L'",
      "L U' L R' L' R U' L'",
      "U L U' L' U L R U' R' L'",
      "R' U' L R' L' R U' R"
    ]
  },
  {
    name: 'Bad Lefty',
    group: 'No Bar',
    setup: "U' L' U L U' R U R'",
    algs: [
      "R U' R' U L' U' L",
      "L R' L' R U' L R' L' R",
      "L U R' L R L' U L'",
      "R' U R' L R L' U R",
      "U' R' U R U' R' L' U L R"
    ]
  },
  {
    name: 'Double Sexy',
    group: 'No Bar',
    setup: "U' R U' R' U R U R'",
    algs: [
      "R U' R' U' R U R'",
      "L' U' L U R' L R L'",
      "U' R U' R' U R U R'",
      "U R U R' U' R U' R'",
      "L U' L' U' L U L'",
      "U L U L' U' L U' L'",
      "U' L U' L' U L U L'"
    ]
  },
  {
    name: 'Double Ugly',
    group: 'No Bar',
    setup: "U L' U L U' L' U' L",
    algs: [
      "L' U L U L' U' L",
      "R U R' U' L R' L' R",
      "U L' U L U' L' U' L",
      "U' L' U' L U L' U L",
      "R' U R U R' U' R",
      "U R' U R U' R' U' R",
      "U' R' U' R U R' U R"
    ]
  }
]
