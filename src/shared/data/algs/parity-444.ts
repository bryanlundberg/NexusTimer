import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

const idMethod = 'PARITY_444_ALGS'
const puzzle = '444'

export const PARITY_444_ALGS: AlgorithmCollection[] = [
  {
    name: 'Basic',
    id: 'd7bc9f9b-1639-4184-9bd7-a3db561cf516',
    idMethod,
    puzzle,
    group: 'OLL Parity',
    algs: [
      { moves: "Rw U2 x Rw U2 Rw U2 Rw' U2 Lw U2 Rw' U2 Rw U2 Rw' U2 Rw'", id: 'd1ad25c2-c2f8-4e82-b6d0-2f3ba9800bfd' },
      { moves: "Rw' U2' Rw U2 Rw U2' Rw2' F2 Rw' U2 Rw' U2' F2 Rw2 F2", id: '89166a84-d147-409a-8e3e-027b0b99bfc5' },
      { moves: "Rw2 B2 U2 Lw U2 Rw' U2 Rw U2 F2 Rw F2 Lw' B2 Rw2", id: 'b43823ca-e4bb-400f-8402-4edee7671f97' },
      { moves: "Rw2 B2 Rw' U2 Rw' U2 x' U2 Rw' U2 Rw U2 Rw' U2 Rw2 U2 x", id: 'b76bef93-f96c-49ab-b438-86196f4b9b30' }
    ],
    prob: null
  },
  {
    name: 'Pure',
    id: '1dc3a2a2-6442-4f0f-9b4e-4e41fbbf440b',
    idMethod,
    puzzle,
    group: 'OLL Parity',
    algs: [
      { moves: "2R' U2 2L F2 2L' F2 2R2 U2 2R U2 2R' U2 F2 2R2 F2", id: '06b33c03-fc08-42ce-a6d8-5ee45e0855a2' },
      {
        moves: "y2 F R U R' U' F' U Rw U2 x Rw U2 Rw U2 Rw' U2 Lw U2 Rw' U2 Rw U2 Rw' U2 Rw'",
        id: '9de51e84-deb5-4cb4-b874-834a7e5ec59d'
      },
      {
        moves: "R' U2 Rw' U2 Rw U2 Rw2 U2 x' U2 Rw' U2 Rw U2 l' U2 Rw U2 Rw R",
        id: 'f656b0e1-b160-46a2-85d4-2336dbc870e3'
      },
      {
        moves: "R U2 R' U' Rw U2 x Rw U2 Rw U2 Rw' U2 Lw U2 Rw' U2 Rw U2 Rw' U2 Rw' F R' F' R",
        id: '6f90129c-788d-4764-a082-d36f44b49f73'
      }
    ],
    prob: null
  },
  {
    name: 'OPP Parity',
    id: 'fd91c41e-91dd-45fd-aa94-2f1c2dfbf989',
    idMethod,
    puzzle,
    group: 'PLL Parity - Edge Swap',
    algs: [
      { moves: '2R2 U2 2R2 Uw2 2R2 Uw2', id: '1c430e22-2d13-4af1-949d-1ecc8b158dfa' },
      { moves: "Rw2' F2 U2 Rw2 R2' U2 F2 Rw2", id: 'b66d3e25-227a-4d88-af8c-a6c20c9b779e' },
      { moves: 'Uw2 Rw2 U2 2R2 U2 Rw2 Uw2', id: 'ace5d665-7e01-4efb-9988-9435e37dd833' },
      { moves: '2L2 U2 2L2 Uw2 2L2 Uw2', id: 'a6544f72-de7c-404c-8c11-5d30db359bcf' }
    ],
    prob: null
  },
  {
    name: 'Adj Parity',
    id: 'f34e95a2-9507-474c-b206-163c011483c1',
    idMethod,
    puzzle,
    group: 'PLL Parity - Edge Swap',
    algs: [
      { moves: "R' U R U' 2R2 U2' 2R2 Uw2' 2R2 Uw2' U' R' U' R", id: '59ebdf14-d9ed-44b9-ba15-b6ffadc15dce' },
      { moves: "R' U R U' 2R2 U2 2R2 Uw2 2R2 Uw2 U' R' U' R", id: 'fa1c5219-6b7e-45d5-a847-0950c27dfee6' },
      { moves: "R U R' U' 2R2 U2 2R2 Uw2 2R2 Uw2 U' R U' R'", id: '9697a8de-f262-4434-b8ae-170fe51b941b' },
      { moves: "R U R' U' 2L2 U2 2L2 Uw2 2L2 Uw2 U' R U' R'", id: 'e2f24a6d-06f6-49bf-b8e5-52f39b9ed79c' }
    ],
    prob: null
  }
]
