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
    name: 'M',
    id: '7c9f84e6-3b51-4a98-8d7e-91c2f5b6a13d',
    idMethod,
    puzzle,
    group: 'OLL Parity',
    algs: [
      {
        moves: "y2 2R2 U2 2R2 Uw2 2R2 Uw2 Rw U2 x Rw U2 Rw U2 Rw' U2 Lw U2 Rw' U2 Rw U2 Rw' U2 Rw'",
        id: 'e4d97a13-5d2c-4c71-a6e9-8a1fb32d9f56'
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
  },
  {
    name: 'CwO',
    id: '3f95e0c1-7a64-4d29-8b5e-6a2c1f9d74ec',
    idMethod,
    puzzle,
    group: 'PLL Parity - Edge Swap',
    algs: [
      {
        moves: "u2 2R2 u2 2R2 U2 2R2 U R' U' R U' R U R U' R' U R U R2 U' R'",
        id: '8d72b1f4-c53a-4b1e-a92f-1c6d8f73e2ab'
      }
    ],
    prob: null
  },
  {
    name: 'CcwO',
    id: 'a1c84e73-9d25-41f8-b6a7-2e5f0c3d9b14',
    idMethod,
    puzzle,
    group: 'PLL Parity - Edge Swap',
    algs: [
      {
        moves: "u2 2R2 u2 2R2 U2 2R2 R' U' R U' R U R U' R' U R U R2 U' R'",
        id: 'f7b2d631-48ce-4a95-93e1-5d8a2f6c1e09'
      }
    ],
    prob: null
  },
  {
    name: 'W',
    id: '1a8d6c74-5b39-49e1-8f2c-7d0a3e6b91f5',
    idMethod,
    puzzle,
    group: 'PLL Parity - Edge Swap',
    algs: [{ moves: "R' U R' U' R' U' R' U R U Rw2 U2 2R2 Uw2 2R2 Uw2", id: 'c4f27e91-8d53-4b6a-9e10-2f8c7d5a3b64' }],
    prob: null
  },
  {
    name: 'Pj',
    id: '9e3b5d71-1c84-4f2a-b690-5a7d2e8c1f43',
    idMethod,
    puzzle,
    group: 'PLL Parity - Edge Swap',
    algs: [
      {
        moves: "R U R' U' R' F R2 U' R' U' R U R' F' U' 2L2 U2 2L2 Uw2 2L2 Uw2",
        id: '6f0d2a9c-b871-47e3-95a2-c8d14f6b3e70'
      }
    ],
    prob: null
  },
  {
    name: 'Ba',
    id: 'b2c97f45-3d18-4a6e-8c91-0f7a5e2d6b34',
    idMethod,
    puzzle,
    group: 'PLL Parity - Edge Swap',
    algs: [
      {
        moves: "Uw2 2L2 Uw2 2L2 U2 2L2 U R U R' F' R U R' U' R' F R2 U' R'",
        id: 'e8a14d63-9f27-45bc-a1d8-3c6f0b7e2a95'
      }
    ],
    prob: null
  },
  {
    name: 'Bb',
    id: '74b9e2d1-6a3f-4c85-8d17-f2b6a9e0c543',
    idMethod,
    puzzle,
    group: 'PLL Parity - Edge Swap',
    algs: [{ moves: "y x Rw2 U2 Rw2 Uw2 2R2 Uw2 B 3Rw' U R' U2 L U' R", id: 'c1d7f4a8-9b25-4e61-a3fc-5d8e2b7a9046' }],
    prob: null
  },
  {
    name: 'Ca',
    id: '2e8a6c93-f1b4-45d9-91a7-6c3f0e2d5b18',
    idMethod,
    puzzle,
    group: 'PLL Parity - Edge Swap',
    algs: [
      { moves: "y2 Uw2 2R2 Uw2 2R2 U2 Rw2 F R U R U' R' F' R U2 R' U2 R", id: 'f5c13d7a-84e9-4b62-b0d5-9a2e6f1c7438' },
      {
        moves: "U2 2R2 U2 2R2 u2 2R2 u2 R2 F R U R U' R' F' R U2 R' U2 R U",
        id: '8b4e9f26-3d71-41ac-95f8-1e7a2c6d0b54'
      }
    ],
    prob: null
  },
  {
    name: 'Cb',
    id: 'd9a2c5f7-1b68-4e43-8fa1-7c0d3e9b6524',
    idMethod,
    puzzle,
    group: 'PLL Parity - Edge Swap',
    algs: [
      { moves: "y R' U2 R U2 R' F R U R' U' R' F' Rw2 U2 2R2 Uw2 2R2 Uw2", id: '4b8f1d62-9e74-4c3a-a1d9-7f2b5e6c8043' },
      {
        moves: "2R2 U2 2R2 u2 2R2 u2 R U' R' U' R U R D R' U' R D' R' U2 R'",
        id: 'e2c9a5f1-6d38-45b7-92fa-1b7e4c3d8a60'
      }
    ],
    prob: null
  },
  {
    name: 'Da',
    id: '91d7e3b4-f2a6-4c18-8b5d-3e0f7a9c6214',
    idMethod,
    puzzle,
    group: 'PLL Parity - Edge Swap',
    algs: [
      { moves: "R' U L' U2 R U' 3Rw B Rw2 U2 Rw2 Uw2 2R2 Uw2 x'", id: 'c6a1f9d8-3b54-4e72-a8c1-5d7f2b0e9463' },
      { moves: "y2 L' U R' U2 L U' L' U2 L R U' 2R2 U2 2R2 u2 2R2 u2", id: '7e3b2c4d-81f6-4a95-9d20-f6a1b8c3e572' },
      {
        moves: "y F R U' R' U' 2R2 U2 2R2 u2 2R2 u2 R U R2 F' R U R U' R' U2",
        id: 'f0d5a8c7-2e91-4b63-8c47-9a1e6d3f52b8'
      }
    ],
    prob: null
  },
  {
    name: 'Db',
    id: '15c8e2f9-a74d-4b10-b6e3-2d9f7a5c1846',
    idMethod,
    puzzle,
    group: 'PLL Parity - Edge Swap',
    algs: [
      { moves: "R U R' F' R U R' U' R' F R2 U' R' u2 2R2 u2 2R2 U2 2R2", id: 'b7f4d1a3-9c62-4e58-81ab-6d3e0f2c9571' },
      { moves: "R U R' F' R U R' U' R' F R2 U' R' 2R2 U2 2R2 u2 2R2 u2", id: '3a9d6e1f-c285-4b74-9f31-e8c2a5d607b4' }
    ],
    prob: null
  },
  {
    name: 'Ka',
    id: '5c9a3e74-d1b8-4f62-9e35-a2d7c0f1846b',
    idMethod,
    puzzle,
    group: 'PLL Parity - Edge Swap',
    algs: [
      { moves: "y 3Lw' U R' D2 R U' R' D2 x' Rw2 U2 2R2 Uw2 2R2 Uw2", id: 'a6d2f81b-4e93-47c5-8a1d-3f7b9e2c6410' }
    ],
    prob: null
  },
  {
    name: 'Kb',
    id: 'e1f7c2a9-86d4-45b3-b9a0-7d3e5c1f8246',
    idMethod,
    puzzle,
    group: 'PLL Parity - Edge Swap',
    algs: [{ moves: "r2 F2 U2 r2 R2 U2 x R' D' R U2 R' D R r2 x' U'", id: '2b4d9f63-a7e1-4c58-8f92-c6a0d3e715b4' }],
    prob: null
  },
  {
    name: 'M',
    id: 'f8c1a5d7-39e2-4b64-91af-5e7d2c0b8463',
    idMethod,
    puzzle,
    group: 'PLL Parity - Edge Swap',
    algs: [{ moves: "y2 Rw2 F2 U2 2R2 U R' U' R U R' D R D' R F2 U Rw2", id: '94e3b6f1-c2d8-47a5-a0e9-1f6c3d7b5824' }],
    prob: null
  },
  {
    name: 'Pa',
    id: 'c7d5a2e8-1b94-4f30-8c61-9a3e7d2f5461',
    idMethod,
    puzzle,
    group: 'PLL Parity - Edge Swap',
    algs: [
      { moves: "R U R' F' R U R' U' R' F R2 U' R' U' 2R2 U2 2R2 u2 2R2 u2", id: '3f1e8c64-5d72-4ab9-9d15-e2c7a0f438b6' }
    ],
    prob: null
  },
  {
    name: 'Pb',
    id: 'b2a7d4f9-e681-43c5-87fa-6d1e9c3b5204',
    idMethod,
    puzzle,
    group: 'PLL Parity - Edge Swap',
    algs: [
      { moves: "2R2 U2 2R2 u2 2R2 u2 R U R' F' R U R' U' R' F R2 U' R'", id: '6e4c9b13-f8d5-4a72-b1c0-2f7d5e8a9436' }
    ],
    prob: null
  },
  {
    name: 'Diag C',
    id: '0f8d3a71-6b25-4ec9-9a17-3d6f2b8c5e40',
    idMethod,
    puzzle,
    group: 'PLL Parity - Diag Corner Swap',
    algs: [
      {
        moves: "F R U' R' U' R U R' F' U' 2R2 U2 2R2 u2 2R2 u2 U' R U R' U' R' F R F'",
        id: 'ad41e6f8-9273-4b5d-8c10-f7a2d9e364b1'
      }
    ],
    prob: null
  },
  {
    name: 'Q',
    id: '73c9b2e5-1f84-4ad6-a5e8-6b0d3f7c9241',
    idMethod,
    puzzle,
    group: 'PLL Parity - Diag Corner Swap',
    algs: [
      {
        moves: "z Rw2 Uw2' R2' Uw2' F R U R' U' R U R' U' R U R' U' F' U2' R2 Uw2' Rw2' z'",
        id: 'e5a7d0c4-39f6-45b8-9b21-1d8e2f6a734c'
      }
    ],
    prob: null
  },
  {
    name: 'Sa',
    id: '1c4e9a7d-b3f2-4d65-8ef0-5a2b7c9d6143',
    idMethod,
    puzzle,
    group: 'PLL Parity - Diag Corner Swap',
    algs: [
      {
        moves: "F R U' R' U' R U R' F' R U R' U' R' F R F' U' 2R2 U2 2R2 u2 2R2 u2",
        id: '98f2c5b1-7d63-4ae9-a4c8-e1b0d6f3752a'
      }
    ],
    prob: null
  },
  {
    name: 'Sb',
    id: '4a7d1e9f-c652-47b3-90de-8f3c1a5b2647',
    idMethod,
    puzzle,
    group: 'PLL Parity - Diag Corner Swap',
    algs: [
      {
        moves: "F R U' R' U' R U R' F' R U R' U' R' F R F' 2R2 U2 2R2 u2 2R2 u2",
        id: 'c2e8f6a9-15d4-4bc7-8a31-7d9e0f2b546c'
      }
    ],
    prob: null
  },
  {
    name: 'X',
    id: '6d1b4c8a-e973-42f5-b7a0-2c5e9d1f8346',
    idMethod,
    puzzle,
    group: 'PLL Parity - Diag Corner Swap',
    algs: [
      {
        moves: "Rw2 F2 U2 Rw2 F' U' R' U R U' R' U R U' R' U R F R2 U2 F2 Rw2",
        id: 'f3a9e7d2-84c1-4b6f-91d5-0e7c2a8b5634'
      }
    ],
    prob: null
  }
]
