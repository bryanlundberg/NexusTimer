import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

const idMethod = 'SQ1CP_ALGS'
const puzzle = 'sq1'
const group = 'Corner Permutation'

export const SQ1CP_ALGS: AlgorithmCollection[] = [
  {
    name: 'Adj / Solved',
    id: 'ff9f5255-7e9a-4b18-a8ff-abcfa26c88d8',
    idMethod,
    puzzle,
    group,
    setup: '/ (0,-3) / (0,3) / (0,-3) / (3,0) / (-3,3) /',
    algs: [
      { moves: '/ (-3,3) / (3,0) / (0,-3) / (0,3) / (0,-3) /', id: '20c322dc-bca2-4196-9e5f-875dd8d61e5c' },
      { moves: '/ (3,-3) / (-3,0) / (0,3) / (0,-3) / (0,3) /', id: '2897c0ab-26f8-4209-8a9e-b22ba055e865' }
    ]
  },
  {
    name: 'Opp / Solved',
    id: 'b2f3b5f7-31a0-4c06-980d-f6b46294b87c',
    idMethod,
    puzzle,
    group,
    setup: '/ (3,3) / (-3,0) / (3,3) / (-3,0) / (3,3) /',
    algs: [
      { moves: '/ (3,3) / (-3,0) / (3,3) / (-3,0) / (3,3) /', id: '98aa225e-c67b-4b36-b6b9-22b14ebd6cfc' },
      { moves: '/ (-3,-3) / (3,0) / (-3,-3) / (3,0) / (-3,-3) /', id: 'c20e279e-0f6b-4f67-88bf-6fb823cabb11' },
      { moves: '/ (-3,-3) / (-3,0) / (-3,-3) / (-3,0) / (-3,-3) /', id: '489dac00-8178-4b5a-a958-5f97b6bc8418' },
      { moves: '/ (3,3) / (-3,0) / (3,3) / (-3,0) / (3,3) /', id: 'c9a87291-0eb7-4887-b797-c33abd578858' }
    ]
  },
  {
    name: 'Solved / Adj',
    id: '255fccf1-88d6-4185-b70d-72a7e2b80551',
    idMethod,
    puzzle,
    group,
    setup: '/ (3,0) / (-3,0) / (3,0) / (0,-3) / (-3,3) /',
    algs: [
      { moves: '/ (-3,3) / (0,-3) / (3,0) / (-3,0) / (3,0) /', id: 'de8897ea-dc41-420b-8dd7-b182ad3ce768' },
      { moves: '/ (3,-3) / (0,3) / (-3,0) / (3,0) / (-3,0) /', id: 'b87d509c-f50d-497e-9d52-118fdb989624' }
    ]
  },
  {
    name: 'Solved / Opp',
    id: '7a6a436e-db4f-493b-bde6-879c49757770',
    idMethod,
    puzzle,
    group,
    setup: '/ (3,3) / (0,3) / (3,3) / (0,3) / (3,3) /',
    algs: [
      { moves: '/ (3,3) / (0,3) / (3,3) / (0,3) / (3,3) /', id: 'f73a7022-21ec-4aeb-af36-8f30b78d5508' },
      { moves: '/ (-3,-3) / (0,-3) / (-3,-3) / (0,-3) / (-3,-3) /', id: '1f5f4371-49df-4338-a1c8-8ea9c73b829d' },
      { moves: '/ (3,3) / (0,-3) / (3,3) / (0,-3) / (3,3) /', id: 'e09ef8c6-6861-41e3-8835-63754338dc0f' },
      { moves: '/ (-3,-3) / (0,3) / (-3,-3) / (0,3) / (-3,-3) /', id: '7a39af8c-40b1-4e4f-a313-77d9a0469b55' }
    ]
  },
  {
    name: 'Adj / Adj',
    id: '5e37415c-1f6b-4f98-aec4-bf1609cad1e9',
    idMethod,
    puzzle,
    group,
    setup: '/ (0,-3) / (3,3) / (-3,0) /',
    algs: [
      { moves: '/ (-3,0) / (3,3) / (0,-3) /', id: '02e49c4f-b55b-4b9f-8379-859ef65c14c2' },
      { moves: '/ (0,-3) / (3,3) / (-3,0) /', id: '5e897f62-c789-447f-aac0-c54276c14943' }
    ]
  },
  {
    name: 'Opp / Adj',
    id: 'eec6d2f2-ca37-4180-b497-2462788d19a7',
    idMethod,
    puzzle,
    group,
    setup: '/ (3,0) / (-3,0) / (3,0) / (-3,0) /',
    algs: [
      { moves: '/ (3,0) / (-3,0) / (3,0) / (-3,0) /', id: '42a3daf5-9cd3-4727-8604-3c48dfcda531' },
      { moves: '/ (-3,0) / (3,0) / (-3,0) / (3,0) /', id: '9ed965b1-e8f2-4ff9-b5a8-9981573858e4' }
    ]
  },
  {
    name: 'Adj / Opp',
    id: 'efa1e92d-f174-4697-961b-f24af106f6c8',
    idMethod,
    puzzle,
    group,
    setup: '/ (0,3) / (0,-3) / (0,3) / (0,-3) /',
    algs: [
      { moves: '/ (0,-3) / (0,3) / (0,-3) / (0,3) /', id: '34e76b19-5490-4aa6-b264-e9c36f6a75f3' },
      { moves: '/ (0,3) / (0,-3) / (0,3) / (0,-3) /', id: 'bb2c6963-7678-45de-ab1d-6dc56687fa66' }
    ]
  },
  {
    name: 'Opp / Opp',
    id: '64b8cbcb-d275-448b-836a-eb530fa5cdcf',
    idMethod,
    puzzle,
    group,
    setup: '/ (3,-3) / (-3,3) /',
    algs: [
      { moves: '/ (-3,3) / (3,-3) /', id: 'fbdd1ef2-5c31-4289-b8d8-c9fd54d4d82f' },
      { moves: '/ (3,-3) / (-3,3) /', id: '4090746e-5889-4ca1-af4f-62d2391b921c' }
    ]
  }
]
