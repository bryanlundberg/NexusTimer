import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

const idMethod = 'ZBLL_S_ALGS'
const puzzle = '333'

export const ZBLL_S_ALGS: AlgorithmCollection[] = [
  {
    name: 'ZBLL S 1',
    id: '00c0c8e5-8922-4d12-9fa0-676231d7448d',
    idMethod,
    puzzle,
    group: 'S1',
    setup: "L' R U' L U R' U2' L' U2' L",
    algs: [
      { moves: "y2 R' U2 R U F R' U R U' F'", id: 'c13bcd6a-1374-40a8-9780-0b88a3abfd19' },
      { moves: "L' U2 L U2 R U' L' U R' L", id: '455cc75a-0424-489d-a9d2-d5e61aceda7b' },
      { moves: "U2 R' U2 R U F R' U R U' F' U'", id: 'bf0c7ab7-14ca-4f67-8396-a3b55549c874' },
      { moves: "R U R' U R U2 R' l' U R' D2 R U' R' D2 R2", id: '4aa7b617-755f-4fc3-b4a1-9fe0374c34ea' }
    ]
  },
  {
    name: 'ZBLL S 2',
    id: 'd59d78fb-a99c-4838-aa2d-83a63ab9e8d4',
    idMethod,
    puzzle,
    group: 'S1',
    setup: "R U2' R' U' R2' D R' U R D' R' U2' R' y'",
    algs: [
      { moves: "R U R' U R U' R2 F' R U R U' R' F R U' R'", id: 'ba7cd109-ec18-415d-9624-43ba31161503' },
      { moves: "y R U2 R D R' U' R D' R2 U R U2 R'", id: 'ab06d277-8f68-4fdf-b517-3c0454253948' },
      { moves: "R U R' U R U L U2 R' U R U2 R' L'", id: '85847b9c-dba3-489d-9d08-6cbd64d183c8' }
    ]
  },
  {
    name: 'ZBLL S 3',
    id: '210ecb84-5704-42e8-8db9-0cc169534bb1',
    idMethod,
    puzzle,
    group: 'S1',
    setup: "R D R' U' R D' R2' U' R U2' R' U' R",
    algs: [
      { moves: "R' U R U2 R' U R2 D R' U R D' R'", id: 'b457c5cc-66bb-41b6-a712-f9e374ed80ca' },
      { moves: "y' R U R' U R2 D R' U' R D' R' U' R'", id: '97158aa2-dc5f-4771-aa7c-44e38ecf88b7' },
      { moves: "y' R' U' R U R2 F' R U R U' R' F U R", id: 'd5315c37-bc46-4140-8e4c-b5f2c317f0c9' },
      { moves: "y' R U R' U2 R' D' R U' R' D R2 U2 R'", id: 'f335041d-07e0-4b4c-80b6-55437fd047a4' }
    ]
  },
  {
    name: 'ZBLL S 4',
    id: 'a238f736-9097-4340-bb46-b888936fa3ca',
    idMethod,
    puzzle,
    group: 'S1',
    setup: "R U2' R2' D' R U2' R' D R2' U' R' U R U' R' y2'",
    algs: [
      { moves: "y2 S' U2 L' U2 L U2 L F' L' f", id: '33d204bf-dbfe-48d2-a8fa-3d1499d4e99c' },
      { moves: "R' U2 R D R D' R' U' R D R' D' U2 R' U R", id: '93ef1780-af9b-4a57-832a-59eda4f53b80' },
      { moves: "y2 R' U2 R U2 R' U R L' U R' U' R L", id: '9aba2597-98a9-47f2-be25-4c124410213f' },
      { moves: "y L' U2 L U F L' U' L U L F' L2 U L", id: '1e7678d4-cbab-4d0d-826e-20a76569608b' }
    ]
  },
  {
    name: 'ZBLL S 5',
    id: 'd390aea1-15f3-4c1a-9f64-f4c33de3ebac',
    idMethod,
    puzzle,
    group: 'S1',
    setup: "L' U R U' L U2' R' U' L' U R U' R' L",
    algs: [
      { moves: "y R' F R U R' U' R' F' D' R U R' D R2", id: 'a560277e-4468-4d14-8bd1-423a41345e31' },
      { moves: "y' R2 D' R U' R' D R2 F R' U R U' F'", id: '782fd711-9837-4807-8993-d78af5af29f6' },
      { moves: "U' R2 D' R U' R' D R2 F R' U R U' F'", id: 'd9714e6d-a7fb-46ff-a0b6-83da8e13fed6' },
      { moves: "y2 R U R' U' R U R2 D' r U2 r' D R2 U2 R'", id: '9b95db04-439e-4cad-b74a-1edfb922ad51' }
    ]
  },
  {
    name: 'ZBLL S 6',
    id: 'f4947251-ffd8-4184-8374-37971021fd48',
    idMethod,
    puzzle,
    group: 'S1',
    setup: "R U B' U R2' U' R2' U' B R' U R' U R y",
    algs: [
      { moves: "F' R U R' U R U2 R' F U R U' R' U2 R U' R'", id: 'fe763db0-07d1-4190-b807-df78f863cbc1' },
      { moves: "y' R U' R2 U2 R2 U R' D' U R U R' D U' R' U R", id: '3a912fed-cce6-40ec-999d-71dc1ac70c39' },
      { moves: "y' R' U2 R' D R' U R D' R U R U' R U' R'", id: '328b4ab5-4ccb-42e2-b052-fe3261e5f3fa' },
      { moves: "F' U' F U' F R' D R2 U R2 D' R U' F'", id: '9831fa2f-d42a-4072-8959-1ec3d1d4b353' }
    ]
  },
  {
    name: 'ZBLL S 7',
    id: '632544d9-02aa-401b-b03e-915fb96c4afc',
    idMethod,
    puzzle,
    group: 'S1',
    setup: "R2' F2' U' R F2' R' U F' R U R U' R' F' U R y'",
    algs: [
      { moves: "y' R' U' R U R2 U' R' U' R U D' R U R' D R'", id: 'dc171ef1-6661-41df-afa0-b56739ad3713' },
      { moves: "R' U L' U2 R U' R' U2 R U2 L U L' U L", id: 'de13535c-7b1d-4259-a177-33f76af9ae2d' },
      { moves: "y' R' U2 R U R' U R2 U R' F' R U R' U' R' F R2 U' R'", id: '596adb24-03d9-4c5a-b5ad-df16bd1410a0' },
      { moves: "S' r' F' r U r U' r' S L' U' L U F", id: 'a98dc95a-aa08-4a5d-915b-96c70b1d354b' }
    ]
  },
  {
    name: 'ZBLL S 8',
    id: '95fd262e-851e-4d8e-84d9-68c06e703f2f',
    idMethod,
    puzzle,
    group: 'S1',
    setup: "U' R2' D r' U2' r D' R2' U' R U' R' y2'",
    algs: [
      { moves: "y2 R U R' U R2 D r' U2 r D' R2", id: '3319aef8-4373-442f-b33c-8074ff96b5a7' },
      { moves: "y2 R U R' U R2 D r' U2 r D' R2 U", id: '39803dea-601d-47e9-a074-32f3458cb255' },
      { moves: "y2 F R U R2 U' R2 U' R2 U2 R U R U R' F'", id: '36068202-ae63-4770-926f-953e91069c5c' }
    ]
  },
  {
    name: 'ZBLL S 9',
    id: '2c07dd21-ec21-4ae7-98d7-c672e11fba45',
    idMethod,
    puzzle,
    group: 'S1',
    setup: "R' U' R U' R U R D R' U' R D' R U2' R y",
    algs: [
      { moves: "y R U R' U' R U R2 D' R U R' D R U R U2 R'", id: '8af4c465-f233-45f4-ae59-89135b114f36' },
      { moves: "y' R' U2 R' D R' U R D' R' U' R' U R' U R", id: '12951a2e-6ebe-449c-9edb-a6cd5a192db8' },
      { moves: "y' R' U2 R U R' U' R' F' R U R U' R' F R U R' U R", id: '419861f0-7863-48b1-8070-773c619d427b' }
    ]
  },
  {
    name: 'ZBLL S 10',
    id: 'e7e71673-785e-4e01-85ad-c9d4e2d260b2',
    idMethod,
    puzzle,
    group: 'S1',
    setup: "R2' D R' U2' R D' R2' U' R U' R' y2'",
    algs: [{ moves: "y2 R U R' U R2 D R' U2 R D' R2", id: 'b81b0124-6f0f-4fad-b158-cbcbcfadd218' }]
  },
  {
    name: 'ZBLL S 11',
    id: '4e5a3477-a310-4295-ba77-57901f64cc72',
    idMethod,
    puzzle,
    group: 'S1',
    setup: "R U R' F' R U2' R' U2' R' F R2' U' R'",
    algs: [
      { moves: "y' R' D' R U2 R' D R U' R U R' U2 R U R'", id: 'da97be0a-3740-457b-88f9-a38e665f9d7c' },
      { moves: "R U R2 F' R U2 R U2 R' F R U' R'", id: '74650c96-8021-44aa-8e77-13ac1c19ddac' },
      { moves: "F R' U' R2 U' R2 U2 R2 U' R' F'", id: 'ce9aaf46-6361-4aa5-8991-89302d3a8192' },
      { moves: "R U R' U' R B' R' U' R U R B R2", id: '82408b28-7fce-4944-881c-90b74156dda7' }
    ]
  },
  {
    name: 'ZBLL S 12',
    id: 'b006adcc-311e-46ec-9f2a-863183ea555c',
    idMethod,
    puzzle,
    group: 'S1',
    setup: "R U2' R' U R U L U' R' U L' U R U' R'",
    algs: [
      { moves: "R U2 R D R' U2 R D' R' U R' U R U2 R'", id: '4f9ef76b-5264-43c6-b391-f0b8dd1c0b7f' },
      { moves: "R U R' U' L U' R U L' U' R' U' R U2 R'", id: '9471c128-2b51-405a-86e9-8e3c6f69fac1' }
    ]
  },
  {
    name: 'ZBLL S 13',
    id: 'af4a89b1-15c0-4309-9c2c-d17b7dabf951',
    idMethod,
    puzzle,
    group: 'S2',
    setup: "R' D' R U2' R' D R2' U' R' U2' R U R' U R U R' y2'",
    algs: [
      { moves: "R U R' U' R2 U' L' U R2 U' L U' R U2 R'", id: '78282a64-6005-47b0-acd6-9f71bc60976f' },
      { moves: "y2 R U' R' U' R U' R' U2 R U R2 D' R U2 R' D R", id: '120680f6-ae0c-4be8-873d-36f407c7f027' },
      { moves: "R2 u R' U R2 U' R u' R2 U F' U2 F", id: '24ad64f8-83ad-40bf-867c-791e5beadc5d' },
      { moves: "D' R2 U R' U R2 U' R U' R2 D R' U2 R", id: 'eedf3110-b904-4103-aa87-745c1d6224d6' }
    ]
  },
  {
    name: 'ZBLL S 14',
    id: '4f077103-e1d8-4103-a154-29fc23d098bc',
    idMethod,
    puzzle,
    group: 'S2',
    setup: "x' R U' R' D R2' U l' U R' U' R U R' U' F' y'",
    algs: [
      { moves: "R U R' U R' F R F' R U' R' F' U F R U' R'", id: '909fcee2-15a3-4a3f-a306-a86dd0c7c60d' },
      { moves: "y F U R U' R' U l F' R U' R2 D' R U l'", id: 'b18b7c9b-0502-43ed-8b69-8f1d25327b5f' },
      { moves: "f R2 f' U R2 u' R U' R2 U R' u R2", id: 'a3017431-7e69-412c-a7d2-2e1ca64f867f' },
      { moves: "y R D R' U2 R D' R2 U R U2 R' U' R U' R' U' R", id: '634c0c4d-2ad1-4e0a-bcef-a5493fff7cde' }
    ]
  },
  {
    name: 'ZBLL S 15',
    id: '75a9dc51-4192-4e69-af3d-eba950879b41',
    idMethod,
    puzzle,
    group: 'S2',
    setup: "R' U2' F' R U R' U' R' F R2' U R' U R y'",
    algs: [
      { moves: "y R' U' F2 U' R2 U R2 U F2 R2 U2 R'", id: 'e261c35c-1e2c-4320-88f6-ba2e629487a2' },
      { moves: "y R' U' R U' R2 F' R U R U' R' F U2 R", id: 'f73044b6-ff79-413a-8519-ba66a740806c' },
      { moves: "y R2 D' R U2 R' D R U R U' R' U R U' R' U2 R", id: '519d9e15-d73c-4507-ae06-3edbede70a58' },
      { moves: "y R' U' R U L U2 R' U R U2 L' U R' U2 R", id: 'd95c32d9-96d6-48b1-9854-4e2afc85b2fc' }
    ]
  },
  {
    name: 'ZBLL S 16',
    id: '7994f23e-6f26-455b-b086-56b6aaf39212',
    idMethod,
    puzzle,
    group: 'S2',
    setup: "R U R' U' L' U2' R U' R' U2' L U' R U2' R' y2'",
    algs: [
      { moves: "y2 R U2 R' U' R U R' U' R U R D R' U2 R D' R2", id: '8d7c0ca0-26b8-476f-a2c8-63fc00b28bfe' },
      { moves: "y2 R U2 R D R2 U' R U R2 D' R U' R U' R'", id: 'd2924f70-e528-4d7f-9597-9b3235890c86' },
      { moves: "R U R' U R U2 R' U R U R' U' R' F R2 U' R' U' R U R' F'", id: 'a915f383-a626-41b2-9ed3-27480d7fac2b' },
      { moves: "U2 R U2 R' U' R U R' U' R U R D R' U2 R D' R2", id: 'f6120ac1-217d-4aba-8e26-237df4a689c1' }
    ]
  },
  {
    name: 'ZBLL S 17',
    id: 'fa0e2aa7-aa12-41d9-af8f-1411a299f7f9',
    idMethod,
    puzzle,
    group: 'S2',
    setup: "R U2' R' L' U2' R U' R' U2' R L U2' R' y'",
    algs: [
      { moves: "y' F R' U R U F' R' U F U F' R", id: '8ad92a7f-36b3-4cdc-9333-28bd87844269' },
      { moves: "R U' L' U R2 D2 R U' R' D2 R L", id: 'fbe9c31d-5967-4b72-ab75-6607d6864d85' },
      { moves: "R U R' U R U2 R2 U2 R U2 R' F R U R' U' R' F' R2", id: '4f14249b-68dd-4546-b855-fb94789492ed' },
      { moves: "R U R' U R U2 R2 U2 R' D' R U' R' D R U R U' R' U' R", id: 'dd41c0cf-dc0b-464e-b7f8-064e75b6eabf' }
    ]
  },
  {
    name: 'ZBLL S 18',
    id: '64cea8c0-e5bb-4bdf-bfab-94d264008e67',
    idMethod,
    puzzle,
    group: 'S2',
    setup: "R U R2' D R2' D' R2' U' R2' D R2' D' R",
    algs: [
      { moves: "y' F R' U2 R F' R' F U2 F' R", id: '4986c607-6436-470f-aaff-0159716ede85' },
      { moves: "R' D R2 D' R2 U R2 D R2 D' R2 U' R'", id: 'a768b1a9-06ad-4fc2-ab27-b94fae3e0858' },
      { moves: "y' x U R' B2 R U' R' U B2 U' R x'", id: 'e206bbdf-0769-4fe2-bb21-80c168a9841e' },
      { moves: "y' R' F R' D' R U2 R' D R U2 F' R", id: 'd2d3a7c2-c110-4509-bf8d-af3e474a2dd5' }
    ]
  },
  {
    name: 'ZBLL S 19',
    id: '3c4d2dfd-321f-4a23-aedd-8ed961cdcaa5',
    idMethod,
    puzzle,
    group: 'S2',
    setup: "R U2' R' U' R U2' R' U R U' R' U' R U R2' D' R U' R' D R",
    algs: [
      { moves: "y' R U R' U R U' R D R' U R r' U2 r D' R2", id: '1ea097a3-c8ca-4034-a007-f3e2a3629535' },
      { moves: "R' F r2 R2 U2 r U r' U2 R r2 F' R2", id: 'ad731943-5f33-425d-9f41-e75ebf370dee' },
      { moves: "y2 R2 D' r U2 r' R U R' D R U' R U R' U R", id: '4c9ae806-e7d3-48b1-a3fc-7ac11c9633b3' },
      { moves: "y2 r' U r' F' r' U' r' U2 R' F' R U2 r U r'", id: '99a1f165-3d0e-4271-8d5f-f70a398fd445' }
    ]
  },
  {
    name: 'ZBLL S 20',
    id: '87f9d556-6e74-4aec-867b-42573e7f8b83',
    idMethod,
    puzzle,
    group: 'S2',
    setup: "R U R' U L' U2' R U L U2' R' U L' U L y'",
    algs: [
      { moves: "R U' R' U' R U R D R' U2 R D' R2 U R U2 R'", id: '1f2ec5f6-5f3a-447b-a655-50a37d3d8c7b' },
      { moves: "y' F R U R' U' R' F' U2 R U R U' R' U R' U R", id: 'e1adb597-0c35-4fe6-9486-c4bbc8106c99' },
      { moves: "y R' U2 R U R2 D' R U2 R' D R U R U' R' U' R", id: '23c24494-6ae5-4184-b353-a00e7b15aa14' },
      { moves: "y R2 U' R2 U' R' U2 R U2 R U D' R U' R' D", id: '97233b97-2254-477e-a5f5-131dfd7db3cd' }
    ]
  },
  {
    name: 'ZBLL S 21',
    id: '5cffdafa-efc9-4c45-9bde-8d1c167fa6a3',
    idMethod,
    puzzle,
    group: 'S2',
    setup: "R' U' R U' R' U R' D' R U' R' D R U2' R y",
    algs: [
      { moves: "y' R' U2 R' D' R U R' D R U' R U R' U R", id: 'f7f07d21-6659-423a-b3ce-61c2ca81b4db' },
      { moves: "y' R' U2 R U' R D R' U R D' R' U R' U R", id: '7a83aa55-1b9c-4b84-86a4-01dc4014bf61' },
      { moves: "y2 R U R' L' U2 R U2 R' U2 L U2 R U' R'", id: '0ea06ad8-4caf-4be0-a82e-33dd76994850' },
      { moves: "y R' B2 R U R U R' U2 R U R2 B2 R", id: '0e667da2-a3cf-4b16-a630-08075c0589d2' }
    ]
  },
  {
    name: 'ZBLL S 22',
    id: 'c14a55d9-62d6-4e3b-b488-9f2c41453381',
    idMethod,
    puzzle,
    group: 'S2',
    setup: "R2' D' R2' U2' R' F2' U F2' U R2' D R' y'",
    algs: [
      { moves: "y2 R U R' U R U' R D R' U R D' R' U2 R'", id: '29a98758-81ca-4956-ab92-44b395197b0d' },
      { moves: "y2 R U R' U R' D' R U R' D R U' R U2 R'", id: '9c5f8a48-2e54-4747-9688-562490855b93' },
      { moves: "y R D' R2 U' F2 U' F2 R U2 R2 D R2", id: 'bd4163d0-ef37-49ff-8b72-12f6618fe314' }
    ]
  },
  {
    name: 'ZBLL S 23',
    id: '11f2484c-1192-4f69-8f3d-94725ecafc4a',
    idMethod,
    puzzle,
    group: 'S2',
    setup: "R2' D R' U R D' R' U R' U' R U' R' y",
    algs: [
      { moves: "y' R U R' U R U' R D R' U' R D' R2", id: 'a59f328f-8807-4c85-938e-3f5cb7e55bf4' },
      { moves: "y2 L R U2 R' U' R U2 L2 U R' U' L", id: 'c3943947-be32-46a3-873c-8690a7b5a88b' },
      { moves: "y' L' U R U' L U R' L U2 L' U' L U' L'", id: 'a6e249af-c810-448d-8dcb-0e4075975979' }
    ]
  },
  {
    name: 'ZBLL S 24',
    id: '5321e1bb-ad0d-40a1-8634-8e8c8f26b3ac',
    idMethod,
    puzzle,
    group: 'S2',
    setup: "R' U' R U' R' U R' D' R U R' D R2' y2'",
    algs: [
      { moves: "y2 R2 D' R U' R' D R U' R U R' U R", id: '9010eb4a-6f41-459f-b9c2-b79a9c879914' },
      { moves: "R U R' U' R' F R F' r U R' U R U2 r'", id: 'c6beea42-67d4-4752-aaa0-6f217efeb9be' },
      { moves: "y R' U' R U' R' U2 R L' U R U' L U R'", id: '43087c81-1f91-43c6-b97a-69ccc71a85b3' },
      { moves: "R U' L' U R2 U2 L U' L' U2 L R", id: 'ee468ac2-eb97-403c-beb9-3c1931a5b95f' }
    ]
  },
  {
    name: 'ZBLL S 25',
    id: '0610721e-52de-4aca-ad43-1eb54250679d',
    idMethod,
    puzzle,
    group: 'S3',
    setup: "R U2' R' U' R U R D R' U2' R D' R2'",
    algs: [
      { moves: "R2 D R' U2 R D' R' U' R' U R U2 R'", id: '90d6bbfe-5997-4ab8-9c45-64f2411009f6' },
      { moves: "R U R' U' F' L' U2 L U x U2 R' U' l", id: '425977d8-c6b0-4317-99d4-aea12960e9c0' }
    ]
  },
  {
    name: 'ZBLL S 26',
    id: 'ded454a6-859d-4eb6-9b69-f86e687d2deb',
    idMethod,
    puzzle,
    group: 'S3',
    setup: "R' U2' R' F' R U R U' R' F U2' R y",
    algs: [{ moves: "y' R' U2 F' R U R' U' R' F R U2 R", id: '3e79ac92-b16b-4373-a0c8-431637cd29e8' }]
  },
  {
    name: 'ZBLL S 27',
    id: 'e3865e67-d643-4bea-90bc-f72d9cf69d9a',
    idMethod,
    puzzle,
    group: 'S3',
    setup: "L U2' R' U L' U L U' R U2' L' R' U2' R",
    algs: [
      { moves: "y R' U2 R U R' U' R' D' R U2 R' D R2", id: 'c5847f59-fe79-4461-9da6-7909923a1eca' },
      { moves: "R' U2 R U R' U' R U R2 F' R U R U' R' F R", id: '97cf3926-369f-47c9-ae7a-980a35063688' },
      { moves: "R' U2 R L U2 R' U L' U' L U' R U2 L'", id: '121931a6-0a25-4c77-a9bc-9613dfdf34ef' }
    ]
  },
  {
    name: 'ZBLL S 28',
    id: '260db24d-6bc9-43c9-8351-629b935e34ed',
    idMethod,
    puzzle,
    group: 'S3',
    setup: "L U2' F L' U' L U L F' L' U2' L'",
    algs: [
      { moves: "y R U R' U R U' R2 D' R U R' D R2 U2 R'", id: '4f51f6bb-2ff5-4031-a7bc-c40c2de267a9' },
      { moves: "y R U2 R' U2 R' F R2 U R' U' R U R' U' F'", id: '6cb1d387-da36-42fd-ab2c-ba8ec80a0136' },
      { moves: "L U2 L F L' U' L' U L F' U2 L'", id: '7b436684-f9ba-4b77-9910-02bf8c7ee5b0' },
      { moves: "z U R2 U F U' R' U' R U F' R2 U'", id: 'c8c80c67-d7a9-4847-8574-c8418ba96785' }
    ]
  },
  {
    name: 'ZBLL S 29',
    id: '72521cd8-bfb7-4e72-be76-9b4653ffeeae',
    idMethod,
    puzzle,
    group: 'S3',
    setup: "L' U R U' L U R'",
    algs: [
      { moves: "R U' L' U R' U' L", id: '85249f71-1f60-4fbc-8b9e-db6102c59c50' },
      { moves: "R U' r' F R' F' r", id: '4182c06a-9882-46ad-b87d-790ece3e9ec7' },
      { moves: "y2 L U' R' U L' U' R", id: 'be93b392-d4ff-4d06-ba7d-d63151ee1925' },
      { moves: "y' F R' F' R y' r' U' R U M'", id: '037d2a8e-66b7-4704-ada5-da225a0ee458' }
    ]
  },
  {
    name: 'ZBLL S 30',
    id: '13a73c06-c9c0-461a-b3ca-f09f0d39108e',
    idMethod,
    puzzle,
    group: 'S3',
    setup: "R2' U' R U' R U R' U R2' D' U R U R' U' R U' R' D",
    algs: [
      { moves: "y' R' U2 R2 U R D' R U R' D R2 U' R U' R'", id: 'd02eea19-9ff1-4a06-a0e4-79cbb76570dd' },
      { moves: "F R2 D R' U R D' R2 U' R U R' U' R U R' U' F'", id: 'a5b8c629-cf63-4232-b519-61aa7f98171c' },
      { moves: "R U R' U R U' R' U' D R2 U' R U' R' U R' U R2 D'", id: '153e1075-c906-4d07-9f39-53e70f362eff' },
      { moves: "D' R U R' U R U' R' U' D R2 U' R U' R' U R' U R2", id: '141a2f94-5a13-4455-8164-912c8a1f20e0' }
    ]
  },
  {
    name: 'ZBLL S 31',
    id: 'c959668d-f916-4cb7-8393-7c9e529a9b63',
    idMethod,
    puzzle,
    group: 'S3',
    setup: "R U R' U R U L' U R' U L U L' U L",
    algs: [
      { moves: "y' R U R' U R U2 R2 U R U2 L' R' U R U' L", id: '0297ac79-2bfa-49d2-ad7b-da8ca015373e' },
      { moves: "R U' R' U R U' R' F R' F' R U' F' U F", id: 'c2ee24ae-c963-441c-80a3-5dc735081f04' },
      { moves: "L' U' L U' L' U' R U' L U' R' U' R U' R'", id: '68379f3e-d939-448d-9eea-52ca6539b3b1' },
      { moves: "y' R U R' U R U2 R2 U R U2 R' L' U R U' L", id: 'bc9e2d76-81b1-4183-a48e-0f7d948742c3' }
    ]
  },
  {
    name: 'ZBLL S 32',
    id: '7ff2441f-28d6-4cc6-bba4-488a0a385048',
    idMethod,
    puzzle,
    group: 'S3',
    setup: "D R' U' R D' R U' R' U R2' U R' U' R2' y",
    algs: [
      { moves: "y2 R U R' F' R U R' U R U' R' U' R' F R2 U' R'", id: 'a92362e9-cd45-4cc4-ae9a-c19719fffec4' },
      { moves: "y' D' R2 U R U' R2 U' R U R' D R' U R", id: 'baa8a929-de38-4990-976c-acc446784c68' },
      { moves: "R U R' U R U R' U' R U R D R' U' R D' R' U2 R'", id: 'cb12153c-e715-41e3-8b59-96b0d08cee40' },
      { moves: "y' R2 U R U' R2 U' R U R' D R' U R D'", id: 'b380943e-9c38-4fdd-93d4-f89d00d5113d' }
    ]
  },
  {
    name: 'ZBLL S 33',
    id: 'af7265f7-5561-4d26-99ab-917e01fdeb9b',
    idMethod,
    puzzle,
    group: 'S3',
    setup: "R' U' R2' U2' R2' D U' R2' U' R2' U R2' D' R2' U' R y'",
    algs: [
      { moves: "y R' U' R' U R2 D' U2 R U R' U' D R'", id: '7c38db35-68ad-409c-a005-8286037f9bac' },
      { moves: "R' L' U2 R L2 U' R' U L2 U2 R U' L", id: '6a7209ae-a3bc-424b-a16b-b771d6d0dd74' },
      { moves: "y' R' U2 R y R U' R' U' R U2 R' U' y' R' U' R", id: 'a7c978d2-3edd-43c7-8c96-7ed86d380a2e' },
      { moves: "y R' U' R' U R2 U2 D' R U R' U' D R'", id: 'bcdadfa0-3672-4430-9cc8-fe88198c6e98' }
    ]
  },
  {
    name: 'ZBLL S 34',
    id: 'fb343347-6cdd-4f96-a75c-052531f584dc',
    idMethod,
    puzzle,
    group: 'S3',
    setup: "F R U' R' U R U R2' F' R U R U R' U' R U' R'",
    algs: [
      { moves: "y2 L U' R' U L' R' U' R' U' R' U R U R2", id: '83be0466-179e-468e-9deb-c4e6c815a3f3' },
      { moves: "y R' U2 R U R' U' R' D' r U2 r' D R2", id: 'af3d05af-cbeb-4e04-8121-e194925823c7' },
      { moves: "y R' D' L D R' D' L' D' F2 R2 B2 U R2 F2 L2 D' R2 U'", id: 'ea1b3668-1b8e-4908-9674-1c4aa3aaae6a' },
      { moves: "R U' L' U R' L' U' L' U' L' U L U L2", id: 'a8b7ff36-9117-4de3-a62d-bc324de58924' }
    ]
  },
  {
    name: 'ZBLL S 35',
    id: 'da0c7205-152d-4d1c-8fee-fce2822ad627',
    idMethod,
    puzzle,
    group: 'S3',
    setup: "L' U R U' L R U R U R U' R' U' R2'",
    algs: [
      { moves: "R2 D r' U2 r D' R' U' R' U R U2 R'", id: 'ffa17c80-beef-4a99-8a00-deffe9890fd6' },
      { moves: "y R' U' R U' R' U R U' R D R' U' R D' R' U R' U2 R", id: 'd9a3e01f-b04a-4f42-8332-a74cea52ae6b' },
      { moves: "R2 U R U R' U' R' U' R' L' U R' U' L", id: '7c6e4452-9d7e-4ea8-95ac-9c09a331ec84' },
      { moves: "y2 z U2 R U R U' R' U' R' D' U' R U' R' D", id: '62158bfc-b0be-4c0f-9624-6a01a9bc7328' }
    ]
  },
  {
    name: 'ZBLL S 36',
    id: '858d3d18-2262-4e8a-b3bb-063e678843bd',
    idMethod,
    puzzle,
    group: 'S3',
    setup: "R U R U' R2' D U2' R' U' R D' U R y",
    algs: [
      { moves: "y' R' U' D R' U R D' U2 R2 U R' U' R'", id: '8e2e2845-8f29-472e-9886-09b6cd7bbbd6' },
      { moves: "y' R' U' D R' U R U2 D' R2 U R' U' R'", id: '85c5a87a-ab53-459c-bf40-b905e176dd83' },
      { moves: "y2 R U' R' y' U' R' U2 R U' R' U' R y R U2 R'", id: '7ba3753e-cc28-4b4b-ba04-6ada8ebf2bd7' },
      { moves: "y2 R U' R' U' y' R' U2 R U' R' U' R y R U2 R'", id: '756fc750-0dce-4b49-8a40-6e7ea8f72a3f' }
    ]
  },
  {
    name: 'ZBLL S 37',
    id: '71f3c9d0-2509-4615-9887-64867c9cced5',
    idMethod,
    puzzle,
    group: 'S4',
    setup: "R U2' R' U2' L' U R U' R' L",
    algs: [
      { moves: "L' R U R' U' L U2 R U2 R'", id: '9d5ae0af-16e7-4023-9bba-1f31ce648b96' },
      { moves: "M F R' F' r U2 R U2 R'", id: 'd6aea526-c87c-4e24-b687-cb154c6a0707' },
      { moves: "r' R F R' F' r U2 R U2 R'", id: '23171702-99be-4b97-92ba-74dd5a27546c' }
    ]
  },
  {
    name: 'ZBLL S 38',
    id: '875d112d-3768-48a5-b833-974435d51978',
    idMethod,
    puzzle,
    group: 'S4',
    setup: "R U' R' U2' R U' R2' D' R U' R' D R y'",
    algs: [
      { moves: "y R' D' R U R' D R2 U R' U2 R U R'", id: '25435dbf-0c98-4ca7-b946-4cb97de7f2f7' },
      { moves: "y' R' U2 R2 D R' U' R D' R' U2 R' U R", id: 'f9082543-2fb1-43cc-b264-878c1f3c81ca' },
      { moves: "R U2 R2 U' R2 U' R2 U' L U' R U L'", id: '5306774b-2d44-4204-b4de-9b01d81c06de' },
      { moves: "U R' D' R U R' D R2 U R' U2 R U R'", id: '24d90ca4-eab1-4786-9b98-bfa36f009c66' }
    ]
  },
  {
    name: 'ZBLL S 39',
    id: 'b37bbfe0-26d9-4c4c-bbc1-857d1571083d',
    idMethod,
    puzzle,
    group: 'S4',
    setup: "R' U2' R' D' R U R' D R2' U' R' U2' R y'",
    algs: [
      { moves: "y R' U2 R U R2 D' R U' R' D R U2 R", id: '5db1841b-b980-4767-9118-5a624ca7b55e' },
      { moves: "F R U' R' U' R U R' U R U' R2 F' R U R U' R'", id: 'b7448c80-4970-4f08-a0a4-7de35514c18b' },
      { moves: "L' R' U2 R U R' U2 L U R U R' U R", id: 'e304ba36-7fbc-4841-961f-e2b7ad325f1d' }
    ]
  },
  {
    name: 'ZBLL S 40',
    id: 'd497ec10-08f8-4daa-8128-192bb52c011a',
    idMethod,
    puzzle,
    group: 'S4',
    setup: "S U2' R U2' R' U2' R' F R f'",
    algs: [
      { moves: "f R' F' R U2 R U2 R' U2 S'", id: '86167406-5725-4328-ab7c-6686d76cd607' },
      { moves: "y R U R2 F' R U R U' R' F U R U2 R'", id: '0fa51843-e0b7-40e4-9586-916edbc7a672' },
      { moves: "y' L R U' R' U L' R U R' U2 R U2 R'", id: '14e0fea8-6502-4819-97bf-6ad917428398' },
      { moves: "y R U R' F' R U R' U' R' F R2 U' R' L U' R' U L' U' R", id: '2088cd67-171b-483d-9503-1a421819d43c' }
    ]
  },
  {
    name: 'ZBLL S 41',
    id: 'a3819d4c-6aaa-4aa4-94be-dd5e362f953c',
    idMethod,
    puzzle,
    group: 'S4',
    setup: "L' R U' L U R' U' L' U2' R U' L U R' y'",
    algs: [
      { moves: "y' L' R U R' U' L U R2 D R' U' R D' R2", id: '853956a2-f562-4c48-810c-f12cc5d2cd9d' },
      { moves: "y' M F R' F' r U R2 D R' U' R D' R2", id: '7b9637d1-7d44-458e-b043-5c462f0e0f5e' },
      { moves: "y R U' L' U R' U2 L U R U' L' U R' L", id: '6ec10d25-2961-4d0a-9872-92367afcbe6b' },
      { moves: "R' U2 R U R' U R' D' r U2 r' D R U2 R", id: 'a4c41c94-06e6-4544-830b-850b5714f30d' }
    ]
  },
  {
    name: 'ZBLL S 42',
    id: '9f0f1152-22ff-4e88-bf1e-fbb037fb369e',
    idMethod,
    puzzle,
    group: 'S4',
    setup: "F R U R' F R' F' U2' R2' U R2' U R F' y'",
    algs: [
      { moves: "y' R' U' F U' R2 U R2 U F' R U' R U' R'", id: 'fd9f3dd9-5246-4a7c-8d53-b34c9457633b' },
      { moves: "y L U' R' U L' U R' D' R U2 R' D R2", id: 'f56025fd-9c30-401e-b4ae-1c061a148b47' },
      { moves: "y' R' U2 R2 U R2 U D' R U R' D R U2 R U' R'", id: '65ed1d85-2bcb-4433-bf67-6accf9399bac' },
      { moves: "R' F' R U R U R' U' R U' R' F R U R' U R U' R'", id: '3dcaa3e7-1a59-43fa-b4c8-72a59cc2bf17' }
    ]
  },
  {
    name: 'ZBLL S 43',
    id: 'f1677518-b55b-4e60-bd42-3d0cf6e45535',
    idMethod,
    puzzle,
    group: 'S4',
    setup: "R' U' R U' R2' D' r U2' r' D R2' y2'",
    algs: [
      { moves: "y2 R2 D' r U2 r' D R2 U R' U R", id: '35dc20d3-8aee-4b83-ae1a-f63e3b49511b' },
      { moves: "y2 L U2 L' U R' U2 L U' L' R U R' U R", id: '0102f544-e083-4e6a-bec2-74237a5a5d44' }
    ]
  },
  {
    name: 'ZBLL S 44',
    id: '64ffe0ca-eacf-4dd3-aaa9-5df32a2403e3',
    idMethod,
    puzzle,
    group: 'S4',
    setup: "R U R' U' R2' U R U R' U' D R' U' R D' R",
    algs: [
      { moves: "R' D R' U R D' U R U' R' U' R2 U R U' R'", id: '27b846e0-d45e-449c-bc8b-884217f53201' },
      { moves: "F U R U' R' S R' F' R U R U' R' S'", id: 'ec3e0a53-47f8-4e56-88b1-6547951c48fd' },
      { moves: "F U R U' R' S R' F' R U R U' R' S' U'", id: 'e072aab7-59c7-425c-bee6-247d07b3ce7a' },
      { moves: "y' R' U' L U' R2 U L' R U' R2 U2 R' U' R2", id: 'e45c5db7-3d13-46ab-8acd-5b9c82ecd625' }
    ]
  },
  {
    name: 'ZBLL S 45',
    id: '645095fa-bf44-4339-a064-b7d124073ab9',
    idMethod,
    puzzle,
    group: 'S4',
    setup: "R U R' U R U2' R2' L U L' U' R U2' L U2' L' y'",
    algs: [
      { moves: "F R U R' U' R' F' R U2 R U' R' U R U2 R'", id: '99e195a7-a7e0-4fa0-bc7b-d6ceb7e4ba8a' },
      { moves: "y R U R2 F' r U R U' r' F U R U2 R'", id: '76232bfa-fd85-400b-abb2-16b074c81347' },
      { moves: "R' U2 R U R D R' U R D' R2 U R U' R' U R", id: '6f9138e6-8c1d-4d90-a61f-8701091190fe' },
      { moves: "R' U2 R U2 R2 D' R U R' D R2 U' R' U R", id: '8676db7c-1c4d-448e-bbdc-0675dbc7b4cc' }
    ]
  },
  {
    name: 'ZBLL S 46',
    id: '534e7ac6-d0d2-4f15-a449-b031170a9de4',
    idMethod,
    puzzle,
    group: 'S4',
    setup: "R' U2' R' D' R U2' R' D R U' R U' R' U2' R",
    algs: [
      { moves: "R' U2 R U R' U R' D' R U2 R' D R U2 R", id: 'ae35fd26-2ce2-4376-b68d-bc793bdf1e10' },
      { moves: "R U R' U R U2 R' U2 R U R' U' R' F R2 U' R' U' R U R' F'", id: '5f6d5331-9c0b-4114-8792-3030ff3b0462' },
      { moves: "R U R' U R U2 R' L' U' L U L F' L2 U L U L' U' L F", id: 'a89d41a2-b8e3-43a3-a3d6-c01ff2f433b4' },
      { moves: "y R U' L U' R2 D' F2 D R2 U2 L' R'", id: 'e86c07a9-d427-4bba-8f70-b6585d188415' }
    ]
  },
  {
    name: 'ZBLL S 47',
    id: 'e598b4e8-50a5-4edd-a516-0569c740c9e2',
    idMethod,
    puzzle,
    group: 'S4',
    setup: "R' U' R U R' F R U R' U' R' F' R2'",
    algs: [
      { moves: "R2 F R U R U' R' F' R U' R' U R", id: '2d287e7c-3a4a-4851-9001-10e88fca79c5' },
      { moves: "R U R' U' R' F R2 U' R' U' R U R' F' R U R' U R U2 R'", id: '0e51f360-c345-4f57-bd50-6acbc4ae19ba' },
      { moves: "R' U R U R' U' R' D' R U R' D R2 U R' U R", id: '3ea098ec-6812-44d1-9ec4-7594c30ad65f' },
      { moves: "y z F' U' R' U2 R2 U2 R' U2 R' U' F z'", id: '0c5aac28-535e-46d2-934c-2562db883c41' }
    ]
  },
  {
    name: 'ZBLL S 48',
    id: '02228f17-1e1d-43fe-aea9-1faec8d68db0',
    idMethod,
    puzzle,
    group: 'S4',
    setup: "R' U' R U' R2' D' R U2' R' D R2' y2'",
    algs: [
      { moves: "y2 R2 D' R U2 R' D R2 U R' U R", id: '5f112a3c-a54a-4b7e-b8c2-92620abb6c6e' },
      { moves: "R U R' U R U2 x R D2 R U R' D2 R U' R", id: '9e4a9f64-5515-4d71-a76f-8f1cb71140ce' }
    ]
  },
  {
    name: 'ZBLL S 49',
    id: '3a39beae-daac-44e2-b844-e0da0c4bb3bd',
    idMethod,
    puzzle,
    group: 'S5',
    setup: "R U R' U L' U2' R U2' R' U2' R L U2' R' y'",
    algs: [
      { moves: "y R2 U R2 F' R U2 R' U' R U' R' F R2 U' R2", id: '3530d4e0-29fc-48fc-a3f0-56d79f7955bb' },
      { moves: "y2 R U' R D R2 U' R U' R' U2 R2 D' R' U R'", id: '94b30ea5-9013-48f1-9200-9e662b82f8ec' },
      { moves: "y2 R U' R' U' R U' R' U2 R U R' U R' D' R U R' D R", id: 'e193a39d-6992-4186-9bb2-ed58720c071e' },
      { moves: "y' z R' U' R' U R U R F' R' U2 R U R' U' R U F z'", id: 'ca3e1460-9d0d-46d1-b017-eef4620b0311' }
    ]
  },
  {
    name: 'ZBLL S 50',
    id: '2bcf3f41-5325-41ba-92c4-391aa5e81c88',
    idMethod,
    puzzle,
    group: 'S5',
    setup: "L' U2' R U' R' U2' L R U R' U' R U R' U' R U' R' y",
    algs: [
      { moves: "y F U R' F R F' R U' R' U R U' R' F'", id: '15cfc045-6c41-4294-8c15-913ccd73d28b' },
      { moves: "y' F' L' U' L U L' U' L F' L F L' U F", id: 'fb244689-fd31-4505-ad25-a1d8701c6d5e' },
      { moves: "y' R U R' U R U' R' U R U' R' L' U2 R U R' U2 L", id: 'b85a0aa7-4265-4125-b6c3-5c75fe41ce77' }
    ]
  },
  {
    name: 'ZBLL S 51',
    id: 'c873e974-9c32-41fb-8777-19c19cdfd9fd',
    idMethod,
    puzzle,
    group: 'S5',
    setup: "R U' R2' D' U' R U' R' D U2' R2' U R' y",
    algs: [
      { moves: "y' R U' R2 U2 D' R U R' U D R2 U R'", id: '946c07a6-e331-49ef-9482-98a890af89b3' },
      { moves: "U R' U R2 U D R' U R D' U2 R2 U' R", id: '29bfe329-6a7f-46b2-a48f-d0639e6ef160' },
      { moves: "y2 R' U' R U R' F' R U R' U' R' F R U2 R U R' U R", id: '2aaa6c5c-7132-42bb-bb1b-8bae244c824f' },
      { moves: "y' R U' R2 U2 R F' U R' U' R F R' U2 R2 U R'", id: '698e37cf-650d-4c93-9cfd-a9aef6199e44' }
    ]
  },
  {
    name: 'ZBLL S 52',
    id: 'f1eb8271-86db-4ea9-a066-c20b726b0225',
    idMethod,
    puzzle,
    group: 'S5',
    setup: "R' U2' R L U2' R' U2' R U2' L' U R' U R y",
    algs: [
      { moves: "y F' R U R' D R U R' U' D' R U' R' F", id: '6304b27d-8793-42c4-ade9-0c1027ffc9f6' },
      { moves: "R' U R U2 R' U2 R' F' R U R U' R' F U' R", id: 'c1fd46df-66d7-46d7-9cc4-daad1ce8d915' },
      { moves: "R' U R' D' R2 U2 R' U' R U' R2 D R U' R", id: 'e07aee5e-ac98-466d-abe0-9cab6322bb26' },
      { moves: "y R2 U' R2 B R' U' R U' R' U2 R B' R2 U R2", id: '70672c7d-005f-49bf-8efd-56829680584e' }
    ]
  },
  {
    name: 'ZBLL S 53',
    id: 'd8b34041-b579-4169-8467-4699b52687d4',
    idMethod,
    puzzle,
    group: 'S5',
    setup: "L' U' L U R U' L' U R' U R U' L U R' y",
    algs: [
      { moves: "y' R' U2 R2 U R' F' R U R' U' R' F R2 U' R2 U R", id: '2e562232-0257-43f8-a148-4890cae97e1f' },
      { moves: "y' R' U' F U R U' R' F' R2 U R' U' R' F R F'", id: '8a41f305-d7f7-4046-afe1-c0e69517bac0' },
      { moves: "y' R U' L' U R' U' R U' L U R' U' L' U L", id: '300694c2-921b-45ee-9f57-07385ff3f4cf' },
      { moves: "R U R' U' L' U R U' L U' L' U R' U' L", id: '331cc647-8b01-4e8b-ba12-bc2d5d5229c1' }
    ]
  },
  {
    name: 'ZBLL S 54',
    id: '95d53159-2f9c-415d-9c75-4e97c4d66d26',
    idMethod,
    puzzle,
    group: 'S5',
    setup: "R U2' R' U2' L' U' L U' R U L' U R' U2' L y2'",
    algs: [
      { moves: "F R U R' U R U2 R U2 R2 U' R2 U' R2 F'", id: '569e9ea3-cfaa-4484-8650-f88ea829beda' },
      { moves: "R' U2 R U R' U' L U' L' U2 R U L U2 L'", id: '60cb36fd-275c-47fd-a5da-dc84dd75431f' },
      { moves: "R U R2 F2 R U2 R U2 R' F2 U R U2 R'", id: '377804f5-ff12-4a2d-adc1-026e49a569bc' },
      { moves: "y' f R' F' R f' R' D R U R' D' R U2 F", id: '2603085e-1e71-48e2-a35f-2ece121cf95c' }
    ]
  },
  {
    name: 'ZBLL S 55',
    id: 'cf50aa87-636c-4958-8f53-65c7c08f1031',
    idMethod,
    puzzle,
    group: 'S5',
    setup: "R' U2' L U' R U L' R' U R U' R' U2' R y'",
    algs: [
      { moves: "R' U2 R U R' U' R F U' R' U' R U F'", id: 'e4480fdd-a75b-4b30-bf29-7106f62406a0' },
      {
        moves: "R U R' U R U2 R' F R U' R' U' R U R' F' R U R' U' R' F R F'",
        id: 'b42d4459-4412-44a5-a3d4-01b637769a29'
      },
      { moves: "y' R U2 R' U' R U R' U' F' R U2 R' U' R U' R' F R U' R'", id: 'ec27c7d7-3224-4097-ad16-14c5e1ee4f16' },
      { moves: "y R' U2 R U R' U' R L U' R' U L' U2 R", id: '1249a5e1-aee5-40be-a3e0-7a73bb670535' }
    ]
  },
  {
    name: 'ZBLL S 56',
    id: '8f16a74d-92ae-4a2f-ae7d-6666c0b30790',
    idMethod,
    puzzle,
    group: 'S5',
    setup: "R U2' R' U' R U L' R' U R U' L U2' R' y",
    algs: [
      { moves: "L' U2 R U' R' U2 L U R U' R' U R U2 R'", id: '76b50e6c-9f30-4247-a08d-1bf07b7cd611' },
      { moves: "y2 r F' U2 F r' U2 R' U' R' U R' U R2", id: 'b89d0b27-a79e-48b6-aac6-b43abf7c2dc9' },
      { moves: "y' R' U' R f R' U R U' F' R U R' U' R' F R f'", id: '4148def4-cb03-406e-be80-68a0102a54c1' },
      { moves: "F R' F' R U R U' R' F U R U2 R' U' R U R' F'", id: '735ecd86-7b74-490d-aabd-baf6039d0229' }
    ]
  },
  {
    name: 'ZBLL S 57',
    id: 'd2dce4be-838b-444d-b4cf-aad04c6c9cd2',
    idMethod,
    puzzle,
    group: 'S5',
    setup: "R U2' L' U R' U' L U' R U' R' y2'",
    algs: [
      { moves: "y2 R U R' U L' U R U' L U2 R'", id: 'd2461ebd-8cf3-460b-b84f-30b46569501e' },
      { moves: "U2 R U R' U r' F R F' r U2 R'", id: '1c0586c4-4e1e-477a-8de3-d3efc2c8d455' },
      { moves: "F' R U2 R' U2 R' F2 R U R U' R' F'", id: 'bcd57074-c181-4cb6-897a-ae91fa04fd4c' },
      { moves: "y2 R U R' F' r U R' U R U2 r' F R U' R'", id: '2ac052c2-2a42-4521-b925-b603e92ce6e8' }
    ]
  },
  {
    name: 'ZBLL S 58',
    id: '31a02f56-cf7f-4789-8607-f9a88fe2aef5',
    idMethod,
    puzzle,
    group: 'S5',
    setup: "R U2' R2' U' R2' U' R' F U' R' U' R U F'",
    algs: [
      { moves: "F U' R' U R U F' R U R2 U R2 U2 R'", id: '8867976c-40e6-48eb-8015-a74a578fb82f' },
      { moves: "R U R' D' R2 U R U' R2 D R' U R2 U2 R'", id: '2d1d0f3c-422e-40e8-945e-0a5977ebbc07' },
      { moves: "R U R U R U' R2 D R' U R D' R U2 R'", id: '85beb38e-5609-48cb-ae2c-7688c8ef124c' },
      {
        moves: "R U R' U R U' R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'",
        id: '5eae78dd-32ef-4613-b3dd-b3f48f53ee4e'
      }
    ]
  },
  {
    name: 'ZBLL S 59',
    id: '8388495f-e1f5-466f-a777-2a35e0df4260',
    idMethod,
    puzzle,
    group: 'S5',
    setup: "R' U' R U' L U' R' U L' U2' R",
    algs: [
      { moves: "R' U2 L U' R U L' U R' U R", id: '7546cd12-c4cd-463b-832a-d573d8978958' },
      { moves: "R' U R U2 R' U R U2 R D R' U' R D' R'", id: 'bc9b995b-234c-4df1-8532-e26c9e2f35b7' },
      { moves: "U2 r' F2 R F' r U R' U r' F r", id: '93c31aa3-edd7-4d47-ad49-020c9c69477e' },
      { moves: "y2 L' U2 R U' L U R' U L' U L", id: '3da8134c-8298-4b27-a413-1e9afbed42e5' }
    ]
  },
  {
    name: 'ZBLL S 60',
    id: 'd63ea1ae-4cfd-419c-b2b0-8f1ff54d7049',
    idMethod,
    puzzle,
    group: 'S5',
    setup: "F R U' R2' U' R U' R' U2' R2' U R' F'",
    algs: [
      { moves: "F R U' R2 U2 R U R' U R2 U R' F'", id: 'c7f4b9ff-4a10-484b-a7d0-eefad7404f25' },
      { moves: "R' F R F' U R U R' U2 F R' F' R", id: 'ccf9c295-2d73-45f4-9c9d-d0870f04cb6b' },
      { moves: "y2 R U R' F' R U R' U R U2 R' F R U' R'", id: 'b40785d5-46ad-4d78-8523-620701bc62e5' }
    ]
  },
  {
    name: 'ZBLL S 61',
    id: '31238315-abe7-4866-85a5-fa85b44222f1',
    idMethod,
    puzzle,
    group: 'S6',
    setup: "R U' R' U2' R U' R' U2' R U2' R' U R U R' y2'",
    algs: [
      { moves: "y' R U R' U' R' U2 R U R' U R U' R U' R'", id: '300656ec-7890-4c81-af9d-d1a65a43060a' },
      { moves: "y' R' U2 R U R' U R U R' U R' U' R3 U' R' U R U R2", id: '48a77510-3018-4aee-adad-40685783e641' },
      { moves: "y L' R u R2 u' R2 U R U' L", id: '41819649-201a-470f-a81e-4903ce6aa268' },
      { moves: "S r U R' U R U2 r' U2 S'", id: '52198995-ef58-4db0-aabb-297457e219da' }
    ]
  },
  {
    name: 'ZBLL S 62',
    id: '32967b34-15d9-4379-af4c-f6a01751e73d',
    idMethod,
    puzzle,
    group: 'S6',
    setup: "R2' U' R' U R U R' U2' R' U R2' U R2' y",
    algs: [
      { moves: "R U R' U R U' R' U R' U' R2 U' R' U R' U R", id: '02f52d09-8a02-4699-a8a0-ccdb9c09d471' },
      { moves: "y' R2 U' R2 U' R U2 R U' R' U' R U R2", id: 'c7303162-f314-4c2e-8a77-be6c81e91500' },
      { moves: "R U R' U R U2 R U' R' U' R U R U R U' R", id: '723a5767-0ef2-4c68-aba6-174bfa18147e' }
    ]
  },
  {
    name: 'ZBLL S 63',
    id: 'dbe51503-8c18-401d-aaba-325b27deb8ca',
    idMethod,
    puzzle,
    group: 'S6',
    setup: "R U2' R2' U2' R2' U R2' U R2' U' R'",
    algs: [
      { moves: "R U R2 U' R2 U' R2 U2 R2 U2 R'", id: '7db4a72a-f966-4783-9a6f-708144d7cde5' },
      { moves: "y' R' U2 R U R' U R U' R' U R' U' R3 U' R' U R U R2", id: '51f9a616-9a86-4488-858f-c10c2937b08b' },
      { moves: "y2 R' U' R2 U R U R' U' R U R2 U2 R' U'", id: 'a109a33c-1c86-4f37-9290-327b63e33a22' },
      { moves: "y R U2 R' U2 R' U2 R U R' U R2 U2 R'", id: '20659767-951c-473e-b46a-6aa31d9aebda' }
    ]
  },
  {
    name: 'ZBLL S 64',
    id: '918f4e6f-9c04-41dd-a8c3-6f24c9077a2e',
    idMethod,
    puzzle,
    group: 'S6',
    setup: "R' U' R U' R' U2' R y",
    algs: [
      { moves: "y' R' U2 R U R' U R", id: 'e60ee5f5-d438-4e2f-b292-ca8523f347e3' },
      { moves: "y L' U2 L U L' U L", id: '151f7ce3-8f21-47a4-87da-0b2705199154' }
    ]
  },
  {
    name: 'ZBLL S 65',
    id: '3215498f-bf1f-41b1-a5c1-1bff20e09f50',
    idMethod,
    puzzle,
    group: 'S6',
    setup: "R' U' R U R U2' R' U' R U' R' U R' U R y2'",
    algs: [
      { moves: "R U R' U R U R U R U R U' R' U' R2", id: '33ea4f23-ce3d-4bb0-9b90-357e459c54f1' },
      { moves: "y' R2 U R' U' R' U' R U2 R' U' R2 U' R2", id: '49055717-722d-4661-a90f-79cadd0c4430' },
      { moves: "y2 R' U' R U' R U R' U R U2 R' U' R' U R", id: '69938fa5-2b49-4f29-809a-790728b77f9b' },
      { moves: "R U' R' U R U R2 U' R U' R U R2 U R", id: '5ebbc544-bc11-428e-8c6c-f194ec25aa0b' }
    ]
  },
  {
    name: 'ZBLL S 66',
    id: 'd965f099-0e5c-45c6-932d-92a368a575eb',
    idMethod,
    puzzle,
    group: 'S6',
    setup: "R' U' R U' R' U R U' R U R2' U R U' R U' R' y'",
    algs: [
      { moves: "R U R2 F' R U2 R U' R' U' R' F R2 U' R'", id: 'e84d13da-10a2-44e1-8a8c-9f9a2862c48b' },
      { moves: "y R U R' U R' U' R2 U' R' U R' U' R U R' U R", id: 'efcc9b7e-e0af-4162-bf70-0449566fdacb' },
      { moves: "y' R' U2 R U R' U R2 U' R U R U R U' R' U' R2", id: '9280b168-27f2-4c6c-919d-8ee571ed4d0f' },
      { moves: "y' R2 U R U' R' U' R U2 R U' R2 U' R2", id: '6a489a97-e021-4d93-883a-cbcf2a7aadcd' }
    ]
  },
  {
    name: 'ZBLL S 67',
    id: 'fc75b0ae-8522-4bb5-bbe6-ba3a3c899fe6',
    idMethod,
    puzzle,
    group: 'S6',
    setup: "R U2' R' U' R U' R'",
    algs: [
      { moves: "R U R' U R U2 R'", id: '6bf65c83-5baf-4037-90c5-0d04d497fbb3' },
      { moves: "R U R2 U' R2 U R' S R2 S'", id: 'a5ccc1c6-132f-4eed-ae35-57a4e3b1541c' }
    ]
  },
  {
    name: 'ZBLL S 68',
    id: 'ed9c32c6-61f8-4605-91d5-b8e6c8cc66f0',
    idMethod,
    puzzle,
    group: 'S6',
    setup: "R' U' R2' U R2' U R2' U2' R2' U2' R",
    algs: [
      { moves: "R' U2 R2 U2 R2 U' R2 U' R2 U R", id: '322212f9-602a-4d00-b5f8-535e9f3d81ac' },
      { moves: "R' U2 R2 U R' U R U2 R' U2 R' U2 R", id: 'aa3612f8-348c-47de-8662-42bd859c49c3' },
      { moves: "R U R' U R U2 R' U R' U R' U' R3 U' R' U R U R2", id: '32824640-14ea-48aa-91f0-64948879bc39' },
      { moves: "y' R' U2 R2 U R U' R' U R U R2 U' R'", id: '7eed0afa-46f9-4707-8fd9-6cacb8e539d2' }
    ]
  },
  {
    name: 'ZBLL S 69',
    id: '552e8f76-7d86-4171-81ff-25b4d32c6ba6',
    idMethod,
    puzzle,
    group: 'S6',
    setup: "R2' U R U R2' U' R' U' R2' U' R U' R'",
    algs: [
      { moves: "y' R U R' U' R' U2 R U R U' R' U R' U R", id: '65dca751-48e1-4017-82fd-78589c84c4b2' },
      { moves: "R U R' U R2 U R U R2 U' R' U' R2", id: '18d5c77c-c2f5-4b09-95a7-3e11b02d336c' },
      { moves: "y' R2 U' R' U' R2 U R U R2 U R' U R", id: '146df49b-2df1-48a1-8d1b-366304b0b346' },
      { moves: "R U R' U R U' R' U' R' U2 R U R U' R2 U2 R", id: 'cfc37bb4-fcef-43e0-8546-eb4fef55165d' }
    ]
  },
  {
    name: 'ZBLL S 70',
    id: 'f0fbc3c7-eb23-4f26-9eb9-52d1dc02bba9',
    idMethod,
    puzzle,
    group: 'S6',
    setup: "R U R' U' R' U' R U R U' R' U' R' U R y",
    algs: [
      { moves: "y' R' U' R U R U R' U' R' U R U R U' R'", id: '5539cec5-6484-4426-bfe6-0c4cc59054bd' },
      { moves: "R' F' U' F U R F U R U' R' F'", id: 'f09593aa-b668-4922-ac46-f78328281c19' },
      { moves: "y F' L' U' L U F U' F U R U' R' F'", id: '568d0369-916b-435f-8539-439c1f1559be' },
      { moves: "y' R' U2 R2 U R U R U' R' U' R2 U R", id: 'd7e31fe2-41af-4f84-b373-178470002237' }
    ]
  },
  {
    name: 'ZBLL S 71',
    id: '54f34e25-8102-43de-8684-c68f252a429c',
    idMethod,
    puzzle,
    group: 'S6',
    setup: "R U2' R2' U' R2' U' R' U R' U R y2'",
    algs: [
      { moves: "y' R' U2 R2 U R2 U R U' R U' R'", id: 'b7a8669d-d421-422a-a217-3f4c1174851b' },
      { moves: "y2 R' U' R U' R U R2 U R2 U2 R'", id: '9983f39a-086d-4294-8ede-218c62bd82ad' },
      { moves: "z U' R' U R' U R U2 R U2 R2 U'", id: 'b2802eaa-87b3-4828-a48d-4e89c2429c5d' },
      { moves: "L' U' L U' L U L2 U L2 U2 L'", id: '3bf2fbdd-5cab-4c9c-a985-cba2ea583ed8' }
    ]
  },
  {
    name: 'ZBLL S 72',
    id: '027027e2-e63b-4dd8-91fa-bf5bf081f7b1',
    idMethod,
    puzzle,
    group: 'S6',
    setup: "R2' D' R2' U2' L F2' L' R' D R U' R U' R'",
    algs: [
      { moves: "R U R' U' R U R' U R U R U2 R' U' R U' R' U R'", id: '2001f8c9-153a-4137-afbf-1016517fe0cf' },
      { moves: "y' R' F R U R' U' R' F' R U' R' D' R U2 R' D R2", id: '363a6b30-5af3-439c-b1e3-268c2f94a03d' },
      { moves: "R U R' U R U2 R' U R U R' U R' U' R2 U' R' U R' U R", id: '6160943e-5dbf-48a3-9fc5-d54b88a37a11' },
      { moves: "y2 R' U' R U' R U R2 U' R2 U2 R' S R2 S'", id: '5b75f3c6-d8e1-4c40-8dbd-24f214f6a8bd' }
    ]
  }
]
