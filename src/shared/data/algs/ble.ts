import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

const idMethod = 'BLE_ALGS'
const puzzle = '222'

export const BLE_ALGS: AlgorithmCollection[] = [
  {
    name: 'H Case 1',
    id: '84f7948c-9086-4d57-a71f-f1f7731426f7',
    idMethod,
    puzzle,
    group: 'H Cases + Corners Oriented Case',
    algs: [{ moves: "U' (R U' R' U') (R U R' U R U R')", id: '154bad11-e800-48da-8cbb-00c476c46f9e' }]
  },
  {
    name: 'H Case 2',
    id: '9b7fde0d-7019-425d-adb6-8466b64851dc',
    idMethod,
    puzzle,
    group: 'H Cases + Corners Oriented Case',
    algs: [{ moves: "(R U' R' U') (R U' R' U R U R')", id: '14d59fa6-da7a-4153-9bf8-8df109099b56' }]
  },
  {
    name: 'H Case 3',
    id: '98bb0c0c-3aee-4d6f-9fd9-8e6c72069c6a',
    idMethod,
    puzzle,
    group: 'H Cases + Corners Oriented Case',
    algs: [{ moves: "U (R U' R' U') (R U2' R' U R U R')", id: '844e20e4-f121-4e4b-9b24-e8c7f325080e' }]
  },
  {
    name: 'Sune Case 1',
    id: 'bcdb2ea3-7b32-4395-b6d7-6738df0220a9',
    idMethod,
    puzzle,
    group: 'Sune Cases',
    algs: [{ moves: "(R U R' U2') (R U R' U2' R U' R')", id: 'b38c3599-ac2e-46ce-917b-6b8210c72420' }]
  },
  {
    name: 'Sune Case 2',
    id: 'b55829cc-0fb3-4f63-b844-e36b357170c9',
    idMethod,
    puzzle,
    group: 'Sune Cases',
    algs: [{ moves: "U' (R U' R' U R U R')", id: '288baea6-5906-45d4-912a-3ff63ed1c43f' }]
  },
  {
    name: 'Sune Case 3',
    id: 'b448680d-cf5e-4539-91f5-b11ff378f400',
    idMethod,
    puzzle,
    group: 'Sune Cases',
    algs: [{ moves: "U (R U2' R' U R U R')", id: 'b0e01bcf-cd54-4f1c-a297-ee597c0b37e4' }]
  },
  {
    name: 'Sune Case 4 - To OLL',
    id: '84662955-9772-4921-b6b1-befff2d1e7d4',
    idMethod,
    puzzle,
    group: 'Sune Cases',
    algs: [{ moves: "U' (F' R U R') (U' R' F R)", id: '89e82782-1a53-4faf-8ae6-321303b36505' }]
  },
  {
    name: 'Sune Case 5',
    id: '1014021f-3af2-4282-bac6-a0666890b075',
    idMethod,
    puzzle,
    group: 'Sune Cases',
    algs: [{ moves: "U (R U' R' U) (R U R' U2' R U R')", id: 'f8366026-b327-4dc3-84a8-0f78ff1a0750' }]
  },
  {
    name: 'Anti-Sune Case 1',
    id: '2727b368-e75f-49bb-aa35-0dfc2f7b3582',
    idMethod,
    puzzle,
    group: 'Anti-Sune Cases',
    algs: [{ moves: "U' (F' R U R2') U' R' F R U R", id: '5965e670-8aeb-489f-aca1-166a502ab767' }]
  },
  {
    name: 'Anti-Sune Case 2 - To OLL',
    id: 'c4121514-f0ef-4daf-8834-6fd9dd024f6d',
    idMethod,
    puzzle,
    group: 'Anti-Sune Cases',
    algs: [{ moves: "U' (F' R U R') (U' R' F R)", id: 'e5b4141f-d333-4525-b3b9-bcabfe891ba8' }]
  },
  {
    name: 'Anti-Sune Case 3',
    id: 'fe3581e8-47d5-491a-b49d-eae2eb1ac4ca',
    idMethod,
    puzzle,
    group: 'Anti-Sune Cases',
    algs: [{ moves: "U' (R U' R' U2) (R U' R' U' R U R')", id: '0767c937-9acc-4b02-8774-9e1fbf1439ac' }]
  },
  {
    name: 'Anti-Sune Case 4',
    id: '6250f543-3ea1-403d-85ea-807c7cf278c8',
    idMethod,
    puzzle,
    group: 'Anti-Sune Cases',
    algs: [{ moves: "U' (R U R' U2') (R U' R' U2 R U' R')", id: '5e3809b3-0694-46fe-9d27-f5a7ffe5ffaf' }]
  },
  {
    name: 'L Case 1',
    id: '722e2ace-6051-4c97-8b8b-4cc44c2791e4',
    idMethod,
    puzzle,
    group: 'L Cases',
    algs: [{ moves: "U (R U' R' U) y' (R' U R U R' U2' R)", id: '3a5c35b7-8424-4320-bdb9-cb501384a2bf' }]
  },
  {
    name: 'L Case 2 - To OLL',
    id: 'ff15f028-453e-4acc-bd55-76a87aeb3b7b',
    idMethod,
    puzzle,
    group: 'L Cases',
    algs: [{ moves: "(R' F' R U) (R U' R' F)", id: '3037e0eb-581b-4c2d-b97a-ac9eb7103b0e' }]
  },
  {
    name: 'L Case 3 - To OLL',
    id: 'f27d8a44-bc32-42ea-a136-89dd640ffa0e',
    idMethod,
    puzzle,
    group: 'L Cases',
    algs: [{ moves: "U' (F' R U R') (U' R' F R)", id: 'b22fdfb8-fe90-48af-a4a0-5ef1a79ab3e4' }]
  },
  {
    name: 'L Case 4',
    id: '2d6b14e9-c5d3-4e43-b2b6-54a9299cf189',
    idMethod,
    puzzle,
    group: 'L Cases',
    algs: [{ moves: "U2 (R U2' R' U') y' (R' U2 R U' R' U' R)", id: 'c8a0c226-b8a7-4654-bf73-6df03c1e3865' }]
  },
  {
    name: 'T Case 1 - To OLL',
    id: '416b6874-fb89-484d-adc1-8af906815068',
    idMethod,
    puzzle,
    group: 'T Cases',
    algs: [{ moves: "(R' F' R U) (R U' R' F)", id: '90f561e4-1999-4ca7-8999-c5945334818c' }]
  },
  {
    name: 'T Case 2 - To OLL',
    id: '335d9f73-9d07-4fc2-a3d9-2e98ac5753e9',
    idMethod,
    puzzle,
    group: 'T Cases',
    algs: [{ moves: "(R' F' R U) (R U' R' F)", id: '3efabfbd-84e4-4acc-abaf-9023d2195102' }]
  },
  {
    name: 'T Case 3 - To OLL',
    id: 'cd285644-7b8b-49fb-ad3a-3edcc80cc641',
    idMethod,
    puzzle,
    group: 'T Cases',
    algs: [{ moves: "U' (F' R U R') (U' R' F R)", id: '79430f0a-cff0-4df0-be72-a5ef3ac52dce' }]
  },
  {
    name: 'T Case 4 - To OLL',
    id: '54e68ba8-6d32-4a7a-852b-9ba66bbac865',
    idMethod,
    puzzle,
    group: 'T Cases',
    algs: [{ moves: "U' (F' R U R') (U' R' F R)", id: '72834a5e-d98b-4541-aeed-e79116df4cc1' }]
  },
  {
    name: 'U Case 1 - To OLL',
    id: '2414e600-5ab4-4f07-80f7-5750093f776e',
    idMethod,
    puzzle,
    group: 'U Cases',
    algs: [{ moves: "U' (F' R U R') (U' R' F R)", id: '17b996fa-3679-44e1-a696-4712809f64f9' }]
  },
  {
    name: 'U Case 2 - To OLL',
    id: '4c9df5fc-d485-44e2-aaaa-fac2d5fbfa51',
    idMethod,
    puzzle,
    group: 'U Cases',
    algs: [{ moves: "U' (F' R U R') (U' R' F R)", id: 'a79efa88-fb4f-4ab0-814d-a449101acc37' }]
  },
  {
    name: 'U Case 3',
    id: 'b854dffa-e602-4075-a715-aeb1f2800473',
    idMethod,
    puzzle,
    group: 'U Cases',
    algs: [{ moves: "U' (R' D' R U') (R' D R U) (R U R')", id: 'bb29d156-cd74-44d0-ad6b-f669415947e5' }]
  },
  {
    name: 'U Case 4',
    id: '28d1940f-6683-467f-84b1-8dcb295bdab5',
    idMethod,
    puzzle,
    group: 'U Cases',
    algs: [{ moves: "U (R U' R') (U' R' D' R) (U R' D R)", id: '23f44642-f082-45f6-88b5-942eae2ec3df' }]
  },
  {
    name: 'Pi Case 1',
    id: '88129020-7afe-48c6-9b4d-13f7850f2f35',
    idMethod,
    puzzle,
    group: 'Pi Cases',
    algs: [{ moves: "(R U2' R' U) (R U2 R' U') (R U2 R')", id: '320468db-fd9d-402b-843a-d3805c982332' }]
  },
  {
    name: 'Pi Case 2',
    id: '18204115-4af3-42fe-ac38-098ae57a6430',
    idMethod,
    puzzle,
    group: 'Pi Cases',
    algs: [{ moves: "(R U R' U2') (R U R' U') (R U2 R')", id: '413f85e7-0d73-434a-a2e0-902e6c52c3d5' }]
  },
  {
    name: 'Pi Case 3',
    id: 'd3bc4403-7436-4564-81e5-0b9d7e2136fd',
    idMethod,
    puzzle,
    group: 'Pi Cases',
    algs: [{ moves: "U2 (R U2' R' U) (R U' R' U2 R U' R')", id: 'c80d45c6-0f1f-4d5b-b112-b5b3635bfca9' }]
  },
  {
    name: 'Pi Case 4',
    id: '7fee0d87-f040-436a-99ab-2aefa78c1166',
    idMethod,
    puzzle,
    group: 'Pi Cases',
    algs: [{ moves: "U2' (R U R' U2') (R U2' R' U2 R U' R')", id: 'a398de9a-e7a4-4c98-865b-84c3289a2622' }]
  }
]
