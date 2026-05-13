import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

const idMethod = 'PBL_ALGS'
const puzzle = '222'

export const PBL_ALGS: AlgorithmCollection[] = [
  {
    name: 'Adjacent Swaps - Both Layers',
    id: 'e3586b3d-862b-4c57-aefe-bc971a607f34',
    idMethod,
    puzzle,
    group: 'PBL',
    algs: [
      { moves: "y2 R2 U' R2' U' D' R2 U' R2'", id: 'bfbfab6d-7d9e-4e34-9501-5591062db325' },
      { moves: "y2 R2 U' R2' U2' F2 U' R2", id: '3d595f4b-2be7-4e9a-9d52-6a479ed2a661' },
      { moves: "R2 U' B2 U2' R2' U' R2", id: '1eef786b-1a0d-4839-beaf-af843d7d661d' }
    ],
    prob: 4 / 9
  },
  {
    name: 'Adjacent Top, Diagonal Bottom',
    id: 'dd28a51c-e2d5-426d-b392-e596abc7931a',
    idMethod,
    puzzle,
    group: 'PBL',
    algs: [
      { moves: "y2 R' U R' F2 R F' R", id: 'c7d2f1a3-8e4b-4c91-b5f6-2a3e7d8c1b90' },
      { moves: "R' F R' F2 R U' R", id: '5b8e3d7c-1f2a-4e05-9c4d-6b7a2f1e8d30' }
    ],
    prob: 1 / 9
  },
  {
    name: 'Adjacent Swap on Top',
    id: '556eaed2-efef-4cc7-8330-b9d5090074ee',
    idMethod,
    puzzle,
    group: 'PBL',
    algs: [
      { moves: "R' U R' F2 R F' R' F2 R2", id: '9f4c2b6e-7d1a-4f38-8b5c-3e0d7a2f9c41' },
      { moves: "y2 R' F R' F2 R U' R' F2 R2", id: '1a7e5c3f-2b8d-4a64-b9e0-4f6c1d2a8e57' }
    ],
    prob: 1 / 9
  },
  {
    name: 'Adjacent Bottom, Diagonal Top',
    id: 'd897a5c7-3f5b-40e7-95a9-f285ab3b7c0e',
    idMethod,
    puzzle,
    group: 'PBL',
    algs: [
      { moves: "y2 R U' R' U' R' F2 U' R U R", id: 'd3f8b2c5-6a4e-4d72-9c1f-5e2a8b3d6c90' },
      { moves: "y R2 U R2' U' R2 U R2' U' R2", id: '7c1e4a9f-3b2d-4c85-af3e-1d8f5c7a2b64' }
    ],
    prob: 1 / 9
  },
  {
    name: 'Adjacent Swap on Bottom',
    id: '9384abc3-18f4-4bbc-affd-c442ffc8ddde',
    idMethod,
    puzzle,
    group: 'PBL',
    algs: [
      { moves: "R U' R' U' R' F2 U' R U R' F2 R2", id: '4d9c7a2e-5f1b-4e63-8a7c-2f4e6b1d9c30' },
      { moves: "y R2 U' R' U R' F2 R F' R' F2", id: '8b3f6e1c-2a4d-4b97-9f5e-7c1d3a8f6b20' }
    ],
    prob: 1 / 9
  },
  {
    name: 'Diagonal Swap on Top',
    id: 'f343adce-8726-487e-8345-0e27f5c74969',
    idMethod,
    puzzle,
    group: 'PBL',
    algs: [
      { moves: "R U' R' U' F2 U' R U R' D R2", id: '6e2d8c5b-1a3f-4d82-bf6a-9c4e1d7b3f50' },
      { moves: "R' U R' F2 R F' U R' F2 R F' R", id: '2f5a1e8d-7c3b-4f46-a9d2-5b8c4e1f7a30' }
    ],
    prob: 1 / 36
  },
  {
    name: 'Diagonal Swap on Bottom',
    id: '10e61ba7-f52b-4d5f-8e9c-3fb2fc399f6f',
    idMethod,
    puzzle,
    group: 'PBL',
    algs: [{ moves: "R U' R' U' F2 U' R U R' D F2 R2", id: '0c8e3b7f-4d2a-4c59-8e1f-3b6d9c0a7e42' }],
    prob: 1 / 36
  },
  {
    name: 'Diagonal Swaps - Both Layers',
    id: 'f852fd93-a1aa-407d-b9f1-0211df01a914',
    idMethod,
    puzzle,
    group: 'PBL',
    algs: [
      { moves: "R2' F2 R2", id: 'e7b4f3c1-9a2d-4e71-b8c0-6d3f5a8b2e14' },
      { moves: "R2 B2 R2'", id: '3a6d0c9e-5f8b-4a23-9b7e-1c4d7a2e5f86' }
    ],
    prob: 1 / 36
  }
]
