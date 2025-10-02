import { AlgorithmCollection } from '@/interfaces/AlgorithmCollection';

export const PARITY_444_ALGS: AlgorithmCollection[] = [
  {
    name: "Basic",
    alg: [
      "Rw U2 x Rw U2 Rw U2 Rw' U2 Lw U2 Rw' U2 Rw U2 Rw' U2 Rw'",
      "Rw' U2' Rw U2 Rw U2' Rw2' F2 Rw' U2 Rw' U2' F2 Rw2 F2",
      "Rw2 B2 U2 Lw U2 Rw' U2 Rw U2 F2 Rw F2 Lw' B2 Rw2",
      "Rw2 B2 Rw' U2 Rw' U2 x' U2 Rw' U2 Rw U2 Rw' U2 Rw2 U2 x"
    ],
    group: "OLL Parity",
    prob: null
  },
  {
    name: "Pure",
    alg: [
      "2R' U2 2L F2 2L' F2 2R2 U2 2R U2 2R' U2 F2 2R2 F2",
      "y2 F R U R' U' F' U Rw U2 x Rw U2 Rw U2 Rw' U2 Lw U2 Rw' U2 Rw U2 Rw' U2 Rw'",
      "R' U2 Rw' U2 Rw U2 Rw2 U2 x' U2 Rw' U2 Rw U2 l' U2 Rw U2 Rw R",
      "R U2 R' U' Rw U2 x Rw U2 Rw U2 Rw' U2 Lw U2 Rw' U2 Rw U2 Rw' U2 Rw' F R' F' R"
    ],
    group: "OLL Parity",
    prob: null
  },
  {
    name: "OPP Parity",
    alg: [
      "2R2 U2 2R2 Uw2 2R2 Uw2",
      "Rw2' F2 U2 Rw2 R2' U2 F2 Rw2",
      "Uw2 Rw2 U2 2R2 U2 Rw2 Uw2",
      "2L2 U2 2L2 Uw2 2L2 Uw2"
    ],
    group: "PLL Parity - Edge Swap",
    prob: null
  },
  {
    name: "Adj Parity",
    alg: [
      "R' U R U' 2R2 U2' 2R2 Uw2' 2R2 Uw2' U' R' U' R",
      "R' U R U' 2R2 U2 2R2 Uw2 2R2 Uw2 U' R' U' R",
      "R U R' U' 2R2 U2 2R2 Uw2 2R2 Uw2 U' R U' R'",
      "R U R' U' 2L2 U2 2L2 Uw2 2L2 Uw2 U' R U' R'"
    ],
    group: "PLL Parity - Edge Swap",
    prob: null
  }
];
