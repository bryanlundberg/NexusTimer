import { AlgorithmCollection } from '@/interfaces/AlgorithmCollection';

export const PARITY_444_ALGS: AlgorithmCollection[] = [
  {
    name: "OLL Parity",
    alg: ["Rw U2 x Rw U2 Rw U2 Rw' U2 Lw U2 Rw' U2 Rw U2 Rw' U2 Rw'"],
    group: "OLL Parity"
  },
  {
    name: "PLL Parity",
    alg: ["r2 R2' U2 r2 R2' u2 r2 R2' u2"],
    group: "PLL Parity"
  },
  {
    name: "Case 1",
    alg: ["Uw' (R U R' F R' F' R) Uw"],
    group: "Edge"
  }
];
