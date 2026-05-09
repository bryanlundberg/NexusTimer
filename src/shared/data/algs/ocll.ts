import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

const idMethod = 'OCLL_ALGS'
const puzzle = '222'

export const OCLL_ALGS: AlgorithmCollection[] = [
  {
    name: 'Sune',
    id: '3a8f778b-e051-4cf5-afca-69f3c7fc5bf2',
    idMethod,
    puzzle,
    group: 'OCLL',
    setup: '',
    algs: [
      { moves: "R U R' U R U2 R'", id: '963ca722-4946-403c-b651-0b5c0505fdb3' },
      { moves: "R U R2 U' R2 U R", id: '304c1c52-cdf0-49a6-bc39-903d4c16ec4a' },
      { moves: "R U' L' U R' U' L", id: '1dd941d8-f652-4cbd-b286-110213a104d7' },
      { moves: "y' R' U2 R U R' U R", id: '5519dc7f-dee9-415c-b1a3-a90df3d23829' }
    ]
  },
  {
    name: 'Anti Sune',
    id: '94c64eaf-d2cc-40b9-9573-82a08a954e14',
    idMethod,
    puzzle,
    group: 'OCLL',
    setup: '',
    algs: [
      { moves: "R U2 R' U' R U' R'", id: '638aed5b-3c74-446b-9fa6-c0bc3bc85b6d' },
      { moves: "y L' U' L U' L' U2 L", id: 'b345387d-4515-463a-b686-96d4bc1bcf10' },
      { moves: "y' R' U' R U' R' U2 R", id: '376a9894-d7d9-4bb3-9c77-c0c49efea833' },
      { moves: "R' F R F' R U R'", id: '5af0e14e-fdb5-453e-aa2a-a0e252830ffe' }
    ]
  },
  {
    name: 'Pi',
    id: 'c7f47c54-acd3-476f-aa35-464a9fcd695a',
    idMethod,
    puzzle,
    group: 'OCLL',
    setup: '',
    algs: [
      { moves: "F R U R' U' R U R' U' F'", id: 'dcbd6c53-aa05-49c0-9eb3-6c8eeeed2c8a' },
      { moves: "R U' R2 U R2 U R2 U' R", id: 'd93a10af-7c1b-437a-9164-f1a363a9f2b1' },
      { moves: "R U2 R2 U' R2 U' R2 U2 R", id: '69cfefa9-1e21-4927-9fad-214e54c5237a' },
      { moves: "y' R' F R2 U' R2 F R", id: 'b8ee891d-8cce-46af-ad28-ea88cabeb263' }
    ]
  },
  {
    name: 'P',
    id: '1715de0c-9443-4853-9227-3d3fc8986b1c',
    idMethod,
    puzzle,
    group: 'OCLL',
    setup: '',
    algs: [
      { moves: "F R U R' U' F'", id: 'eac9ce7b-faff-43db-86be-681ba1f46151' },
      { moves: "y2 F U R U' R' F'", id: 'ac132f2f-715a-4a07-b381-2a625c9bce54' },
      { moves: "y' R2 D R' U2 R D' R' U2 R'", id: '347f5cec-4cf7-476e-b801-c6a6e16c7ec5' },
      { moves: "y R2 D' R U2 R' D R U2 R", id: 'a7e9da6a-5e74-49ec-9460-7d97189423dd' }
    ]
  },
  {
    name: 'L',
    id: '0866342e-6193-40af-b33c-1248270ac2f1',
    idMethod,
    puzzle,
    group: 'OCLL',
    setup: '',
    algs: [
      { moves: "y F' R U R' U' R' F R", id: 'e3466d0d-f822-4912-acf4-486d5f68ce25' },
      { moves: "F R U' R' U' R U R' F'", id: '889aeab8-6f45-4a28-bced-5cab7c404630' },
      { moves: "F R' F' R U R U' R'", id: '645cc63c-cf2e-49cf-b4b8-acf812ca13d8' },
      { moves: "F' R U R' U' R' F R", id: '82b1717c-57c8-438b-9011-934272182823' }
    ]
  },
  {
    name: 'T',
    id: 'ccf72e56-d106-4ec6-afe5-e4a011bb6bc0',
    idMethod,
    puzzle,
    group: 'OCLL',
    setup: '',
    algs: [
      { moves: "R U R' U' R' F R F'", id: 'da80da09-5f76-4705-8c8b-f5cf7086db91' },
      { moves: "U R U R' U' F' U' F", id: 'e24411c5-1d2d-482e-87c0-9367d1924143' },
      { moves: "y2 x U' L' U R' U' L U R", id: '266da886-7643-44e2-af04-948d78c9ede8' },
      { moves: "x L U R' U' L' U R U'", id: 'c166bf5a-c8ef-4e2c-a2dd-903cc729a40b' }
    ]
  },
  {
    name: 'H',
    id: '2bd856ab-9be1-4b4e-86b8-688c4a97ab7d',
    idMethod,
    puzzle,
    group: 'OCLL',
    setup: '',
    algs: [
      { moves: "R2 U2 R' U2 R2", id: 'ec17d830-1ccf-4982-9ee5-acfbe3d2dbf4' },
      { moves: 'R2 U2 R U2 R2', id: '66b3267e-2f4b-4249-b595-399e179eecdb' },
      { moves: "y R U R' U R U' R' U R U2 R'", id: '39a5d4d8-68d4-4ef4-b0f3-5605e25ae338' },
      { moves: "F R U R' U' R U R' U' R U R' U' F'", id: '7d5a04a1-4ddf-46b0-a383-fea3b927f324' }
    ]
  }
]
