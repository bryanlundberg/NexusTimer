import { AlgorithmCollection } from '@/interfaces/AlgorithmCollection'

export const OCLL_ALGS: AlgorithmCollection[] = [
  {
    name: 'Sune',
    group: 'OCLL',
    setup: '',
    algs: ["R U R' U R U2 R'", "R U R2 U' R2 U R", "R U' L' U R' U' L", "y' R' U2 R U R' U R"]
  },
  {
    name: 'Anti Sune',
    group: 'OCLL',
    setup: '',
    algs: ["R U2 R' U' R U' R'", "y L' U' L U' L' U2 L", "y' R' U' R U' R' U2 R", "R' F R F' R U R'"]
  },
  {
    name: 'Pi',
    group: 'OCLL',
    setup: '',
    algs: ["F R U R' U' R U R' U' F'", "R U' R2 U R2 U R2 U' R", "R U2 R2 U' R2 U' R2 U2 R", "y' R' F R2 U' R2 F R"]
  },
  {
    name: 'P',
    group: 'OCLL',
    setup: '',
    algs: ["F R U R' U' F'", "y2 F U R U' R' F'", "y' R2 D R' U2 R D' R' U2 R'", "y R2 D' R U2 R' D R U2 R"]
  },
  {
    name: 'L',
    group: 'OCLL',
    setup: '',
    algs: ["y F' R U R' U' R' F R", "F R U' R' U' R U R' F'", "F R' F' R U R U' R'", "F' R U R' U' R' F R"]
  },
  {
    name: 'T',
    group: 'OCLL',
    setup: '',
    algs: ["R U R' U' R' F R F'", "U R U R' U' F' U' F", "y2 x U' L' U R' U' L U R", "x L U R' U' L' U R U'"]
  },
  {
    name: 'H',
    group: 'OCLL',
    setup: '',
    algs: ["R2 U2 R' U2 R2", 'R2 U2 R U2 R2', "y R U R' U R U' R' U R U2 R'", "F R U R' U' R U R' U' R U R' U' F'"]
  }
]
