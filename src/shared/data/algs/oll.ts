import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

const idMethod = 'OLL_ALGS'
const puzzle = '333'

export const OLL_ALGS: AlgorithmCollection[] = [
  {
    name: 'OLL 1',
    id: 'dcb60a27-3117-4000-aceb-d62b75ab9acd',
    idMethod,
    puzzle,
    group: 'Dot Case',
    setup: "F R' F' R U2' F R' F' R2' U2' R'",
    algs: [
      { moves: "R U2 R2 F R F' U2 R' F R F'", id: 'd139df07-2b8c-43be-a7f9-2db5bdb799d7' },
      { moves: "y R U' R2 D' r U' r' D R2 U R'", id: '1f8facfa-5bf2-400e-9586-ced035792a24' },
      { moves: "f R U R' U' R f' U' r' U' R U M'", id: 'c597fd41-62db-4d4d-be88-dd773b7d54c0' },
      { moves: "R' U' F R' F' R2 U R f' U' f", id: 'a9c3a25d-5cf5-4dcc-8b3c-c63f59e6fc69' }
    ]
  },
  {
    name: 'OLL 2',
    id: '3436450e-41d4-4286-b1a2-6bd89d1010be',
    idMethod,
    puzzle,
    group: 'Dot Case',
    setup: "f U R U' R' f' F U R U' R' F'",
    algs: [
      { moves: "y' R U' R2 D' r U r' D R2 U R'", id: '36eeca31-b674-4e26-9969-9ba7cbf8317f' },
      { moves: "F R U R' U' S R U R' U' f'", id: 'ee857ecb-1575-4d8c-9ac7-7869d950e0f2' },
      { moves: "F R U R' U' F' f R U R' U' f'", id: 'd78621f1-3620-4691-baa6-1a328faa13e1' },
      { moves: "y r U r' U2 R U2 R' U2 r U' r'", id: '10b41d41-3fd5-4232-be19-d8a54d79e4ef' }
    ]
  },
  {
    name: 'OLL 3',
    id: 'c4518a72-f059-44e3-860f-00962f8aba6a',
    idMethod,
    puzzle,
    group: 'Dot Case',
    setup: "F U R U' R' F' U f U R U' R' f' y",
    algs: [
      { moves: "y R' F2 R2 U2 R' F R U2 R2 F2 R", id: '4107d713-ceaa-4fca-9923-e0f70cdf4148' },
      { moves: "y' f R U R' U' f' U' F R U R' U' F'", id: '020390a5-3792-4fc0-b242-5638974cbc69' },
      { moves: "r' R2 U R' U r U2 r' U M'", id: 'db5db691-a9f8-4526-b2fe-60a38aa28357' },
      { moves: "M R U R' U r U2 r' U M'", id: 'c0bd9c1b-7365-4a90-a8bc-5c854467b5ac' }
    ]
  },
  {
    name: 'OLL 4',
    id: '000be30a-c428-48c7-ab35-3534b1d99390',
    idMethod,
    puzzle,
    group: 'Dot Case',
    setup: "F U R U' R' F' U' f U R U' R' f' y",
    algs: [
      { moves: "y' R' F2 R2 U2 R' F' R U2 R2 F2 R", id: '9530a631-7a57-453f-a595-3cf27507331f' },
      { moves: "y' f R U R' U' f' U F R U R' U' F'", id: '164792f3-d3ed-4528-aeac-750705870ed3' },
      { moves: "R' F R F' U' S R' U' R U R S'", id: 'c82220ba-8bcd-450c-bf0a-418db9bfaf73' },
      { moves: "y F U R U' R' F' U' F R U R' U' F'", id: 'f0ce6735-107e-4597-a817-c6758b7ff62a' }
    ]
  },
  {
    name: 'OLL 5',
    id: '12b5d4a1-307c-470b-95fa-d9fb0d05e3e7',
    idMethod,
    puzzle,
    group: 'Square Shapes',
    setup: "r' U' R U' R' U2' r",
    algs: [
      { moves: "r' U2 R U R' U r", id: 'b2cd2b27-27c7-4025-93c6-ddede6170078' },
      { moves: "y2 l' U2 L U L' U l", id: '18319012-224f-4997-9e1f-8d0c3d8b7be1' },
      { moves: "y2 R' F2 r U r' F R", id: '4fdb5989-d3ba-4982-8e79-5a910e75c04d' },
      { moves: "y2 R' F2 L F L' F R", id: '8475e39a-dc84-4d75-b419-375d10f06d0a' }
    ]
  },
  {
    name: 'OLL 6',
    id: 'fec0503d-65e6-422b-b05a-e45e5a49cc8e',
    idMethod,
    puzzle,
    group: 'Square Shapes',
    setup: "r U R' U R U2' r'",
    algs: [
      { moves: "r U2 R' U' R U' r'", id: '4f6bccda-a751-4509-98b0-eb7a6f1bd34f' },
      { moves: "F U' R2 D R' U' R D' R2 U F'", id: 'db924e31-b06b-4d39-9bc8-f01c9703be33' },
      { moves: "y2 l U2 L' U' L U' l'", id: '5a7054e4-a4ce-413c-b172-4b117bc75ff3' },
      { moves: "y' x' D R2 U' R' U R' D' x", id: 'a665d40c-4792-42d7-995a-e64a814fac30' }
    ]
  },
  {
    name: 'OLL 7',
    id: '01519716-0e05-4743-9a3b-5f73fb4653ee',
    idMethod,
    puzzle,
    group: 'Lightning Shapes',
    setup: "r U2' R' U' R U' r'",
    algs: [
      { moves: "r U R' U R U2 r'", id: '83f56aab-40a5-4dab-b36b-6ca361c87eb7' },
      { moves: "L' U2 L U2 L F' L' F", id: 'fd8dc1ac-f9bb-4379-ba31-d9b1c869b42b' },
      { moves: "y2 l U L' U L U2 l'", id: '9311e3f2-eb40-4b8b-951a-63a816eba604' },
      { moves: "r U r' U R U' R' r U' r'", id: '754795d6-192d-4dac-a2e5-626c2fdf3510' }
    ]
  },
  {
    name: 'OLL 8',
    id: 'acced824-99eb-4a0f-89fb-c8b257493fb6',
    idMethod,
    puzzle,
    group: 'Lightning Shapes',
    setup: "r' U2' R U R' U r y2'",
    algs: [
      { moves: "y2 r' U' R U' R' U2 r", id: '2698235d-b679-4edd-8e44-ae0bcc97cb2d' },
      { moves: "l' U' L U' L' U2 l", id: 'c9c1a45a-79e2-49a4-a317-d8cae593cd1a' },
      { moves: "R U2 R' U2 R' F R F'", id: 'd0cb9dc9-3a12-40d3-923c-3b0307125f40' },
      { moves: "R' F' r U' r' F2 R", id: 'c609e79c-f72a-485b-9fce-80f3f3febbe8' }
    ]
  },
  {
    name: 'OLL 9',
    id: '19fd3b31-de8a-4fc9-ae98-7f44f832941d',
    idMethod,
    puzzle,
    group: 'Fish Shapes',
    setup: "F U R U' R2' F' R U R U' R' y'",
    algs: [
      { moves: "y R U R' U' R' F R2 U R' U' F'", id: 'f560c951-0935-4122-b147-c36c8ec0c5a5' },
      { moves: "R U2 R' U' S' R U' R' S", id: 'ed938d84-2f06-4285-8c47-dac6d041f50c' },
      { moves: "y2 F' U' F r U' r' U r U r'", id: 'a03dc2ea-15e2-46e1-b60b-e9d681da5157' },
      { moves: "y' L' U' L U' L F' L' F L' U2 L", id: '51e47c69-c404-4698-a948-7606de0f6672' }
    ]
  },
  {
    name: 'OLL 10',
    id: '22c03c70-f3de-4273-b8a1-a391aa3c5428',
    idMethod,
    puzzle,
    group: 'Fish Shapes',
    setup: "R U2' R' F R' F' R U' R U' R'",
    algs: [
      { moves: "R U R' U R' F R F' R U2 R'", id: 'fc01c68c-af4c-42d5-a696-2ba5128ed09d' },
      { moves: "y F U F' R' F R U' R' F' R", id: '8cd93dfa-ee8e-4da7-8266-4be6e8c11399' },
      { moves: "y M' R' U2 R U R' U R U M", id: '1f69e8a1-1f42-4840-9ac2-795e6fd9d46d' },
      { moves: "y2 L' U' L U L F' L2 U' L U F", id: '0ca3a825-93de-4ac6-90ad-a0d77d1f50df' }
    ]
  },
  {
    name: 'OLL 11',
    id: '3972bd20-39ef-4d94-b5d1-ff5b6dbf8d00',
    idMethod,
    puzzle,
    group: 'Lightning Shapes',
    setup: "M U' R U2' R' U' R U' R2' r",
    algs: [
      { moves: "r' R2 U R' U R U2 R' U M'", id: '35af1691-21b9-4d33-8edf-6e866d14e88e' },
      { moves: "y2 r U R' U R' F R F' R U2 r'", id: '56b0b6f8-8a57-4a63-b51b-1e5390ea39da' },
      { moves: "S R U R' U R U2 R' U2 S'", id: '2aaa2f03-5f3f-4a87-bed7-9074b0ce0807' },
      { moves: "M R U R' U R U2 R' U M'", id: '720e2aa0-afd7-42f0-934f-47e1e663021b' }
    ]
  },
  {
    name: 'OLL 12',
    id: '0ffb11c3-b167-4a25-86a0-7ea6db31a953',
    idMethod,
    puzzle,
    group: 'Lightning Shapes',
    setup: "F U R U' R' F' U' F U R U' R' F'",
    algs: [
      { moves: "y' M' R' U' R U' R' U2 R U' M", id: 'c4e04b15-8d7d-4702-b793-7d84f67b1471' },
      { moves: "F R U R' U' F' U F R U R' U' F'", id: '46595ec0-3dc8-42ad-a4ed-355e8ad470d5' },
      { moves: "y' S R' U' R U' R' U2 R U2 S'", id: '4b7baf58-f4c6-47ea-accd-95721201ef88' },
      { moves: "y l L2 U' L U' L' U2 L U' M'", id: '5c75e6e4-a956-430b-a5a1-3527729cca32' }
    ]
  },
  {
    name: 'OLL 13',
    id: 'b512341d-e716-4ba7-96ac-c9c22c64a20b',
    idMethod,
    puzzle,
    group: 'Knight Move Shapes',
    setup: "F' U' F r U' r' U r U r'",
    algs: [
      { moves: "F U R U2 R' U' R U R' F'", id: '9f94e01d-91a5-44f8-85be-ebfae7c1cead' },
      { moves: "F U R U' R2 F' R U R U' R'", id: '6a598186-3cdb-465d-b02a-ee48752a0fc7' },
      { moves: "r U' r' U' r U r' F' U F", id: '2c9bc4f2-9935-42f6-9ebb-ecaa5d5991f8' },
      { moves: "r U' r' U' r U r' y L' U L", id: '935d526b-6b5e-4bf9-a33f-ae4fed458024' }
    ]
  },
  {
    name: 'OLL 14',
    id: 'ec67e04e-c715-4d33-9a0f-70a4092d6726',
    idMethod,
    puzzle,
    group: 'Knight Move Shapes',
    setup: "F U F' R' F R U' R' F' R",
    algs: [
      { moves: "R' F R U R' F' R F U' F'", id: '7fa15cfc-ad90-471f-be14-d9d84ca24abe' },
      { moves: "r U R' U' r' F R2 U R' U' F'", id: 'a9a402f1-5b65-465f-9149-ddccb05aae74' },
      { moves: "F' U' L' U L2 F L' U' L' U L", id: 'dad5d745-3da2-4507-97e7-066cec95fece' },
      { moves: "l' U l U l' U' l F U' F'", id: '2a66a626-1e38-4d0b-b527-e6cecfa44691' }
    ]
  },
  {
    name: 'OLL 15',
    id: '618c70d2-2fc1-4013-bb4d-2a3ecf99e5bd',
    idMethod,
    puzzle,
    group: 'Knight Move Shapes',
    setup: "r' U' r U' R' U R r' U r",
    algs: [
      { moves: "r' U' r R' U' R U r' U r", id: '3f9efe43-e42e-44a5-8434-a5f334ced2cd' },
      { moves: "y2 l' U' l L' U' L U l' U l", id: '4af1a920-03f1-4ff5-b524-608513fca310' },
      { moves: "r' U' M' U' R U r' U r", id: '808ba28e-6c20-4516-8e8d-64a17e61894a' },
      { moves: "y2 R' F' R L' U' L U R' F R", id: 'd8fbca6b-c897-41de-b7b4-5d4a27b4783c' }
    ]
  },
  {
    name: 'OLL 16',
    id: 'caf1c97b-2843-44dc-9128-10301ca8a4cc',
    idMethod,
    puzzle,
    group: 'Knight Move Shapes',
    setup: "r U r' U R U' R' r U' r'",
    algs: [
      { moves: "r U r' R U R' U' r U' r'", id: '1c7abe10-c79e-427c-8338-577a8a5fbb21' },
      { moves: "r U M U R' U' r U' r'", id: '6f32abe9-33ea-4a2f-b026-7a8165d2a333' },
      { moves: "y2 R' F R U R' U' F' R U' R' U2 R", id: '805225a8-b82d-4963-8c8b-64347c046146' },
      { moves: "y2 l U l' L U L' U' l U' l'", id: 'f328ebdb-2e7e-4a87-afa5-5316a8e3b19a' }
    ]
  },
  {
    name: 'OLL 17',
    id: 'fb1ea207-5d44-49dc-9173-c926dda2ed60',
    idMethod,
    puzzle,
    group: 'Dot Case',
    setup: "F R' F' R U2' F R' F' R U' R U' R'",
    algs: [
      { moves: "R U R' U R' F R F' U2 R' F R F'", id: 'dfeb3f8a-17dc-4ec3-8ff9-eed03c2ec3ea' },
      { moves: "y2 F R' F' R U S' R U' R' S", id: 'b93c04fe-629d-415c-802d-0fdeb3c7b78f' },
      { moves: "y2 F R' F' R2 r' U R U' R' U' M'", id: '2c3ea94a-9bd4-43ce-9b9f-0990741d865e' },
      { moves: "y' F' r U r' U' S r' F r S'", id: '569b2412-b64e-4ac5-b9ba-7af70be567fd' }
    ]
  },
  {
    name: 'OLL 18',
    id: '53501cf3-5423-4cad-b6aa-acbda7d23b21',
    idMethod,
    puzzle,
    group: 'Dot Case',
    setup: "r' U2' R U R' U r2' U2' R' U' R U' r'",
    algs: [
      { moves: "y R U2 R2 F R F' U2 M' U R U' r'", id: 'dd31c611-4342-49a4-bf3a-f3931fa1a45f' },
      { moves: "y F S' R U' R' S R U2 R' U' F'", id: '058925af-9175-46f8-ae59-1c40e65c71e6' },
      { moves: "r U R' U R U2 r2 U' R U' R' U2 r", id: 'c52ea8ab-5953-4ec5-8038-d78851fc04b0' },
      { moves: "R D r' U' r D' R' U' R2 F R F' R", id: '82183a37-aefd-4603-98f4-b3bc527a4564' }
    ]
  },
  {
    name: 'OLL 19',
    id: '48995b15-a834-422d-ab3f-8fc26957e970',
    idMethod,
    puzzle,
    group: 'Dot Case',
    setup: "F R' F' R M U R U' R' U' M'",
    algs: [
      { moves: "y S' R U R' S U' R' F R F'", id: '973cb170-9d4f-4b00-8885-c835e935c9fe' },
      { moves: "M U R U R' U' M' R' F R F'", id: 'd2f657f4-b1ec-49fb-9b07-e2907ca66acc' },
      { moves: "R' U2 F R U R' U' F2 U2 F R", id: '207d84da-45d4-4725-afcf-9e99f73afe92' },
      { moves: "r' R U R U R' U' r R2 F R F'", id: '6f7542f9-6f59-4883-87f7-e464c83cb90a' }
    ]
  },
  {
    name: 'OLL 20',
    id: 'e22ed9d8-be6e-4589-8488-dd2d6ca078e2',
    idMethod,
    puzzle,
    group: 'Dot Case',
    setup: "r U R' U' M2' U R U' R' U' M'",
    algs: [
      { moves: "r U R' U' M2 U R U' R' U' M'", id: 'a4b3715f-84f6-4ff1-9f19-89dad7660adf' },
      { moves: "M' U2 M U2 M' U M U2 M' U2 M", id: '658b1335-13f7-4299-bd2a-40d59da46d3a' },
      { moves: "S' R U R' S U' M' U R U' r'", id: '2f58d055-2a28-4e5c-bf83-b0bb40e7dcc1' },
      { moves: "S R' U' R U R U R U' R' S'", id: '9cc5c2ab-6571-46b1-9371-e5ab9f669a69' }
    ]
  },
  {
    name: 'OLL 21',
    id: 'f6694c2d-ed29-4b06-8ebe-f210bad6bfd5',
    idMethod,
    puzzle,
    group: 'OCLL',
    setup: "R U R' U R U' R' U R U2' R' y'",
    algs: [
      { moves: "R U R' U R U' R' U R U2 R'", id: '0e6f638a-fd79-40cc-82b0-b1ff7f2780e5' },
      { moves: "y R U2 R' U' R U R' U' R U' R'", id: '7f778f09-7c68-450b-916f-1208bb32c358' },
      { moves: "y F R U R' U' R U R' U' R U R' U' F'", id: '8f6f881e-5314-4cb4-bcf9-a4d69c3c5688' },
      { moves: "R' U' R U' R' U R U' R' U2 R", id: 'b07b63e3-fdba-4cbc-bdcb-5a64cae182e1' }
    ]
  },
  {
    name: 'OLL 22',
    id: 'dd70f4d5-79f0-4c4d-85c8-0f67fa8592b5',
    idMethod,
    puzzle,
    group: 'OCLL',
    setup: "R' U2' R2' U R2' U R2' U2' R'",
    algs: [
      { moves: "R U2 R2 U' R2 U' R2 U2 R", id: '2ee53bbd-f297-435e-b977-bf437a940ca6' },
      { moves: "R' U2 R2 U R2 U R2 U2 R'", id: 'cffb9857-eb03-4e03-9e56-6037a8ed154d' },
      { moves: "f R U R' U' S' R U R' U' F'", id: 'c7611eb2-73f4-4714-a37d-dd996f1b226c' },
      { moves: "f R U R' U' f' F R U R' U' F'", id: 'fd6e90a7-d395-4c74-8dfa-f466b3138c23' }
    ]
  },
  {
    name: 'OLL 23',
    id: '4ef93b23-4bf3-4a7c-b4fb-2ee75c287e4b',
    idMethod,
    puzzle,
    group: 'OCLL',
    setup: "R U2' R D R' U2' R D' R2'",
    algs: [
      { moves: "R2 D R' U2 R D' R' U2 R'", id: '5cd46cb4-552d-46cf-ad3c-353896fa28bb' },
      { moves: "y2 R2 D' R U2 R' D R U2 R", id: 'e9dc9244-49d3-411a-9f83-39993d54d8bd' },
      { moves: "R U R' U R U2 R2 U' R U' R' U2 R", id: 'caea04fc-f778-4995-8652-75ec6e5ef885' },
      { moves: "y' R U2 R' U' R U' R' L' U2 L U L' U L", id: '9d6269ef-c8ed-4df9-9634-5272ebccb494' }
    ]
  },
  {
    name: 'OLL 24',
    id: 'd05d5cd5-8f11-4d2f-a425-c294e1f9e5d1',
    idMethod,
    puzzle,
    group: 'OCLL',
    setup: "F R' F' r U R U' r'",
    algs: [
      { moves: "r U R' U' r' F R F'", id: '11ded922-bf75-4e30-989b-43b39c52e88e' },
      { moves: "y' x' R U R' D R U' R' D' x", id: 'aeae7e78-3f9d-4fda-b8e7-c9de77d67a4d' },
      { moves: "y R U R D R' U' R D' R2", id: 'df82cd9f-7a7b-42d3-bff9-0e1a01fe2ca6' },
      { moves: "L F R' F' L' F R F'", id: '65b97e4b-5533-46b6-aaed-6bbdeade0571' }
    ]
  },
  {
    name: 'OLL 25',
    id: 'a7c34e0c-2fb5-4e63-be82-b7f4aa770def',
    idMethod,
    puzzle,
    group: 'OCLL',
    setup: "R' F' r U R U' r' F y'",
    algs: [
      { moves: "R U2 R D R' U2 R D' R2", id: 'f31fab7f-6718-489e-ab08-209a31a09bbc' },
      { moves: "y F' r U R' U' r' F R", id: '6375dbeb-f1c1-4041-9f61-421bae5bf621' },
      { moves: "F R' F' r U R U' r'", id: '647ef497-fb74-4176-a29f-3da291d9cbdf' },
      { moves: "x R' U R D' R' U' R D x'", id: '6f0d44fb-13c7-48ae-bfc1-56b0bc4ab864' }
    ]
  },
  {
    name: 'OLL 26',
    id: 'e3ccc70f-df8b-4de4-8f12-0b174a18be64',
    idMethod,
    puzzle,
    group: 'OCLL',
    setup: "R U R' U R U2' R' y'",
    algs: [
      { moves: "y R U2 R' U' R U' R'", id: '2964994a-634d-4b88-a579-fce97c331e11' },
      { moves: "R' U' R U' R' U2 R", id: 'c104f0b2-8f39-4fe1-9014-ec7329636af7' },
      { moves: "y2 L' U' L U' L' U2 L", id: '1cd112cb-f5f6-4826-834b-0d1d730dc039' },
      { moves: "y2 L' U R U' L U R'", id: '51dd1694-c457-4664-80a4-84c437fdee88' }
    ]
  },
  {
    name: 'OLL 27',
    id: '20f11139-7e65-4120-9f1f-9ba2d1ef5d8c',
    idMethod,
    puzzle,
    group: 'OCLL',
    setup: "R U2' R' U' R U' R'",
    algs: [
      { moves: "R U R' U R U2 R'", id: '023be0bd-1826-4825-a8f1-0fb0477a8f0f' },
      { moves: "y' R' U2 R U R' U R", id: 'fcebfc47-2cd2-42db-90ad-7bdf8e7e78e8' },
      { moves: "y L' U2 L U L' U L", id: 'ae6b240c-ac70-4ac1-aae8-91f456cb4195' },
      { moves: "y2 L U L' U L U2 L'", id: 'eb4fcefe-5bf6-424b-a6d3-f995077ab4da' }
    ]
  },
  {
    name: 'OLL 28',
    id: '77cb20e9-ad34-4cc9-afe6-72810129cb87',
    idMethod,
    puzzle,
    group: 'All Corners Oriented',
    setup: "R U R' U' M' U R U' r'",
    algs: [
      { moves: "r U R' U' M U R U' R'", id: 'f7de95cd-1b59-4440-9676-4cb7d53976bf' },
      { moves: "R' F R S R' F' R S'", id: '9c1d640e-a6b2-41cd-94f6-aeaca2af4276' },
      { moves: "r U R' U' r' R U R U' R'", id: '51d58e95-7395-4458-964a-58d6af1cff47' },
      { moves: "y2 M' U M U2 M' U M", id: 'bd487c3d-10b8-4943-8570-074a4d0e4e0a' }
    ]
  },
  {
    name: 'OLL 29',
    id: 'a7cf821a-365c-4538-af89-64e1eb9bd42b',
    idMethod,
    puzzle,
    group: 'Awkward Shapes',
    setup: "M F R' F' R U R U' R' U' M'",
    algs: [
      { moves: "r2 D' r U r' D r2 U' r' U' r", id: '581274a8-aa83-482e-9bdd-4012a3ef259a' },
      { moves: "y R U R' U' R U' R' F' U' F R U R'", id: '3b94c6a8-c6a8-4ab1-a987-bc5831cc8f0b' },
      { moves: "y S' R U R' U' R' F R F' U S", id: '6646b69d-57ba-4e0a-828e-c196c8905602' },
      { moves: "M U R U R' U' R' F R F' M'", id: 'e0c9a694-a03e-4e91-ab9c-fba37c81059e' }
    ]
  },
  {
    name: 'OLL 30',
    id: 'dfebbdd4-08b4-44bd-9646-e2a44105b1e4',
    idMethod,
    puzzle,
    group: 'Awkward Shapes',
    setup: "F U R U2' R' U R U2' R' U' F' y2'",
    algs: [
      { moves: "y' r' D' r U' r' D r2 U' r' U r U r'", id: 'a3fac6ab-8a9d-4d96-aa42-2e4232ba8461' },
      { moves: "y2 F U R U2 R' U' R U2 R' U' F'", id: 'aab52507-3e7b-43c5-9e51-f723430a0db0' },
      { moves: "y2 F R' F R2 U' R' U' R U R' F2", id: '60bda2d1-7292-4461-a81e-dd7cfe31e5c1' },
      { moves: "y S' R' U' R f R' U R U' F'", id: '50b1a337-b54f-49ae-a15a-92d9f027c652' }
    ]
  },
  {
    name: 'OLL 31',
    id: '3edec3a9-d670-4e4e-a95f-77c9c129b0e8',
    idMethod,
    puzzle,
    group: 'P Shapes',
    setup: "R' F R U R' U' F' U R",
    algs: [
      { moves: "R' U' F U R U' R' F' R", id: 'da741fc7-b4ef-44a1-bf87-86a8e6b4203e' },
      { moves: "y S R U R' U' f' U' F", id: 'f4bdeffc-b26f-4933-aa04-925135f7d575' },
      { moves: "y2 S' L' U' L U L F' L' f", id: 'cc073a13-2571-4d9b-8cc0-67ccc64ea4e8' },
      { moves: "y' F R' F' R U R U R' U' R U' R'", id: '6bda3d2c-3457-49b8-b792-6b2918a7f55e' }
    ]
  },
  {
    name: 'OLL 32',
    id: '9274f54b-2ff4-48c3-b658-6729cabef921',
    idMethod,
    puzzle,
    group: 'P Shapes',
    setup: "f R' F' R U R U' R' S'",
    algs: [
      { moves: "S R U R' U' R' F R f'", id: 'de76a453-e547-4307-935c-41ca15131463' },
      { moves: "y2 L U F' U' L' U L F L'", id: 'aaf6703f-fcbd-4060-ab05-422df153e9cf' },
      { moves: "R U B' U' R' U R B R'", id: '47c30603-e4ac-4cf0-b2d8-115c9429b591' },
      { moves: "y' R' F R F' U' r U' r' U r U r'", id: '36833674-5bc8-4b07-b7cf-43153dd46bcc' }
    ]
  },
  {
    name: 'OLL 33',
    id: 'a8dd0929-e02c-4bd2-972d-79f670e7f741',
    idMethod,
    puzzle,
    group: 'T Shapes',
    setup: "F R' F' R U R U' R'",
    algs: [
      { moves: "R U R' U' R' F R F'", id: 'b4560a41-7c57-4248-8b61-df41b7f92115' },
      { moves: "y2 L' U' L U L F' L' F", id: 'faa8a6af-d3b8-427c-bbcd-ba2437ebe6d1' },
      { moves: "y2 r' F' r U r U' r' F", id: 'c768404a-c77d-4f68-b2d6-5777af1504ae' },
      { moves: "R U R' F' U' F R U' R'", id: '6592a39e-e781-472c-a18b-3e0a06331c31' }
    ]
  },
  {
    name: 'OLL 34',
    id: '0c6da84c-1b14-4da8-81aa-13eb51977fea',
    idMethod,
    puzzle,
    group: 'C Shapes',
    setup: "F U R' U' R' F' R U R2' U' R' y2'",
    algs: [
      { moves: "y f R f' U' r' U' R U M'", id: '81f3701e-f1bb-4042-8a00-4b90ac63b2ad' },
      { moves: "y2 R U R2 U' R' F R U R U' F'", id: 'bb5a5f14-6fe2-4cd2-bf85-fa337ec2e015' },
      { moves: "F R U R' U' R' F' r U R U' r'", id: '89527bf7-cbce-473d-99d4-d1b53bbf64ef' },
      { moves: "y2 R U R' U' B' R' F R F' B", id: '3110fba3-e811-42bc-8e45-81fc88637994' }
    ]
  },
  {
    name: 'OLL 35',
    id: '520a406a-7c29-4df0-b498-69e649e4d33d',
    idMethod,
    puzzle,
    group: 'Fish Shapes',
    setup: "R U2' R' F R' F' R2' U2' R'",
    algs: [
      { moves: "R U2 R2 F R F' R U2 R'", id: '1e5474dc-6453-48df-9907-a6b175672397' },
      { moves: "f R U R' U' f' R U R' U R U2 R'", id: 'c41e1492-1139-4ae7-8a82-e1ce4e20be47' },
      { moves: "y L' U2 L2 F' L' F L' U2 L", id: '21049b85-7576-481f-9178-40805a2b009d' },
      { moves: "R U2 R' d' R' F R U' R' F' R", id: '39410ed3-aba2-43ba-bd3c-76d02904db16' }
    ]
  },
  {
    name: 'OLL 36',
    id: '67a8d1d4-febd-4504-8cdb-58368128d29b',
    idMethod,
    puzzle,
    group: 'W Shapes',
    setup: "F' L F L' U' L' U' L U L' U L y2'",
    algs: [
      { moves: "y R U R2 F' U' F U R2 U2 R'", id: 'fa7b8790-c2a1-4b9c-9261-e843a3d5260f' },
      { moves: "y2 L' U' L U' L' U L U L F' L' F", id: '7c3e6323-4c24-4c5d-9636-20b08a8a5347' },
      { moves: "y2 R U R' F' R U R' U' R' F R U' R' F R F'", id: '6c18f797-a868-4713-bcb4-fbcbcdd05089' },
      { moves: "y2 R' F' U' F2 U R U' R' F' R", id: '599aaa74-bdcf-4cce-a6c8-b5150d971db6' }
    ]
  },
  {
    name: 'OLL 37',
    id: '849c84f3-29d4-4e44-8cf9-a74f230b1ac7',
    idMethod,
    puzzle,
    group: 'Fish Shapes',
    setup: "F R U' R' U R U R' F'",
    algs: [
      { moves: "F R' F' R U R U' R'", id: 'f23bb08c-3553-4fde-a8a0-1809f25bb594' },
      { moves: "F R U' R' U' R U R' F'", id: '61486107-a468-4f3e-bacb-18d6ce9aec1c' },
      { moves: "y F' r U r' U' r' F r", id: '89cc6204-175c-4acb-b397-9e4ac5a3073e' },
      { moves: "y2 r2 D' r U' r' D r U r", id: 'dc0dcf62-2a1b-49ea-80f7-6cf676dd8d13' }
    ]
  },
  {
    name: 'OLL 38',
    id: 'c2051a37-6777-476a-816e-a6b19534303d',
    idMethod,
    puzzle,
    group: 'W Shapes',
    setup: "F R' F' R U R U R' U' R U' R'",
    algs: [
      { moves: "R U R' U R U' R' U' R' F R F'", id: 'c82f55df-1225-4ca2-a24e-6f0dc31552c3' },
      { moves: "y F R U' R' S U' R U R' f'", id: 'edf9b277-8249-4c4b-8de9-5ddeab0f0af0' },
      { moves: "r U R' U' r' F R U R U' R' F'", id: 'b60711bc-2f4f-4ab3-a7db-24f8ca10af0b' },
      { moves: "y2 L' U2 l' D' l U2 l' D l L", id: '09368aad-38b1-4fbf-953f-e8b99f0cb717' }
    ]
  },
  {
    name: 'OLL 39',
    id: '33f33a53-7c2c-40c5-9963-22fd8d81b258',
    idMethod,
    puzzle,
    group: 'Lightning Shapes',
    setup: "L U F' U' L' U L F L' y'",
    algs: [
      { moves: "y' f' r U r' U' r' F r S", id: '5098adab-9170-41e1-90b9-6095cc1eda9c' },
      { moves: "y' R U R' F' U' F U R U2 R'", id: 'c6e04a30-0403-4650-bb69-9f15ff0d93cb' },
      { moves: "y L F' L' U' L U F U' L'", id: 'f19c7614-f88e-4934-b38c-bc693035f883' },
      { moves: "y' f' L F L' U' L' U L S", id: '3f114a95-c130-40b6-924c-c00405c86428' }
    ]
  },
  {
    name: 'OLL 40',
    id: '5fc263f6-d620-4979-8220-a3d97d0c5852',
    idMethod,
    puzzle,
    group: 'Lightning Shapes',
    setup: "R' U' F U R U' R' F' R y'",
    algs: [
      { moves: "y R' F R U R' U' F' U R", id: 'a8df01f1-910e-4f5d-8a38-19110d2bd73a' },
      { moves: "y' f R' F' R U R U' R' S'", id: '48274e64-0126-4e00-9eb2-287ee10712d6' },
      { moves: "R r D r' U r D' r' U' R'", id: '6b5f20b8-e90b-49e9-a6ae-51417f944944' },
      { moves: "y' L' U' L F U F' U' L' U2 L", id: '27115ada-e4c1-473c-b3ea-2a211ebd131b' }
    ]
  },
  {
    name: 'OLL 41',
    id: '1f3ad50e-f5ab-43bb-8fb2-affe7f8e749a',
    idMethod,
    puzzle,
    group: 'Awkward Shapes',
    setup: "F U R U' R' F' R U2' R' U' R U' R' y2'",
    algs: [
      { moves: "y2 R U R' U R U2 R' F R U R' U' F'", id: '3092744a-f051-4d86-9eca-f906b783d541' },
      { moves: "y2 F U R2 D R' U' R D' R2 F'", id: '729c0cda-f95b-4fcd-beca-d8f2d121ca63' },
      { moves: "y' S U' R' F' U' F U R S'", id: '78400e5f-5097-4d6d-8a1f-8f4e3e52fc5b' },
      { moves: "M U' F' L' U' L U F M'", id: '9cb97681-8750-4b09-bb5c-5993afd6274c' }
    ]
  },
  {
    name: 'OLL 42',
    id: 'ad6e8699-08aa-46b2-8617-6a028e597e23',
    idMethod,
    puzzle,
    group: 'Awkward Shapes',
    setup: "F U R U' R' F' R' U2' R U R' U R",
    algs: [
      { moves: "R' U' R U' R' U2 R F R U R' U' F'", id: '7f90d984-35d2-4a6b-bc7d-709a90313627' },
      { moves: "y F S' R U R' U' F' U S", id: '2982fb8f-0e21-43ad-9f82-0ee3d104458b' },
      { moves: "y R' F R F' R' F R F' R U R' U' R U R'", id: '343d67c4-72de-46c2-8c1e-3925f527ba4c' },
      { moves: "y R' U' F2 u' R U R' D R2 B", id: '76578fba-b178-4a96-ba79-b75676c517e9' }
    ]
  },
  {
    name: 'OLL 43',
    id: '3045f490-890d-4c5b-a606-7480d26328bd',
    idMethod,
    puzzle,
    group: 'P Shapes',
    setup: "f' U' L' U L f",
    algs: [
      { moves: "y R' U' F' U F R", id: '1f5d3063-27fb-4787-b336-38a4d87d1023' },
      { moves: "y2 F' U' L' U L F", id: 'b5681510-0cee-48eb-980a-fb55c3a29c43' },
      { moves: "f' L' U' L U f", id: 'e53f88fc-a546-4b68-8143-ea15666e9657' },
      { moves: "B' U' R' U R B", id: '07a6ae6c-977a-4642-b04f-d6d0e432e28b' }
    ]
  },
  {
    name: 'OLL 44',
    id: '6fafc458-d50d-47aa-b9f4-7b98393da894',
    idMethod,
    puzzle,
    group: 'P Shapes',
    setup: "f U R U' R' f'",
    algs: [
      { moves: "f R U R' U' f'", id: '04309689-9604-4c5e-8771-87580ec14b72' },
      { moves: "y2 F U R U' R' F'", id: '063164b8-efd0-4028-8f2e-ff2a4f16b35d' },
      { moves: "y R U B U' B' R'", id: 'a57b0a66-72c6-4bf0-870e-19f4eb9d22a7' },
      { moves: "y' L U F U' F' L'", id: '66357226-3eab-4974-be08-bbd3eaceed1c' }
    ]
  },
  {
    name: 'OLL 45',
    id: '918f96e0-44ed-47af-a136-4c685b2815f3',
    idMethod,
    puzzle,
    group: 'T Shapes',
    setup: "F U R U' R' F'",
    algs: [
      { moves: "F R U R' U' F'", id: '7bd392cc-9492-43fc-93ed-aa7bfd4c379d' },
      { moves: "y R' F' U' F U R", id: 'e6297b74-86fd-4591-bbe1-854c36bd5fc9' },
      { moves: "y2 f U R U' R' f'", id: '8dd418b2-7502-41a6-946e-bfa6e23f9439' },
      { moves: "y2 F' L' U' L U F", id: '41340dba-fcca-4645-bdac-822b9de2cfda' }
    ]
  },
  {
    name: 'OLL 46',
    id: '73457a97-6d62-43fb-9731-50d2b2d647ba',
    idMethod,
    puzzle,
    group: 'C Shapes',
    setup: "R' U' F R' F' R U R",
    algs: [
      { moves: "R' U' R' F R F' U R", id: '81373f3a-c93f-435b-b313-8fd441291647' },
      { moves: "R' F' U' F R U' R' U2 R", id: 'f325354f-40ac-49f6-a4ad-0ef37ee7a9d0' },
      { moves: "y F R U R' U' F' U' R U R' U R U2 R'", id: '3e13ac2e-652b-4104-9031-263377625a39' },
      { moves: "l' U2 L2 F' L' F U L' U l", id: 'dcd8102c-817f-480c-994c-5ac3ee086e3a' }
    ]
  },
  {
    name: 'OLL 47',
    id: '6b9b47ad-132a-42c8-ad4b-6908c4f93ded',
    idMethod,
    puzzle,
    group: 'L Shapes',
    setup: "F' U' L' U L U' L' U L F",
    algs: [
      { moves: "y' F R' F' R U2 R U' R' U R U2 R'", id: '4e1dd9e8-5011-4066-bd50-da1fb36807a0' },
      { moves: "F' L' U' L U L' U' L U F", id: '1ba1a818-5c9c-4bc8-bdaa-b196148e947b' },
      { moves: "R' U' R' F R F' R' F R F' U R", id: '7f4635b2-9a43-47ec-a4ce-cee1eec2ee01' },
      { moves: "y' R' F' U' F U F' U' F U R", id: '38853bd0-b296-47e7-9a1d-705427de8a6c' }
    ]
  },
  {
    name: 'OLL 48',
    id: '864cca60-3e87-4848-9dc2-9318dcc9b8d4',
    idMethod,
    puzzle,
    group: 'L Shapes',
    setup: "F U R U' R' U R U' R' F'",
    algs: [
      { moves: "F R U R' U' R U R' U' F'", id: '39ffd257-5a33-490e-acb1-2fea277344c6' },
      { moves: "y2 f U R U' R' U R U' R' f'", id: '783099ba-3dbb-4277-b509-d2db687e037c' },
      { moves: "R U2 R' U' R U R' U2 R' F R F'", id: '1bfb780e-0dcb-440e-85f3-a8faa2ba22cc' },
      { moves: "F R' F' U2 R U R' U R2 U2 R'", id: 'edb917d1-4493-4421-9a9e-fe34ebb81e73' }
    ]
  },
  {
    name: 'OLL 49',
    id: '6642bf64-4671-4ca2-b157-15060153b3ab',
    idMethod,
    puzzle,
    group: 'L Shapes',
    setup: "r' U r2' U' r2' U' r2' U r' y2'",
    algs: [
      { moves: "y2 r U' r2 U r2 U r2 U' r", id: 'cc1e5d19-edde-4bdb-aa14-413bcb955a3c' },
      { moves: "l U' l2 U l2 U l2 U' l", id: '7a6f6c80-89a9-40ca-81b4-b19b33226b1a' },
      { moves: "R B' R2 F R2 B R2 F' R", id: 'f303b97f-d86e-407d-9780-392b15d1fb2c' },
      { moves: "y2 R' F R' F' R2 U2 B' R B R'", id: 'bd0738c3-d170-4dfd-ba47-182642fd6b63' }
    ]
  },
  {
    name: 'OLL 50',
    id: 'f4f9ed55-3621-4596-83b6-6ceb4b2fcf21',
    idMethod,
    puzzle,
    group: 'L Shapes',
    setup: "r U' r2' U r2' U r2' U' r",
    algs: [
      { moves: "r' U r2 U' r2 U' r2 U r'", id: 'a8ca6f14-3d93-4e57-826b-76bf6ce5b261' },
      { moves: "y2 R' F R2 B' R2 F' R2 B R'", id: '8b732d87-8679-4b5b-924b-a5832858f222' },
      { moves: "y' R U2 R' U' R U' R' F R U R' U' F'", id: 'd5faf79e-6c2c-411b-bfef-a6db746c3c63' },
      { moves: "y2 l' U l2 U' l2 U' l2 U l'", id: 'f9334abf-b9a0-4687-8e88-a098c6a24d7a' }
    ]
  },
  {
    name: 'OLL 51',
    id: '63eade6f-5822-48da-868a-14a6a6f66bb2',
    idMethod,
    puzzle,
    group: 'Line Shapes',
    setup: "f U R U' R' U R U' R' f'",
    algs: [
      { moves: "y2 F U R U' R' U R U' R' F'", id: 'c49682d3-692f-4b77-bb14-420683112f6e' },
      { moves: "f R U R' U' R U R' U' f'", id: 'b459f14b-0f7f-4480-ba1e-4bd0ef4acc1a' },
      { moves: "y' R' U' R' F R F' R U' R' U2 R", id: 'c570a11b-7f77-4972-a2cd-7389074e02c3' },
      { moves: "y r' F' U' F U F' U' F U r", id: 'c7527930-b867-460b-848f-5f544c29a113' }
    ]
  },
  {
    name: 'OLL 52',
    id: '9ce4fe13-5638-46eb-b1ab-c49fa3942193',
    idMethod,
    puzzle,
    group: 'Line Shapes',
    setup: "F R U R' d R' U' R U' R'",
    algs: [
      { moves: "y2 R' F' U' F U' R U R' U R", id: 'fde9013e-47aa-4519-8489-8f5237a185a4' },
      { moves: "R U R' U R U' B U' B' R'", id: 'b1ba2ed8-dd29-4ccd-9881-98132f7a5b4b' },
      { moves: "R U R' U R d' R U' R' F'", id: '93f25136-5638-4400-baaa-dbb09efc5552' },
      { moves: "R U R' U R U' y R U' R' F'", id: '7ea3fe75-9d52-4e81-b78a-84a2b316b85b' }
    ]
  },
  {
    name: 'OLL 53',
    id: 'd4b28f00-ad43-496e-a629-5dfde2860a80',
    idMethod,
    puzzle,
    group: 'L Shapes',
    setup: "r' U2' R U R' U' R U R' U r",
    algs: [
      { moves: "r' U' R U' R' U R U' R' U2 r", id: 'b904e29e-5862-4d42-a8d9-592e145c0d9f' },
      { moves: "y2 l' U' L U' L' U L U' L' U2 l", id: '9a759e9b-4081-4968-bd81-eede3c8a7f6f' },
      { moves: "y r' U2 R U R' U' R U R' U r", id: 'bbc6443d-e467-4c64-b2ea-63e50a99faf0' },
      { moves: "y' l' U2 L U L' U' L U L' U l", id: 'b9f9da3c-a230-4383-bd23-53e362a26fe3' }
    ]
  },
  {
    name: 'OLL 54',
    id: 'a2c1ec66-cc6c-4164-add4-bb62094056bd',
    idMethod,
    puzzle,
    group: 'L Shapes',
    setup: "r U2' R' U' R U R' U' R U' r'",
    algs: [
      { moves: "r U R' U R U' R' U R U2 r'", id: '444d7ee9-8ae6-4938-9879-5b5573f965ac' },
      { moves: "y' r U2 R' U' R U R' U' R U' r'", id: '3f6ddc3b-e9d4-4eef-b1ec-6ac2f83764b1' },
      { moves: "y2 l U L' U L U' L' U L U2 l'", id: '2bcbf06b-b7a3-4d08-955c-e07150bb826e' },
      { moves: "y' r U r' R U R' U' R U R' U' r U' r'", id: '55f8d21a-cc7e-4c90-98cb-977e09209dda' }
    ]
  },
  {
    name: 'OLL 55',
    id: '30379ace-f9d5-4dae-a0b6-83fd2d51d9d8',
    idMethod,
    puzzle,
    group: 'Line Shapes',
    setup: "F R' F' U2' R U R' U R2' U2' R'",
    algs: [
      { moves: "y R' F U R U' R2 F' R2 U R' U' R", id: '563d150b-63a0-49c2-a363-8fe85d930ae4' },
      { moves: "y R' F R U R U' R2 F' R2 U' R' U R U R'", id: '1132d996-960f-41c1-9aa4-6f2035d2a956' },
      { moves: "R U2 R2 U' R U' R' U2 F R F'", id: 'b7a5142e-8651-4fe8-964b-7b7b4526b66f' },
      { moves: "r U2 R2 F R F' U2 r' F R F'", id: '9a314b57-5559-41c1-b3b7-c9141d96bef4' }
    ]
  },
  {
    name: 'OLL 56',
    id: '2527fe92-2257-4092-a621-94ff36872325',
    idMethod,
    puzzle,
    group: 'Line Shapes',
    setup: "r U r' R U R' U' R U R' U' r U' r'",
    algs: [
      { moves: "r U r' U R U' R' U R U' R' r U' r'", id: '698f5038-ebe2-4ce9-afa3-bdb7b9b1adeb' },
      { moves: "r U r' U R U' R' M' U R U2 r'", id: 'd08ae7f1-43ad-43fd-9f84-ab5b5fbc5f16' },
      { moves: "F R U R' U' R F' r U R' U' r'", id: '94c42b97-5a83-490c-be5b-1657052cb2c0' },
      { moves: "r' U' r U' R' U R U' R' U R r' U r", id: '06218748-f479-47b4-84b9-4794c416a5e2' }
    ]
  },
  {
    name: 'OLL 57',
    id: 'f9d7fa9c-13f9-442a-8c12-260226f362f2',
    idMethod,
    puzzle,
    group: 'All Corners Oriented',
    setup: "r U R' U' M U R U' R'",
    algs: [
      { moves: "R U R' U' M' U R U' r'", id: 'a17370a4-63fc-4c8a-80a1-e67f190d6936' },
      { moves: "y R U' R' S' R U R' S", id: 'cb413abd-8cde-4fcf-ad8e-7db27a941e24' },
      { moves: "y R U R' S' R U' R' S", id: 'a26c5865-fe24-40d4-b49b-663a7656b67f' },
      { moves: "R U R' U' R' r U R U' r'", id: '12d2536e-7d0e-4b4c-ac22-6b634d0778ca' }
    ]
  }
]
