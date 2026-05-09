import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

const idMethod = 'EG_1_ALGS'
const puzzle = '222'

export const EG_1_ALGS: AlgorithmCollection[] = [
  {
    name: 'EG1 AS 1',
    id: 'b370a40c-120d-4b73-b1d8-01f6556a33f9',
    idMethod,
    puzzle,
    group: 'AS',
    setup: '',
    algs: [
      { moves: "y U2 B U' R2 F2 U' F", id: '27e59550-b4fc-497a-9497-5a98c111b26c' },
      { moves: "y R' F R2 U R' F' U' R U' R'", id: '4ea94023-0a2f-4b4e-b06d-1e703ce8b00d' },
      { moves: "y U' L' U' L U' F' L' U L2 F L'", id: 'be909a1e-f9d9-4696-a3bd-84cfa780d7f9' },
      { moves: "y L' U L2 F L' F' U' L F' L'", id: 'd684fa31-05a6-4fe1-b32f-c0025a0629da' }
    ]
  },
  {
    name: 'EG1 AS 2',
    id: 'b71b5fad-a4cb-4260-bbfb-ad2ed85d7e76',
    idMethod,
    puzzle,
    group: 'AS',
    setup: '',
    algs: [
      { moves: "U R U' R' F' U' F2 R U' R'", id: '4794f1e6-ab89-4400-93ab-2d8aed858add' },
      { moves: "U2 L' U' L F2 U' F' L' U' L", id: 'bc527cdd-4d54-4988-961f-57d3992bcd43' },
      { moves: "R U' F2 R U2 R U' F", id: '5ef9a9e7-2239-4ad2-a2b2-c5a2a3afd38d' },
      { moves: "F R U' R' U R' F' R U F' R U R' U", id: '7ceeb50b-a7ef-4f59-b3a1-b2fffcee5b00' }
    ]
  },
  {
    name: 'EG1 AS 3',
    id: '69dfe07b-8051-44f0-9a97-5477fcd39560',
    idMethod,
    puzzle,
    group: 'AS',
    setup: '',
    algs: [
      { moves: "F' R U R' U' R U R2 F' R", id: '4cf1b86c-4d20-44f8-b9dd-0b69603c296a' },
      { moves: "U' R U' R' U2 R' F R2 U2 R' F", id: '801fae1c-5c22-4aa3-aaaa-3de0cffe6be4' },
      { moves: "F' L F L' U' L F L2 U' L", id: 'd2e41c07-cb37-494c-bfc4-21fcbc9e56d8' },
      { moves: "F' L F L' U' R U R' L' U' L", id: '778d91b9-59e0-4e2f-9e67-e51c9b9dfdff' }
    ]
  },
  {
    name: 'EG1 AS 4',
    id: '24e87d15-0a27-426a-b1d2-c12aff548759',
    idMethod,
    puzzle,
    group: 'AS',
    setup: '',
    algs: [
      { moves: "R U' R' F' U' R U R' U' F", id: '0f4e69fe-adb6-481f-8f0e-9716745db808' },
      { moves: "U' R' F R F' U R U' R2 F' R F", id: '376864cd-2721-4b14-94cd-8d44ca93dcd9' },
      { moves: "U2 F U' L' U L U' F' L' U' L", id: '364a5462-26f9-4d12-b107-7ff2267705f7' },
      { moves: "U' R U R' U2 R' F' R F R' F R", id: '9b378592-7fc9-47e3-9268-6babdda83a5c' }
    ]
  },
  {
    name: 'EG1 AS 5',
    id: 'dfa569de-dd28-477c-8161-6bd3da06a19b',
    idMethod,
    puzzle,
    group: 'AS',
    setup: '',
    algs: [
      { moves: "y' R U R' F' U' R U R' U' R U R'", id: '01583e8f-8c53-4b56-aab2-ccd6f14d010a' },
      { moves: "y' U2 R' F R U' R' F R U R U R' F'", id: 'a004bf57-ad44-4509-aea4-184f13a0a5ec' },
      { moves: "d U2 L' U L U' L' U L U L F L' F'", id: 'ec590868-0229-482d-8d43-8ad2551c1eba' },
      { moves: "y' U R' F2 R U' R U R' F' R U' R' U", id: '3695634f-4cd0-4585-b3db-437f9e21bb2b' }
    ]
  },
  {
    name: 'EG1 AS 6',
    id: '2cea216a-12dc-4d9b-8f14-869d9fcc49be',
    idMethod,
    puzzle,
    group: 'AS',
    setup: '',
    algs: [
      { moves: "y2 R U' R2 F R U' R' F R F'", id: 'bb99e6d9-1ad7-46af-8c7f-d7fe352bd64f' },
      { moves: "y2 L F' L2 U L U' L' U L F'", id: '9edc40db-5ff2-415a-9cf4-2496b2f2822e' }
    ]
  },
  {
    name: 'EG1 H 1',
    id: '0d887874-27f8-42de-995a-14c5c6636df9',
    idMethod,
    puzzle,
    group: 'H',
    setup: '',
    algs: [
      { moves: "U' R' F R2 U' R' F R U R' F'", id: '2b0d76ae-b15c-4e1f-8dcf-694868b52aba' },
      { moves: "U' R' F R2 U' R2 U' F U R", id: 'f5e92cdb-9bcd-4a04-9303-1d3e969220a4' },
      { moves: "U R U' R2 F R F' R' F' R F", id: '03ebe007-3bf7-46c3-bb4e-e832c1299ee3' },
      { moves: "F' R' F R F R' F' R2 U R'", id: 'b19fd27e-a15e-4a9b-bd5f-1c0728978478' }
    ]
  },
  {
    name: 'EG1 H 2',
    id: '3189135b-f4e9-4d48-a762-1a09a040852e',
    idMethod,
    puzzle,
    group: 'H',
    setup: '',
    algs: [
      { moves: "U' F' U R U' R2 F2 R U' F", id: '6dbf6cba-fb62-4b61-82af-9e99b1945a5f' },
      { moves: "y' R2 U' R U' R' U R' U' R U' R2", id: 'f6b6f6ac-c538-476f-9c10-27c1af518a2e' },
      { moves: "F R U' R2 F U' F2 U R", id: '72d83524-293b-45f1-a369-f43cbc9307f5' },
      { moves: "y' R2 U2 R U' R2 U R2 U' R2 U R2 U R2", id: '46ae4e83-e43f-425a-bf58-326a83303420' }
    ]
  },
  {
    name: 'EG1 H 3',
    id: '61fd9e3c-dd7b-465c-80cf-a352d9d01d5f',
    idMethod,
    puzzle,
    group: 'H',
    setup: '',
    algs: [
      { moves: "U R' F R F' U2 F R U2 R' F", id: 'd59e3c5c-1419-4ae7-94b9-e238bfba8de8' },
      { moves: "R' U' R' F2 U F' R F'", id: '7b4f2aea-c35d-48bc-8faf-c0460416983f' },
      { moves: "U R U' R' F U2 x U' R' U2 R U'", id: '3597269c-e81e-4492-bb45-285d9bcc56d4' },
      { moves: "U' F U2 R U' R' F2 R' F2 R F'", id: '52318ff5-9e20-42e7-bf5f-cc5333d60370' }
    ]
  },
  {
    name: 'EG1 H 4',
    id: 'afe04165-68c1-4b05-ae75-accc96e400e7',
    idMethod,
    puzzle,
    group: 'H',
    setup: '',
    algs: [
      { moves: "U' R U R' F' R U R' U' R U R' U'", id: '2db4c7e7-1540-4907-8afb-370cb63332bd' },
      { moves: "F' U R' F R F' U F2", id: '5a6af955-f6fa-40da-b5a1-ae9d876ce421' },
      { moves: "U' R U R' F' R U R' U' R U R'", id: 'b3c4fcb9-9a0d-4bbf-a98a-1583dfee2b13' },
      { moves: "R' F R F' R' F R U' R' F R F'", id: '14a3ed5a-3448-4cc7-bf57-2ee08646edf6' }
    ]
  },
  {
    name: 'EG1 L 1',
    id: 'f53052a1-4a7f-47ae-8e81-28317982c30d',
    idMethod,
    puzzle,
    group: 'L',
    setup: '',
    algs: [
      { moves: "y R U' R' U R U' R2 F' R F", id: '188fb73f-faa5-4820-baef-a9786c40c447' },
      { moves: "y U R U R' F' R U2 R' U2 R U R'", id: '17086be5-247d-43ff-830a-5f71f95aed73' },
      { moves: "y U F R U' R' F' R U R' F' R U R'", id: '6aec1f2c-dab2-4bd1-8105-bfcbe4288768' }
    ]
  },
  {
    name: 'EG1 L 2',
    id: 'b95bb8aa-2c2b-46cb-b50a-ff8ca11798d1',
    idMethod,
    puzzle,
    group: 'L',
    setup: '',
    algs: [
      { moves: "y' U' R' F R U' R' F R2 U R' F' U2", id: 'c7e0d9bf-0a11-4528-a659-51a7ed278f86' },
      { moves: "y' U' R' F R U' R' F R2 U R' F'", id: '1554db74-94da-413c-bd52-9abafaa1a157' },
      { moves: "y' U2 x R' U' R U' R' U' R U' R' U2 R", id: 'b9b2bfda-b33c-4d53-82b4-629afa4d6ec9' },
      { moves: "y' U' L' U L U' L' U L2 F L' F'", id: '400e130b-7ec5-4ac9-8fd5-3ffca11f0bfd' }
    ]
  },
  {
    name: 'EG1 L 3',
    id: '4d5fd22a-2607-4b11-8424-1254c2ca25c7',
    idMethod,
    puzzle,
    group: 'L',
    setup: '',
    algs: [{ moves: "y R' U R2 U' R2 U' F R2 U' R'", id: 'edc4e646-b4ca-4bd6-9fc6-86695dcca92d' }]
  },
  {
    name: 'EG1 L 4',
    id: 'bac14773-13fb-48db-a7d3-63d4ef72ed90',
    idMethod,
    puzzle,
    group: 'L',
    setup: '',
    algs: [
      { moves: "y R' F R2 U R' F' R U2 R'", id: '73824f02-d689-4c9d-b49f-a63df727fe2d' },
      { moves: "y R U2 R' F R U' R2 F' R", id: 'b271536f-49b0-4858-b8c1-c9d43c6e2001' }
    ]
  },
  {
    name: 'EG1 L 5',
    id: '92e74c7f-ecbf-4368-a653-7b1f8e315dd8',
    idMethod,
    puzzle,
    group: 'L',
    setup: '',
    algs: [
      { moves: "y2 R U R' F' R U R' U' F R' F' R", id: 'c36bcea7-3bb6-40ee-aa42-9507b68dc4bf' },
      { moves: "y2 U' R U R' F' U R U R' U' R U R' U'", id: 'c5bf32d1-0e5a-4cc5-9e96-d04692c333f6' },
      { moves: "y2 U F' R' F R U' R U R' U' R U R' U'", id: 'ceaeb016-9579-4ed7-9b93-befd8d8f2409' },
      { moves: "y2 L' U L y' R U2 R U' R2", id: 'c9a53bd6-a0a4-4a72-9958-bb468039c9eb' }
    ]
  },
  {
    name: 'EG1 L 6',
    id: 'b7d13b15-ec82-402e-9e84-83f62ea6764c',
    idMethod,
    puzzle,
    group: 'L',
    setup: '',
    algs: [
      { moves: "y2 R' U2 F R U2 R U' R2 F", id: '4b70b222-10de-441a-beb3-c52abe7fd059' },
      { moves: "y2 U' L' U' L F L' U' L U F' L F L'", id: '93d9a456-f4e4-45e0-b766-d83d4ac32d26' },
      { moves: "y2 U2 F R U' R' U R' F' R U R' F' R", id: 'a46e0c66-2777-4a90-9ce7-1fe33749fd53' },
      { moves: "y2 R' F' R F U' R' F' R U R' F' R", id: '6f033d77-ec7d-4c66-a21f-406b02211390' }
    ]
  },
  {
    name: 'EG1 Pi 1',
    id: 'a2c8445c-3f01-4339-b574-ee82721a496b',
    idMethod,
    puzzle,
    group: 'Pi',
    setup: '',
    algs: [
      { moves: "y2 F2 R U R' U2 R U R' U' F", id: '63900c72-e276-4761-9d9f-683b7131bbaf' },
      { moves: "y2 U' F U' R' F R U' F2 R U R'", id: '79b48192-f737-409e-9058-acb6e4adcf36' },
      { moves: "y2 R2 B2 R' U R' U' R U2 R U' R2", id: '56d7d8d6-5cb6-43c7-b689-470dab136c35' },
      { moves: "U' R U' R2 F R2 U' R F2 R2 U'", id: '6fbb37f7-fa9f-4412-9845-6f0d1e66c09a' }
    ]
  },
  {
    name: 'EG1 Pi 2',
    id: 'd51a29e1-802f-4f59-80b0-44513bb12702',
    idMethod,
    puzzle,
    group: 'Pi',
    setup: '',
    algs: [
      { moves: "y' R U' R2 F R2 U' R'", id: '6086dc8f-b78a-43d7-8a83-0ffdb751a831' },
      { moves: "y' R' F R2 U' R2 F R", id: '69f021c1-0bdf-4794-8387-2473db1da229' },
      { moves: "y' R U R2 F' R2 U R'", id: '42ee4663-f282-4470-ad26-fbb832aebfac' },
      { moves: "y R' U R L U' L' R' U R", id: 'ffc42c4a-8410-4532-bbeb-67b04a36655a' }
    ]
  },
  {
    name: 'EG1 Pi 3',
    id: '406991a7-c099-4268-9382-2dcec78105c8',
    idMethod,
    puzzle,
    group: 'Pi',
    setup: '',
    algs: [
      { moves: "y' F R' F U' F2 R U R", id: '3650a61f-610a-4635-b074-6a0405b889e1' },
      { moves: "y' F' R U2 R' F' U2 F R' F' R", id: 'ac4f4bd8-d4db-4f2d-a433-79c21759eca4' }
    ]
  },
  {
    name: 'EG1 Pi 4',
    id: '254d8e68-9a8e-498b-aeef-6d1a1a0761ea',
    idMethod,
    puzzle,
    group: 'Pi',
    setup: '',
    algs: [
      { moves: "y' R U' R' U R U' R' F R U' R'", id: '33e8a3fb-8ccf-444c-bd78-9b47ad9f0014' },
      { moves: "y' F' R U R' U' R U R' F' R U R'", id: '105ffccd-83a9-4975-ae57-b5dd79a6b6a8' }
    ]
  },
  {
    name: 'EG1 Pi 5',
    id: '372a54ba-8e22-4a02-9839-e9a719425d39',
    idMethod,
    puzzle,
    group: 'Pi',
    setup: '',
    algs: [
      { moves: "R U' R2 F R U R U' R' U' R' F R F'", id: '03547bda-3be9-4714-84b5-6a1643e66bdf' },
      { moves: "U' R U R' U R U' R2 F' R F R' F' R", id: '5acb3ed2-7300-4206-ad54-a81fb5447058' },
      { moves: "R' U' R' F2 U' R U2 F2 R", id: '25bf7bc6-08d4-464b-ae68-4034744660c6' },
      { moves: "U' L F' L' F L F' L2 U' L U L' U L U'", id: '4d78dc32-f8d9-4a69-9d54-df306106658d' }
    ]
  },
  {
    name: 'EG1 Pi 6',
    id: '5d43448a-ad16-4003-929b-1be2b1df7a39',
    idMethod,
    puzzle,
    group: 'Pi',
    setup: '',
    algs: [
      { moves: "U' R' F' R U' R' F R2 U R' F' R U R'", id: '53e2d6e8-0756-42a2-bd13-d2922eb3c07c' },
      { moves: "U' R' F R F' R' F R2 U R' U' R U' R'", id: '7744d06f-8271-48bd-ba4e-625d1631a525' },
      { moves: "F R U' R' F R U2 R' U F'", id: '23c37830-c4c8-4806-8c17-7519e7b23886' },
      { moves: "U' F R' F' R U R U R' U' R' F' R2 U R'", id: 'bc1415b8-57e1-40cf-a8c6-271d6c6d93be' }
    ]
  },
  {
    name: 'EG1 S 1',
    id: '52edef7a-ea98-4604-8441-b319789f78dc',
    idMethod,
    puzzle,
    group: 'S',
    setup: '',
    algs: [
      { moves: "y2 U' L F' L2 U' L F U L' U L", id: 'e139f31e-771b-440c-875a-abd81694e945' },
      { moves: "y2 R U R' U F R U' R2 F' R", id: '262656c9-29a7-4bdb-828e-80a17dd8fc5d' },
      { moves: "y2 U F' R B2 U2 R F' R2", id: '73568786-3733-4c52-b2b1-8a6619711e85' },
      { moves: "y U R' F R2 F' R2 U2 R U2", id: 'a46d5aa3-a700-43f1-80cd-20c3eaac112c' }
    ]
  },
  {
    name: 'EG1 S 2',
    id: '33938e9c-58eb-46d8-8d3e-facb9159999f',
    idMethod,
    puzzle,
    group: 'S',
    setup: '',
    algs: [
      { moves: "R U R' F2 U F R U R'", id: 'beea414c-72db-4b2e-a25c-0220a72f8e92' },
      { moves: "U F R' F' R F R U' R' U R' F' R", id: '4c394484-7d12-4615-ac99-49b88179ec60' },
      { moves: "U R' F R F U F2 R' F R", id: '7af7faed-14e3-4d06-8d70-a73af0325165' }
    ]
  },
  {
    name: 'EG1 S 3',
    id: '6e0c4fb7-7597-418e-8e5f-0c30a6c3edfe',
    idMethod,
    puzzle,
    group: 'S',
    setup: '',
    algs: [
      { moves: "y2 F R' F' R U R' F' R2 U R'", id: '89a86499-c25c-44b8-ae64-567944f0bbed' },
      { moves: "y2 F L' U' L U L' U' L R U R'", id: '31b5d1cd-4942-4b61-acb1-431bc284a2f2' },
      { moves: "y2 U R' F R U2 R U' R2 F2 R F'", id: '71d147c4-40cf-44d2-bbcb-005ba667123d' }
    ]
  },
  {
    name: 'EG1 S 4',
    id: '127ced56-bd1e-4a5d-b54a-427b13151c0e',
    idMethod,
    puzzle,
    group: 'S',
    setup: '',
    algs: [
      { moves: "U F' R' F R2 U R' U' F R' F' R U", id: 'e249d545-3c45-445b-8357-9974e9422d30' },
      { moves: "U F' R' F R2 U R' U' F R' F' R", id: 'a6b6c47d-4daf-4ca4-bf2b-491dbc8355ba' },
      { moves: "F' U R U' R' U F R U R'", id: 'f074e464-8d4c-4a15-af95-a51aee12d9ff' }
    ]
  },
  {
    name: 'EG1 S 5',
    id: 'ddf08ba7-845d-465f-a19e-9ef3352ddb03',
    idMethod,
    puzzle,
    group: 'S',
    setup: '',
    algs: [
      { moves: "y R U' R' U R U' R' U F R U' R'", id: '8ac8f8ff-f9a1-41c4-8006-edf93d8a4184' },
      { moves: "y U2 R2 F U' R U' R U' B2 U2", id: 'ff9bd681-a5bc-42f5-93c1-5a1ff0b03158' },
      { moves: "y U2 L' U' L F U L' U' L U L' U' L", id: '35925d5b-ea8e-4afe-bd94-e0b7c26e99c9' },
      { moves: "y U2 R2 F U' R U' R U' F2", id: '4e2a7855-2369-4cd3-bada-699532c0dd76' }
    ]
  },
  {
    name: 'EG1 S 6',
    id: 'c41cda14-3964-4927-a552-87792941f352',
    idMethod,
    puzzle,
    group: 'S',
    setup: '',
    algs: [
      { moves: "R' F R2 U' R' U R U' R' F", id: '05288aa3-efed-4c0e-a1ba-b108b7d29eeb' },
      { moves: "L' U L2 F' L' U L F' L' F", id: '05f62cc2-6926-4240-9fa8-fdc6cdd3acd5' },
      { moves: "R' F R2 U' R' U L F' L' F", id: '2b940baf-967e-4b7e-bc0e-36c03cdb2495' }
    ]
  },
  {
    name: 'EG1 T 1',
    id: 'e00c1434-cd9f-46f0-8a1c-8322e5081aa2',
    idMethod,
    puzzle,
    group: 'T',
    setup: '',
    algs: [
      { moves: "F R U' R2 F' R U R' F' R", id: '3a3040cb-d7b7-4df0-a9a7-7fe9b62c9a76' },
      { moves: "F L F' L2 U' L U L' U' L", id: 'bcf4dea6-9756-416a-a8dc-6284c39636f9' },
      { moves: "U R2 U R U' R2 F R U2 R' F", id: '9ad208dc-0093-4c3e-a38f-4f68f7badb31' },
      { moves: "U2 R U2 R' U' R' F' R F R' F' R", id: 'a3f5e55c-19cc-4d16-88f8-8bd1cf286eb8' }
    ]
  },
  {
    name: 'EG1 T 2',
    id: '605d0dd0-2553-4d21-be00-7559bc2f7fa9',
    idMethod,
    puzzle,
    group: 'T',
    setup: '',
    algs: [
      { moves: "F' R' F R2 U R' U' R U R'", id: '87a3cb72-d067-4cff-a5af-e073ba93a089' },
      { moves: "U2 R U2 R' F R U' R' F' R U R'", id: 'da2c9641-8df6-4bed-9416-ecc1eb6e04c6' },
      { moves: "U2 R U' R' F R U' R' F R U R' F'", id: '55bd1213-4d94-4b87-a177-dea4ee5393e5' }
    ]
  },
  {
    name: 'EG1 T 3',
    id: 'e4cfafbc-942c-44ef-93a3-f4ca42526aa1',
    idMethod,
    puzzle,
    group: 'T',
    setup: '',
    algs: [
      { moves: "y R U' R2 F R U R U2 R'", id: 'ba4a4af1-8df3-49be-8f52-1b5e692045aa' },
      { moves: "y R U2 R' U' R' F' R2 U R'", id: '2172e94d-df3f-42e9-8a36-4c5c79438234' },
      { moves: "y U2 R' F R2 U' R' U' R' F2 R", id: 'd098e96f-77ff-447a-94e5-06b26617874c' },
      { moves: "y U2 L' U L2 F' L' U' L' U2 L U2", id: '5a7c9ef5-b68b-45f8-9d07-2e48f5013cf8' }
    ]
  },
  {
    name: 'EG1 T 4',
    id: 'b61e6a29-0278-4869-abb0-b50bf6fae829',
    idMethod,
    puzzle,
    group: 'T',
    setup: '',
    algs: [
      { moves: "y' U2 R' F R F' U R U' R' U F R U' R'", id: '2d479b76-860f-4e35-873b-976254f0f686' },
      { moves: "y' U' R' U F R2 U' R2 U' F U' R", id: '78330b85-ac64-4f2c-9f03-f2f76f5a3641' },
      { moves: "y' R2 B2 U' R' U' R U' R' U R'", id: '50cbcca7-aea4-4c9f-a9e6-25cb69fc8d4e' }
    ]
  },
  {
    name: 'EG1 T 5',
    id: 'e3b24810-6924-4236-85ab-a81381a94486',
    idMethod,
    puzzle,
    group: 'T',
    setup: '',
    algs: [
      { moves: "y' R' F' R2 U R' F' R U R'", id: 'f1f32468-5488-4d2d-96bf-702ed7e7dd1c' },
      { moves: "y' U2 R U R2 F' R F R' F' R", id: '70551ad1-dfad-4d03-846d-d6475df6cfc6' },
      { moves: "y' U2 R U R2 F' R F R' F' R U2", id: 'cb619fdd-5261-48e1-9217-f901250a06a2' }
    ]
  },
  {
    name: 'EG1 T 6',
    id: 'e1780e15-cfed-4251-89ec-37aa6cb03336',
    idMethod,
    puzzle,
    group: 'T',
    setup: '',
    algs: [
      { moves: "y' U' R U' R' U2 F R U2 R' F", id: '343b5e93-b8f3-47a5-995e-8f30dd15caa4' },
      { moves: "y' U R' U' R U F2 U' F2 R U R", id: 'bc9e6f06-5194-4100-ab5c-b41891d141f1' },
      { moves: "y' U R' U' R U F2 U' F2 R U R", id: 'ebca8395-1c67-4de0-b1cc-7e554379effa' },
      { moves: "y' R U R' F R U R' F U' R U' R'", id: 'a69e7635-a5a9-45b0-88ba-cd3bdcafe47d' }
    ]
  },
  {
    name: 'EG1 U 1',
    id: '571c137b-1e41-410d-9134-3925636a9445',
    idMethod,
    puzzle,
    group: 'U',
    setup: '',
    algs: [
      { moves: "y U2 R U R' U R U' R2 F' R2 U R' U", id: 'a58c25c8-c1c5-4bd0-b805-a899739e89c7' },
      { moves: "y U2 R U R' U R U R2 F R2 U' R'", id: '7626853b-b027-4338-8340-557a52a2fac9' },
      { moves: "y U2 R U' R2 F R2 U R' U' R U' R' U", id: 'bdf748d1-59f4-4d44-9bba-593e0efe861a' },
      { moves: "y U2 R U R2 F' R2 U' R' U' R U' R'", id: '9e10924b-7f5f-4c02-9d29-782ba770ee0a' }
    ]
  },
  {
    name: 'EG1 U 2',
    id: '67a601eb-92d7-4ada-887e-68de7e5510d6',
    idMethod,
    puzzle,
    group: 'U',
    setup: '',
    algs: [
      { moves: "U2 y R' U R' U' R U' R' U' F2 R2", id: '59791947-fab2-408f-8fd2-0fa772f7cfa4' },
      { moves: "U' F R2 B R2 F U F2 R2", id: '47f7b095-0df2-46ec-b025-755a235ac945' },
      { moves: "U' F R U' R' F x F' L' U' L' U", id: '4e3ea19c-99e4-487e-9f1e-e0657f8ff9ed' },
      { moves: "U' R U R' F' U' R U R' U' F R' F' R", id: '3eaa35b6-4d3c-4597-955e-cfb2f1037c8d' }
    ]
  },
  {
    name: 'EG1 U 3',
    id: 'be8f07bd-ab5e-48c2-b8b7-5fe678009453',
    idMethod,
    puzzle,
    group: 'U',
    setup: '',
    algs: [
      { moves: "F' U2 R U2 R' U2 F", id: '6f033f54-c7ca-45c6-b2e1-5d86b43b6c74' },
      { moves: "U2 R U' R2 F2 R F' U R U R'", id: '9604b9df-0805-471d-b7f0-18da03cf8a5d' },
      { moves: "U y' R U R' F R2 F' R U' R'", id: 'b7c4d548-cdad-4bec-a4d4-ac2847c3509e' },
      { moves: "R U R' U F' R U R' U' R U R2 F2 R", id: 'cc611dcb-092f-4130-ae1f-a607801b7c20' }
    ]
  },
  {
    name: 'EG1 U 4',
    id: '2447d99d-1be4-411c-97d0-b413d4fa29c8',
    idMethod,
    puzzle,
    group: 'U',
    setup: '',
    algs: [
      { moves: "y R' F R F' R' F R2 U' R'", id: 'f9fe5b1d-94ec-434f-b17f-855c57d554bb' },
      { moves: "y U2 R U' R' F R U' R2 F R", id: '641b95ee-0d56-4706-9415-608f384a6860' },
      { moves: "y U2 L F' L' F L F' L2 U L", id: '628bdcaf-01e4-4209-8f31-c7646065f8e4' }
    ]
  },
  {
    name: 'EG1 U 5',
    id: 'c6102bf1-ad42-4948-a1f4-28b212ae736c',
    idMethod,
    puzzle,
    group: 'U',
    setup: '',
    algs: [
      { moves: "U2 R U' R' U R U' R' U' F R U' R'", id: 'c394679f-b3d1-4a75-b189-2731112729e9' },
      { moves: "U R' F R F' U R U' R' F R U' R'", id: '1625665a-c2db-4f8b-9d6f-c252a43e7118' },
      { moves: "U2 L F' L' U L F' L' U L' U' L F", id: '78410d3c-2e3a-4273-9c13-d37ef0838223' },
      { moves: "F U' R' F2 R F' U2 F'", id: 'e6291439-551e-4992-bf54-c94e7d55e34a' }
    ]
  },
  {
    name: 'EG1 U 6',
    id: '239b554a-2bb7-4b1d-a570-377c6492fca0',
    idMethod,
    puzzle,
    group: 'U',
    setup: '',
    algs: [
      { moves: "y2 R' F R U' R' F R U' R U R' F' U2", id: '0c43f205-25c2-4cff-958a-1f9c39ad88a3' },
      { moves: "y2 R' F R2 U' R' U y' R U R'", id: '68d960e7-5603-4122-b44c-c82d3ce8442b' },
      { moves: "y2 U L F' L' F U' L' U L F' L' U L", id: '281e99ad-2d96-47dc-be4e-470d0370f842' },
      { moves: "y2 U2 F' U L F2 L' F U2 F", id: 'dbd429b4-84d8-43f5-842e-f5dadaf5b2da' }
    ]
  }
]
