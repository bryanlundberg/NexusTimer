import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

const idMethod = 'ZBLL_AS_ALGS'
const puzzle = '333'

export const ZBLL_AS_ALGS: AlgorithmCollection[] = [
  {
    name: 'ZBLL AS 1',
    id: '467b4c32-dc6c-456a-bd9b-dfb383dae1a1',
    idMethod,
    puzzle,
    group: 'AS1',
    setup: "R U2' R' U2' B' U R U R' U' B R U' R' y",
    algs: [
      { moves: "y' R2 D R' U2 R D' R' U' R' U R U' R' U R U2 R'", id: '2ad60437-25cb-43f4-9ae3-0895b958d015' },
      { moves: "y' R U R' U R' D R2 U' R' U R2 D' R' U2 R'", id: '87e64ad7-9412-4c3c-bf36-fbe99f640120' },
      { moves: "y' R U R' U' L' U2 R U' R' U2 L U' R U2 R'", id: '2585caa9-6daf-46f0-b50a-2c55bf53b3c6' },
      { moves: "y R U R2 F' U' F U R F R' F' R2 U2 R'", id: '9dbd6e06-970d-4f93-a405-711e9e5d0930' }
    ]
  },
  {
    name: 'ZBLL AS 2',
    id: 'dec6725a-277e-40ec-9a9e-f1bdb7bb27bc',
    idMethod,
    puzzle,
    group: 'AS1',
    setup: "R' U' F2' U' R2' U R2' U F2' R2' U2' R'",
    algs: [
      { moves: "y2 R' U2 F' R U R' U' R' F R2 U R' U R", id: '937259d9-697b-44cb-a228-9870d9ec3433' },
      { moves: "R U2 R2 F2 U' R2 U' R2 U F2 U R", id: '77868384-eb86-4d39-8c98-3aec8964a2e4' },
      { moves: "y2 R' U2 R U R' U' R U R' U' R' D' R U2 R' D R2", id: '687815ed-53d4-4c49-a1da-7c53ccba06ea' },
      { moves: "R U2 R2 F2 D' F2 U' F2 D F2 U R", id: 'f2a10f08-5ddc-41d6-b788-ff646ab5cfa9' }
    ]
  },
  {
    name: 'ZBLL AS 3',
    id: '67f41347-244d-4eae-8f15-82a2a6c3dc41',
    idMethod,
    puzzle,
    group: 'AS1',
    setup: "R' U2' R U' L U' R2' U L' U' R2' U' R' U R",
    algs: [
      { moves: "y2 R' U R U R' U R U2 R' U' R2 D R' U2 R D' R'", id: 'f092ab1a-bb07-4b95-84ae-142817602b9e' },
      { moves: "D R2 U' R U' R2 U R' U R2 D' R U2 R'", id: '33321e19-c08c-4a9f-a569-7d5da5729d60' },
      { moves: "R' U' R U' R D' R U2 R' D R U2 R U2 R", id: '95e1de89-f95a-4306-961c-e423d969fa51' },
      { moves: "R U R' U' R' F R U2 F' U' F U' R U R' U' F'", id: '5b1198af-f468-42fb-b02f-9bb04a783a18' }
    ]
  },
  {
    name: 'ZBLL AS 4',
    id: '825beac7-c4e7-40da-aaf2-f6801139264b',
    idMethod,
    puzzle,
    group: 'AS1',
    setup: "F' U2' F' R2' u' L F2' L' u R2' F2'",
    algs: [
      { moves: "y' R' D' R U2 R' D R2 U' R' U2 R U R' U R U R'", id: '94d7c741-e15f-4485-b834-5d7ddba8565a' },
      { moves: "y2 R' U2 R' U2 F' R U R U' R' F R' U2 R U2 R", id: '4a03610f-deaf-4844-90ce-cde3af75d54c' },
      { moves: "y2 r U' r' U2 R' F R U2 F2 U' R U' R' F'", id: '3ecae113-8523-4f8d-99ec-e7c176afa540' },
      { moves: "y' R U2 R U2 R' U' R' U R F' R U2 R' U2 R' F", id: '573ce82e-9170-4989-a371-2b54b0e1638f' }
    ]
  },
  {
    name: 'ZBLL AS 5',
    id: 'ff7671fa-4cb3-46de-ad05-c802628e25ad',
    idMethod,
    puzzle,
    group: 'AS1',
    setup: "F R' U2' R F' R' F U2' F' R y2'",
    algs: [
      { moves: "y2 R' F U2 F' R F R' U2 R F'", id: 'f7d98ccf-06cc-4f9c-9960-6c34051825c4' },
      { moves: "y2 R' F U2 R' D' R U2 R' D R F' R", id: 'c85f0e73-6695-4753-b220-5cd94d606dcf' },
      { moves: "y2 x R' U B2 U' R U R' B2 R U' x'", id: '05eafe16-f670-4f5d-a726-34d77027a99d' },
      { moves: "y' R U R2 D R2 D' R2 U' R2 D R2 D' R", id: 'e5c39342-c0e4-4f52-a654-ed34c3ce2149' }
    ]
  },
  {
    name: 'ZBLL AS 6',
    id: '715aa13e-e6ac-4131-bb7a-40631b8b386b',
    idMethod,
    puzzle,
    group: 'AS1',
    setup: "z' D U R2' U' L' U R2' z R2' U L' U' R",
    algs: [
      { moves: "y2 R' F U' F' U' R F U' R' U' R F'", id: '2ae4d4a3-920e-457c-afd6-fbe0a32c0365' },
      { moves: "y2 R U R' U R' U' R U' R D R' U R D' U' R2 U2 R", id: '551fac66-4e99-4f07-b640-8a548d56c73a' },
      { moves: "y2 R' F U' F' U' R F U' R' U' R F' U", id: '871d8a31-8c21-471f-a7d2-975cc5121027' },
      { moves: "L' R' D2 R U R' D2 R2 U' L U R'", id: 'c5d8edd7-5f2d-42b1-9a5a-c12ea9b78b0f' }
    ]
  },
  {
    name: 'ZBLL AS 7',
    id: '530c776e-e28b-438d-92ba-eeadb837b662',
    idMethod,
    puzzle,
    group: 'AS1',
    setup: "F R2' F' U2' R' U2' R2' U2' R U2' R F R F' R y'",
    algs: [
      { moves: "y2 R2 D r' U2 r R' U' R D' R' U R' U' R U' R'", id: '389b864b-3962-4d6c-bc03-1228dfb7290d' },
      { moves: "R B' r2 R2 U2 r' U' r U2 R' r2 B R2", id: '12c1ab83-d9d8-4427-8bc4-47cd0bde3dbe' },
      { moves: "y R' U' R U' R' U R' D' R U' R' r U2 r' D R2", id: 'd4bae92c-02b6-45d7-bff9-9f6d8a275729' },
      { moves: "y R' F R' F' R' U2 R' U2 R2 U2 R U2 F R2 F'", id: '4ef73286-7abf-4297-9846-732360f881da' }
    ]
  },
  {
    name: 'ZBLL AS 8',
    id: '17b0db07-3d63-46e3-9dd3-bb24f1008c36',
    idMethod,
    puzzle,
    group: 'AS1',
    setup: "L' U' L U' R U2' L' U' R' U2' L U' R U' R' y'",
    algs: [
      { moves: "y' R U2 R' U' R2 D R' U2 R D' R' U' R' U R U R'", id: 'f226b9d0-8104-4cb0-a6f4-573cc9399ee7' },
      { moves: "y2 R' U' R U' R U R' U' R' U2 F R U R U' R' F'", id: 'ff48131f-0558-4b9e-b73b-781fa74d2f01' },
      { moves: "y' R2 U R2 U R U2 R' U2 R' U' D R' U R D'", id: '6601106d-635d-4d58-9c76-f49deede019d' },
      { moves: "y' R2 F' R2 U R2 D' F' U' D F' U F2 R2", id: 'b754269d-e4c7-4e9a-b894-3757eff04101' }
    ]
  },
  {
    name: 'ZBLL AS 9',
    id: '193bf322-3b68-4e43-8096-1c21cb48d5eb',
    idMethod,
    puzzle,
    group: 'AS1',
    setup: "L' U2' R L U' L' U2' R' U2' L U2' R U' R' y'",
    algs: [
      { moves: "y2 R' U' R U' R D R' U' R D' R' U R' U2 R", id: '3a128939-516e-4ddc-86a3-c2803c136981' },
      { moves: "y2 R' U' R U' R' U R' D' R U' R' D R U2 R", id: '22b553a0-007b-4673-b369-9a700478800e' },
      { moves: "y R U R D' R' U2 R D R' D' R' U2 R U' D R'", id: '496b2801-44af-4668-9aaa-b118b3065198' },
      { moves: "y R U R' U2 L' U2 R U2 L U L' R' U2 L", id: '066fdd55-3ccb-43e8-9d0c-13c36bb02bc7' }
    ]
  },
  {
    name: 'ZBLL AS 10',
    id: 'cc6d407b-2275-479e-8096-e44234378dc7',
    idMethod,
    puzzle,
    group: 'AS1',
    setup: "L U2' R' U L' U' L R U R' U L' U' R y'",
    algs: [
      { moves: "y R U2 R D R' U' R D' R' U R' U' R U' R'", id: 'b08b4ee8-2c1f-4330-983c-9129c2e3d814' },
      { moves: "y R U2 R' U R' D' R U' R' D R U' R U' R'", id: '9cfda8d5-9501-442c-9aae-20740f42f1c3' },
      { moves: "y R' U L U' R U' R' L' U L U' R U2 L'", id: '3896c785-5491-4681-b88a-ea4183d1d59c' },
      { moves: "y R U2 R D R' U' R D' R' U R' U' R U' R' U2", id: '4ebb4950-927e-4591-a49f-abede03dc47f' }
    ]
  },
  {
    name: 'ZBLL AS 11',
    id: '082420ef-a671-48b5-aad9-025c5113d63f',
    idMethod,
    puzzle,
    group: 'AS1',
    setup: "R U R' U R U' R D R' U' R D' R2' y2'",
    algs: [
      { moves: "y2 R2 D R' U R D' R' U R' U' R U' R'", id: 'a184bd73-3da7-407b-bcbb-685dc6784a66' },
      { moves: "y2 L' U R U' L2 U2 R' U R U2 L' R'", id: '4c95fa68-51a0-4dc2-b5b9-36df73d3f168' },
      { moves: "U R U R' U' D R' U' R U R2 U' R U R2 D'", id: '079b7101-4feb-45c3-9069-1140052b2c15' },
      { moves: "y2 R' F' r U R U' r' F r' F' r U' r' F2 r", id: '5426759d-0f1a-497c-bb3a-346c86f70dff' }
    ]
  },
  {
    name: 'ZBLL AS 12',
    id: '4861a1c4-e327-46fd-965d-a50e1e6d5cc5',
    idMethod,
    puzzle,
    group: 'AS1',
    setup: "R2' D' R U' R' D R U' R U R' U R y'",
    algs: [
      { moves: "y R' U' R U' R' U R' D' R U R' D R2", id: '03890646-6e0f-451f-bae7-ab4ad2758967' },
      { moves: "y' r U2 R' U' R U' r' F R' F' R U R U' R'", id: '5c11bd43-e5a1-4281-9102-19d1b7613512' },
      { moves: "y' R U' L' U R' U' L R' U2 R U R' U R", id: '981051fd-0194-449e-a006-c3e477ddb177' }
    ]
  },
  {
    name: 'ZBLL AS 13',
    id: 'acd06353-71c1-4be2-a69f-f08d9360e291',
    idMethod,
    puzzle,
    group: 'AS2',
    setup: "R' D' R U R' D R2' U R' U2' R U R'",
    algs: [
      { moves: "R U' R' U2 R U' R2 D' R U' R' D R", id: 'f375f791-6430-41d6-b1b6-a3e66cac9410' },
      { moves: "y' L U' R' U L' U R2 U R2 U R2 U2 R'", id: 'f010377c-e294-45ae-b900-3dc0a8f37560' },
      { moves: "y R' U' R U2 R D R' U R D' R2 U2 R", id: 'f70f9bf7-818d-4ea6-b236-a7355f906f8c' },
      { moves: "y R' U' R U' R2 D' R U R' D R U R", id: 'f1d6e76d-7306-4304-98cf-a087b97c69ae' }
    ]
  },
  {
    name: 'ZBLL AS 14',
    id: '5675a835-2836-4a76-832d-9df6c67af79d',
    idMethod,
    puzzle,
    group: 'AS2',
    setup: "R U R2' F' R U R U' R' F U R U2' R' y'",
    algs: [
      { moves: "y R U2 R' U' F' R U R' U' R' F R2 U' R'", id: '5a67bdc3-c493-41f3-9a7c-537c0cd1e2b0' },
      { moves: "S U2 R U2 R' U2 R' F R f'", id: '26b07699-1cea-407d-81c4-13bb3162bbee' },
      { moves: "y2 R U2 R' U2 R U' R' L U' R U R' L'", id: '75e56158-e75a-4961-9765-81543a5e0763' },
      { moves: "y2 R U' R U F' U2 R' U2 R F U' R2", id: 'e20c1872-c8a3-4f26-b593-568277d5bf20' }
    ]
  },
  {
    name: 'ZBLL AS 15',
    id: 'a6aa42c6-3a13-46c4-9e6b-8229d0635442',
    idMethod,
    puzzle,
    group: 'AS2',
    setup: "x M U R' U' L U2' R U2' R' y2'",
    algs: [
      { moves: "y' F U2 F' U' R' F U' F' U R", id: 'b8e8f450-4081-408e-b085-e94bee4fa9ec' },
      { moves: "y2 R U2 R' U2 L' U R U' R' L", id: '891b0bee-ac91-4ebe-a12f-b1f5de607aa1' },
      { moves: "y2 R U2 R' U2 r' F R F' r R'", id: '5183860b-e65a-4cce-a380-a778d0314198' },
      { moves: "y2 R U2 R' U2 L' U R U' M' x'", id: 'dd01a8f8-56cd-4607-a746-a79ddcd5d873' }
    ]
  },
  {
    name: 'ZBLL AS 16',
    id: '1634faef-d7fb-4c55-96fe-60c49c423d29',
    idMethod,
    puzzle,
    group: 'AS2',
    setup: "L' R' U2' R U R' U2' L U R U R' U R",
    algs: [
      { moves: "y' R' U2 R' D' R U R' D R2 U' R' U2 R", id: 'a61321f8-9499-4b43-a71b-93db30375db3' },
      { moves: "R' U' R U' R' U' L' U2 R U' R' U2 R L", id: '6fde3a3c-4a8e-4eb1-859f-d15b0e9795a3' }
    ]
  },
  {
    name: 'ZBLL AS 17',
    id: 'be9ec9a4-5cb9-4ff7-9d4a-1d0efb478929',
    idMethod,
    puzzle,
    group: 'AS2',
    setup: "R' U' F U' R2' U R2' U F' R U' R U' R' y'",
    algs: [
      { moves: "y R U R' U R' F U' R2 U' R2 U F' U R", id: 'efe9d29f-2888-4647-b1c8-2e3979dff05b' },
      { moves: "y R U R' U2 R' D' R U' R' D U' R2 U' R2 U2 R", id: 'b103ee43-4c72-4303-803a-50d9b6d2325f' },
      { moves: "y R U R' U' R U' R' F' R U R' U R U' R' U' R' F R", id: '6c08c7fb-c65d-43e0-9f81-e378c9c93756' },
      { moves: "F R U R' F R' F' U2 R2 U R2 U R F'", id: '57b5960b-9fd1-4a3c-996c-74df4afa2e85' }
    ]
  },
  {
    name: 'ZBLL AS 18',
    id: '83f050f8-de24-4f75-a75a-ac06a762c155',
    idMethod,
    puzzle,
    group: 'AS2',
    setup: "L U' R' U L' U2' R U L U' R' U L' R",
    algs: [
      { moves: "y R2 D R' U R D' R2 U' r' F R F' M'", id: '57764851-546e-485b-b0b7-850f3e136975' },
      { moves: "y R2 D R' U R D' R2 U' L' U R U' R' L", id: '777c703e-636c-4b44-9869-80c43083f49b' },
      { moves: "y2 R L' U' L U R' U' L' U2 R U' L U R'", id: 'ee734473-9b4f-4a8a-a298-f22ddbfa6038' },
      { moves: "y2 F2 D F' U F D' F2 R' F U' F' U R", id: '3b8a5d9f-b43f-4c56-86ac-a32c76b31da7' }
    ]
  },
  {
    name: 'ZBLL AS 19',
    id: '3c7d9810-78c8-48e0-a5fb-e53dddf979e5',
    idMethod,
    puzzle,
    group: 'AS2',
    setup: "L U L' U L U2' R U2' R' U' R U2' L' U R'",
    algs: [
      { moves: "y2 S R U R' U' R' F R S' R U R' U' F'", id: '87a53f20-f0d8-4b59-af3c-b8ca56178c62' },
      { moves: "y2 S R U R' U' R' F R f' F R U R' U' F'", id: 'aee5ae87-9667-4fa2-9bf4-7e04a6aefe8b' },
      { moves: "F R' F' U2 R U F' R' U R U F R U' R'", id: 'e9bae3a1-d826-410b-85f4-2817c05a9019' },
      { moves: "R U' L U2 R' U R U2 R' U2 L' U' L U' L'", id: '58c0df24-ece6-4fb2-b6f4-6e5f83dda0b6' }
    ]
  },
  {
    name: 'ZBLL AS 20',
    id: '88814166-d8c8-41e8-9fd0-fa508a7cbb18',
    idMethod,
    puzzle,
    group: 'AS2',
    setup: "R2' D' r U2' r' D R2' U R' U R y2'",
    algs: [
      { moves: "y2 R' U' R U' R2 D' r U2 r' D R2", id: '02c15416-2241-4a2d-a117-df3936761b48' },
      { moves: "R D' R U' R D R' U R2 D' R U2 D R' U2 R", id: '7c40b397-a4bb-423e-ac33-a2aea041c6ae' }
    ]
  },
  {
    name: 'ZBLL AS 21',
    id: '2d645019-d118-4516-80c3-96948ddd1e5e',
    idMethod,
    puzzle,
    group: 'AS2',
    setup: "R2' D' R U2' R' D R2' U R' U R y2'",
    algs: [{ moves: "y2 R' U' R U' R2 D' R U2 R' D R2", id: '444ebcc5-5e57-49a9-aa92-7636792a9125' }]
  },
  {
    name: 'ZBLL AS 22',
    id: 'ed0a33a7-826d-4420-8b69-8c41e9d86868',
    idMethod,
    puzzle,
    group: 'AS2',
    setup: "R U R2' F' r U R U' r' F U R U2' R' y'",
    algs: [
      { moves: "y2 R U2 R' U' R U R' U2 R' F R U R U' R' F'", id: 'bbdc630e-98b0-4e1b-8a4c-e019466a387f' },
      { moves: "y R U2 R' U' F' r U R' U' r' F R2 U' R'", id: 'd4914bed-a115-4837-a5fa-f96fd4824c78' },
      { moves: "y L U L' U L U2 L2 R U R' U' L U2 R U2 R'", id: '9607c600-ad1f-44ca-98e1-a8af0d7a818a' }
    ]
  },
  {
    name: 'ZBLL AS 23',
    id: 'ffcbbaec-9b03-4504-9e38-43fa39ce95b4',
    idMethod,
    puzzle,
    group: 'AS2',
    setup: "R' F' R U R' U' R' F R U' R U R' U' R U R' U R y'",
    algs: [
      { moves: "R' U2 R' D' R U2 R' D R U' R U' R' U2 R", id: 'be2a6ae6-80f5-4ff9-881c-4a45a7165906' },
      { moves: "y R' U' R U' R' U R U' R' U R' F' R U R U' R' F R", id: 'e1aa248e-a98b-403c-b086-cedaa76420c3' },
      { moves: "y R' U' R U' R' U y' R' U2 R U' R' U' R B", id: '49a34933-2bbd-4b3d-88cb-5dc7b56f15c4' },
      { moves: "F R U R2 U' R U' R U R2 U R2 U' R' U F'", id: '4993b1cc-cc35-4f90-a369-f673cb8dd646' }
    ]
  },
  {
    name: 'ZBLL AS 24',
    id: '33e8a8e7-83b0-4469-b8a7-beb2c93f989f',
    idMethod,
    puzzle,
    group: 'AS2',
    setup: "R2' F R U R U' R' F' R U' R' U R",
    algs: [
      { moves: "R' U' R U R' F R U R' U' R' F' R2", id: '2d5cfaa5-6a1d-4fe8-bee5-2a4c2e5abc1e' },
      { moves: "y L U2 L' U2 R' U L2 U' R U L' U' L'", id: '7ca1eef8-8916-468d-8f7a-3a078257a573' },
      { moves: "y R U2 R' U2 R' F R2 U' R' U' R U R' F'", id: 'db35e40d-831c-4d8d-8538-7c7c73f67613' }
    ]
  },
  {
    name: 'ZBLL AS 25',
    id: '29c0ba5b-a15b-4af6-b050-009d9835ce30',
    idMethod,
    puzzle,
    group: 'AS3',
    setup: "R2' D R' U2' R D' R' U' R' U R U2' R' y",
    algs: [{ moves: "y' R U2 R' U' R U R D R' U2 R D' R2", id: 'e022a37d-c865-412a-90a7-8105eed34a04' }]
  },
  {
    name: 'ZBLL AS 26',
    id: '0cbf3e40-c1ba-4131-aa92-df5d6511848f',
    idMethod,
    puzzle,
    group: 'AS3',
    setup: "R' U2' F' R U R' U' R' F R U2' R y2'",
    algs: [
      { moves: "y2 R' U2 R' F' R U R U' R' F U2 R", id: '99f8209b-b6b2-494b-ab3f-9e4951543375' },
      { moves: "U2 R' U2 R' F' R U R U' R' F U2 R U2", id: 'b4d305c4-d25b-40cf-9334-ced10248c323' }
    ]
  },
  {
    name: 'ZBLL AS 27',
    id: 'ac9c2a21-7c86-461e-8810-e8f041525b55',
    idMethod,
    puzzle,
    group: 'AS3',
    setup: "R' U2' R U R' U' R' D' R U2' R' D R2'",
    algs: [
      { moves: "R2 D' R U2 R' D R U R U' R' U2 R", id: 'bfbdc6ca-34f8-4f4d-a2e7-be0be57dc0a0' },
      { moves: "R' F' R U R' U' R' F R2 U' R' U R U' R' U2 R", id: '1c396942-3259-47e4-a98b-7acc89d03527' },
      { moves: "y2 L' U' L U F R U2 R' U' x U2 L U r'", id: 'd781f0de-48f1-470b-9c74-9e8e05e5bed5' }
    ]
  },
  {
    name: 'ZBLL AS 28',
    id: 'cd4cd534-21b1-45f9-81cb-a372fdb89b59',
    idMethod,
    puzzle,
    group: 'AS3',
    setup: "R2' D R2' U2' R U R' U R2' D' R' U2' R' y'",
    algs: [
      { moves: "y2 F U R U' R' U R U' R2 F' R U2 R U2 R'", id: 'd924d92c-772d-4015-9fd5-a19e0b631fcc' },
      { moves: "y2 R U2 R2 D' R U' R' D R2 U R' U' R U' R'", id: 'a8ab927b-20e2-4cd2-8dcc-ac1cb60a2a05' },
      { moves: "y R U2 R D R2 U' R U' R' U2 R2 D' R2", id: '60528daf-be97-41fa-8833-cee72900c1f4' },
      { moves: "y' L U2 F L' U' L U L F' L' U2 L'", id: 'f49bd5c9-a0c3-495d-b5b8-8d9918e67de3' }
    ]
  },
  {
    name: 'ZBLL AS 29',
    id: '9b98a2ae-51ef-4f73-89c9-95903ed2f981',
    idMethod,
    puzzle,
    group: 'AS3',
    setup: "R' U2' R2' U R D' R U R' D R2' U' R U' R' y2'",
    algs: [
      { moves: "y F U R U' R' U R U' R' U R2 D R' U' R D' R2 F'", id: '81db352b-57ed-4a8f-999d-6b303df07cd7' },
      { moves: "y' R' U2 R U R2 D' R U' R' D R2 U R' U' R U R' U R", id: '64f4763d-38aa-4165-b32f-ddb454a9f061' },
      { moves: "y2 R U R' U R2 D' R U' R' D R' U' R2 U2 R", id: '9324fa08-c8de-4f01-885b-50d5319d162a' },
      { moves: "R U' R' F D U R U' R' U R U' R' D' R' F' R", id: '57b7abe5-59c1-4e14-89a2-6b7e9d5740f8' }
    ]
  },
  {
    name: 'ZBLL AS 30',
    id: '4e12b20e-818b-4ca4-bd7d-92a2b261ac2a',
    idMethod,
    puzzle,
    group: 'AS3',
    setup: "L U' R' U L' U' R",
    algs: [
      { moves: "y2 L' U R U' L U R'", id: '72e1bdfc-148d-4b19-9df6-5e905a2a4749' },
      { moves: "y2 r' F R F' r U R'", id: '318e5082-cfbd-48f0-bb99-814823ba2479' },
      { moves: "R' U L U' R U L'", id: 'ab8957a6-8cf0-476d-9738-7d172e81ca7b' },
      { moves: "z D' R U R' D R U' z'", id: 'a9c78ea3-fd78-4e16-aafd-90375bb3e4f0' }
    ]
  },
  {
    name: 'ZBLL AS 31',
    id: '061d1b65-681a-4b1a-b5b9-c01fba1b7f1f',
    idMethod,
    puzzle,
    group: 'AS3',
    setup: "L' U' L U' L' U' R U' L U' R' U' R U' R' y2'",
    algs: [
      { moves: "y2 R' U R U R' U' R' D' R U R' D R U R U' R' U2 R", id: '6f88a567-09dd-41ed-9a5c-5de8ee447f31' },
      { moves: "y' L' U R' U' R L U2 R' U' R2 U2 R' U' R U' R'", id: 'ffda9be3-c516-43ad-99db-96c4101d4c84' },
      { moves: "y R U2 R' U' R U R D R' U R D' R' U' R' U R U R'", id: 'b7116242-a135-42bf-86b1-e2f467d5a145' },
      { moves: "y2 R U R' U R U L' U R' U L U L' U L", id: 'c8536dfd-d6e7-4c81-be28-0c6722b3e3e0' }
    ]
  },
  {
    name: 'ZBLL AS 32',
    id: 'd39b7644-e81c-4f82-b997-ce6212c25a02',
    idMethod,
    puzzle,
    group: 'AS3',
    setup: "R' U2' R' D' R U' R' D R U R U' R' U R U R' U R",
    algs: [
      { moves: "y R U R2 F' R U R U R' U' R U' R' F R U' R'", id: 'f4b2221d-58ca-4c98-a942-92d9bc093cce' },
      { moves: "y2 D R' U' R D' R U' R' U R2 U R' U' R2", id: '60eb4a51-ce8e-48fb-b998-213ce7d5b782' },
      { moves: "y R2 U' R' U R2 U R' U' R D' R U' R' D", id: 'ae5fa49a-394e-406a-9630-ff53bd3740b0' },
      { moves: "R' U' R U' R' U' R U R' U' R' D' R U R' D R U2 R", id: 'b1367688-08dc-49a1-8418-7071c7f36ce8' }
    ]
  },
  {
    name: 'ZBLL AS 33',
    id: '76cbb5c5-3b1a-4a47-a188-02ef44cf09ce',
    idMethod,
    puzzle,
    group: 'AS3',
    setup: "R2' U R U R' U' R' U' R' L' U R' U' L y2'",
    algs: [
      { moves: "y' R U2 R' U' R U R D r' U2 r D' R2", id: 'fc6db223-4afc-40e4-a99c-6426572d4e1c' },
      { moves: "y2 R' U2 R' D' R U R' D R U' R U R' U' R U R' U R", id: 'edba5f18-ab99-442d-affb-949d67c6eb3c' },
      { moves: "y2 L' U R U' L R U R U R U' R' U' R2", id: 'b42afea4-b60b-4a63-adf4-76277da1ed22' }
    ]
  },
  {
    name: 'ZBLL AS 34',
    id: '21ab42d2-02c7-4ed2-bfce-ddd693c8f1c3',
    idMethod,
    puzzle,
    group: 'AS3',
    setup: "R2' F2' R2' U R U' R F2' R' U2' R' U R U2' R' y'",
    algs: [
      { moves: "y' R U R U' R2 D U2 R' U' R U D' R", id: '4f7925a1-49de-4ca9-a8fc-a98f262b681c' },
      { moves: "y R U2 R' U' R U2 R F2 R' U R' U' R2 F2 R2", id: '679e1085-8d0d-49c9-a8cc-f6f7a647c673' },
      { moves: "S U' R U R U' R2 U R F R' f'", id: '2f000d9a-77f9-4b60-b2d4-8992c6aac1f8' }
    ]
  },
  {
    name: 'ZBLL AS 35',
    id: '5ca7bdbe-bff4-4bb1-bb4b-4a4b1616d16b',
    idMethod,
    puzzle,
    group: 'AS3',
    setup: "L' U' L' U L2' D' U2' L U L' D U' L' y",
    algs: [
      { moves: "y R D' U R U' R' U2 D R2 U' R U R", id: '52f77d05-6c38-457f-941a-5563b83c46f0' },
      { moves: "y' L U D' L U' L' U2 D L2 U' L U L", id: '59af1157-a9a9-4cb3-9e3f-6546e5e12e20' },
      { moves: "y' F' U' f R U R2 U' R U R U' S'", id: '30576c53-b6f6-4d8b-91a0-0c7903ca5230' }
    ]
  },
  {
    name: 'ZBLL AS 36',
    id: '209b4b71-34f7-42eb-8cf9-7ae5d5ab6474',
    idMethod,
    puzzle,
    group: 'AS3',
    setup: "F2' R U' R' U' R U2' R2' U' R F2' R' U R y2'",
    algs: [
      { moves: "y2 F R U' R' U R U R2 F' R U R U R' U' R U' R'", id: '963f6fbf-9c0d-471d-9dac-a186a39b4a49' },
      { moves: "R2 D' r U2 r' D R U R U' R' U2 R", id: 'afbd90b5-2e37-4b8a-b687-13cf68622ba4' },
      { moves: "y2 R' U' R F2 R' U R2 U2 R' U R U R' F2", id: '9ead3237-c598-4cee-b71f-d9e19296562b' }
    ]
  },
  {
    name: 'ZBLL AS 37',
    id: 'deb86257-5610-4a47-ba5d-a893f0b6ff6f',
    idMethod,
    puzzle,
    group: 'AS4',
    setup: "R U R' U R U L U2' R' U R U2' R' L'",
    algs: [
      { moves: "R U R' F' R U R' U' R' F R2 U R' U' R U' R'", id: '81944f1b-3bf6-4027-b836-fe055c982b95' },
      { moves: "y' R U2 R' U' R2 D R' U R D' R' U2 R'", id: '5b9b6839-cc2b-48f7-b335-67be6a9d1d89' },
      { moves: "L R U2 R' U' R U2 L' U' R' U' R U' R'", id: 'ff8c1467-9958-4435-bd1a-0ec1c8d6670c' }
    ]
  },
  {
    name: 'ZBLL AS 38',
    id: '6bdbf461-4435-4746-80f9-98559c570729',
    idMethod,
    puzzle,
    group: 'AS4',
    setup: "R U R' U' R U R2' D' R U2' R' D R2' U2' R' y",
    algs: [
      { moves: "y L' R' U R U' L R' U' R U2 R' U2 R", id: 'ff08dbc6-1eb3-4c71-a8f6-f1eca6dadebf' },
      { moves: "y2 f' L F L' U2 L' U2 L U2 S", id: '9fd0d775-1e2c-421c-b47c-921552b70398' },
      { moves: "y2 R2 U' R U' R2 D' R U R' D R U R U' R", id: '5549b61b-3b91-4fd9-b4bd-4ea8fa656e88' },
      { moves: "y' R U2 R2 D' R U2 R' D R2 U' R' U R U' R'", id: '9b113988-95c3-4d8e-bea0-033e52c13de5' }
    ]
  },
  {
    name: 'ZBLL AS 39',
    id: 'e2e2b0a7-276c-447c-a61d-109ed6a57209',
    idMethod,
    puzzle,
    group: 'AS4',
    setup: "R' U2' R U2' L U' R' U M x",
    algs: [
      { moves: "y2 L' R U' L U R' U2 L' U2 L", id: 'c691315a-08cb-4844-a159-bc3e2064f616' },
      { moves: "x' M' U' R U L' U2 R' U2 R", id: '6947288d-f14f-4d2d-8959-0df26ba1e02a' },
      { moves: "y' F U R' U' R F' U' R' U2 R", id: 'be62185e-b8a9-4e75-a4a0-bb922a04faea' },
      { moves: "y2 x M U' L U R' U2 L' U2 L", id: 'db33980d-5741-4588-93f4-44124c98ad01' }
    ]
  },
  {
    name: 'ZBLL AS 40',
    id: '72074eaa-6be6-4035-badd-bf4879a744ec',
    idMethod,
    puzzle,
    group: 'AS4',
    setup: "R' U R U2' R' U R2' D R' U R D' R' y",
    algs: [
      { moves: "y R U R D R' U R D' R2 U' R U' R'", id: '1a5b80b0-f304-4e0c-9c2e-1cde938d2125' },
      { moves: "R' U' F' R U R' U' R' F R2 U' R' U R", id: '99276668-5fc3-4e94-ac87-ca66f3cdd3d9' },
      { moves: "y R U2 R2 D' R U R' D R U2 R U' R'", id: '8f55b8dc-6e5f-4c2b-a4f4-b2667104b130' },
      { moves: "y' R U' R' U2 L' U R U' L2 U' R' U L'", id: '110420e0-a398-44c1-90e9-e1221a589694' }
    ]
  },
  {
    name: 'ZBLL AS 41',
    id: 'e5a2d268-90e5-4aff-b289-61d28da94681',
    idMethod,
    puzzle,
    group: 'AS4',
    setup: "R' U2' R' D R' U R D' R U R U' R U' R' y'",
    algs: [
      { moves: "y R U R' U2 R U R' U' F' R U2 R' U' R U' R' F", id: 'ac294467-04e1-4626-a7e8-4ed2b0f40767' },
      { moves: "y2 R2 D R' U2 R D' R U' R2 U' R' U R' U R", id: 'a1bce894-7860-44fa-b0d4-22e429f7c88a' },
      { moves: "y' L' U R U' L U' R D R' U2 R D' R2", id: 'a851ce1f-06b1-4a53-a2b1-8504d59b5443' },
      { moves: "y R U R' U R' U' R' D R' U' R D' R U2 R", id: '5b41515e-3c6a-4943-84b6-3b9f57590ad9' }
    ]
  },
  {
    name: 'ZBLL AS 42',
    id: '9f19c419-2c88-4320-800c-43fc8e5b899f',
    idMethod,
    puzzle,
    group: 'AS4',
    setup: "R L' U R' U' L U R U2' L' U R' U' L y'",
    algs: [
      { moves: "R2 D' R U' R' D F R U R U' R' F' R", id: '47b1c90e-af3b-4b4a-8bc3-954fa7b7f97a' },
      { moves: "F U R' U' R F' R2 D' R U R' D R2", id: '33bd35fa-c13e-41ef-b000-20363031ca28' },
      { moves: "y L' U R U' L U2 R' U' L' U R U' L R'", id: 'd9abca60-4286-46e2-9b04-fbbaa56c2755' },
      { moves: "R U2 R' U' R U' R D r' U2 r D' R' U2 R'", id: '52224423-d95d-4f3d-9f0f-cd8ba12aa68f' }
    ]
  },
  {
    name: 'ZBLL AS 43',
    id: '9643cf6e-4229-423e-a891-365e3e709940',
    idMethod,
    puzzle,
    group: 'AS4',
    setup: "R U R' U R2' D r' U2' r D' R2' y2'",
    algs: [{ moves: "y2 R2 D r' U2 r D' R2 U' R U' R'", id: 'db59863e-36c1-44c5-8218-6a082fbedabf' }]
  },
  {
    name: 'ZBLL AS 44',
    id: '4dcb1a17-2b8c-4acb-94b6-0a3cc5fc7669',
    idMethod,
    puzzle,
    group: 'AS4',
    setup: "L' U R' U2' L U' L' U2' L U2' R U R' U R",
    algs: [
      { moves: "R U R' U' R' U2 R U R' U R2 U r' F R' F' r", id: '3e02d4c5-ad2f-4f90-9d36-569f2551a098' },
      { moves: "y R U R' U R U' R2 F R F' r U' r' U r U r'", id: '07e3cbdc-df5f-4dc3-8304-209530ac1152' },
      { moves: "R D' R U' R' D U' R' U R U R2 U' R' U R", id: 'de0cf83a-1858-44bd-a718-8bed3a568128' },
      { moves: "R' U' R U' R' U2 L' U2 L U L' U2 R U' L", id: '6e0c6618-ecff-466a-8b04-6f53caa0f6c2' }
    ]
  },
  {
    name: 'ZBLL AS 45',
    id: 'd7ddd031-117c-49c6-8ab7-f9edbed8283c',
    idMethod,
    puzzle,
    group: 'AS4',
    setup: "R U R' U' L U' R U L' U' R' U' R U2' R'",
    algs: [
      { moves: "R U2 R' U' R U' R D R' U2 R D' R' U2 R'", id: '0b5f7c0e-d51e-4002-a06f-6d37167dccee' },
      { moves: "R U2 R' U R U L U' R' U L' U R U' R'", id: '343f5dbd-bf4e-486d-a938-501e8883e522' }
    ]
  },
  {
    name: 'ZBLL AS 46',
    id: '46113678-db8c-4628-8000-c74b4d394fe5',
    idMethod,
    puzzle,
    group: 'AS4',
    setup: "R' U2' L U' R2' U L' R' U2' R U R' U' R' U R y",
    algs: [
      { moves: "y' R' U' R U' R' F' R U R' U' R' F R U R U' R' U2 R", id: '43e71546-7b3e-4b74-b279-071e3a6ccb31' },
      { moves: "R U2 R' U' R' D' R U' R' D R2 U' R' U R U' R'", id: '68ff68d3-c6ab-486f-a31b-1f312ce355eb' },
      { moves: "y' R' U' R U' R U R D R' U' R D' R U2 R", id: '92e691e3-2e62-430d-8c06-5a5ec5a06f13' },
      { moves: "y' R' U' R U R U' R' U2 R L U' R2 U L' U2 R", id: '9ab56ff6-f94f-4111-8e1d-d60ddcc16e60' }
    ]
  },
  {
    name: 'ZBLL AS 47',
    id: '0fb2c4c7-89a4-46ef-8f83-4cdf0d363aea',
    idMethod,
    puzzle,
    group: 'AS4',
    setup: "R U R' U R2' D R' U2' R D' R2' y2'",
    algs: [{ moves: "y2 R2 D R' U2 R D' R2 U' R U' R'", id: 'ae06fe36-b81b-4fd9-a6cc-c0cd23030c39' }]
  },
  {
    name: 'ZBLL AS 48',
    id: '6af1f2c8-ddb6-4be2-8bb8-993e58865a04',
    idMethod,
    puzzle,
    group: 'AS4',
    setup: "F R' U' R2' U' R2' U2' R2' U' R' F' y'",
    algs: [
      { moves: "R U' R' U2 R U' R' U R' D' R U2 R' D R", id: 'c0da2aba-484f-4602-9ff8-32b65d200645' },
      { moves: "R U R' F' R U2 R' U2 R' F R2 U' R'", id: 'c6400ba9-aaae-4a32-b441-85d61ef6a178' },
      { moves: "y F R U R2 U2 R2 U R2 U R F'", id: 'f7a4aa68-94bf-4a06-b77c-66f9184d5662' }
    ]
  },
  {
    name: 'ZBLL AS 49',
    id: '392d3b69-3c61-4ea6-aa5f-8a052c380584',
    idMethod,
    puzzle,
    group: 'AS5',
    setup: "R U R' U L' U R U' L U2' R'",
    algs: [
      { moves: "y R U' R' F' R U R' U' R' F R2 U' R' U2 R U' R'", id: 'e450e2a5-8586-4ab2-9b76-363d8d22fc9a' },
      { moves: "R U2 L' U R' U' L U' R U' R'", id: '8bd8cd60-04e0-4d12-8340-fa4916e6f707' },
      { moves: "R U' R' U2 R U' R' U2 R' D' R U R' D R", id: 'f330a0ae-75f9-4481-baf0-30c91000b597' }
    ]
  },
  {
    name: 'ZBLL AS 50',
    id: '632ab299-76be-449b-86b8-4b660f587a40',
    idMethod,
    puzzle,
    group: 'AS5',
    setup: "F U' R' U R U F' R U R2' U R2' U2' R' y",
    algs: [
      { moves: "y' R U2 R2 U' R2 U' R' F U' R' U' R U F'", id: 'b4ecadf6-b370-49dd-a809-2fd9e1f26705' },
      { moves: "y' R U2 R2 U' R2 F' R U R' U' R' F U' R'", id: 'e4ac7079-5241-4e8f-a2e0-ccdc3ef786fc' },
      { moves: "y' R U2 R2 U' R2 U' R' U2 R' F' R U R' U' R' F R2", id: '46498ce6-f71b-4eba-811a-85a731e1fd18' },
      { moves: "y' R U2 R' D R' U' R D' R2 U R' U' R' U' R'", id: 'eef8d5f4-8930-4a96-9475-522e9c1802c1' }
    ]
  },
  {
    name: 'ZBLL AS 51',
    id: '69234d01-4a14-49bc-a48b-1ec8dd426080',
    idMethod,
    puzzle,
    group: 'AS5',
    setup: "F R U' R2' U2' R U R' U R2' U R' F' y2'",
    algs: [
      { moves: "R U R' F' R U2 R' U' R U' R' F R U' R'", id: '92b7dbfc-46bf-4cba-ac64-61af7df6c1c6' },
      { moves: "y2 R' F R F' U2 R U' R' U' F R' F' R", id: '82a42e39-b807-4a25-a310-4fb828968c8d' },
      { moves: "y2 F R U' R2 U' R U' R' U2 R2 U R' F'", id: 'bb21d215-8fb5-4ef7-b5d4-a955c52413b0' }
    ]
  },
  {
    name: 'ZBLL AS 52',
    id: '962ad449-96ac-470d-9c77-b2f202d61e48',
    idMethod,
    puzzle,
    group: 'AS5',
    setup: "R' U2' L U' R U L' U R' U R y2'",
    algs: [
      { moves: "y2 R' U' R U' L U' R' U L' U2 R", id: 'c338e8f8-c207-401e-be43-549cb1f1f694' },
      { moves: "L' U' L U' R U' L' U R' U2 L", id: 'a65a9c8d-1be5-4dd0-9fc4-95b07b62f4a0' },
      { moves: "y' R D R' U R D' R' U2 R' U' R U2 R' U' R", id: '73d7e8e4-38e2-4819-ae16-2b7dbbae0d41' },
      { moves: "y2 R' F R f' U2 R U' R' U' f R' F' R", id: '333002df-c0a7-400b-ba57-cea10e338ad0' }
    ]
  },
  {
    name: 'ZBLL AS 53',
    id: '3266e39e-0046-4855-abd5-ba701208ef98',
    idMethod,
    puzzle,
    group: 'AS5',
    setup: "R' U2' L R2' U2' R' U' R U2' L' U R2' U R y2'",
    algs: [
      { moves: "y2 F R' F' R U R U' R2 F R U R' U' F' U R", id: '17cd98ad-bbd2-4ccc-8c62-d4c8f11cc80b' },
      { moves: "y' L' U R U' L U L' U R' U' L U R U' R'", id: 'd67f6456-229c-42b0-af92-e13e353d1c93' },
      { moves: "y' r R D R' U R U' D' L' U R' U' x'", id: '4fd5b658-caa3-410a-a614-2aaabe6d3066' },
      { moves: "R' U2 R' D' R U R' D F R U R U' R' F' R", id: '0d199315-a732-4a6a-8457-ed6489a74921' }
    ]
  },
  {
    name: 'ZBLL AS 54',
    id: '373ef62c-de18-4c0d-8d65-620865c052b9',
    idMethod,
    puzzle,
    group: 'AS5',
    setup: "L' U2' L U R U2' L' U' L U' R' U R U2' R'",
    algs: [
      { moves: "y2 F R2 U R2 U R2 U2 R' U2 R' U' R U' R' F'", id: '2e471823-5bb9-4243-a7b1-ce8b8fab1a3b' },
      { moves: "F' U2 R' D R U' R' D' R f R' F R f'", id: '9f52a918-83b9-440e-8ebc-cbc1a9daf6d9' },
      { moves: "R U2 R' U' F2 R U2 R' U2 R' F2 R2 U' R'", id: '97a91fd8-c909-43db-a612-0f8a26443973' },
      { moves: "R U2 R' U' R U L' U L U2 R' U' L' U2 L", id: 'd6a136f2-b366-4cd8-aa40-ddc554ad0980' }
    ]
  },
  {
    name: 'ZBLL AS 55',
    id: 'fa2a6be9-91fb-4738-a1cd-b84d28cdfae9',
    idMethod,
    puzzle,
    group: 'AS5',
    setup: "R' U2' R U R' U' R L U' R' U L' U2' R y'",
    algs: [
      { moves: "y' F U' R' U R U F' R' U R U' R' U2 R", id: '301767a4-cc05-4465-94b9-240c62676777' },
      { moves: "y R' U2 L U' R U L' R' U R U' R' U2 R", id: '11c83b4f-8486-4c7e-9414-d5b08a24ef58' },
      { moves: "y' R U R' U R U' R' U r' F R F' r U2 R'", id: 'e0acb7e8-3069-4c8c-96a9-3a2a39571b16' }
    ]
  },
  {
    name: 'ZBLL AS 56',
    id: '9cfe4537-6dd3-4a2f-816f-58a6a48bd0ee',
    idMethod,
    puzzle,
    group: 'AS5',
    setup: "R U2' L' U R' U' L R U' R' U R U2' R' y",
    algs: [
      { moves: "y' F R U' R' U R U2 R' U' F' R U R' U' R' F R F'", id: 'f11c5f85-6928-48aa-8287-22db5aafb310' },
      { moves: "y' R U2 R' U' R U R' r' F R F' r U2 R'", id: 'c481bd44-4d6b-46a5-8636-a5eb3e8f8f14' },
      { moves: "y' R U2 R' U' R U R' L' U R U' L U2 R'", id: '0c902bbd-0d42-4eef-b8bb-da3a805512be' },
      { moves: "y R' F' U' F U R F R U R' U' R U R' U' F'", id: '26e1222b-4e2d-4067-a033-9ca935cb8a8b' }
    ]
  },
  {
    name: 'ZBLL AS 57',
    id: '4163f629-6f97-47fa-a4c7-ff19fe28f7ab',
    idMethod,
    puzzle,
    group: 'AS5',
    setup: "L' U2' R L U2' L' U2' R' U2' L U' R U' R' y'",
    algs: [
      { moves: "y' R2 U R2 F' R U R' U R U2 R' F R2 U' R2", id: '37df1d54-914f-41b1-b6bb-3c23e3f43242' },
      { moves: "y R U R' U L' U2 R U2 L U2 L' R' U2 L", id: '4762fe51-cd7e-4392-b1f0-ec937538b823' },
      { moves: "y' R U2 R' F' R U R' U F U F' U R' F R2 U' R'", id: 'e89506dc-ef82-4114-9c92-034566fc8c04' },
      { moves: "R U' R D R2 U2 R U R' U R2 D' R' U R'", id: 'cc0eb073-c170-4195-9ec0-5995ee822932' }
    ]
  },
  {
    name: 'ZBLL AS 58',
    id: '2af7aae1-c781-4fc2-a411-235cfc2b86a2',
    idMethod,
    puzzle,
    group: 'AS5',
    setup: "F U R' F R F' R U' R' U R U' R' F' y",
    algs: [
      { moves: "y' F R U R' U' R U R' F R' F' R U' F'", id: '36088ff8-09f4-44a9-a8b6-c0bd840f5e59' },
      { moves: "y L' U2 R U' R' U2 L R U R' U' R U R' U' R U' R'", id: '2f2303a0-7a87-49f2-b781-57c24dc009f9' }
    ]
  },
  {
    name: 'ZBLL AS 59',
    id: '34248105-b5e8-47d0-88a7-87f4280f994f',
    idMethod,
    puzzle,
    group: 'AS5',
    setup: "R2' U2' R U' R' U R' U L' U R' U' L U' R' y2'",
    algs: [
      { moves: "y2 R' U F' R U R' U' R' F R U2 R U2 R' U' R", id: 'a73f8568-8404-42ea-9901-5d5cf407362b' },
      { moves: "y' R2 U' R2 B R' U2 R U R' U R B' R2 U R2", id: 'dc53b8d0-2368-4c91-a9d8-d34d2ca9035c' },
      { moves: "y2 R' U R' D' R2 U R' U R U2 R2 D R U' R", id: 'eb9f5cfc-36eb-4111-81f3-99fc5acbb5a1' },
      { moves: "y2 R U L' U R U' L U' R U' R U R' U2 R2", id: 'b36d7bcb-df7b-408d-816e-3d4827984be6' }
    ]
  },
  {
    name: 'ZBLL AS 60',
    id: '7856b0cc-2e5f-4c90-a303-ac16ebe64417',
    idMethod,
    puzzle,
    group: 'AS5',
    setup: "L U' R U' R2' U L' U' R U2' L U R U2' R' L' y'",
    algs: [
      { moves: "y' R U' R2 D' U' R U' R' U2 D R2 U R'", id: '14739dcc-b214-4623-a4de-fe14fb383225' },
      { moves: "y R' U R2 U2 D R' U' R D' U' R2 U' R", id: 'd5265fa5-a88d-4450-b945-f822a7c9c1ac' },
      { moves: "y L R U2 R' U' L' U2 R' U L U' R2 U R' U L'", id: 'f33eaca8-38d9-41ac-a564-4508831c97c5' }
    ]
  },
  {
    name: 'ZBLL AS 61',
    id: 'adc94ee4-ee85-40f9-9e8c-7b6ebd2d78b2',
    idMethod,
    puzzle,
    group: 'AS6',
    setup: "R2' U' R2' U' R U R2' U' R2' U R' U R2' y",
    algs: [
      { moves: "y R2 U R2 U R' U2 R' U R U R' U' R2", id: '13848b89-f0eb-4d33-aa67-2792c912e7e6' },
      { moves: "R' U' R U' R' U R U' R U R2 U R U' R U' R'", id: '330a17d2-cdc2-4e5e-b2c6-d7ce2a72b1d2' },
      { moves: "y' F R U R' U F' U' F U' R U R' U' F'", id: 'a5e50e7f-9361-443c-99e6-de5de2ab08aa' },
      { moves: "R' U' R U' R2 U' R' U' R' U R U R U' R", id: 'b39c25c6-2bee-4ee2-b833-9718b85aedd4' }
    ]
  },
  {
    name: 'ZBLL AS 62',
    id: '288b5020-ce2c-4656-ada8-f7a0f3d9a736',
    idMethod,
    puzzle,
    group: 'AS6',
    setup: "R' U2' R U R U R U R' U' R U R U' R U' R' y2'",
    algs: [
      { moves: "y R' U' R U R U2 R' U' R U' R' U R' U R", id: '07411dde-c78a-4496-965f-4d90db7b9384' },
      { moves: "y R2 U R2 U R U2 R' U R U R U' R2", id: 'c0be6f0c-c621-4498-be28-6c5fe647da88' },
      { moves: "y R U2 R' U' R U' R' U' R U' R U R U R U' R' U' R2", id: '04f6152a-79ee-4d7a-a9f4-07f2f8535b11' },
      { moves: "y2 S' l' U' L U' L' U2 l U2 S", id: '44fbccb7-45ad-435a-914e-7bad1de20526' }
    ]
  },
  {
    name: 'ZBLL AS 63',
    id: 'e112a6ce-c295-411b-bafe-6afd43269cb8',
    idMethod,
    puzzle,
    group: 'AS6',
    setup: "R2' U' R' U' R U R U R U R U R' U R",
    algs: [
      { moves: "y2 R U R' U R' U' R U' R' U2 R U R U' R'", id: 'd7d69412-5983-4846-9525-570c4bd2d149' },
      { moves: "R' U' R U' R' U' R' U' R' U' R' U R U R2", id: 'eaf38878-3fe2-4913-b79e-c500e0e81097' },
      { moves: "y R2 U' R U R U R' U2 R U R2 U R2", id: '7f4ca34e-886e-46f9-ad6c-895531201a2f' },
      { moves: "y' R2 F2 R' U2 R' U' R U' R F2 R2", id: 'e1197392-fceb-4990-b31f-1b9a2eb9a15f' }
    ]
  },
  {
    name: 'ZBLL AS 64',
    id: '154a883a-175d-4e28-8f11-edad82d0023a',
    idMethod,
    puzzle,
    group: 'AS6',
    setup: "R' U' R U' R U R' U' R U R2' U R2' U' R' U R U' R' y'",
    algs: [
      { moves: "y' R' U' R U' R U R2 U R U' R U R' U' R U' R'", id: 'd65d9e2c-4e9b-4f7f-ad8a-d62fa2372ade' },
      { moves: "y R U R' U' R U R2 U' R2 U' R' U R U' R' U R' U R", id: 'af7c89fa-a015-464f-894a-73b28de9ae2a' },
      { moves: "y R U2 R' U' R U' R2 U R' U' R3 U' R' U R U R2", id: 'c43a465d-79ec-47d1-9083-2e4f9cbeb6f7' },
      { moves: "y R2 U' R' U R U R' U2 R' U R2 U R2", id: 'e37b4b84-afe4-4ec3-98c4-27e9ab614ce3' }
    ]
  },
  {
    name: 'ZBLL AS 65',
    id: '8044387e-9204-4fe0-bb45-e853437847b2',
    idMethod,
    puzzle,
    group: 'AS6',
    setup: "R' U2' R2' U2' R2' U' R2' U' R2' U R",
    algs: [
      { moves: "R' U' R2 U R2 U R2 U2 R2 U2 R", id: 'a42bc724-9af5-4cdb-9ef8-9de76f56a5b7' },
      { moves: "y R U2 R' U' R U' R' U R U' R U R U R U' R' U' R2", id: '24114470-e2f8-4a99-ade1-0bae067c1dee' },
      { moves: "y2 R U R2 U' R' U' R U R' U' R2 U2 R", id: '424deb44-fd1c-432c-b5a6-4b78b4e28bc5' },
      { moves: "y' R' U2 R U2 R U2 R' U' R U' R2 U2 R", id: '0ab6af98-5226-4808-a5eb-b354b91f5d0a' }
    ]
  },
  {
    name: 'ZBLL AS 66',
    id: '94acdc5a-79a4-48af-b02f-7936e431b569',
    idMethod,
    puzzle,
    group: 'AS6',
    setup: "R U R' U R U2' R' y'",
    algs: [
      { moves: "y R U2 R' U' R U' R'", id: 'c4c58c17-3598-480a-aa6c-4c2aadf652f8' },
      { moves: "y' L U2 L' U' L U' L'", id: '17560e00-1f4a-4497-9bb0-8dea4745bc22' },
      { moves: "y' M' U2 R U2 M R' U' R U' R' U2", id: 'd04a48d7-9b2d-4a1b-b31a-6ea94e6567c4' }
    ]
  },
  {
    name: 'ZBLL AS 67',
    id: '9f1e46ad-dc17-4556-a1bd-d3a65042b49b',
    idMethod,
    puzzle,
    group: 'AS6',
    setup: "R U R2' U' R2' U' R2' U2' R2' U2' R'",
    algs: [
      { moves: "R U2 R2 U2 R2 U R2 U R2 U' R'", id: '525a35fc-7998-4748-8568-d90e85c11ee0' },
      { moves: "R U2 R2 U' R U' R' U2 R U2 R U2 R'", id: 'abbea8a2-3bda-4dde-ab98-fcbe876272f4' },
      { moves: "R' U' R U' R' U2 R U' R U' R U R U R U' R' U' R2", id: '6dc45b6c-ad4b-487b-8f9d-a28c451d24a4' },
      { moves: "y R U2 R2 U' R' U R U' R' U' R2 U R", id: '5c5c9be3-bb20-4ae7-be01-f9a9cdc9a49f' }
    ]
  },
  {
    name: 'ZBLL AS 68',
    id: '1a076a32-e82c-4bb0-a384-beb46d98d4c1',
    idMethod,
    puzzle,
    group: 'AS6',
    setup: "R' U2' R U R' U R",
    algs: [
      { moves: "R' U' R U' R' U2 R", id: 'aa769b7c-953b-44fc-8660-0e58da1dc23d' },
      { moves: "y2 r' F' r U' r' F2 r", id: 'd85a5b3b-6f86-405c-a132-5cb01404a7d3' },
      { moves: "y R U' R' U' R U R' U R U' R' U R U2 R' U2 R U' R'", id: 'b4351604-8125-4558-b17e-b9ddd6701e45' },
      { moves: "y2 L' U' L U' L' U2 L", id: '15764841-0081-4b2d-ab50-43bd7de1a550' }
    ]
  },
  {
    name: 'ZBLL AS 69',
    id: '05ebe56f-4cd6-45ff-909e-a573318a44aa',
    idMethod,
    puzzle,
    group: 'AS6',
    setup: "R' U' R U R U R' U' R' U R U R U' R' y'",
    algs: [
      { moves: "y R U R' U' R' U' R U R U' R' U' R' U R", id: '275e86c5-7cba-48fc-9089-9f0dd8d26848' },
      { moves: "y R U2 R2 U' R' U' R' U R U R2 U' R'", id: 'b683c8a4-9b5d-45a3-b8f1-ac5c1d195b04' }
    ]
  },
  {
    name: 'ZBLL AS 70',
    id: '84434075-5332-4309-8787-b43bb33764de',
    idMethod,
    puzzle,
    group: 'AS6',
    setup: "R2' U' R' U' R2' U R U R2' U R' U R",
    algs: [
      { moves: "y R' U' R U R U2 R' U' R' U R U' R U' R'", id: '8004dd59-1540-4353-a0bf-6a4ca02b873c' },
      { moves: "R' U' R U' R U R' U' R' U2 R U R U' R'", id: '33967657-6317-4769-aafe-777d7890870a' },
      { moves: "y R2 U R U R2 U' R' U' R2 U' R U' R'", id: '09942312-7696-49a4-8004-4fe6f631c11d' },
      { moves: "R' U' R U' R2 U' R' U' R2 U R U R2", id: 'c7a7ad17-677f-4137-b96a-25d51e9b5fbc' }
    ]
  },
  {
    name: 'ZBLL AS 71',
    id: '65ea0bce-fb63-4932-801d-2c3d42e683eb',
    idMethod,
    puzzle,
    group: 'AS6',
    setup: "R' U2' R2' U R2' U R U' R U' R' y2'",
    algs: [
      { moves: "y2 R U R' U R' U' R2 U' R2 U2 R", id: '5dcf7513-f0a9-4702-802d-6469e1bf33ff' },
      { moves: "y R U2 R2 U' R2 U' R' U R' U R", id: 'ee666cf5-493d-4fb8-b467-a4de718be00b' },
      { moves: "y2 r U R' U R' U' R2 U' r' R' U2 R", id: 'fc9a7707-f3b9-4458-b3e0-166dac6aa75b' },
      { moves: "y' R U' R' U' R U' R' U R U' R' U R U R' U' R U2 R'", id: '4f55e663-fd21-4262-bb38-fcd55b0fd928' }
    ]
  },
  {
    name: 'ZBLL AS 72',
    id: 'c0920124-5f33-4041-af8e-a0a5e2ab3ddf',
    idMethod,
    puzzle,
    group: 'AS6',
    setup: "R2' U R' U R U2' R U2' R U R' U R2' U R' y'",
    algs: [
      { moves: "y' R2 D' R U2 R' D R U R' F R U R U' R' F' R", id: 'd776cf2b-6426-43ce-a0f2-740e1a1c3e15' },
      { moves: "R' F2 R D R' D' F2 U' R2 U R' U' R2", id: '40c2b57a-c81c-465a-8335-f30e4fee6dbd' },
      { moves: "R2 U' S R2 S' R2 U R U' R U' R' U2 R", id: '642ce671-0fe6-4a4e-9441-a643386214b8' },
      { moves: "y R U' R U R' U R U2 R' U' R' U' R U' R' U R U' R'", id: 'fd86d348-c3b2-4955-9fd3-2608ee8a78a3' }
    ]
  }
]
