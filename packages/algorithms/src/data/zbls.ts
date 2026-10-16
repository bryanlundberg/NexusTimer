import type { AlgorithmCollection } from '../types'

const idMethod = 'ZBLS_ALGS'
const puzzle = '333'

export const ZBLS_ALGS: AlgorithmCollection[] = [
  {
    name: 'ZBLS 1.1',
    id: 'c9ee8196-8cfe-435d-b7da-aef7bf45fc21',
    idMethod,
    puzzle,
    group: 'ZBLS 1',
    algs: [
      { moves: "y R' F' R U2 L R' F' L' R", id: 'bbd8c85b-aa91-4d1a-bcad-19e82d311aef' },
      { moves: "y' r' U' r U2 r' R U' R' r", id: '0fb5fae4-14a0-4519-a78f-e472c2e238d3' },
      { moves: "U2 R' F R F' U2 R' F R F'", id: 'fee20835-70c7-4b2d-bc57-cabcede9e1db' },
      { moves: "y R' F' R U2 M' U' M", id: '8fa647e3-0215-43f0-93b5-11b016f0af3a' },
      { moves: "M' U R U' r2 U2' R U R' U r", id: 'd746502e-0660-4139-8f48-0f6dd10055ce' }
    ]
  },
  {
    name: 'ZBLS 1.2',
    id: '1567e01b-6f0c-4e5e-a607-cdcf930ed21a',
    idMethod,
    puzzle,
    group: 'ZBLS 1',
    algs: [
      { moves: "(U2) R U' B U' B' R'", id: 'fb21ae3d-e335-46a8-8e44-cc056a90de39' },
      { moves: "U2 x U R' U' R2 x' U2 R'", id: 'a279ac4b-a10d-45b1-aa89-4690620ce069' },
      { moves: "M U R U' R' U' M'", id: '3f0f447a-99bd-4dbb-91c9-3d0b5568fb43' },
      { moves: "U S' R U' R' S", id: '0e6e348a-a3cd-4487-a631-bc3837d24f50' }
    ]
  },
  {
    name: 'ZBLS 1.3',
    id: '43500101-a8bc-4468-9d26-fe6a3342d281',
    idMethod,
    puzzle,
    group: 'ZBLS 1',
    algs: [
      { moves: "R' F R2 U R' U' F'", id: '62394d74-cb43-4698-b6b4-afc8147a9a70' },
      { moves: "U2 R U' R' U' R' F R F'", id: '1a84fb41-f775-4897-850b-5feeb4a7bf33' }
    ]
  },
  {
    name: 'ZBLS 1.4',
    id: '1acd64ba-4d03-4cb9-b386-0a4ba3be7777',
    idMethod,
    puzzle,
    group: 'ZBLS 1',
    algs: [
      { moves: "R' U' F U R2 U' R' F'", id: '46801872-2f18-479b-8b17-c64ad0484fab' },
      { moves: "U R U R' U2' R' F R F'", id: 'c8a0c53f-25a6-4341-a238-a9ddb9bd72d7' },
      { moves: "U R U R' U2 M' U R U' r'", id: '8fe2e72e-93dd-4a9b-97ee-3d5a18e4494e' }
    ]
  },
  {
    name: 'ZBLS 1.5',
    id: 'ded74521-7973-433c-a586-3c8e46b03f16',
    idMethod,
    puzzle,
    group: 'ZBLS 1',
    algs: [
      { moves: "(U) R B U' B' R'", id: '96c69649-8b89-4e77-b7ac-6abdaa049edf' },
      { moves: "y U F R U' R' F'", id: '098698b8-8e2f-4fa5-9a4f-bbcee3ab484e' },
      { moves: "U2' R' F R F' R U2 R'", id: 'f6e8c4e7-e00e-4f41-bee9-b3b4c2b18819' },
      { moves: "U R' F R F2 U F", id: '2ee3feb7-dcf1-4216-bda9-7ffaa51c5835' },
      { moves: "(U2) F2 r U r' F", id: '5478f77c-701b-467d-8e58-b2d9bb233053' },
      { moves: "y' U2' R2' F R F' R", id: 'de0fa467-c3a6-42bf-a819-f4d539e231da' }
    ]
  },
  {
    name: 'ZBLS 1.6',
    id: '754eedf7-7c6c-415a-8d95-b7cf41987c7f',
    idMethod,
    puzzle,
    group: 'ZBLS 1',
    algs: [
      { moves: "R' F R F'", id: 'd16bfa6c-88ce-410b-beb1-65416f52cc5f' },
      { moves: "x R' U R U' x'", id: '049bc1d9-e203-4c16-98ac-1ed2ef3b1990' },
      { moves: "M' U R U' r'", id: '7ec585d4-bf10-4c68-bd29-e0cb8d7226e7' }
    ]
  },
  {
    name: 'ZBLS 1.7',
    id: 'd4582577-657e-4146-bc4c-6b91b464b290',
    idMethod,
    puzzle,
    group: 'ZBLS 1',
    algs: [
      { moves: "(U) F' L' U' L F", id: '4a9e27fc-f75b-4e8a-b63f-43579aad21ea' },
      { moves: "R' U' F U R U' F'", id: 'b8391ac8-9124-434e-aac2-3b1c20eeb63a' },
      { moves: "U2 R U2 B U B' U' R'", id: '697cd8e9-e502-4065-b8de-f9566c58cd5e' }
    ]
  },
  {
    name: 'ZBLS 1.8',
    id: 'c1097e83-0cea-4e24-ac4d-7c7714f37822',
    idMethod,
    puzzle,
    group: 'ZBLS 1',
    algs: [{ moves: "(U) R U' R'", id: '006f27b0-087a-40fe-b2c3-c2a893189047' }]
  },
  {
    name: 'ZBLS 2.1',
    id: 'd368dfff-7688-410d-bdcd-cc9824570459',
    idMethod,
    puzzle,
    group: 'ZBLS 2',
    algs: [
      { moves: "L F L' U2 R' L F R L'", id: 'ca7fa088-cbc2-47c7-a011-59ebbdf1cac1' },
      { moves: "r U r' U2 M' U M", id: 'c8e17698-b3b2-4c66-bfe6-58fded931f58' },
      { moves: "r U r' U2 r R' U R r'", id: '7775489b-8da2-4ad4-87e3-9749d765a061' }
    ]
  },
  {
    name: 'ZBLS 2.2',
    id: 'ba201715-1c6a-415b-94ef-f6c2166bb9ca',
    idMethod,
    puzzle,
    group: 'ZBLS 2',
    algs: [
      { moves: "(U2) F' U L' U L F", id: '9ce6a2e5-13ce-4488-94a4-a35803f59752' },
      { moves: "U' R' D' r U r' D R", id: 'd41556ca-7b1d-4f16-a04f-007a701ab6ba' },
      { moves: "U' F2 r U r' U F", id: '5a82cb86-5503-4db8-a0fd-a61bb06dd630' }
    ]
  },
  {
    name: 'ZBLS 2.3',
    id: 'c8a05db1-374f-49d9-82fd-4431ad655861',
    idMethod,
    puzzle,
    group: 'ZBLS 2',
    algs: [
      { moves: "F R' F2 U' F U R", id: '59d7d300-fb69-44a2-87fa-cf172a2b80da' },
      { moves: "y L F' L2 U' L U F", id: '7fc41148-56c7-440c-abeb-d8170c10cbac' },
      { moves: "R U2 R D r' U' r D' R2", id: 'b6ff19cb-5b76-4af5-bd9c-c231c4ee7a59' }
    ]
  },
  {
    name: 'ZBLS 2.4',
    id: '438af39d-aaa7-49cc-a19f-59a145af8750',
    idMethod,
    puzzle,
    group: 'ZBLS 2',
    algs: [
      { moves: "F U R' U' F2 U F R", id: 'd5147fac-84a2-42e0-841c-61565e415ae6' },
      { moves: "y L U F' U' L2 U L F", id: '1b426138-3c14-48e5-907f-2cd2c778ebe7' },
      { moves: "U R' D' r U' r' D R", id: 'd599a083-8170-435a-9cf8-ddb0da6944b9' },
      { moves: "U' R2 D r' U r D' R2", id: '58a6c44f-4420-4e69-9b1a-56a2fbd6b5ce' }
    ]
  },
  {
    name: 'ZBLS 2.5',
    id: 'dd3cf1eb-6bbf-4da6-83ce-1111207c0e49',
    idMethod,
    puzzle,
    group: 'ZBLS 2',
    algs: [
      { moves: "(U') F' L' U L F", id: '7f024280-7863-46e5-88c7-7a05eeea54d4' },
      { moves: "U' r U' r' U r U r'", id: '4455c606-06dc-48c9-90fe-dbb2bb6bccb1' },
      { moves: "U2 R2 B' R' B R'", id: '502f58a4-104d-4d46-b709-7e89fb26fa68' },
      { moves: "U2 l R U' R' U l'", id: '1b9ae7b0-e346-4965-be84-3447b414218e' }
    ]
  },
  {
    name: 'ZBLS 2.6',
    id: '71465c3c-d456-4d8d-9ac2-b0045de442a1',
    idMethod,
    puzzle,
    group: 'ZBLS 2',
    algs: [
      { moves: "F R' F' R", id: '9d245f5e-0c18-4185-b0f9-6659801b3b4f' },
      { moves: "r U R' U' M", id: '98414ac0-885b-4470-abf4-0b410afca3c2' },
      { moves: "x U R' U' R x'", id: '0deddc30-faf9-4066-ac58-c3971207ff66' }
    ]
  },
  {
    name: 'ZBLS 2.7',
    id: '6563b499-4b22-4845-a1e3-98d0c33fc26c',
    idMethod,
    puzzle,
    group: 'ZBLS 2',
    algs: [
      { moves: "(U') R B U B' R'", id: '697bf60c-eb1f-4451-9873-40783e5245e4' },
      { moves: "y U' F R U R' F'", id: '7c9e9246-aab2-47d7-af82-8f429b098a77' },
      { moves: "d' F R U R' F'", id: 'cb217f4f-9fdc-4151-b445-019868b6c261' },
      { moves: "U2' R U R' U' R' F R F' R U' R'", id: 'e5923f6e-b19f-4b12-bb44-788d59430c36' }
    ]
  },
  {
    name: 'ZBLS 2.8',
    id: '205f12f1-1eab-4fc2-8467-be55828863fb',
    idMethod,
    puzzle,
    group: 'ZBLS 2',
    algs: [
      { moves: "(U') F' U F", id: 'b8077c4f-e701-48ab-a69f-5de8b74649d0' },
      { moves: "y' U' R' U R", id: '66deb0d6-f2bb-456b-b977-a3c8a7c0cdb9' },
      { moves: "y U' L' U L", id: '71fb2ab3-7eaf-493b-be42-2db05a26b063' }
    ]
  },
  {
    name: 'ZBLS 3.1',
    id: '03f427bf-bab8-4364-8c7a-05ea366d4019',
    idMethod,
    puzzle,
    group: 'ZBLS 3',
    algs: [
      { moves: "F D B' R' B D' F2 U' F", id: 'c2d2b165-8074-41a7-bdeb-248a24f24d85' },
      { moves: "R U' R' U F' L' U' L U' F", id: 'bb4c1122-a6b8-4dd0-839e-385cb2635023' },
      { moves: "R' F R2 U' M' U2 r' U' F'", id: 'ce59b092-a74b-4175-b3c4-bdee4cccfad8' }
    ]
  },
  {
    name: 'ZBLS 3.2',
    id: '4c0db153-7b14-4fcf-b517-274f512d5956',
    idMethod,
    puzzle,
    group: 'ZBLS 3',
    algs: [
      { moves: "U2 F' U' L' U L U F", id: 'fe757f02-da4d-4275-b58e-7258c05fd938' },
      { moves: "U2 R' D' r U' r' D R2 U' R'", id: 'f05f0cf0-169f-46cd-8dd3-13f046c05a63' }
    ]
  },
  {
    name: 'ZBLS 3.3',
    id: '5ef7dd02-b4c1-4247-9b62-3216d163a6a7',
    idMethod,
    puzzle,
    group: 'ZBLS 3',
    algs: [
      { moves: "F' U2 L' U L F", id: '8db97660-b51a-4c68-a555-38a2e8b4b629' },
      { moves: "U R2 D r' U' r D' R2", id: 'fe45cfa4-c234-4eb4-898c-985082206704' }
    ]
  },
  {
    name: 'ZBLS 3.4',
    id: '6cc10e9e-8d29-47f9-90f8-3bd0ba87a48b',
    idMethod,
    puzzle,
    group: 'ZBLS 3',
    algs: [
      { moves: "F' U' L' U' L U F", id: 'a8313f9b-c329-4540-a567-10bd908a575b' },
      { moves: "y' S' (R' U' R) S", id: 'e6b495d3-5650-41b5-8dec-fc0c8ac4e55e' }
    ]
  },
  {
    name: 'ZBLS 3.5',
    id: '6be27dcb-ce5f-4f5c-9f8b-8bb7a0d10778',
    idMethod,
    puzzle,
    group: 'ZBLS 3',
    algs: [
      { moves: "(U) R U2 R' F R' F' R", id: '39a6fe71-10f2-45d2-97dd-9b842ca88f2a' },
      { moves: "U R U2 R' x U R' U' R x'", id: '2e408d45-f2fd-4476-a90f-86d18df705b5' },
      { moves: "S U R U' R' S'", id: '8080acde-2b39-47ab-b559-a832d249b0c2' },
      { moves: "R U' R' F' r U' r' F2", id: 'd0e7bf37-5cd3-4895-b293-50c2cfea2f49' },
      { moves: "M y' R' U' R U S'", id: '0669e251-29bd-4202-a224-84176b4e04c8' }
    ]
  },
  {
    name: 'ZBLS 3.6',
    id: 'ffd50cb8-54f4-45be-ac6f-db6f13d0ffda',
    idMethod,
    puzzle,
    group: 'ZBLS 3',
    algs: [
      { moves: "(U) R U2 R' U' F' U F", id: 'd51a9fa7-93be-4eb7-ab8c-b0b3d82a5beb' },
      { moves: "U R U2 R' U' y' R' U R", id: 'c01783cf-fd1e-4227-8919-5f8fd82ca2a8' },
      { moves: "F' r U' r' F2 R U' R'", id: 'd8c9f276-1dec-4675-a575-038cbe0b900f' }
    ]
  },
  {
    name: 'ZBLS 3.7',
    id: '20f4d1b6-eec8-4b29-ba5b-a8a1ec0c8347',
    idMethod,
    puzzle,
    group: 'ZBLS 3',
    algs: [
      { moves: "F' U F U2 F R' F' R", id: '98249374-9a24-45e8-872e-6e2c89d38999' },
      { moves: "y' U2 r' U r U r' U' r", id: '13885723-ee59-4fd0-b8ef-8d6e3c96bad0' },
      { moves: "U' R' F R U R U' R2 F' R", id: '1ee6b8a4-a049-437f-8b4f-30c97aa81882' }
    ]
  },
  {
    name: 'ZBLS 3.8',
    id: '8fd1018a-636a-4d4c-9558-5c5e2b9d7952',
    idMethod,
    puzzle,
    group: 'ZBLS 3',
    algs: [
      { moves: "F' U' F", id: 'eee208d1-636b-46fe-8dc9-6d9c9c76cc4d' },
      { moves: "y' R' U' R", id: '047c9309-66a4-4969-b6d6-2f7de52155b6' },
      { moves: "y L' U' L", id: '847a5877-fc5f-4b1b-919e-572ff85bae5e' }
    ]
  },
  {
    name: 'ZBLS 4.1',
    id: '417c13f8-1e47-4868-9bc8-8f8e0ba2f887',
    idMethod,
    puzzle,
    group: 'ZBLS 4',
    algs: [
      { moves: "R' D' L F L' D R2 U R'", id: '8e8a964e-2930-4e93-91a4-f4d984ab7244' },
      { moves: "y L' U L U' F R U R' U F'", id: '359f79ae-8712-48d9-833e-bc015d45688a' },
      { moves: "R' D' r U' r' D R2 U R'", id: '28fbcd15-bac3-4766-9b07-d20289079cb9' },
      { moves: "R U' r' U r U2' r' U' r U2' R'", id: 'd4d7fb54-9a9e-4868-80e5-de5092f9b7e4' },
      { moves: "R U' R2' F R F' U2 R' F R F'", id: '50726c14-e81b-4f91-b33e-2b54c850f4f7' }
    ]
  },
  {
    name: 'ZBLS 4.2',
    id: '6203c89d-ea12-4f8f-87b6-465f3c498028',
    idMethod,
    puzzle,
    group: 'ZBLS 4',
    algs: [
      { moves: "(U2) R U B U' B' U' R'", id: '184f4452-12d0-4740-b11a-a59682bc3264' },
      { moves: "y U2 F U R U' R' U' F'", id: '5914c4f9-1fa3-4989-a9db-84828c6436bc' },
      { moves: "R U' R2' F R F' R U2' R'", id: '0b164cf0-7795-4755-8234-42a6c2c6bff9' },
      { moves: "R U' R' F2 r U r' F", id: '234dd37d-aaba-420e-a108-0f9c6ecb74c4' }
    ]
  },
  {
    name: 'ZBLS 4.3',
    id: '4bda552e-7a70-40a6-88a5-ece3347b0b10',
    idMethod,
    puzzle,
    group: 'ZBLS 4',
    algs: [
      { moves: "R U2 B U' B' R'", id: '756c78b4-1f5a-464b-8c2d-6175a9273ca3' },
      { moves: "y F U2 R U' R' F'", id: '7b32eb0c-b755-4f94-92d0-ffc351cd243e' },
      { moves: "U F U R U' R2' F' R", id: '37c03ad7-782f-42b2-8b54-78f95ea0b75e' },
      { moves: "R U R' U' r' U2 R U R' U r", id: '9cae5903-aa08-4584-be52-3ff99685cbb7' }
    ]
  },
  {
    name: 'ZBLS 4.4',
    id: 'fd5c0bde-50bc-4372-abae-a3260f5b4546',
    idMethod,
    puzzle,
    group: 'ZBLS 4',
    algs: [
      { moves: "R U B U B' U' R'", id: '0a6778c5-d873-4429-b58a-b36d91cef6f5' },
      { moves: "R U R' U' F R U R' U' F'", id: '84c1ebc5-d6a0-46ef-ba6b-320750ba40f7' },
      { moves: "y F U R U R' U' F'", id: '272762db-6af0-4730-8249-3dceb2c1a74f' },
      { moves: "S' R U R' S", id: '09bc6695-2ade-47ae-bc1e-da0ff4141436' },
      { moves: "R U y R U R' U' F'", id: 'eb5011b9-d85f-459a-85a8-6c509442a8f1' }
    ]
  },
  {
    name: 'ZBLS 4.5',
    id: 'ec173cf6-375c-41dc-9b16-14976d56beba',
    idMethod,
    puzzle,
    group: 'ZBLS 4',
    algs: [
      { moves: "(U') F' U2 F R' F R F'", id: 'fdf7dfdc-762e-4643-8c25-091be9725f5d' },
      { moves: "U M U' R U R' M'", id: 'fe12b815-47a5-4a57-a656-74c6f8bb354c' },
      { moves: "R U2 R' U' R' F R F'", id: '147d4360-5add-40e3-a814-f98eabdd5d59' },
      { moves: "R U R' F R U R' U' F'", id: '13219513-7122-4365-9306-cfed3e68b0a1' }
    ]
  },
  {
    name: 'ZBLS 4.6',
    id: 'e1692a5f-c9d1-4dba-809e-0a32d4536889',
    idMethod,
    puzzle,
    group: 'ZBLS 4',
    algs: [
      { moves: "(U') F' U2 F U R U' R'", id: '81f7de0d-2bdc-4c0c-87c6-3bb5daf7d62a' },
      { moves: "y' U' R' U2 R y U R U' R'", id: '9f3ba64e-4a49-41a7-89ad-d26d4a4f86f7' },
      { moves: "R U R' F U R U' R' F'", id: 'c292c550-259e-4e2f-91a1-a38499715f31' }
    ]
  },
  {
    name: 'ZBLS 4.7',
    id: '3996d9c0-5af7-474e-80e9-c5574d5e0625',
    idMethod,
    puzzle,
    group: 'ZBLS 4',
    algs: [
      { moves: "R U' R' U2 R' F R F'", id: 'bfb25d49-1b0a-4c22-af39-fc78cb598a33' },
      { moves: "U2 r U' r' U' r U r'", id: '05e39944-d6dd-4126-ba31-567ccb8fc71c' }
    ]
  },
  {
    name: 'ZBLS 4.8',
    id: '034bf33e-50f0-451e-a614-1c692b4143fb',
    idMethod,
    puzzle,
    group: 'ZBLS 4',
    algs: [{ moves: "R U R'", id: 'fc53e41e-a1f7-4493-acc0-8aaa860802d4' }]
  },
  {
    name: 'ZBLS 5.1',
    id: '5c8214cc-da6f-4f03-ba77-844750ae01a3',
    idMethod,
    puzzle,
    group: 'ZBLS 5',
    algs: [
      { moves: "(U') F' U F R B U2 B' U R'", id: 'e03f3edb-6906-424c-9c50-c9147cd10b0a' },
      { moves: "U' r U' r' U2 r U r' R U2 R'", id: 'd8d33e01-2849-4852-a6b8-d9b5b6c74f7e' }
    ]
  },
  {
    name: 'ZBLS 5.2',
    id: 'c432b609-bcfd-4b66-89bf-3461eaf0747f',
    idMethod,
    puzzle,
    group: 'ZBLS 5',
    algs: [
      { moves: "(U') L F R' F' L' R2 U2 R'", id: '1c5e2c29-da2b-4df3-bad1-1b21f6845e5a' },
      { moves: "U' r U R' U' r' R2 U2 R'", id: '6058bce8-9faa-4e5d-a461-e3ef0e4dd64f' }
    ]
  },
  {
    name: 'ZBLS 5.3',
    id: '134215d3-226a-4fc1-ae8d-521c1e663eb9',
    idMethod,
    puzzle,
    group: 'ZBLS 5',
    algs: [
      { moves: "(U2) R B U B' U2 R'", id: '7aa7ebde-54ac-4df0-b29a-091258d9ea69' },
      { moves: "y U2 F R U R' U2 F'", id: 'e0e6a9fb-9d44-49f5-8906-08e1c59c2fe5' },
      { moves: "U' F R U R' U' F' R U2 R'", id: 'f6dd1539-fa81-465a-bee4-d711ead42fba' },
      { moves: "U R U' R' U' R' F R F' R U R'", id: 'a2ffa58b-53c2-4506-ac22-fbfb8f00437f' }
    ]
  },
  {
    name: 'ZBLS 5.4',
    id: 'a6683241-8e05-4890-8677-d8a01a46c6bb',
    idMethod,
    puzzle,
    group: 'ZBLS 5',
    algs: [
      { moves: "(U') R U R' U R' F R F'", id: 'ab4622d5-1bab-4d9f-a271-50f90b3a9b0d' },
      { moves: "y U' F U R U' R' U F'", id: '0f2496b2-a698-4375-b281-71ec4a6d887a' }
    ]
  },
  {
    name: 'ZBLS 5.5',
    id: '08496b5e-0880-4530-85e9-494fe775f343',
    idMethod,
    puzzle,
    group: 'ZBLS 5',
    algs: [
      { moves: "(U2) R' F R F' U2 F' U' F", id: 'f6378ca6-cf59-434d-9e9d-1f8279af5f29' },
      { moves: "y' U r' U R U' R' U' r", id: 'd19fd8e0-1224-4816-b9ea-7f02ba3e697a' },
      { moves: "r U' r' U' r U r' F' r U' r' F2", id: 'b54188ac-096d-48cc-825f-8960e834ba5e' }
    ]
  },
  {
    name: 'ZBLS 5.6',
    id: '11a1805a-926b-450f-bc97-19b5224b9bc7',
    idMethod,
    puzzle,
    group: 'ZBLS 5',
    algs: [
      { moves: "F' B' U' R' U R B F", id: '1f1de01e-5708-4765-bd14-b15c98980715' },
      { moves: "y F R U2 R' U' R U2 R' F'", id: '15b5dec0-26dc-46fc-b5f2-1da9e9bb258d' },
      { moves: "R' D' R U R' D F R F'", id: '40d5641b-bce9-4b2d-b9ee-a4f122d75a24' }
    ]
  },
  {
    name: 'ZBLS 5.7',
    id: '4352df55-9d6f-4384-bf0d-d8422a7c51b5',
    idMethod,
    puzzle,
    group: 'ZBLS 5',
    algs: [
      { moves: "B L F' U' F U L' B'", id: '1aed310f-c3b7-44f3-9cfe-28ef83a4baa2' },
      { moves: "U2 F' L' U2 L U' L' U2 L F", id: '16affae6-1922-4f34-aa59-633efdc63346' },
      { moves: "U2 R U' R' U2 R U' R' U R' F R F'", id: '31d633b2-fd7f-4196-9188-4ab74e6fc346' },
      { moves: "R U' R B2 r' U' r B' R2", id: 'd2f2ef87-fefc-4161-b0b1-ed4106d14c0c' }
    ]
  },
  {
    name: 'ZBLS 5.8',
    id: '96f7e99c-e454-493f-95fa-c342ca05e8c0',
    idMethod,
    puzzle,
    group: 'ZBLS 5',
    algs: [{ moves: "U' R U R' U' R U2 R'", id: 'bb4125ce-1094-46df-aeda-2a0b06e4d921' }]
  },
  {
    name: 'ZBLS 6.1',
    id: 'ca71ca9d-d336-439f-af5c-49dbb5eadb39',
    idMethod,
    puzzle,
    group: 'ZBLS 6',
    algs: [
      { moves: "(U) R U' R' F' L' U2 L U' F", id: 'e52d1ed2-5fe6-422a-92fc-875b649abbe1' },
      { moves: "y' U r' U r U2 r' U' r R' U2 R", id: '2c263093-78c1-4479-b310-295ada88a423' },
      { moves: "U M' U M U2 r U R' U M", id: 'a7f5c21b-821b-4627-8f81-9c0915241133' },
      { moves: "U R U R D r' U' r D' R2' U' R U R'", id: 'e7f8b86e-e8e2-4d78-a962-71c95d6f8c12' },
      { moves: "U R U' R' d' L' U L2 F' L' F", id: '7495b7d8-65a8-44cf-91be-745221f8ec81' }
    ]
  },
  {
    name: 'ZBLS 6.2',
    id: '47db9759-9224-4786-a267-f970ecc0abfe',
    idMethod,
    puzzle,
    group: 'ZBLS 6',
    algs: [
      { moves: "(U) B' R' F R B F2 U2 F", id: '73a27cf9-1860-4d9d-946f-8a6d048cfead' },
      { moves: "y' U r' U' R U r R2 U2 R", id: '36d9452a-8b26-4aed-8596-9b9749495df6' },
      { moves: "U' R' F R F' R U2' R2' F R F'", id: '9a65b622-ac89-4c3a-91f7-d0b12bf680c8' },
      { moves: "R2 D r' U' r D' R' U R'", id: '82587c2e-7886-497a-b167-1823b9ad26e0' }
    ]
  },
  {
    name: 'ZBLS 6.3',
    id: 'ad6c1126-eeb7-4a97-929d-e6fc8c79acd4',
    idMethod,
    puzzle,
    group: 'ZBLS 6',
    algs: [
      { moves: "(U2) F' L' U' L U2 F", id: 'e0232d9e-1c5c-428c-8f58-3aca66501ab2' },
      { moves: "U2 y' R' F' U' F U2' R", id: 'ad7d0f61-6ad8-4b38-aaea-96bb870fb2a5' },
      { moves: "U' R' F2 R U' F U' R U2 R' F2", id: 'd873d70d-a01e-4ba1-ac29-379fb3684b63' },
      { moves: "U2 F' L' U' L U2' F", id: '34cb470d-7d9b-4e5a-a6dd-05fbeff0d25e' },
      { moves: "U R U R2' F R F' r U' r' U' r U r'", id: '6d127e06-0c72-4783-ab30-16233f8befcb' }
    ]
  },
  {
    name: 'ZBLS 6.4',
    id: 'bc9458e4-ea74-4686-85f7-17fcef5e09fa',
    idMethod,
    puzzle,
    group: 'ZBLS 6',
    algs: [
      { moves: "(U) F' U' F U' F R' F' R", id: 'cabab9e7-9409-4405-a086-08b144ec3c86' },
      { moves: "U F' U' L' U L U' F", id: '5d12a824-c3ae-460b-9dec-adfba02ac255' },
      { moves: "y U L' U' L U' L F' L' F", id: '2b5aa8cd-0ab6-4f6e-9943-0e868c3b9044' },
      { moves: "F R U' R' U' R U R' F2 U F", id: '690c89c4-9eba-4989-85ea-442fe03e9d6a' }
    ]
  },
  {
    name: 'ZBLS 6.5',
    id: '7af5c44e-e5b7-49f3-9826-74c6ee24788f',
    idMethod,
    puzzle,
    group: 'ZBLS 6',
    algs: [
      { moves: "(U2) F R' F' R U2 R U R'", id: 'b0b74c8d-0a0c-4780-ae7e-b21cc7523378' },
      { moves: "U' r U' R' U R U r'", id: 'f55f81d6-ca44-4ac3-a86b-5fb46e213105' }
    ]
  },
  {
    name: 'ZBLS 6.6',
    id: '81746a73-09d8-40b4-9bbf-02338e01864f',
    idMethod,
    puzzle,
    group: 'ZBLS 6',
    algs: [
      { moves: "R L U F U' F' L' R'", id: '128b827a-5edb-4ce2-b3da-a6203b6005e1' },
      { moves: "F' L' U2 L U L' U2 L F", id: '4d5730f6-846a-412b-9887-07fd7baceec0' },
      { moves: "R' D' F r U2 r' F D R", id: 'cd135426-f69a-4620-bc2a-c3498fccf829' }
    ]
  },
  {
    name: 'ZBLS 6.7',
    id: 'fb39b880-4d07-4e02-ad71-070513f0e411',
    idMethod,
    puzzle,
    group: 'ZBLS 6',
    algs: [
      { moves: "L' B' R U R' U' B L", id: '7a8e569a-ccaa-448b-bcf2-bcce2865bfb8' },
      { moves: "R' U' R x U R' U' x' U R", id: '19a0d225-94a7-41de-a529-daada7e9f59c' },
      { moves: "U2' R' F' U' F U R2 U' R'", id: 'c5aa82d5-0382-499b-9f06-698d70e71c93' },
      { moves: "(R U R' U') (R U R' U') F' U' F", id: 'c7e7a3cb-4499-4770-8152-8a31fa9bac65' }
    ]
  },
  {
    name: 'ZBLS 6.8',
    id: '900f1487-cb08-488a-b253-fd9ea22076e1',
    idMethod,
    puzzle,
    group: 'ZBLS 6',
    algs: [
      { moves: "(U) F' U' F U2 F' U F", id: '1028c5b0-e274-425f-8568-f2c7b58dada3' },
      { moves: "y' U R' U' R U2 R' U R", id: '543bd0ab-e2ec-4950-b7ae-53c81855d2b9' },
      { moves: "y F2 R U R' U' F2", id: '2219f856-4762-46b9-91af-c867c1076bb4' }
    ]
  },
  {
    name: 'ZBLS 7.1',
    id: '1470eaf3-1b59-4103-b97b-d3c0db791e5c',
    idMethod,
    puzzle,
    group: 'ZBLS 7',
    algs: [
      { moves: "L R' F' L' R U2 L F' L'", id: '58de47d7-aa1a-407b-b413-1ad44509e52b' },
      { moves: "r R' U' R r' U2 r U' r'", id: '3ad0467d-9ab2-481b-a3a7-2ad689f6d453' },
      { moves: "M' U' M U2 r U' r'", id: 'c6d38b72-347d-4297-a882-b1cf9fbd212e' }
    ]
  },
  {
    name: 'ZBLS 7.2',
    id: '8ae37d03-b682-4765-9c80-d146b406f1a2',
    idMethod,
    puzzle,
    group: 'ZBLS 7',
    algs: [
      { moves: "(U2) L U F U' F' L' R U' R'", id: 'ad5fd623-13d1-484d-ba60-f02d4c280e38' },
      { moves: "y F U R U2 R' U2 R U' R' F'", id: '952dfbfe-b5a1-40f3-a5c2-c396d807fa0e' },
      { moves: "U R U' R' U R' F R F' R U R'", id: 'e322e0de-f1c2-4c4f-8539-9c0d0f485c96' },
      { moves: "U' R B r' U r B2 U' R'", id: '1a917c45-827f-47f5-94d5-fed10fe71fd5' }
    ]
  },
  {
    name: 'ZBLS 7.3',
    id: '59247030-0a7d-4cce-91a6-9c416dc0a353',
    idMethod,
    puzzle,
    group: 'ZBLS 7',
    algs: [
      { moves: "(U') R U2 R' U R' F R F'", id: 'e3e9de47-6406-49d6-ae5b-4b68000c3d5f' },
      { moves: "y U' F U2 R U' R' U F'", id: 'f58885e1-4710-43f9-a588-d8db3210ecb1' },
      { moves: "U' R U2 R' U R' F R F'", id: '02611721-43ac-44bf-aa4e-01104139af18' }
    ]
  },
  {
    name: 'ZBLS 7.4',
    id: '722ce72b-5663-4eea-886b-a92326ea7622',
    idMethod,
    puzzle,
    group: 'ZBLS 7',
    algs: [
      { moves: "(U2) R U2 R2 U2 B' R' B U2 R", id: '36a41bbc-33fc-48c2-9a4e-605ad6ed68d7' },
      { moves: "y F R' U' R2 U' R2 U2 R U2 F'", id: 'e00c698d-11ce-4a32-80d0-5707a34b9296' },
      { moves: "F R' F' R U2 R U' R' U R U' R'", id: 'aae23b81-f17b-4bcc-ad24-859110861560' },
      { moves: "r' F' R2 U R' U2 R U' R2 F r", id: '277f193e-393e-4efa-b6ad-e133680c3a7c' }
    ]
  },
  {
    name: 'ZBLS 7.5',
    id: '3a54cc4c-638a-48ef-b051-ff17afbb1605',
    idMethod,
    puzzle,
    group: 'ZBLS 7',
    algs: [
      { moves: "(U) R U B U2 B' U2 R'", id: '1dfe578a-a586-42cb-8bd4-34d3a1ba3033' },
      { moves: "y' r U2 R2 U' R2 U' r'", id: 'b64a94e5-fafe-4dc5-80fa-13568cf3ade4' },
      { moves: "R' D' R U2 R' D F R F'", id: '35e93c4f-dbdc-45cb-9cc5-0dae866c6c95' }
    ]
  },
  {
    name: 'ZBLS 7.6',
    id: '9dbcb2cc-2689-4ef3-b51d-d9fd986fce4f',
    idMethod,
    puzzle,
    group: 'ZBLS 7',
    algs: [
      { moves: "(U) R2 U R B' R' B U' R2", id: '37cce412-cfce-48fd-8425-4f5e10ff5f62' },
      { moves: "y' r U2 R2 U' R U R U2 r'", id: '681a5b07-04e6-4dc3-af96-69deb37cb73b' },
      { moves: "R' D' r U2 r' D F R F'", id: '20ac78e2-6ff8-42fa-a586-cf60cbf670be' },
      { moves: "y' R2' F R F' U R U2' R' U R", id: '059be006-5169-40a7-947f-19f82666bb56' },
      { moves: "F2 r U r' F R U R' U2 R U R'", id: 'd8705fc9-f8e3-4d35-8472-436b9ab91ac7' }
    ]
  },
  {
    name: 'ZBLS 7.7',
    id: '4e21ce6c-ed07-46d5-9abd-dfc31adb8706',
    idMethod,
    puzzle,
    group: 'ZBLS 7',
    algs: [
      { moves: "R U B U2 B' U R'", id: '0b53f5f6-8ede-4161-afce-d154400e8bc2' },
      { moves: "y F U R U2 R' U F'", id: '0e9ae748-a5b7-46f3-8f38-94b3aedede90' },
      { moves: "R U R' U R U' R2 F R F'", id: '6e0be221-6e78-4f41-b574-ecf59acdba8a' },
      { moves: "U R' F R F' R U' R' U R U R'", id: '3e8212e6-fb4f-45f7-a4d6-6d0527fa7242' }
    ]
  },
  {
    name: 'ZBLS 7.8',
    id: 'c39f133b-bf5b-4898-a6d0-6e6b941ef00f',
    idMethod,
    puzzle,
    group: 'ZBLS 7',
    algs: [{ moves: "(U') R U2 R' U' R U2 R'", id: '0400098e-9369-43ed-bf24-abb49c664948' }]
  },
  {
    name: 'ZBLS 8.1',
    id: '2c808093-f3ed-4403-bc16-a6de842e9d03',
    idMethod,
    puzzle,
    group: 'ZBLS 8',
    algs: [{ moves: "r U r' U' R U' M' U r'", id: '86d367c0-c8dd-484e-8492-52754f7b680c' }]
  },
  {
    name: 'ZBLS 8.2',
    id: '5696a21a-49c9-4ded-8f58-6bd2d9f069fe',
    idMethod,
    puzzle,
    group: 'ZBLS 8',
    algs: [
      { moves: "(U2) B' U' R' U R B F' U F", id: 'b30eaebd-3d34-47c0-9c76-e89a901b9a09' },
      { moves: "U' r' F' r U r U' r2' F2 r F", id: '5d23cfa5-18e6-4d4d-8f01-bdf8c846a196' },
      { moves: "r' U2 R U R' U r2 U' R' U' R U r'", id: '08463b9c-ce2b-4c10-a56e-dc6650d23723' }
    ]
  },
  {
    name: 'ZBLS 8.3',
    id: '49edbef6-9a1d-4078-8460-2ed387e0e253',
    idMethod,
    puzzle,
    group: 'ZBLS 8',
    algs: [
      { moves: "(U) F' U2 F U' F R' F' R", id: '6c311538-10a3-4220-ab79-b5509177636f' },
      { moves: "r' U2 R2 U R2' F' U F r", id: 'ac8e69da-527f-4972-bb81-bb123b1e20e2' },
      { moves: "U y L' U2 L U' L F' L' F", id: '6b65d2e1-702f-4641-bf01-ae3e704a6290' }
    ]
  },
  {
    name: 'ZBLS 8.4',
    id: 'b7efb814-9af7-4200-b09e-4088cf11b8e6',
    idMethod,
    puzzle,
    group: 'ZBLS 8',
    algs: [
      { moves: "(U2) F' U2 F2 U2 L F L' U2 F'", id: '9450b29b-025d-4f4e-a3e3-aff538e0f35c' },
      { moves: "F R' F' R U' R U R' U' F' U' F", id: 'de13f5cf-41d5-4a05-8902-0eeeeb8b993e' },
      { moves: "R2 D R' U' R r' U' r D' R' U R'", id: '12a7bcd0-3d61-4896-977a-8ad2c9691dba' },
      { moves: "(x' R2) U' R' U F' l' U R' F R F'", id: '41639914-d5f2-4c96-8e5c-1f890f626a7e' }
    ]
  },
  {
    name: 'ZBLS 8.5',
    id: '4a213e88-cd06-423d-b2f8-79938fb7c93e',
    idMethod,
    puzzle,
    group: 'ZBLS 8',
    algs: [
      { moves: "(U') F' U' L' U2 L U2 F", id: '15c92221-228a-4056-ad2b-98bf1189f7e7' },
      { moves: "r' U2 R2 U R2' U r", id: 'ba288266-9186-4a15-adf3-7c025c33340a' },
      { moves: "U2 r' D' r U r' D r2 U' R' U R U r'", id: 'a5cdbf06-caed-4640-8d66-ac159bb3e8ae' }
    ]
  },
  {
    name: 'ZBLS 8.6',
    id: '88640d3a-3394-4f4e-86c7-8edc5cef21f3',
    idMethod,
    puzzle,
    group: 'ZBLS 8',
    algs: [
      { moves: "U R U' R' d R' U R U' R' U R", id: '17d719f4-7b9d-4a0a-9b69-14fef18cb3f4' },
      { moves: "r' U2 R2 U R' U' R' U2 r", id: 'a208bc68-7568-47e4-9f7e-5747419460d3' },
      { moves: "R l U' R' U F' l' U2 R U' R'", id: '42cec0c2-03de-4002-af96-9a8fe84b2687' }
    ]
  },
  {
    name: 'ZBLS 8.7',
    id: 'bce7ce3a-1dd7-4d7d-b63a-eff87d78915e',
    idMethod,
    puzzle,
    group: 'ZBLS 8',
    algs: [
      { moves: "F' U' L' U2 L U' F", id: '9d856a73-47ce-4a90-97e6-89afdb0ca917' },
      { moves: "B' R' U' R2 U R' B", id: '91492bb6-9e8e-46d0-aca1-f749fe5f1516' },
      { moves: "U2 R U' R' F' U' F U' R U R'", id: '32e609e0-4831-4a82-8508-27807c98f45f' }
    ]
  },
  {
    name: 'ZBLS 8.8',
    id: '219070e5-9c18-4675-9347-7bf6e449fbb9',
    idMethod,
    puzzle,
    group: 'ZBLS 8',
    algs: [
      { moves: "(U) F' U2 F U2 F' U F", id: 'c74903a8-d679-425f-9ff5-c6b7e00705b9' },
      { moves: "y' U R' U2 R U2 R' U R", id: '584c7d27-23b2-4bc7-8896-c8a93e6b7b14' }
    ]
  },
  {
    name: 'ZBLS 9.1',
    id: '70a75ad9-9275-4624-aa11-039b3819008a',
    idMethod,
    puzzle,
    group: 'ZBLS 9',
    algs: [
      { moves: "(U2) B' R B U2 B' F R' F' R' B", id: '8ef067e4-138a-4eff-952c-2c50b3562606' },
      { moves: "y' U2 r' U r U2 r' R U' R' U' r", id: '51e3579b-f907-4abb-b8a5-ebe7c3a9ccaf' },
      { moves: "U r U r' U2 M' U M R U' R'", id: 'e8de8cfc-c1c3-47cd-85fc-044a11117f40' },
      { moves: "U2 R U R' U' R' F R F' R U2' R2' F R F'", id: '1d8d441d-99aa-4f58-9ea9-5b4aba975b4d' },
      { moves: "U2 R U R D r' U' r D' R' U R'", id: '32f0e42a-f7ca-4b82-8a30-dc8c52427287' },
      { moves: "R' F2 R2 U' R' U' R' F' R2 U R' F2", id: 'a2c32831-6122-4b85-98f0-333a7a780e76' }
    ]
  },
  {
    name: 'ZBLS 9.2',
    id: '480f3cd8-01f2-42f5-88f4-e17f5e0ca7d0',
    idMethod,
    puzzle,
    group: 'ZBLS 9',
    algs: [
      { moves: "F' U L' U' L U2 F", id: '19d4e496-6320-4508-815e-96ffabaa310f' },
      { moves: "F R U R' U' F' U' R' F R F'", id: '2a6f1e7c-7029-4278-aaa0-1ea26572e984' },
      { moves: "M' U R2 r' U2 M' U r'", id: '0ba0cf35-b99e-4dcf-9675-47f48d5c57f8' }
    ]
  },
  {
    name: 'ZBLS 9.3',
    id: '6a5a3628-7f3a-4657-800a-9bb23a32d0cf',
    idMethod,
    puzzle,
    group: 'ZBLS 9',
    algs: [
      { moves: "F' R' F' U' F U R U2 F", id: '4713199d-9381-44b1-bb95-1f3ea2f2158e' },
      { moves: "y' U R' U' r U' R' U' R U R r'", id: '7fb37817-9b0d-4bdd-8fcb-15fc2162a95e' },
      { moves: "U' r U2 r' U' r U' r' U r U2 r'", id: '18eeea0c-dcb7-419b-bddd-52955d1df7df' },
      { moves: "U r U' r' U2' r U r' R U' R'", id: 'ce063156-f819-40b5-a886-f7c104e76926' }
    ]
  },
  {
    name: 'ZBLS 9.4',
    id: '8fc335ac-dee6-43e4-bb15-2e15ec7fa50e',
    idMethod,
    puzzle,
    group: 'ZBLS 9',
    algs: [
      { moves: "(U) L R' D' F' D L' R2 U' R'", id: '8575fc9d-ab32-4206-b383-9860bf4e196d' },
      { moves: "F' U L' U' L U L' U L F", id: '4eb3647c-7bf9-4fe6-aed7-4713d7a09ed8' },
      { moves: "R' F R2 U' R' U' r U2 r' U' F'", id: '5512950c-0d8d-48da-967e-714555c24e7a' }
    ]
  },
  {
    name: 'ZBLS 9.5',
    id: '86313511-12e1-4da5-a8e1-6ae0a2ebaa56',
    idMethod,
    puzzle,
    group: 'ZBLS 9',
    algs: [
      { moves: "(U') R U' R' U F' U' F", id: '135b4615-0fe1-4b5e-9a25-8d4ea666ab83' },
      { moves: "y' U2 r' U R U R' U' r", id: '461a7a40-2b8a-4d62-bef1-89d7fab150e5' },
      { moves: "U' R U' R' d R' U' R", id: '7e77ec87-0be4-42fc-a95d-b1315cc15da2' },
      { moves: "F2 r U r' U' r' F r U' F", id: '71f39a2a-066c-42f2-9e41-33fbc0d770fc' }
    ]
  },
  {
    name: 'ZBLS 9.6',
    id: 'd2c1f077-82cb-4d92-9b4e-6839b4b05e0a',
    idMethod,
    puzzle,
    group: 'ZBLS 9',
    algs: [
      { moves: "(U) L F R' F' L' R2 U' R'", id: '78ad2d0f-1d06-41c0-a26b-ca3476ff4cfa' },
      { moves: "U r U R' U' R2 r' U' R'", id: '51a0106e-49c9-4abe-8e87-1db8efcb6089' },
      { moves: "U r U R' U' M R U' R'", id: '95637839-79bd-4694-ac89-688ee5b601c5' },
      { moves: "R' F R U2 r U2 r' U2 F'", id: '7f8c6def-0b33-4867-90dd-9ce68e2e1dae' }
    ]
  },
  {
    name: 'ZBLS 9.7',
    id: 'f6e93ddc-d827-4f09-9abd-a084a92973bc',
    idMethod,
    puzzle,
    group: 'ZBLS 9',
    algs: [{ moves: "F R U R' U' F' R U' R'", id: '30f149cb-8cff-466f-8aa2-e971f5acacc1' }]
  },
  {
    name: 'ZBLS 9.8',
    id: '32ec3480-f0f4-4358-b08d-d0ba72f280e6',
    idMethod,
    puzzle,
    group: 'ZBLS 9',
    algs: [
      { moves: "(U) F' U' F U' F' U' F", id: 'ebc4dcdb-fc7c-4dad-aee5-26fb11acff26' },
      { moves: "y' U R' U' R U' R' U' R", id: '9ec118e4-1fa0-4b5f-9eb8-7c85f37a057f' },
      { moves: "y' U2' R' U R U R' U' R", id: 'bc83cfd2-f474-4ff6-9b6d-89a24866ea0e' },
      { moves: "U y' R' U' R U' R' U' R", id: '6bec3a1c-e87f-4bb7-9490-2e0131b4718a' },
      { moves: "R' D' R U' R' D R F' U' F", id: 'd40fecbe-e547-4d80-ac4d-3417de653e73' }
    ]
  },
  {
    name: 'ZBLS 10.1',
    id: '99106bcb-cb74-4b2a-abc3-297659618b21',
    idMethod,
    puzzle,
    group: 'ZBLS 10',
    algs: [
      { moves: "(U2) L F' L' U2 L R' F R F L'", id: 'e77bd04e-c475-497e-bf26-e1d5bdca719e' },
      { moves: "U2 r U' r' U2 r R' U R U r'", id: 'a4decf79-d022-45f0-97cb-3f197b6aaefe' },
      { moves: "r U' r' U' r U r' U2' R' F R F'", id: '4d77b907-731a-4043-8f88-297b6d38df9e' },
      { moves: "R U' R D r' U' r D' R' U' R'", id: '8ba77dda-fc4a-4c8b-ba8e-2e90bef211c1' },
      { moves: "R' D' R U M' U r' D R2 U R'", id: 'bf1825f0-b536-4736-8e8a-ac14f6f16a2c' }
    ]
  },
  {
    name: 'ZBLS 10.2',
    id: 'b19f7d87-0a52-447f-9db9-4ffd73b73327',
    idMethod,
    puzzle,
    group: 'ZBLS 10',
    algs: [
      { moves: "R U' B U B' U2 R'", id: 'fce8027e-00bc-437f-a026-1a1311e5fb3d' },
      { moves: "y F U' R U R' U2 F'", id: '77e5e4ce-b82f-4afb-a219-563d9f9ffa23' },
      { moves: "U F R' F' R U2 R U' R'", id: '3c5bbf1d-a793-4e4b-902f-6e06412b8130' },
      { moves: "R U R' F' U F U R U' R'", id: 'df0921a5-df2e-4149-b16c-695ae514f304' }
    ]
  },
  {
    name: 'ZBLS 10.3',
    id: '935d983f-144c-4e82-8fb1-06582faa300b',
    idMethod,
    puzzle,
    group: 'ZBLS 10',
    algs: [
      { moves: "R F R U R' U' F' U2 R'", id: '85d3bf80-36fc-44e3-aa17-218fc2b17195' },
      { moves: "U' R U r' U R U R' U' R' r", id: '6f63fcaf-4816-4627-a0d7-2955d2cf4f5e' },
      { moves: "R B' R' U' R U B U2 R'", id: 'd96138ad-647c-4fcf-9fdf-169508a2409e' },
      { moves: "U2 R U' R' U r U' r' U' r U r'", id: '9ae81a33-ab08-42d3-b820-c55060d079f6' }
    ]
  },
  {
    name: 'ZBLS 10.4',
    id: '2071e293-dfec-4ea6-b75e-0a3904196205',
    idMethod,
    puzzle,
    group: 'ZBLS 10',
    algs: [
      { moves: "(U') F B' D R D' B F2 U F", id: 'f6d20701-bbe3-4d15-a922-4dce3b743c82' },
      { moves: "y F U' R U R' U' R U' R' F'", id: 'c61b9fb7-7fcc-4570-9071-3ac29e933b22' },
      { moves: "U' R U R' U' r U' r' U' r U r'", id: '102196e6-1217-449e-9c7e-af8de4671af1' },
      { moves: "R' F' R U R U' R' F' r U r' F", id: '6794faf4-eba5-4ef0-9a35-1fb645752c95' }
    ]
  },
  {
    name: 'ZBLS 10.5',
    id: '52bc45d3-280d-45a7-b5ea-976df5b79b66',
    idMethod,
    puzzle,
    group: 'ZBLS 10',
    algs: [
      { moves: "(U) F' U F U' R U R'", id: '48be30b9-fad4-4d85-b835-c55683b5b9f8' },
      { moves: "U2 r U' R' U' R U r'", id: '06af0f9d-535a-44a4-85e6-cc50627e2b7a' },
      { moves: "R U R2 F R F' R U R'", id: '64d26758-15d9-4986-9b07-f6f1f055f18e' }
    ]
  },
  {
    name: 'ZBLS 10.6',
    id: '5f8eabc4-af88-4d73-ac56-ccff1b4ed428',
    idMethod,
    puzzle,
    group: 'ZBLS 10',
    algs: [
      { moves: "(U') B' R' F R B F2 U F", id: 'f511ac7c-0c30-4618-ac92-98e276fe2871' },
      { moves: "y' U' r' U' R U R2 r U R", id: 'a0998ad0-16f5-4857-b455-6f6963dcb8a5' },
      { moves: "U' F' U' F r U' r' U' r U r'", id: 'e5a0e378-d411-49fd-950e-4ee540aac271' },
      { moves: "R' D2 r U' r2' D r D2 R", id: 'c628cf0e-8fca-497c-bcf5-8cb359cbad7e' },
      { moves: "R' F R F' U2' R U R' U' R U R'", id: '13b91b16-86ba-4a68-acdb-7a0edbdd0960' },
      { moves: "U' r' D' r U' r' D r2 U' r' U' r U r'", id: '066024fb-701c-43eb-859c-e9c4edf3919b' }
    ]
  },
  {
    name: 'ZBLS 10.7',
    id: '192b56ea-2237-4630-839b-82a25a262d45',
    idMethod,
    puzzle,
    group: 'ZBLS 10',
    algs: [
      { moves: "R' F' U' F U R F' U F", id: 'a7493cbb-5f2e-4c4d-84fc-61a2f2bd5e0b' },
      { moves: "y F' L' U' L U F L' U L", id: '3570188b-a155-41ad-905a-6e18d423ba42' },
      { moves: "F R' F' R U R' F R F' R U R'", id: '5287dcee-f956-41a1-ab16-7dd5e0580b36' },
      { moves: "r' D' r U r' D R r U R'", id: '261a5236-51b4-40ca-92c2-26d9cb171aa8' }
    ]
  },
  {
    name: 'ZBLS 10.8',
    id: 'b75d9161-0cd1-4342-b539-c025cb85d4d1',
    idMethod,
    puzzle,
    group: 'ZBLS 10',
    algs: [{ moves: "(U') R U R' U R U R'", id: '6eec8c27-c6b4-49ed-9fa1-cf447e179246' }]
  },
  {
    name: 'ZBLS 11.1',
    id: 'e8b6e2df-0ea6-408f-a714-3487caa13d8d',
    idMethod,
    puzzle,
    group: 'ZBLS 11',
    algs: [
      { moves: "(U2) R B U2 B' U R' U' F' U F", id: 'da51b828-171d-4842-9dad-45bcce7ed490' },
      { moves: "R U' R' F' U2 L' U2 L U' F", id: 'f99036f0-99a0-4d54-8e48-88257f409213' },
      { moves: "F R' F' R U' R U' R2 F R F'", id: '8999bb23-a1b0-4e02-b97a-3cee8dd17832' },
      { moves: "R U R' U2 R' F R F2 U' F", id: '79008b28-9615-4616-9716-7182b7a2da0d' },
      { moves: "R U' R' U y r' F2 r2 U' r' F", id: '7d05e593-e74c-4d9c-9edc-e4d793976bb9' }
    ]
  },
  {
    name: 'ZBLS 11.2',
    id: '072658ab-098f-43a5-b5b9-12e792350be5',
    idMethod,
    puzzle,
    group: 'ZBLS 11',
    algs: [
      { moves: "R U2 R' U' F' L' U2 L F", id: 'adca0e1c-65a1-400e-87ba-80af08965307' },
      { moves: "y L' U2 F' U' L' U L F L", id: '3a1e81e3-7f00-4ef6-abb3-66ecb839705b' },
      { moves: "R U2 R' U' r U' r' U2 r U r'", id: '67c7b108-c1ac-47d5-8e8b-9e107880f4ab' },
      { moves: "r' U' R2 U' R2' U2' r F' U F", id: '472ad34a-057a-4a2d-976c-66b6e3198cfc' },
      { moves: "R U' R' U' R U' R2' F R F2 U' F", id: '4870760a-967f-40ba-9404-e3cb697613bd' }
    ]
  },
  {
    name: 'ZBLS 11.3',
    id: '54f9b1db-c4d7-4743-b998-a8d191cd1d8f',
    idMethod,
    puzzle,
    group: 'ZBLS 11',
    algs: [
      { moves: "F' U L' U2 L U2 F", id: '336b8244-be51-40a2-ad6d-bbb4462cdda5' },
      { moves: "F' U r' F2 r U2 F", id: '41df8eb5-f718-45d6-8001-f2f9bbac20dd' }
    ]
  },
  {
    name: 'ZBLS 11.4',
    id: 'f5c7cdc9-81d2-450b-97ff-6b1dbbe52ac0',
    idMethod,
    puzzle,
    group: 'ZBLS 11',
    algs: [
      { moves: "(U2) F' U2 F U' R U' R' F' U' F", id: '369dedec-8dee-4da5-ac4b-1c7691dd8884' },
      { moves: "F' L' U' L U' L' U L U' F", id: '7c886f08-f57d-4d60-998e-3c9fa1af5004' },
      { moves: "R' D' r U r U R U' r2' D", id: '99cf5b41-a303-446e-91c8-ee4119a144db' }
    ]
  },
  {
    name: 'ZBLS 11.5',
    id: '1e26cba9-b5e7-4756-ad54-23b65087988d',
    idMethod,
    puzzle,
    group: 'ZBLS 11',
    algs: [
      { moves: "(U') R U2 R' U F' U' F", id: 'ca5a2294-5eea-43ab-a449-87a8939c1b3f' },
      { moves: "U' R U2 R' y' U R' U' R", id: '79c0d6d3-6f8e-4aef-923f-097f00360c5d' }
    ]
  },
  {
    name: 'ZBLS 11.6',
    id: '347c6de0-c54a-4851-8747-3f2110decee1',
    idMethod,
    puzzle,
    group: 'ZBLS 11',
    algs: [
      { moves: "F' U' F2 U2 L F2 L' U2 F'", id: '96f38062-d83d-4254-ab00-c433a3bb899f' },
      { moves: "y' R' U' R2 U2 x U R2 U' x' U2 R'", id: '1e305d6a-03d2-445e-a900-41f05d45f942' },
      { moves: "R U R' U' R U' R' F' U' F", id: '6e83f293-b060-4934-b73b-cc1c5823ec38' }
    ]
  },
  {
    name: 'ZBLS 11.7',
    id: 'f5feadc2-0cc4-4c05-8aaa-55f8bcb84dfc',
    idMethod,
    puzzle,
    group: 'ZBLS 11',
    algs: [
      { moves: "R' U' R2 U' R2 U2 R F' U F", id: '17ef78ef-3306-4b47-9337-9799b9791aeb' },
      { moves: "R' U' R2 U' R2 U2 R y' R' U R", id: '80cf93bb-ea85-44c7-8aaa-90a5b2734d26' },
      { moves: "(U') R U R' U' R U' R' U' F' U' F", id: '1705aea1-0037-4d70-8bbd-59efd910537a' },
      { moves: "R U' R' U R U' R2' F R F' R U' R'", id: 'dc804ab4-95d9-4a9f-b494-05b73f50d2ac' }
    ]
  },
  {
    name: 'ZBLS 11.8',
    id: 'a02e0b57-74b5-43a3-8e2b-698f81d61dbb',
    idMethod,
    puzzle,
    group: 'ZBLS 11',
    algs: [
      { moves: "F U2 F2 U' F2 U' F'", id: '0aed5d57-184f-409d-9793-eb5e083664b6' },
      { moves: "y' R U2 R2 U' R2 U' R'", id: '1873f3cc-ad20-44e5-b942-b6da21bd4d34' },
      { moves: "R U2' R' U R U R' F' U' F", id: 'aa89be22-0688-43c7-a103-201a3a94b23c' }
    ]
  },
  {
    name: 'ZBLS 12.1',
    id: '339f4dc3-f6bf-4bed-a6b6-81c4545e09ba',
    idMethod,
    puzzle,
    group: 'ZBLS 12',
    algs: [
      { moves: "(U2) F' L' U2 L U' F U R U' R'", id: '8e90c84b-41fb-4c6f-b69b-304a5d99f407' },
      { moves: "U F' U L' U L F U R U' R'", id: '5be0f2a4-9eee-4876-b4b1-ce4e17271745' },
      { moves: "R' D' R U2 M' U r' D R2 U R'", id: 'd0a97841-1735-4cc3-af94-f4a842a15b68' },
      { moves: "R U2 R' U' M' U' M U2' r U' r'", id: '6b55c0b7-fe14-4016-b789-34062aa838f6' }
    ]
  },
  {
    name: 'ZBLS 12.2',
    id: 'f856cf80-1b34-4d5e-9fc8-86e1a0311ed3',
    idMethod,
    puzzle,
    group: 'ZBLS 12',
    algs: [
      { moves: "R U2 F U R U' R' F' R'", id: '7d8380d0-c6c1-4643-be3b-0874b5a6d0ff' },
      { moves: "R U M' U' M U2 M' U' r'", id: '56604369-d42f-463e-b5cf-c3fab3336cc7' },
      { moves: "(U2) R' F2 r U r' F R2 U R'", id: '1b01dedb-6ae0-4ada-809b-0f4b8f626746' }
    ]
  },
  {
    name: 'ZBLS 12.3',
    id: '147fc91f-a517-4c57-93b1-3cbc9c1113c2',
    idMethod,
    puzzle,
    group: 'ZBLS 12',
    algs: [
      { moves: "R U' B U2 B' U2 R'", id: '3e9450ff-fa27-4e45-b5ae-9cb6114387c7' },
      { moves: "y F U' R U2 R' U2 F'", id: '846dea39-20a6-48a5-a457-3dec556862c1' },
      { moves: "R d' R U2 R' U2 F'", id: 'bb77bb19-d6db-44c7-b2b2-663e888da9c8' }
    ]
  },
  {
    name: 'ZBLS 12.4',
    id: '515678de-b7cc-4b0b-b60b-e47cb680a152',
    idMethod,
    puzzle,
    group: 'ZBLS 12',
    algs: [
      { moves: "(U2) R U2 R' U F' U F R U R'", id: '30aff6ba-36f8-46ca-ae3b-5f3abfb346b0' },
      { moves: "y F R U R' U R U' R' U F'", id: '4a8bb6a8-781f-487e-b34d-2d6c0de128ae' },
      { moves: "R U R' U R' F R F' R U R'", id: '814e7c34-96aa-424a-8a43-debd2e75fa2f' }
    ]
  },
  {
    name: 'ZBLS 12.5',
    id: 'f9c5b26b-44c3-46c3-a209-8a419b08cbb2',
    idMethod,
    puzzle,
    group: 'ZBLS 12',
    algs: [
      { moves: "(U) F' U2 F U' R U R'", id: 'f789ebb4-b27b-4dfe-9601-f4bff1dc0539' },
      { moves: "y' U R' U2 R y U' R U R'", id: 'f5cf2048-5bc9-4487-ae25-d36adddccf3f' }
    ]
  },
  {
    name: 'ZBLS 12.6',
    id: '8d6c3f49-ff8b-4e17-8fbe-dcc0f7df6a9c',
    idMethod,
    puzzle,
    group: 'ZBLS 12',
    algs: [
      { moves: "R U R2 U2 B' R2 B U2 R", id: '94b146da-26b9-4f82-93c1-60597f0df185' },
      { moves: "R U R2 U2 x' U' R2 U x U2 R", id: 'c2a4285a-ae9f-4f2c-8160-7ce6e91c9d11' },
      { moves: "R U' R' U R U' R' U R' F R F'", id: 'e1ce05fe-a23d-4f3a-ace7-1c9977174cbb' },
      { moves: "U r U' R' U' R U r' U' R U R'", id: '8d98cb11-7866-44b0-aa43-8e73ec898ccc' }
    ]
  },
  {
    name: 'ZBLS 12.7',
    id: '954959c4-8014-472a-bc1e-430948c4fb17',
    idMethod,
    puzzle,
    group: 'ZBLS 12',
    algs: [
      { moves: "F U F2 U F2 U2 F' R U' R'", id: '6010315a-2c52-4fb1-abdf-2aacab92183d' },
      { moves: "y' R U R2 U R2 U2 R' y R U' R'", id: '2073a499-4a33-453e-971a-ef93cf9bfcd1' },
      { moves: "R U' r' U R U' R' U' r U2 R'", id: '47447e86-c004-48b4-a06d-d9332e80d7ff' }
    ]
  },
  {
    name: 'ZBLS 12.8',
    id: '848b2185-54d7-41ec-8686-70e702076cb7',
    idMethod,
    puzzle,
    group: 'ZBLS 12',
    algs: [
      { moves: "R' U2 R2 U R2 U R", id: 'd52160e4-5483-40f9-af9c-b8b35a2dbcab' },
      { moves: "R U' R' U R U' R' U2 R U' R'", id: '5fd6764d-fce6-477c-9bbf-51430d0ccfda' }
    ]
  },
  {
    name: 'ZBLS 13.1',
    id: '4d94af7a-4a69-4515-89d8-dafc15440a6c',
    idMethod,
    puzzle,
    group: 'ZBLS 13',
    algs: [
      { moves: "(U2) B' R B U' B' F R2 F' R' B", id: '29889287-7574-4504-a0ab-9a8d881d0dca' },
      { moves: "y' U2 r' U r U' r' R U2 R' U' r", id: '666571ff-5c0b-4893-b640-69a1553f98d7' },
      { moves: "U2 R U R D r' U r D' R' U R'", id: '711ddf0c-bbf4-45f5-8944-cf7ba9fddb9c' }
    ]
  },
  {
    name: 'ZBLS 13.2',
    id: '24d3f570-43f9-43c7-9288-2a0a308fc164',
    idMethod,
    puzzle,
    group: 'ZBLS 13',
    algs: [
      { moves: "(U) B' U' R' U R B F' U' F", id: 'cb08b17a-c757-486a-a009-ad8cac51fc14' },
      { moves: "U2 F' L' U L U' L' U2 L F", id: 'b659ae4c-952f-43eb-abdb-878ec9fae3a8' },
      { moves: "M' U' R U' r' U2 r U' r'", id: 'f76d1ed6-a2f7-4858-88fe-e763838bb72f' }
    ]
  },
  {
    name: 'ZBLS 13.3',
    id: '70be03ec-2e53-4046-94b0-e3ed91dbc5c6',
    idMethod,
    puzzle,
    group: 'ZBLS 13',
    algs: [
      { moves: "F' L U F U' F2 L' F2", id: 'bdecc48b-91b3-49bc-86cd-d1fc5ef428c8' },
      { moves: "y' F U R2 U' R' U R2 U' F'", id: 'ddccbe93-87c2-43db-a155-3894e6b5c2be' },
      { moves: "R' D' r U r' D R U R U' R'", id: '9b1e4c38-52c9-449e-9845-2788af71b461' },
      { moves: "R' F R F' U' R' F R F' R U R'", id: '6aaced05-c89e-4433-8937-d1cd6b929540' }
    ]
  },
  {
    name: 'ZBLS 13.4',
    id: '4c9041f1-9cf1-4674-835c-d0ffd56b455c',
    idMethod,
    puzzle,
    group: 'ZBLS 13',
    algs: [
      { moves: "(U) F U R U' R' F2 U' F", id: 'f08bf72e-6ec3-48af-aa0b-89317c337252' },
      { moves: "y L' U F' L2 U' L U L2 F L", id: 'ae216351-1d48-483a-b1c7-f5ad496145f6' },
      { moves: "R' F R U2 r U' r' U2 F'", id: 'afe65231-08e6-4add-bbf4-171c6e712d9d' },
      { moves: "U2' r U2' r' U' r U r' U r U2' r'", id: '0be195f1-f62c-4aa9-ad1b-6171ef93e133' }
    ]
  },
  {
    name: 'ZBLS 13.5',
    id: '9144d059-d172-4218-894b-b865d4585f13',
    idMethod,
    puzzle,
    group: 'ZBLS 13',
    algs: [
      { moves: "(U2) B' F' R' F R' F' R2 F B", id: 'd6bc4fc2-2eee-4872-a736-02386fd95430' },
      { moves: "y' U2 r' R' U' R U' R' U2 R r", id: 'cb513b95-a01c-4ffa-8586-dc091bbed023' },
      { moves: "R' F' r U R U2 r' F2", id: '3ee4bab3-2632-45f8-9511-294df7140945' }
    ]
  },
  {
    name: 'ZBLS 13.6',
    id: 'db6dc192-e341-49ee-b9f6-8f8b41312864',
    idMethod,
    puzzle,
    group: 'ZBLS 13',
    algs: [
      { moves: "(U) F' U B L' F' L' F L F B'", id: '8a201059-80f2-4313-b105-31617f66dda5' },
      { moves: "y' U R' U r U' R' U' R U R r'", id: 'c75573f9-30ec-4f5c-aed9-286eeadbdde5' },
      { moves: "M' U' R U R' U2 R U' r'", id: '8e7c96ad-32ff-4c9e-8bb5-73db21cc948b' },
      { moves: "R U' R' U R' F R F' R U' R'", id: 'f5c2f5f3-7c78-4409-bc79-398cb15c0418' },
      { moves: "R U R' U R U' R' F' U' F", id: '69d2d08f-b090-440d-bec8-7ea62df3b870' }
    ]
  },
  {
    name: 'ZBLS 13.7',
    id: '7bf265d0-7177-41aa-bf35-a11b03a5e938',
    idMethod,
    puzzle,
    group: 'ZBLS 13',
    algs: [
      { moves: "R U' R' U F' U2 F R U R'", id: '7d32c1fd-0ce4-4db2-9caf-79a63fc0ed4f' },
      { moves: "y U L F' L2 U' L U L F L'", id: '99096cf0-add0-416e-8613-f67f963a562c' },
      { moves: "R2 D R' U R D' R2 F' U' F", id: '637cd0f5-57b3-45af-8a94-406fac8e2506' },
      { moves: "U R U' R' U R U' R' U' y' R' U R", id: '83242911-75ef-42a2-8b14-588b23995aec' }
    ]
  },
  {
    name: 'ZBLS 13.8',
    id: 'fb68cab2-816b-4314-b149-adc4c20350f8',
    idMethod,
    puzzle,
    group: 'ZBLS 13',
    algs: [
      { moves: "(U) F' U F U' F' U' F", id: '3b071689-6f5a-432f-b553-62d741f482b1' },
      { moves: "y' U R' U R U' R' U' R", id: '7d757c9e-78b2-46af-909e-a9019e6e80f3' },
      { moves: "U y' R' U R U' R' U' R", id: '44a7d213-3200-43ef-b9d6-ea0affade0e9' },
      { moves: "R' D' R U R' D R F' U' F", id: 'f151337f-1024-46ce-ad1d-15e38deccd03' }
    ]
  },
  {
    name: 'ZBLS 14.1',
    id: 'b08faec5-c691-41b9-9229-34bdb6b9bcd3',
    idMethod,
    puzzle,
    group: 'ZBLS 14',
    algs: [
      { moves: "(U2) L F' L' U L R' F2 R F L'", id: 'c6662fb1-3d6f-4f88-b9c3-1405438c9606' },
      { moves: "U2 r U' r' U r R' U2 R U r'", id: 'efd4e583-79a6-483b-a7ae-6ab806f3008e' },
      { moves: "R' F R F' R U' R' U R U2' R2' F R F'", id: 'd60aed73-5f37-4f47-bf59-a675269b7a61' },
      { moves: "U2 r U' r' U2 r U r' U R U R'", id: 'd2d00535-d2cb-40a5-b956-2403c1c63bf9' },
      { moves: "U R2 D r' U r D' R2' U2' R U R'", id: '975818bd-4436-48a8-ba5c-59aecd88a288' }
    ]
  },
  {
    name: 'ZBLS 14.2',
    id: '4634bd47-685c-4aa9-81e1-34253d7e7357',
    idMethod,
    puzzle,
    group: 'ZBLS 14',
    algs: [
      { moves: "(U') L U F U' F' L' R U R'", id: 'ebda588e-d54e-4c32-9d76-845369589b1e' },
      { moves: "y U2 F R U' R' U R U2 R' F'", id: 'ed40e6d6-19a3-40f3-8ab5-47b3477a2bc0' },
      { moves: "R U R' U' F' U' F U R U R'", id: '3523e13c-5e41-4256-a832-88398437e0a7' },
      { moves: "U2 r U R' U R U2 r' U R U' R'", id: '39173acf-5ee2-4d05-85f7-0d725b88aaf8' },
      { moves: "R B r' U r B2 U2' R'", id: '9f27b192-aa27-487f-a879-821dc112fde0' }
    ]
  },
  {
    name: 'ZBLS 14.3',
    id: '47437c8e-4a01-4d25-8075-9b7eef1bf4b6',
    idMethod,
    puzzle,
    group: 'ZBLS 14',
    algs: [
      { moves: "R B' U' R' U R2 B R2", id: '583b3a2c-7e05-430a-942a-87d4c394bd97' },
      { moves: "R U R U x' R' U' R U x U' R2", id: 'af329e05-ad58-46ef-a1a3-cec7c5e2b67e' },
      { moves: "R U R' U' R' F R F' R U R'", id: 'ae754615-499d-4e06-9083-a21074a18839' }
    ]
  },
  {
    name: 'ZBLS 14.4',
    id: '4263e97b-4853-4d75-88d4-437af2b8d72d',
    idMethod,
    puzzle,
    group: 'ZBLS 14',
    algs: [
      { moves: "(U') R' U' F' U F R2 U R'", id: '58a2fe6a-ce9b-47b8-a528-c5bef5cfa28a' },
      { moves: "R U' F R2 U R' U' R2 F' R'", id: '15d568e2-2056-4ef8-ac76-d9803e8503e6' },
      { moves: "F' r U' r' F2 U' R U R'", id: '25b4e12f-2bff-4118-aab4-2200e08ccd52' },
      { moves: "U' R U' R' U' r U' r' U' r U r'", id: 'bd66022c-8042-4630-9997-e3a32595c531' }
    ]
  },
  {
    name: 'ZBLS 14.5',
    id: 'f0fa1cab-27b1-4aff-81f7-21c1517bfa6d',
    idMethod,
    puzzle,
    group: 'ZBLS 14',
    algs: [
      { moves: "(U2) L R F R' F R F2 R' L'", id: '243aa145-a14c-43e8-a4ab-025e5beb4ccd' },
      { moves: "U2 r R U R' U R U2 R' r'", id: 'bc5347e4-3d3a-461b-8ebe-472f531a9c44' },
      { moves: "U2 R U R' U R U2 R2 F R F'", id: '3888af64-04d6-4b33-9ade-f463d9e35070' }
    ]
  },
  {
    name: 'ZBLS 14.6',
    id: 'a20313d5-5e88-4d8c-86ec-62ab66876bd5',
    idMethod,
    puzzle,
    group: 'ZBLS 14',
    algs: [
      { moves: "(U') R U' L' B R B R' B' R' L", id: 'ddc0ffab-2e7c-4bab-8094-8da0580ea7b5' },
      { moves: "U' R U' r' U R U R' U' R' r", id: 'a4767387-6403-4e52-9a73-d47fe8f70091' },
      { moves: "M' U' R U' R' U R U R' U' M", id: 'ee6eb77d-f956-41d5-80a7-c8522595bc29' }
    ]
  },
  {
    name: 'ZBLS 14.7',
    id: '5c12f66d-d04b-4832-922f-fa308ddf4037',
    idMethod,
    puzzle,
    group: 'ZBLS 14',
    algs: [
      { moves: "F' U F U' R U2 R' F' U' F", id: 'fa706520-5d2f-4f7a-aeca-7bc5b7f45d7d' },
      { moves: "U' R' F R2 U R' U' R' F' R", id: '4bcbadb5-5e4d-4e38-b1de-cfd1f418a684' },
      { moves: "r' D' r U' r' D r R U R'", id: '7c97f4f9-4365-4b62-a899-52d7fbf6ebd8' },
      { moves: "U F R U R' D R2 U' R2 D' F'", id: 'acbff7f8-2aff-479e-913f-76fa4998d7f8' }
    ]
  },
  {
    name: 'ZBLS 14.8',
    id: 'ffb054cd-2605-4bb1-8caa-f1205be5d25d',
    idMethod,
    puzzle,
    group: 'ZBLS 14',
    algs: [{ moves: "(U') R U' R' U R U R'", id: 'defa4ac7-65da-486e-8189-aa94b5408df3' }]
  },
  {
    name: 'ZBLS 15.1',
    id: 'f253d9c1-7403-4ab3-a610-f402907d448d',
    idMethod,
    puzzle,
    group: 'ZBLS 15',
    algs: [
      { moves: "(U') F' U2 F R B U2 B' R'", id: 'ba3fd794-53f5-4ba3-a521-6df67f39354d' },
      { moves: "y U' L' U2 L F R U2 R' F'", id: 'fcd4bb03-e781-4807-9307-bf7886e7f02f' },
      { moves: "l U r U' r2' F r U2 l'", id: '128f9c2f-7ba2-4ab0-bee3-9b4a39cacf85' },
      { moves: "U R U' R D r' U r D' R' U' R'", id: '4f88a84a-7992-4bd9-bcec-c96a208d3f8f' },
      { moves: "r' U' R U M' U' R' F U R U' F'", id: 'd4d722b3-ce68-4e9b-b3e2-4db4cd16c1bb' }
    ]
  },
  {
    name: 'ZBLS 15.2',
    id: 'b16bb725-9ff9-4477-87e9-a4a0a31ec83a',
    idMethod,
    puzzle,
    group: 'ZBLS 15',
    algs: [
      { moves: "R U B' R B R' U2 R'", id: '7a22969b-234f-4dea-aac3-d1c901ee082f' },
      { moves: "R U x' U' R U R' x U2 R'", id: 'dc981d23-588a-4903-9126-c5937b023fa0' },
      { moves: "R U2' R2' F R F' U' R U2' R'", id: '4cddd9bd-868c-405e-9fe3-17bce8eb7e48' }
    ]
  },
  {
    name: 'ZBLS 15.3',
    id: '0187d52b-9c57-4d6a-aff9-465e2c3fe401',
    idMethod,
    puzzle,
    group: 'ZBLS 15',
    algs: [
      { moves: "R U R' U2 R U' R2 F R F'", id: '409f9736-16fe-4bae-8468-77fc96396bb4' },
      { moves: "R U R' U2 R U' R2 x U R U' x'", id: '6c33b715-034e-4585-b76e-1c2de49ab662' }
    ]
  },
  {
    name: 'ZBLS 15.4',
    id: 'ed3980c1-8548-4fb7-8eed-a337f641cf43',
    idMethod,
    puzzle,
    group: 'ZBLS 15',
    algs: [
      { moves: "(U2) F' U' F R B U2 B' R'", id: '9dc77c13-d6c4-48f4-b21b-11b57105fee9' },
      { moves: "y F R U' R' U2 R U2 R' F'", id: '4d9590f2-264d-4b28-a71c-01d82ba27fcd' },
      { moves: "M U R U R' U' r U' R'", id: 'df38e17c-10d2-4032-a080-fbec4c02778e' }
    ]
  },
  {
    name: 'ZBLS 15.5',
    id: '0cb6cb83-8c7f-4cd2-9665-f7ddff5a2e92',
    idMethod,
    puzzle,
    group: 'ZBLS 15',
    algs: [
      { moves: "L R F U F' U' R' L'", id: 'fbd4bddc-ca0b-4354-bb2a-283538cdab56' },
      { moves: "F' U L' U L U L' U L F", id: '8a7775eb-dc28-4b08-9b8a-750bf8044368' },
      { moves: "R' D' R U' R' D F R F'", id: '7d2dd43d-386a-4070-bd88-e51bbb7de3fd' },
      { moves: "U' R' F R F' R U R' U2' R U R'", id: '5605911f-c02b-4da0-bfb7-143a07905b2f' },
      { moves: "y' R2' F R F' R U2' R' U R", id: 'bffcff47-7dbd-411b-8697-52967dd1e1de' }
    ]
  },
  {
    name: 'ZBLS 15.6',
    id: '827c9499-c26b-4823-ba22-f5ac90f0a173',
    idMethod,
    puzzle,
    group: 'ZBLS 15',
    algs: [
      { moves: "F' U F U2 R U R'", id: 'a31d1a48-3e38-46cd-98ca-c4d8ff6b58a9' },
      { moves: "y' R' U R U2 y R U R'", id: '92494444-300c-4e62-9805-85bd2495b46d' },
      { moves: "U R' F R F' U R U R'", id: 'cb3df0dc-739c-4317-8f0d-d1336346bb82' }
    ]
  },
  {
    name: 'ZBLS 15.7',
    id: '7eae56cf-6ff6-41cf-b350-101d5897a1bc',
    idMethod,
    puzzle,
    group: 'ZBLS 15',
    algs: [
      { moves: "R B L U' L' B' R'", id: '77154afd-5c52-4f5c-aa3a-b4106e6c54ae' },
      { moves: "y U' L' F' L' U' L U F L", id: '76017b27-3a97-40c4-8ca4-4fb42eed8c23' },
      { moves: "M U r U' r' U' M'", id: 'd94b5b18-99e8-4d2a-9e09-3dbad5cc5c3e' },
      { moves: "F D R U R U' R2 D' F'", id: '7fdb3091-614a-4a3a-b717-284ed8d6a27a' }
    ]
  },
  {
    name: 'ZBLS 15.8',
    id: '07eaa439-2f31-4e1c-8811-b22f5c212ae1',
    idMethod,
    puzzle,
    group: 'ZBLS 15',
    algs: [
      { moves: "R F U R' U' R F' U' R'", id: 'ed3eb40b-256d-4ef2-baa6-050aead57d68' },
      { moves: "U' R' U2 R' U R' U' R U2 R", id: 'ccad8bef-0316-47ae-b9ad-be71b449670d' },
      { moves: "R' D' R U' R' D R U R U' R'", id: '9b6df21c-a475-46eb-b01c-205880050078' },
      { moves: "R U2 R' U R U R' U R U' R'", id: 'c2a17b49-22d3-4590-9655-ae6c8b1afa36' },
      { moves: "R U R' U2 R U' R' U R U' R'", id: 'bcf5d595-8ffb-431a-8b08-2bef6051de18' }
    ]
  },
  {
    name: 'ZBLS 16.1',
    id: 'f4fe4f77-b1aa-4448-bd17-d7512299c495',
    idMethod,
    puzzle,
    group: 'ZBLS 16',
    algs: [
      { moves: "(U) R U2 R' F' L' U2 L F", id: '3027e16f-1fcd-4455-a707-e380e69a6138' },
      { moves: "U' r U' R' U' M U2 r U r'", id: 'c4156ebf-d255-42c8-bf04-bb18394e7b3c' },
      { moves: "U R U2' R' r U' r' U2' r U r'", id: '86cc8870-9caa-45be-8da0-6e97a741eb86' }
    ]
  },
  {
    name: 'ZBLS 16.2',
    id: '3f7f207f-6e60-4c57-8869-aee978df89b6',
    idMethod,
    puzzle,
    group: 'ZBLS 16',
    algs: [
      { moves: "F' U' L F' L' F U2 F", id: '1ac6e924-df71-4c71-b203-e8f3d747ece4' },
      { moves: "y' R' U' x U R' U' R x' U2 R", id: 'ae56a62a-0429-4fcb-9758-8ae0dbebacc7' },
      { moves: "U2 R' D' r U' M U' R' D R", id: 'e9b6b5d8-2338-4a66-8326-098d9899b736' },
      { moves: "U r U' r' U2' r U r' U' R U R'", id: '17783510-f9be-4984-8c27-52fa71c0bc76' }
    ]
  },
  {
    name: 'ZBLS 16.3',
    id: 'cfc3ef00-aad7-4373-8a33-ea6b320c474e',
    idMethod,
    puzzle,
    group: 'ZBLS 16',
    algs: [
      { moves: "F' U' F U2 F' U F2 R' F' R", id: 'b202446c-2d1d-440e-ada5-ca7acf6e7560' },
      { moves: "y' R' U' R U2 R' U R2 x' U' R' U x", id: 'c0035304-4982-4bde-95d9-27e91bf900bd' },
      { moves: "r U' r' U l' U2 R U' R' U2 l", id: '4b9fd3af-db88-4678-b592-22dc5a11a26e' },
      { moves: "U2 r' F' r U' r' F2' r2 U' r' U2' r U r'", id: 'be190415-1598-462b-9b7e-b98b9c2179bf' }
    ]
  },
  {
    name: 'ZBLS 16.4',
    id: 'd924a96e-9bdc-48ee-8f17-999d56aa8dc1',
    idMethod,
    puzzle,
    group: 'ZBLS 16',
    algs: [
      { moves: "(U2) R U R' F' L' U2 L F", id: '73083c5c-9b96-460c-bbb8-844edaba7606' },
      { moves: "F' L' U L U2 L' U2 L F", id: '3657b090-8c88-4ead-8fa5-a811361042a1' },
      { moves: "F' U R U R' U' R' F2 R F'", id: 'f3023c91-a551-4e1d-a1e0-d43653774bb1' },
      { moves: "U2 R U R' r U' r' U2' r U r'", id: '97a4acf7-b682-452b-8ffc-6572bf10c9d6' }
    ]
  },
  {
    name: 'ZBLS 16.5',
    id: '66a4794a-5970-413a-a450-0b621114989f',
    idMethod,
    puzzle,
    group: 'ZBLS 16',
    algs: [
      { moves: "F' B' R' U' R U B F", id: '7a3b4117-bd20-47cb-a89a-60f4dae3ed20' },
      { moves: "y F U' R U' R' U' R U' R' F'", id: '4b8926e6-11bf-46f8-a560-f5bb0e551021' },
      { moves: "U F U R U' R' F' R U R'", id: '3133973c-4cbc-42eb-b8b0-f2b9f3ad0ec4' },
      { moves: "(l R) U' R' U l' U2 R U' R'", id: '145d0114-015a-408d-981a-ed7ebf4b5f90' },
      { moves: "R' D' R U R' D R F R' F' R", id: '65c7715f-335c-4c59-8ad2-be1246cc2a30' }
    ]
  },
  {
    name: 'ZBLS 16.6',
    id: '9ff722d8-ed11-4080-b897-81f8236c4dee',
    idMethod,
    puzzle,
    group: 'ZBLS 16',
    algs: [
      { moves: "R U' R' U2 F' U' F", id: '1c7986fe-89de-43ca-b145-11662ab84697' },
      { moves: "R U' R' U2 y' R' U' R", id: 'c303ff00-0f65-4883-bc82-5ace3cde9d28' }
    ]
  },
  {
    name: 'ZBLS 16.7',
    id: 'ed7aedd6-b07b-4182-9fa8-4e4ea9e3dd2b',
    idMethod,
    puzzle,
    group: 'ZBLS 16',
    algs: [
      { moves: "F' L' B' U B L F", id: 'bee64fa2-7d95-4716-8403-3c2a946a431d' },
      { moves: "U R F R U R' U' F' R'", id: '6b25e058-933d-4de6-8f78-d08a1352eeb8' },
      { moves: "R U R' U2' R U' R' U' F' U F", id: 'e0b68c31-fc3c-46da-a4dc-0d9893ae4cd9' },
      { moves: "y' M' U' r' U r U M", id: '606bd854-895c-4d54-8f8d-45524b3977cb' }
    ]
  },
  {
    name: 'ZBLS 16.8',
    id: '3fbf0d95-18a8-4c8f-897a-52ccdf8aac33',
    idMethod,
    puzzle,
    group: 'ZBLS 16',
    algs: [
      { moves: "F' R' U' F U F' R U F", id: '73600c4e-5998-492c-bc48-331a956da3b9' },
      { moves: "y' U R U2 R U' R U R' U2 R'", id: 'cabfed36-6689-4bd8-aa0c-1350efb4cbd2' },
      { moves: "r U r' U r U2 r' U' r U' r'", id: '449ed626-098d-4e27-8a81-dbd0799ccad3' },
      { moves: "U M' U R U' r' U' R U R'", id: '78149a0c-e8f6-4886-a231-9126bb1bd25f' },
      { moves: "U F R' F' R2 U' R' U R' F R F'", id: 'f2685b71-1ada-4284-bdc4-aa3027467a41' },
      { moves: "F' U (R U R' U R U2' R') F", id: '7098fd63-e471-408d-8595-33560b313d0a' }
    ]
  },
  {
    name: 'ZBLS 17.1',
    id: '33e35004-aab6-4e77-a73e-d2225b355ec7',
    idMethod,
    puzzle,
    group: 'ZBLS 17',
    algs: [
      { moves: "(U') R U' B U' L U' L' B' R'", id: '5d73f8c5-f9c8-4ca6-954d-bd847496ba8b' },
      { moves: "U' F' L' U2 L U' F U' R U R'", id: 'c97fb642-5c62-4787-96c5-975e98d8a5aa' },
      { moves: "r' D' r U2' r' D r2 U' R' U2' R U r'", id: 'cbcd43bd-a1aa-4cb1-b58e-954931a4c6ba' },
      { moves: "F' r U' r' F2 R U2' R2 F R F'", id: '0998209c-cf01-4aa5-8c9a-683bc095810c' }
    ]
  },
  {
    name: 'ZBLS 17.2',
    id: '103b06c0-7ee3-4a57-b61e-6450a53ac7f6',
    idMethod,
    puzzle,
    group: 'ZBLS 17',
    algs: [
      { moves: "(U') R U2 R' U' F' U' F R U R'", id: 'd2437df4-c2a8-477c-b526-79ad1d037c65' },
      { moves: "y U F R U R' U' R U R' U2 F'", id: '8ca00959-4cdf-470c-91d2-a5197b7f9214' },
      { moves: "U R U2 R' U' R U R' U R' F R F'", id: 'eada739c-5b5b-485c-ac97-9beb0f3230fc' },
      { moves: "U' F R U R' U' F2 r U' r' F2", id: '1f5633ad-49a4-442b-8081-ed05a17c6154' },
      { moves: "U' R U2 R' U' F' U' F R U R'", id: 'b1fd4e2f-e2c2-455c-9b6a-015fb51c2f15' },
      { moves: "R U' R' U' F R' F' R U2 R U' R'", id: '17a862c3-0f20-4a01-b130-f802f9169a14' }
    ]
  },
  {
    name: 'ZBLS 17.3',
    id: 'e861521d-a822-4a4f-86dd-9dcb7ac06b53',
    idMethod,
    puzzle,
    group: 'ZBLS 17',
    algs: [
      { moves: "(U) R U R U2 F R F' U2 R2", id: 'f41264c5-114f-431e-96b0-d202bc8e7a23' },
      { moves: "U' R U2 R' U' x' R U' R U R2 x", id: 'c6fbae14-4f08-4acb-978f-418d5eb27fe7' },
      { moves: "R U2 R' F U R U' R2 F' R", id: 'baa17eef-83d6-4c84-861f-b7f0997b89c9' }
    ]
  },
  {
    name: 'ZBLS 17.4',
    id: 'def1b3a7-2f55-4ed5-9ffa-466089e6b2c5',
    idMethod,
    puzzle,
    group: 'ZBLS 17',
    algs: [
      { moves: "(U2) R2 U2 F R F' U2 R2", id: 'ae3e83c9-b3d6-4434-bb4c-a6591b387560' },
      { moves: "R U2 r' U' R U R2 r", id: '930c1973-e11c-4b7c-94db-ebb05b5e5286' },
      { moves: "R U' R' r U' R' U' R U r'", id: 'f56ac9b0-d256-42ae-8204-8bce7bbf3570' },
      { moves: "R U' M' U' R' U' R U r'", id: '607ef599-2a46-4ad1-b83d-a9067fd7bd46' }
    ]
  },
  {
    name: 'ZBLS 17.5',
    id: 'bb37dc96-9b58-4ad0-a357-a517bd6da855',
    idMethod,
    puzzle,
    group: 'ZBLS 17',
    algs: [
      { moves: "F' U F R U R' F R' F' R", id: 'b03cd596-36ba-4d54-b7a4-58a268fca5c4' },
      { moves: "U F' L' U L U' L' U2 L U' F", id: 'b542003b-c095-47d5-b776-c9c1ed5951c0' },
      { moves: "F' U2' F R U R' U2 R U' R'", id: 'afd58db4-c88d-45c6-9f13-96aa65b58c00' },
      { moves: "y' M U' R' U2 R U' R' U R U2' M'", id: '865855c8-640b-41e4-a41f-f9892c6857db' },
      { moves: "R U l' U R' U' R U R' U' l", id: '966fa2f1-267c-4b3e-b906-43b3977e9e9d' },
      { moves: "B' R U' R U R' U' R2 U B", id: '6d7f85e9-417b-450f-bf3f-61c98bbed8a5' }
    ]
  },
  {
    name: 'ZBLS 17.6',
    id: '9de9067b-1cca-42ef-8d9e-be28b4a63742',
    idMethod,
    puzzle,
    group: 'ZBLS 17',
    algs: [
      { moves: "(U2) R2 B2 L' B' L B' R2", id: 'c6b51094-631b-48c3-8e81-08e925be7700' },
      { moves: "U2 x' R2 U2 L' U' L U' R2 x", id: 'd41297d9-8a79-4bb4-b943-93e30fee7300' },
      { moves: "R U R' U' F R' F' R2 U R'", id: '3b9e0138-32cf-4f4e-a422-68ff57f0eccd' }
    ]
  },
  {
    name: 'ZBLS 17.7',
    id: 'e279aeed-544d-4590-a6df-6141faf85861',
    idMethod,
    puzzle,
    group: 'ZBLS 17',
    algs: [
      { moves: "F' U2 L F U F' U' L' F", id: '0d9a984b-b0f2-45cb-9523-4eb840277c70' },
      { moves: "y' R' U2 F R U R' U' F' R", id: 'c3f0bf72-fa54-4193-98d2-84e1053bfa5d' },
      { moves: "F' U' F U R U' R' U R U' R'", id: '6cb84624-8c45-41f9-9095-4d8ba8143494' },
      { moves: "R U2' R' U r U' r' U' r U r'", id: '5fa08a38-26d6-4444-b01c-22fc1256ed7d' }
    ]
  },
  {
    name: 'ZBLS 17.8',
    id: 'a9a2e576-e4bd-4104-9cd8-e545a8611a93',
    idMethod,
    puzzle,
    group: 'ZBLS 17',
    algs: [{ moves: "R U2 R' U' R U R'", id: '2da4aed5-e26b-4d19-9a86-e1e5cea1c3c0' }]
  },
  {
    name: 'ZBLS 18.1',
    id: '3374c79a-1aa5-49d8-9196-b7b19ef09d61',
    idMethod,
    puzzle,
    group: 'ZBLS 18',
    algs: [
      { moves: "(U) F' U L' U B' U B L F", id: '60275f3d-ac0e-4224-8221-bdfb104f30de' },
      { moves: "U R U' R' U F' U L' U2 L F", id: '9f0a7c08-6216-4b0c-afbf-920c7b75ede1' },
      { moves: "F R' F' R2 U' R' U R U2' R2' F R F'", id: 'fb84868e-f646-46bd-b868-4161d66a85ce' },
      { moves: "F R U R' U' F' R U2' R2 F R F'", id: '1d84c603-82a1-4d5c-ae25-6b4b1a531929' }
    ]
  },
  {
    name: 'ZBLS 18.2',
    id: '73fbc65d-6a5b-4e73-8335-8fe801560df7',
    idMethod,
    puzzle,
    group: 'ZBLS 18',
    algs: [
      { moves: "(U) F' U2 F U R U R' F' U' F", id: 'ea2a2cb6-b329-45b0-8766-33b7c2394193' },
      { moves: "U' F' L' U' L U L' U' L U2 F", id: '07be8d96-565f-49f4-ad8a-f213479d857f' },
      { moves: "r U R' U R U r' U M' U2 R U r'", id: 'e05993f6-9086-4227-996b-42d17cca94cc' },
      { moves: "U' R2 D' r U' r' D r U R2 U' r'", id: 'd7019322-0af4-41cc-9958-74665beaec91' },
      { moves: "R' D' R U2 R' D R r U' r' U2' r U r'", id: '1c17f0bb-1543-41ed-8b9c-9b82320e8773' },
      { moves: "M' U2 r' F2 R U2 r U' r' U2 F", id: '8200abe9-bf0e-43e3-a3cc-da5556db38ec' },
      { moves: "R U2 R' r U r' U2 r U R' U R r'", id: '0b39fd74-9a3e-47e8-a61e-198639a01a4c' }
    ]
  },
  {
    name: 'ZBLS 18.3',
    id: '5034e613-3529-4faa-8912-6e9289af1e2c',
    idMethod,
    puzzle,
    group: 'ZBLS 18',
    algs: [
      { moves: "(U') F' U' F' U2 R' F' R U2 F2", id: '47877525-fa1b-4fef-a128-12825f3c91d1' },
      { moves: "y' U R' U2 R U x R' U R' U' R2 x'", id: 'ecf36f77-818d-4e6c-8145-c82eeda6cda1' },
      { moves: "R U' R2' F R F' r U' r' U' r U r'", id: '54aa986c-cda0-42ff-8e18-ba422110d12b' },
      { moves: "R' D R2 U2' r' U2 R U r D' R2", id: '02c7a17d-d1aa-43eb-8df1-80e6699850b9' }
    ]
  },
  {
    name: 'ZBLS 18.4',
    id: 'a62e3e42-5c43-4a21-b343-057a7e8642b6',
    idMethod,
    puzzle,
    group: 'ZBLS 18',
    algs: [
      { moves: "(U2) F2 U2 R' F' R U2 F2", id: '22f3456f-3d11-4b91-8c2a-48f29e962a98' },
      { moves: "y' R' U2 r U R' U' R2 r'", id: '044b941f-ead3-47e6-b2dc-a5bf3c7567b8' },
      { moves: "R U R' d' r' F r2 U' r' F", id: '9e5cb44b-2fbf-45bb-9abd-420669dc8ecd' },
      { moves: "R U R' F' L' U2 L U' F", id: 'ad9adaa6-831c-4edb-af5f-fcb3f0e2410e' },
      { moves: "R U' R D r' U' r D' R2' U' R U R'", id: '629a8085-8635-4cc8-a164-18de2e70f7ae' },
      { moves: "U F2 r U r' U F R U2 R'", id: 'ac7a94aa-2bbe-4794-a1e2-73354904b1bb' }
    ]
  },
  {
    name: 'ZBLS 18.5',
    id: '9f0d99ad-b31e-469a-b394-00da82d0b8da',
    idMethod,
    puzzle,
    group: 'ZBLS 18',
    algs: [
      { moves: "R U' R' F' U' F R' F R F'", id: '7c7e8eb3-12f1-4141-8733-7b4057bef29d' },
      { moves: "y' F R' U R' U' R U R2 U' F'", id: '9b82f1e1-8bbf-45b0-8203-4bb1648e5ed9' },
      { moves: "R' F R F' R U' R2' F R F'", id: 'c62d500d-3eca-4983-a4c0-f9470411d22a' },
      { moves: "R U R' U' R U2 R' F' U2 F", id: 'b9143fab-1100-4015-900b-d9d7c76e258f' }
    ]
  },
  {
    name: 'ZBLS 18.6',
    id: 'ded5e743-c68c-444e-ba42-50ac78215d28',
    idMethod,
    puzzle,
    group: 'ZBLS 18',
    algs: [
      { moves: "(U2) F2 L2 B L B' L F2", id: '1f585774-089e-484a-9ea9-5d28813b0ea4' },
      { moves: "U2 x z R2 U2 L U L' U R2 x'", id: '59095d38-8d4d-4029-a626-f1c5659b7411' },
      { moves: "R U' R' F' U F U R U R'", id: '559a9aab-db56-4100-ac97-b7b34e9f0b0e' },
      { moves: "U R U' R2' F R F' U R U' R'", id: '0ffac302-69df-4c3e-af8d-a085640effe0' },
      { moves: "U R' F R F' R U' R' U F' U' F", id: 'b532a74a-63c6-4c9b-abd5-fc6da6b50f80' }
    ]
  },
  {
    name: 'ZBLS 18.7',
    id: 'aaedc71a-9233-4d1d-bc31-339d541d07fa',
    idMethod,
    puzzle,
    group: 'ZBLS 18',
    algs: [
      { moves: "R U2 B' R' U' R U B R'", id: '87709c35-3e75-41e6-be1a-92e2c5c52cc0' },
      { moves: "R U R' U' y' R' U R U' R' U R", id: 'f513ae21-24a8-41d9-b505-6eabe42d7b35' },
      { moves: "R U' R' F' U' F U R U' R'", id: 'f1fd5eaa-32e7-411b-ab19-bedbe2f8d4b0' },
      { moves: "R U R' d' L' U L U' L' U L", id: 'ded58fec-df51-4dbd-8b83-c31e9ac097a7' }
    ]
  },
  {
    name: 'ZBLS 18.8',
    id: 'c593cb8e-6925-4468-b708-71c50d5d7d9a',
    idMethod,
    puzzle,
    group: 'ZBLS 18',
    algs: [
      { moves: "F' U2 F U F' U' F", id: '6118dcd8-c61a-4fd9-93da-66461817f36f' },
      { moves: "y' R' U2 R U R' U' R", id: '0f3a4e62-37cc-43be-8c97-32398acdb77f' },
      { moves: "R' F R F' R U' R' U R U' R'", id: '2b3129bd-51fb-4f77-86f7-075249981a11' }
    ]
  },
  {
    name: 'ZBLS 19.1',
    id: 'c77a93a2-efbd-4583-93c1-cb350681e0a4',
    idMethod,
    puzzle,
    group: 'ZBLS 19',
    algs: [
      { moves: "(U') R2 B' R' B2 U2 B' R'", id: '56157e37-35ad-4281-9060-21acd1fa3ba9' },
      { moves: "y U2 L' U L U F R U2 R' F'", id: 'b40b086f-8369-491d-ad88-2eecb855961a' },
      { moves: "U2 R U R2' r U' M U2' r U' r'", id: '4f09c29b-647b-4b4f-a943-804e7bdc749d' },
      { moves: "R' U' F' U F2 R2 U R' U' R' F' R", id: '86061d5b-da66-406d-9a95-c81cf02bc1d8' }
    ]
  },
  {
    name: 'ZBLS 19.2',
    id: 'b7ee1919-74b0-4834-9535-dbd103df6d71',
    idMethod,
    puzzle,
    group: 'ZBLS 19',
    algs: [
      { moves: "(U) R U2 R2 F R F'", id: '0add98b7-e5fc-4402-a9ec-68c7a3dfaf3a' },
      { moves: "y U2 F U2 R U2 R' U F'", id: 'ae370410-b34f-4363-80af-50a05a8143b9' }
    ]
  },
  {
    name: 'ZBLS 19.3',
    id: '60b42dc7-87a2-417f-8281-bfb1f5f2ae88',
    idMethod,
    puzzle,
    group: 'ZBLS 19',
    algs: [
      { moves: "(U) R U R' F' U' F R U R'", id: 'a4b3de46-1367-4a3a-ad85-3e8041206e14' },
      { moves: "y F U' R U' R' U R U2 R' F'", id: '68f4d908-dcf0-4c47-b07a-dbde43aa2cdf' },
      { moves: "U (F R U R' U' F') R U R'", id: '2b0e1594-6fd1-451b-9758-bdc9f922462d' }
    ]
  },
  {
    name: 'ZBLS 19.4',
    id: 'c23c33cf-0c11-4d17-9f96-79f95b734500',
    idMethod,
    puzzle,
    group: 'ZBLS 19',
    algs: [
      { moves: "(U) R U2 R' U R B U' B' R'", id: '8fad1fe4-e7a2-44f3-a737-92fbdc391627' },
      { moves: "y F R U' R' U R U2 R' U2 F'", id: '702698a9-6634-4d65-af00-d3b07be5097c' },
      { moves: "U' l R U' R' U x U' R' U2 R U R'", id: 'a3e25494-d7aa-46f4-b4b4-ed2dee9251be' },
      { moves: "U F R' F' R r U' R' U R U r'", id: 'd1054a32-6fce-4204-9a61-7896d6901f88' },
      { moves: "F R' F' R2 U2 R' U2 R U R'", id: 'b066db4b-7142-41b7-a9fd-3cc8e2546556' }
    ]
  },
  {
    name: 'ZBLS 19.5',
    id: 'f74f768d-fc60-4adc-b9c9-d87e10131787',
    idMethod,
    puzzle,
    group: 'ZBLS 19',
    algs: [
      { moves: "(U) F' U F2 R' F' R F' U F", id: 'c988d41e-d20a-4613-88f5-0db8e9bb3168' },
      { moves: "y' U' F R U R U' R' U R2 U' F'", id: 'aa5796b9-6e81-4728-b2c5-a64299435cf9' },
      { moves: "F' U' F U2 R U' R' U R U' R'", id: '9a60ffa2-3dc4-4824-8fb7-0c92b19c77ae' },
      { moves: "U' r U' R' U' R U r' U R U' R'", id: '8a896394-7a88-445d-8ff2-5989fd37e35b' },
      { moves: "U R U2' R' U R U R' U2' R' F R F'", id: '70ad0e60-04d7-45bb-9814-8fec0772892c' }
    ]
  },
  {
    name: 'ZBLS 19.6',
    id: 'a6a4858a-8312-4cf4-be2b-b4b1bf5b420b',
    idMethod,
    puzzle,
    group: 'ZBLS 19',
    algs: [
      { moves: "(U) R U' R' F' U2 F R U2 R'", id: 'c3e86c23-8e03-49b3-8c54-174746ffa1e2' },
      { moves: "U r U2 R' U R U' R' U R r'", id: '7a103db9-5ee8-4c41-b7f4-ada3cabe80fe' },
      { moves: "U R' F R F' R U' R' U2 R U' R'", id: 'fb486fb1-3629-4141-bc6c-3645d3d6d44e' },
      { moves: "F' U R U R' U' R' F R2 U R'", id: 'e0d51e99-bef4-4961-9d7c-43a42b1bcf8f' },
      { moves: "U R U2' r' U R U' R' U' M'", id: '2fd72caa-b214-4068-86eb-8dc8ee56cf7a' }
    ]
  },
  {
    name: 'ZBLS 19.7',
    id: '0a6f0072-4252-4e06-b69b-ebc0b8bafbe1',
    idMethod,
    puzzle,
    group: 'ZBLS 19',
    algs: [
      { moves: "(U') R2 B' R' B2 U' B' U' R'", id: '38d05c93-40af-4fab-b44f-7d64b1c87910' },
      { moves: "y U' F U R U R' U' R U2 R' F'", id: 'c906f985-0e0c-483d-ad5d-a8c0221d4644' },
      { moves: "R' U R U' R2 F R2 U R' U' R F'", id: 'f285e721-c126-4005-bf21-86a0aed1bae1' },
      { moves: "U' R U' R' U r U' R' U2' R U r'", id: '41cffc4c-33e0-4827-8a2a-d1a5d37c94a7' }
    ]
  },
  {
    name: 'ZBLS 19.8',
    id: '9878b231-9c67-441b-a6c0-605b5427323b',
    idMethod,
    puzzle,
    group: 'ZBLS 19',
    algs: [{ moves: "(U) R U2 R' U R U' R'", id: 'b425b9c8-f221-478a-81ae-93d7ea3c123a' }]
  },
  {
    name: 'ZBLS 20.1',
    id: '0a145897-dfac-4bee-b5c5-cd64e5aa77f1',
    idMethod,
    puzzle,
    group: 'ZBLS 20',
    algs: [
      { moves: '(U) F2 L F L2 U2 L F', id: '73213a06-a473-4f79-80ac-3e710e244015' },
      { moves: "U2 R U' R' U' F' L' U2 L F", id: 'd60fadcc-ef2f-4b00-bc39-df1d4b24fb1f' },
      { moves: "U' R U' R2' F R F' U' R' F R F'", id: 'ef0de7c0-698d-4307-8c99-2a4ab6eca08c' },
      { moves: "U R U' R2 F R F2 U' F", id: '926702c3-88e8-4d91-b685-c1d7d169db7a' }
    ]
  },
  {
    name: 'ZBLS 20.2',
    id: 'c3e7e097-ce6d-4000-92c4-54031bcb4c6b',
    idMethod,
    puzzle,
    group: 'ZBLS 20',
    algs: [
      { moves: "(U') F' U2 F2 R' F' R", id: '231d4b82-5987-4ecb-b4ed-a2d703012fe3' },
      { moves: "U2 F' U2 L' U2 L U' F", id: 'a3a87717-c80d-4356-a476-8cf8d65426e4' },
      { moves: "U' F' U' r U' r' F2", id: 'a7ffa488-1cfd-4dcc-b464-0f3fa9551272' },
      { moves: "y U' L' U2 L2 F' L' F", id: '527edddc-e54b-4efe-89cd-6cfb740ab23a' }
    ]
  },
  {
    name: 'ZBLS 20.3',
    id: '57aba7b2-2d88-447c-9a52-218366ec1fbd',
    idMethod,
    puzzle,
    group: 'ZBLS 20',
    algs: [
      { moves: "(U') F' U' F R U R' F' U' F", id: '39c765ac-be39-4f74-b5bf-d9a74dc499a6' },
      { moves: "F' U L' U L U' L' U2 L F", id: '2a9680e0-9588-4e84-96e3-6a0e34720c55' },
      { moves: "r' D' r U r' D r2 U' r' U2' r U r'", id: '93134930-d21a-4888-9182-5a9d979ecfc3' },
      { moves: "U' R U' r' U r U2' r' U' r U R'", id: '88717597-bb51-4f7a-8a9b-d7133bab07d7' },
      { moves: "F D R2 U' R' U2 R U R2 D' F'", id: '9e9eeb53-a911-4745-86ce-29c83019726f' }
    ]
  },
  {
    name: 'ZBLS 20.4',
    id: '8e60b829-49ac-430a-8429-7a2f3d52a28a',
    idMethod,
    puzzle,
    group: 'ZBLS 20',
    algs: [
      { moves: "(U') F' L' U2 L F U' R U R'", id: '98cf10c7-b65b-4665-91d4-dfecb21ed603' },
      { moves: "F' L' U L U' L' U2 L U2 F", id: 'a5fcbffc-824c-49cc-b60b-fb764855757d' },
      { moves: "R' F2 R U' F U R' F2 R", id: 'd39cddab-dd68-4ba1-a0f5-cfa4a8e67202' }
    ]
  },
  {
    name: 'ZBLS 20.5',
    id: '4412659b-0844-4f9d-a765-febdf2c66ebc',
    idMethod,
    puzzle,
    group: 'ZBLS 20',
    algs: [
      { moves: "(U') R U' R2 F R F' R U' R'", id: 'cc342a39-5ce6-463c-9e74-3083031ae43f' },
      { moves: "U R U' R' U R U' R' y' R' U' R", id: '54b8d6a7-e287-483e-afbf-80f439977d3f' }
    ]
  },
  {
    name: 'ZBLS 20.6',
    id: '0b8b956a-cd57-4fa0-9218-397f45d9f61e',
    idMethod,
    puzzle,
    group: 'ZBLS 20',
    algs: [
      { moves: "(U') F' U F R U2 R' F' U2 F", id: 'a8464d00-3ab9-425c-91f7-c1e815b87dee' },
      { moves: "y' U' r' U2 R U' R' U R U' R' r", id: '890060c3-74bb-4a22-9f41-3d5261498893' },
      { moves: "U' R U' R' U R U' R' d R' U R", id: '03f47c46-0eeb-444b-822a-ea8131af5e70' },
      { moves: "R' F2 r U2 R U' r2' F r F", id: '2fb5d27a-9881-4291-8815-4fc69e1c5364' }
    ]
  },
  {
    name: 'ZBLS 20.7',
    id: 'dbdf6371-f102-495d-bc1d-7f5bf8421556',
    idMethod,
    puzzle,
    group: 'ZBLS 20',
    algs: [
      { moves: '(U) F2 L F L2 U L U F', id: 'b75f3a49-17bc-46dd-9c30-80bedf03fe80' },
      { moves: "U F' U' L' U' L U L' U2 L F", id: '512ba7c5-34c3-46ed-bd50-8a3cf6baa3ba' },
      { moves: "R' U' R' F R F' U R2 U' R'", id: 'ac466f24-811e-42f6-8bd5-3200f5b794f2' },
      { moves: "U2' r U' R' U R U r' F' U' F", id: '14c56172-56e5-4b04-b194-1d91399d035d' },
      { moves: "x R' U R U' R' U R U2' x' U' F", id: 'db82f152-7c02-4d6e-afff-9b2198928b6a' },
      { moves: "U2' R U' R' U F' r U' r' F2'", id: 'db02593c-2216-41b9-a416-b14fddb5b8e2' }
    ]
  },
  {
    name: 'ZBLS 20.8',
    id: '0b35c5d2-ae3c-4fe6-9b36-e04ebf5a56e7',
    idMethod,
    puzzle,
    group: 'ZBLS 20',
    algs: [
      { moves: "(U') F' U2 F U' F' U F", id: 'a339fc09-901b-4f74-886a-4ad508f2c6de' },
      { moves: "y' U' R' U2 R U' R' U R", id: 'de9447e4-06da-4755-8e00-0b4680280c03' }
    ]
  },
  {
    name: 'ZBLS 21.1',
    id: '3c4a868c-6200-4c38-8b41-fd600b4a640a',
    idMethod,
    puzzle,
    group: 'ZBLS 21',
    algs: [
      { moves: "(U2) F' L' U2 L2 F' L' F2", id: '1c33ab18-127f-46bd-a864-6df30464804f' },
      { moves: "U2 F' L' U2 L2 x U' L' U2 x'", id: '0fc98d6e-0ebf-4e84-ac4b-c34371950cb8' },
      { moves: "U2' F' r' F2 r2 U' r' F2", id: 'b6b9723c-d738-4307-885c-ff02c427f00d' },
      { moves: "U R' F R F2 U' F R U2 R'", id: 'c6bdb46b-7d29-4248-94c0-bb62b7f9a73d' }
    ]
  },
  {
    name: 'ZBLS 21.2',
    id: '266d06c5-f5f1-497f-ba97-8be11abaef9a',
    idMethod,
    puzzle,
    group: 'ZBLS 21',
    algs: [
      { moves: "(U) F R U R2 U' F' U R", id: 'b14fdab1-ae96-4e9d-b4ca-7cdc7a63eec0' },
      { moves: "U F R' F' R2 U' R' U R U R'", id: '81205ee2-95f7-40c7-9ba9-ac294f981b25' },
      { moves: "U2' R U r' U R U' R' U' M'", id: 'd0c84f96-853d-4ffb-b97b-c66b19fd5837' },
      { moves: "r' U2 R' U R2 U' R U2 r", id: '7574978b-ea68-4777-b111-a3b7e0c2c092' }
    ]
  },
  {
    name: 'ZBLS 21.3',
    id: '30243c98-4d61-40db-91fa-7ed491cb8543',
    idMethod,
    puzzle,
    group: 'ZBLS 21',
    algs: [
      { moves: "(U) R B U B' U R'", id: '67cedd09-51db-48ec-a797-655e905454d8' },
      { moves: "y U F R U R' U F'", id: '1e8acda9-3d61-4442-a9c6-23563c109482' },
      { moves: "U2 F R U R' U' F' U' R U2 R'", id: '56c6124b-ef3e-43fc-9f41-cef6b163467e' }
    ]
  },
  {
    name: 'ZBLS 21.4',
    id: 'd9116fc1-ff87-48cd-8626-1c3ea2ca9f5e',
    idMethod,
    puzzle,
    group: 'ZBLS 21',
    algs: [
      { moves: "R B U2 B' R'", id: 'bf4e3afd-43de-4e6f-868e-27949e8fdd8e' },
      { moves: "y F R U2 R' F'", id: 'ddc878a2-7d5c-48d0-9d46-e7d17847023c' },
      { moves: "r U' R' U2 R U r'", id: '05635913-ef15-4aa6-af45-90e8f9e859d4' }
    ]
  },
  {
    name: 'ZBLS 21.5',
    id: '6fa263ab-78d2-45f3-9395-588077290c1e',
    idMethod,
    puzzle,
    group: 'ZBLS 21',
    algs: [
      { moves: "(U) R' F R F' U R' F R F'", id: '75fad28f-2a08-4f06-9fe7-ad4d01e3f487' },
      { moves: "U2 x R' U' R D' R' U2 R U' D x'", id: '6849de09-3d34-418e-b607-bdf5cdfb9294' },
      { moves: "U R U' R' U2 R U' R2' F R F'", id: '50e7b7ae-6510-4ea0-a82b-d4fbeb377923' },
      { moves: "R U R' U' F' U F R U R'", id: '85da3ffc-efe2-455f-af44-d539adb9655a' },
      { moves: "U2 F' r U R' U' r' F2 R F'", id: '3d42a6ea-0d26-4d05-a218-b31ed808bb2a' }
    ]
  },
  {
    name: 'ZBLS 21.6',
    id: 'acec08f7-280a-43b3-bc10-bb8d86e97b46',
    idMethod,
    puzzle,
    group: 'ZBLS 21',
    algs: [
      { moves: "(U2) R U R2 F R F'", id: 'ebf83b56-0f57-4096-8f4f-0e21629a3fe0' },
      { moves: "U2 x' R U' R U R2 x", id: '1ddb8e06-830d-4a89-8212-dce9c2607808' },
      { moves: "U2' R U R2' F R F'", id: '9878fbd5-8d88-44d5-bf61-5139b75b79e7' },
      { moves: "U2 R B' R B R2", id: 'df07d090-039e-4e35-b095-835372e979a1' }
    ]
  },
  {
    name: 'ZBLS 21.7',
    id: 'f25e54b4-6a9b-493e-a979-7762d6f57951',
    idMethod,
    puzzle,
    group: 'ZBLS 21',
    algs: [
      { moves: "R B U' B' U' R'", id: 'baafd1d4-0fba-4fb6-ad32-bcba69e085ee' },
      { moves: "y F R U' R' U' F'", id: 'a5bde8af-c8d9-46e5-8f81-9da6f0fe18f0' },
      { moves: "U R' F R F' U' R U2 R'", id: 'a2a84c41-46a8-457f-8dc9-7b6660f29002' },
      { moves: "U2 F' U' F R U R'", id: 'caf2471d-7299-48b2-a3ec-2e50b3d66188' }
    ]
  },
  {
    name: 'ZBLS 21.8',
    id: '4e44082a-d102-4416-8f02-5f3dd1bec96a',
    idMethod,
    puzzle,
    group: 'ZBLS 21',
    algs: [
      { moves: "(U2) R U R' U R U' R'", id: '8d28bd9b-2f8d-4963-8da0-ff2ca68bb76a' },
      { moves: "R U' R' U2 R U R'", id: '8395fe09-f0f0-4095-b226-48820109a7a2' }
    ]
  },
  {
    name: 'ZBLS 22.1',
    id: 'f20b6a71-7bad-4d73-99cd-ce978928e586',
    idMethod,
    puzzle,
    group: 'ZBLS 22',
    algs: [
      { moves: '(U2) R B U2 B2 R B R2', id: 'd64b55c6-0a71-40c1-a597-cda0cad0fa75' },
      { moves: "U' R U2 r' U r U2 r' U' r U R'", id: '82bb0a0a-66c1-4c83-a908-c47cc4018a81' },
      { moves: "U' F R' F' R U2' r U' r' U r U r'", id: '5b92305d-6d96-4666-9a77-81370c9dbe9b' },
      { moves: "M' U R U' r' F2 r U r' U2 F", id: '4e5a3062-d71c-4e38-a914-9cab94a26dc6' }
    ]
  },
  {
    name: 'ZBLS 22.2',
    id: '1bef087f-f5f7-4195-8fe8-04c269488d85',
    idMethod,
    puzzle,
    group: 'ZBLS 22',
    algs: [
      { moves: "F' L' U' L U' F R U' R'", id: '43c6413d-10ec-4835-b9ce-eaf775913e59' },
      { moves: "U2' R' F R F' R U R2' F R F'", id: 'e15e96b2-6369-4c7c-877f-34adb2af6956' },
      { moves: "r U' r' U2 y' R U R U' R'", id: 'e22368ef-8b06-4544-a957-6c7a1cbad49b' }
    ]
  },
  {
    name: 'ZBLS 22.3',
    id: '183865e9-15ee-412b-912c-bb9381c9e32c',
    idMethod,
    puzzle,
    group: 'ZBLS 22',
    algs: [
      { moves: "(U') F' L' U' L U' F", id: 'd71d5bb2-3eb7-46b9-a697-05fefb89b5ea' },
      { moves: "U2 R' F R F2 U' F R U R'", id: '202bd0fb-fa76-4b1a-82ab-046a77eca0ea' }
    ]
  },
  {
    name: 'ZBLS 22.4',
    id: '789a32a5-21d1-4310-8731-467ead05340c',
    idMethod,
    puzzle,
    group: 'ZBLS 22',
    algs: [
      { moves: "F' L' U2 L F", id: '44d469b0-b68b-4be1-9de1-f84af580a4a2' },
      { moves: "r U' r' U2' r U r'", id: '52e0fe2c-20db-4b94-b5f6-2678433f2a94' }
    ]
  },
  {
    name: 'ZBLS 22.5',
    id: '85868eea-9d4a-4eba-89a5-513055cd60ce',
    idMethod,
    puzzle,
    group: 'ZBLS 22',
    algs: [
      { moves: "(U') F R' F' R U' F R' F' R", id: 'd886c26b-ea46-44f5-a00b-151b51f1a2e4' },
      { moves: "U R U' R' U' R U' R' y' R' U' R", id: '8797e7c3-11e8-463d-94e3-73ed49b40913' },
      { moves: "R2 U2 R2 F R F' R U2 R2", id: '562b3c17-5d50-4ced-b363-52064390a1fb' }
    ]
  },
  {
    name: 'ZBLS 22.6',
    id: 'e65c0b9b-802f-46a8-82fa-177fc08945d8',
    idMethod,
    puzzle,
    group: 'ZBLS 22',
    algs: [
      { moves: "(U2) F' U' F2 R' F' R", id: '8abed934-0625-4bdf-bca9-cbf9c5b52b06' },
      { moves: "U2 F' r U' r' F2", id: '2783d05a-d6be-4b37-a44d-a5c3d1b3f013' }
    ]
  },
  {
    name: 'ZBLS 22.7',
    id: '1a403720-4ac9-44ef-b2da-2ab99583bc4d',
    idMethod,
    puzzle,
    group: 'ZBLS 22',
    algs: [
      { moves: "F' L' U L U F", id: '586bdee2-a075-4bcb-a10f-1ac7a7ede2a3' },
      { moves: "U2' R U R' F' U' F", id: 'ff0da93a-0b9d-4894-9a08-22e0f835bd95' },
      { moves: "y' R' F' U F U R", id: 'f6f58c74-dd54-4b25-ac5f-608d4dea6f8f' }
    ]
  },
  {
    name: 'ZBLS 22.8',
    id: 'f99b67cc-5299-4977-a971-3fcd1dcc7017',
    idMethod,
    puzzle,
    group: 'ZBLS 22',
    algs: [
      { moves: "(U2) F' U' F U' F' U F", id: 'bb09640b-29e1-46c5-9b23-d6b34dd3fa65' },
      { moves: "y' R' U R U2 R' U' R", id: 'e30efe2f-dcf7-4d87-be7f-c53f6ec66294' },
      { moves: "U2 R' F R F' R U R' U R U' R'", id: '2dba8bb6-d43f-4ea2-a91c-a4a63bc50cf4' }
    ]
  },
  {
    name: 'ZBLS 23.1',
    id: '9ac20c69-6fd9-40d4-8eda-4202ee949bd8',
    idMethod,
    puzzle,
    group: 'ZBLS 23',
    algs: [
      { moves: "(U') F' L' B' U' B U' L U' F", id: '3da06167-99e7-486d-9042-f4b435813d1b' },
      { moves: "y L' U' L U2 F R U2 R' U F'", id: 'e474ada0-74c4-4132-815d-f93482410248' },
      { moves: "U' R' F R F' U2' R U' R' U R' F R F'", id: 'eb662ecb-8846-4e6a-bb51-f91a9c83f480' },
      { moves: "U F R' F' R2 r' U R U R' U' M'", id: '97d5b448-25b3-4bba-931f-84478fac86aa' },
      { moves: "(U') F2 r U r' U' r' F' r2 U' r' F2", id: '6998a8ac-089a-4c5a-9502-2ada31a72602' }
    ]
  },
  {
    name: 'ZBLS 23.2',
    id: 'd038d2a5-ebdd-44ce-9bb1-5b5241aa8edc',
    idMethod,
    puzzle,
    group: 'ZBLS 23',
    algs: [
      { moves: "(U') R U' B U' B' R' F' U' F", id: '6e04ef22-bb28-4f61-b018-a14846e8be5b' },
      { moves: "y U F U2 R2 U R' U R U2 R2 F'", id: '1907a089-35db-47d1-85b2-9bd469f9927b' },
      { moves: "M U2 R U R' U r U' R'", id: '838582cd-2bcd-4d63-b3cd-126eb7a14b3c' },
      { moves: "U2' r U' r' U r U r' U R U' R'", id: '64f41dd4-2790-4127-beed-4f653c20d403' }
    ]
  },
  {
    name: 'ZBLS 23.3',
    id: '97519777-11c7-444b-88da-100cee9b681f',
    idMethod,
    puzzle,
    group: 'ZBLS 23',
    algs: [
      { moves: "R U R B' R' B U2 R'", id: '7d8a0654-701e-433d-9936-65c47aa9b35d' },
      { moves: "y F R U' R' U R U R' U2 F'", id: 'ac846bb5-304e-443f-a920-170e01663d45' },
      { moves: "R U2' R' U r U' R' U' R U r'", id: '706d720b-fc3e-41b7-b7ec-b82db59a5f48' },
      { moves: "R U2 R' F' U F U' R U R'", id: 'aed2beab-4a71-4cb0-9ccd-2289d3587a56' }
    ]
  },
  {
    name: 'ZBLS 23.4',
    id: 'f4f420ed-7741-47d1-ac7b-cd40435c8fc4',
    idMethod,
    puzzle,
    group: 'ZBLS 23',
    algs: [
      { moves: "R U R' F' U F R U R'", id: '5646e1aa-b562-4274-aa06-b2dd1b9e9a43' },
      { moves: "U F R' F' R U R U R'", id: '92a1ecd1-6feb-4885-bc5a-34c70d265a06' },
      { moves: "U x U R' U' R x' U R U R'", id: '3aec54f4-aa4d-493f-9fa2-a225908944e9' }
    ]
  },
  {
    name: 'ZBLS 23.5',
    id: 'fecf78a0-8956-4bd6-87ec-1461843d00a4',
    idMethod,
    puzzle,
    group: 'ZBLS 23',
    algs: [
      { moves: "(U') R B U' B' R' F' U' F", id: '6a09e350-e7ca-4196-9f8d-d83bb19335a6' },
      { moves: "F' U L' U2 L U' L' U2 L F", id: 'e4ed2649-51d5-4396-929b-4a6e38c1ef9d' },
      { moves: "U R U' R' U' R U' R2' F R F'", id: 'f3a9ea73-5387-44a8-834a-9c9c0a9524a2' },
      { moves: "F' U' F U' R U' R' U R U' R'", id: 'ef056472-b5fa-48c8-9e8f-9cdee084c291' }
    ]
  },
  {
    name: 'ZBLS 23.6',
    id: '46edb128-1129-4ec5-9c43-668ce8e3b8f3',
    idMethod,
    puzzle,
    group: 'ZBLS 23',
    algs: [
      { moves: "(U') F' U2 F' U' L' U L F2", id: '8d038f08-a9b7-49c5-8834-edcb3559058f' },
      { moves: "y F' U' L' U L F L' U L", id: 'c1927360-0e9b-48b7-9aa1-001a98822b37' },
      { moves: "U R' F R F' R U R' U2 R U' R'", id: 'd5dda579-2d85-433b-bfae-8d2d6f5762d0' },
      { moves: "F U R U' R' F' U' F' U' F", id: '2ff58158-f44c-433a-afbc-71ef9ec05dc8' }
    ]
  },
  {
    name: 'ZBLS 23.7',
    id: 'f01de627-f1ce-46ba-8c3d-f1a9aac6cf4a',
    idMethod,
    puzzle,
    group: 'ZBLS 23',
    algs: [
      { moves: "(U') L F U F' U' L' F' U' F", id: '8b86b6b9-682f-42d7-a2e0-7ceface57ecd' },
      { moves: "F' U' L' U' L U2 L' U2 L F", id: '95f34677-0cb6-4a20-a447-86623c720ebe' },
      { moves: "U2 R U R' U' R U' R' U R' F R F'", id: '560edd4e-608c-48d4-a988-859c02001f5f' },
      { moves: "U2 R U2 R' U' R U' R2 F R F'", id: '50d88c91-a5d1-4e92-b87f-7baf9974fa57' }
    ]
  },
  {
    name: 'ZBLS 23.8',
    id: 'f3daa50c-b395-4530-9126-3595f4845982',
    idMethod,
    puzzle,
    group: 'ZBLS 23',
    algs: [
      { moves: "(U2) R2 U2 R' U' R U' R2", id: 'ee9c40a2-3966-4499-9ae3-a24d97a40c26' },
      { moves: "R U' R2' D' R U2 R' D R", id: '6708ef2a-988a-4556-80be-622f2ba011cf' }
    ]
  },
  {
    name: 'ZBLS 24.1',
    id: '981c77f5-1fd1-4ac0-82fc-f45aad3940f4',
    idMethod,
    puzzle,
    group: 'ZBLS 24',
    algs: [
      { moves: "(U) R B L U L' U B' U R'", id: '66abe9e3-189d-4973-af7d-702f082034b3' },
      { moves: "y' R' F' U L' U' L U F R", id: 'c0ec4152-e501-4187-9cf9-4450a4ce79d6' },
      { moves: "R U' R2 D' r U M U R' D R", id: '9a80ceef-e8fb-422c-a7fb-0cf93dec2cdf' },
      { moves: "R U R' U2 F' r' F2 r U' F", id: '68c8c043-851d-40b9-ab69-6274d1733b82' },
      { moves: "U2 R U R' U' r U2' r' U' r U' r' U r U2' r'", id: '680207a2-894e-446f-8459-fafe5c6846a7' }
    ]
  },
  {
    name: 'ZBLS 24.2',
    id: 'e2e8540a-3d04-4a7e-971f-068365ba4647',
    idMethod,
    puzzle,
    group: 'ZBLS 24',
    algs: [
      { moves: "(U) F' U L' U L F R U R'", id: 'c9ca40d3-e557-4d88-83dd-ced79cf163ed' },
      { moves: "U' F' U2 L2 U' L U' L' U2 L2 F", id: '79df4ddf-ab69-4a89-9972-3fcc702fd631' },
      { moves: "y' M' U2 R' U' R U' r' U R", id: '4e2450c5-0c09-495e-9f5f-5acccb39d47d' },
      { moves: "U r U' r' U2' r U r' R U2' R' U R U' R'", id: '128e181c-30a8-4dcc-a6cd-28b5cb53ae4b' },
      { moves: "F' U' r U2 R' U' R U' r' U2' F", id: '86cb71f6-6cbd-4dbc-a6a7-e6f18eb72856' },
      { moves: "U2 R' F R y' R U2' R U R' U R2", id: '6a23c4ca-c16b-47b5-917d-0cae12c60a1c' },
      { moves: "U' R U' R' F' L' U' L U' F", id: 'ae3aee74-2f27-426c-9e02-b3ada443e02d' },
      { moves: "U' F' U r' F r U r' F r U' F", id: 'b29f2a59-078a-43fe-99f0-9f441fdaf76c' }
    ]
  },
  {
    name: 'ZBLS 24.3',
    id: 'c4458b0e-22c8-4229-90a7-d257bc55e58e',
    idMethod,
    puzzle,
    group: 'ZBLS 24',
    algs: [
      { moves: "F' U' F' L F L' U2 F", id: '553e3916-7040-4fda-82d1-cff800cea5a9' },
      { moves: "F' L' U L U' L' U' L U2 F", id: '26cf76d1-1da5-44d0-b541-788607a1b43e' },
      { moves: "r U' r' U' r U r2' D' r U2' r' D r", id: '74282fe6-6b01-426f-845c-334ea804dd01' },
      { moves: "r U R' U R U r' U' r U r'", id: 'ff56a769-5758-4df1-af73-542ad98bd6eb' },
      { moves: "r U' r' U' r U r' F' U2' F", id: 'daa1262d-32e8-4154-8cef-8de66135b34c' }
    ]
  },
  {
    name: 'ZBLS 24.4',
    id: 'ba1e2933-002f-482a-b3ac-1b1fe0a1c81b',
    idMethod,
    puzzle,
    group: 'ZBLS 24',
    algs: [
      { moves: "F' U' F R U' R' F' U' F", id: '20e5a84e-2875-4a90-912a-7e7134c6c6f6' },
      { moves: "U' x R' U R U' z x' U' R' U' R", id: 'c63afb65-c3a2-4a08-b08c-d5740657d27f' },
      { moves: "U' R U' R' U r U' r' U2' r U r'", id: 'be69f1e5-7f4d-42ac-b954-d2029034b49f' },
      { moves: "F U R U' R' F2 U' F R U' R'", id: 'fdce8581-a805-4afb-94bd-ca2be6f8195d' }
    ]
  },
  {
    name: 'ZBLS 24.5',
    id: '0c7b09b7-3099-4bdd-9d1d-c62eeadd6171',
    idMethod,
    puzzle,
    group: 'ZBLS 24',
    algs: [
      { moves: "(U) F' L' U L F R U R'", id: 'ec4942b9-ecde-43d8-8c35-151b17eee41a' },
      { moves: "y F U' R U2 R' U R U2 R' F'", id: 'bd359fa4-858a-468d-8850-431285d86651' },
      { moves: "R U R' d R' U R U' R' U R", id: '04ea3949-f30d-4ec7-abd6-872ff6d8b742' },
      { moves: "R U' R2 F' U' F U R2 U' R'", id: 'e20e645f-eafe-4f21-b316-7c632c561bae' },
      { moves: "U F' r' F r F R U R'", id: '04a0491e-a24b-4d0e-88d3-fb63d6b13a2a' }
    ]
  },
  {
    name: 'ZBLS 24.6',
    id: '9c0b2825-a8d5-4432-b1f2-19b0e1984330',
    idMethod,
    puzzle,
    group: 'ZBLS 24',
    algs: [
      { moves: "(U) R U2 R U B U' B' R2", id: '251b5fe8-4547-4bfe-a950-da4147e4043d' },
      { moves: "F U R U' R' F' R U' R'", id: '4edff986-6bb7-4938-ba17-c3c6f3bd8aff' }
    ]
  },
  {
    name: 'ZBLS 24.7',
    id: 'a79754a4-92f2-4958-ae9e-7a22dbdf4072',
    idMethod,
    puzzle,
    group: 'ZBLS 24',
    algs: [
      { moves: "(U) B' R' U' R U B R U R'", id: '83a07e46-a3be-4377-8679-093a107a6591' },
      { moves: "y' F R U R U' R2 U R2 U' F'", id: '1fc67a09-196e-4c43-95cd-60335bea755d' },
      { moves: "R U' R' U r U' R' U R U r'", id: '13ae7ced-896a-4ebd-8315-78f1da174d8c' }
    ]
  },
  {
    name: 'ZBLS 24.8',
    id: '3a60370b-dd7d-4b6f-bf0b-af7657c6dcaf',
    idMethod,
    puzzle,
    group: 'ZBLS 24',
    algs: [
      { moves: "U2 F2 U2 F U F' U F2", id: 'f0a7a525-3919-44be-9b01-4e62b8ae223b' },
      { moves: "y' U2 R2 U2 R U R' U R2", id: 'c60b41b6-6751-426a-b046-d884ea35e112' },
      { moves: "U' R U R2' F R F' R U' R'", id: '5bebe4b0-fc99-4311-83f5-18d49ac4dba4' }
    ]
  },
  {
    name: 'ZBLS 25.1',
    id: 'c628f826-a489-446a-81e3-bd364dcc5f9f',
    idMethod,
    puzzle,
    group: 'ZBLS 25',
    algs: [
      { moves: "(U) R2 D L' B L D' R' U' R'", id: '58d47948-2f9f-4db4-ac5c-a2ca4e195794' },
      { moves: "r U2 R' U R r' U2 r U' r'", id: 'd7453470-434b-4103-a9b2-c0f90816abd0' },
      { moves: "r U r' U2 r U R' U' R U2 r'", id: 'b1ed2ef8-6a14-4802-b581-5798a3e2941c' },
      { moves: "U R2 D r' U r D' R' U' R'", id: '444ed4d8-85ed-4727-bff4-e814832d2280' }
    ]
  },
  {
    name: 'ZBLS 25.2',
    id: '2de51e42-017b-4eb8-a2ca-6847b7b149fd',
    idMethod,
    puzzle,
    group: 'ZBLS 25',
    algs: [
      { moves: "(U) B' R2 U' R U R2 B", id: '4c580c03-5483-4d5b-9d90-93849bf35875' },
      { moves: "r' U' R' U' R' U R U r", id: 'ca9d0e2b-f471-412d-bb5c-c1fb2bc4749b' },
      { moves: "U2 r U2' R' U R U' R' U2' R U' r'", id: '3ff9d074-f230-4ea7-b413-93d009d382cd' }
    ]
  },
  {
    name: 'ZBLS 25.3',
    id: 'fa9c1ae8-3afb-4028-ba12-d29ee1702418',
    idMethod,
    puzzle,
    group: 'ZBLS 25',
    algs: [
      { moves: "B' R2 U' R' U R2 B", id: '9bf08003-cc80-4ff4-9423-4d529560af1f' },
      { moves: "U r U r' U R U R' r U r'", id: 'b2eade21-213f-4f4f-82b0-1c517c054f6e' },
      { moves: "U2 r U' r' R U' R' U' r U' r'", id: 'ff0914bb-a299-4ef3-a093-cd41134298ed' },
      { moves: "U2 F' L' U' L U R U R' U' R' F R", id: 'fee176bb-7084-41b4-89f4-af56a905e29b' }
    ]
  },
  {
    name: 'ZBLS 25.4',
    id: 'af448ae8-8bca-435b-bd45-59b3563296f4',
    idMethod,
    puzzle,
    group: 'ZBLS 25',
    algs: [
      { moves: "(U2) R U2 B U2 B' U2 R'", id: 'd3b1ad9d-7770-4e09-90e5-f3ef0373f217' },
      { moves: "U2 r' U' R' U' R U R U r", id: '59ee613d-aa29-4e70-a16c-aaf04bcc6f7b' },
      { moves: "r U r' U2 r U R' U2 R U' r'", id: '7a9657d6-f43c-4800-8c88-4800cb9a2602' },
      { moves: "F2 r U2 R' U' r' F2 R F'", id: '2828ef1e-9641-432d-a6b5-50412dc33bfb' }
    ]
  },
  {
    name: 'ZBLS 25.5',
    id: '9255462f-073b-4098-a1d9-8df241b84e6e',
    idMethod,
    puzzle,
    group: 'ZBLS 25',
    algs: [
      { moves: "(U') F' U' F U R U R'", id: '62319e93-d08f-49c8-b226-3922ec0e1535' },
      { moves: "x R U D' R D R' U' R' x'", id: 'a255a129-ab16-4eb8-a214-f598dbd0a79a' },
      { moves: "R2' U R U' R' U F R2 F' R'", id: 'ff5846fb-3336-40e5-9bce-9fa92c9c8e52' }
    ]
  },
  {
    name: 'ZBLS 25.6',
    id: '89ee35f0-1708-48b0-96af-61739a2122be',
    idMethod,
    puzzle,
    group: 'ZBLS 25',
    algs: [
      { moves: "(U') F' U F U R U' R'", id: 'ecca0f91-fd17-482e-8b56-b3f299568ee0' },
      { moves: "y U' F U2 R U R' U2 F'", id: 'd007827e-a081-42d3-92a8-c67b3b4ac981' },
      { moves: "L D (R' F R F') D' L'", id: 'f7ecc594-ac44-4a37-a9d3-5270dff45462' }
    ]
  },
  {
    name: 'ZBLS 25.7',
    id: '2a3cb5e6-2f83-4836-9f7c-6dab25bc2287',
    idMethod,
    puzzle,
    group: 'ZBLS 25',
    algs: [
      { moves: "(U') F' U F R' F R F'", id: 'd44c9288-78e2-4aee-b985-a3c649c757f8' },
      { moves: "U r' R U' R U r R' U' R'", id: 'fad31a19-5e5d-4c24-923d-2153812464b3' },
      { moves: "U' (M' U R U' r') R U R'", id: '9865cbf3-1f02-4fce-9dff-a2eda6edc95d' },
      { moves: "U' R' F R F' R U R'", id: 'a6973701-58fe-4935-8b7f-f8642e6a57cf' }
    ]
  },
  {
    name: 'ZBLS 25.8',
    id: '6f01f1a4-ce7e-49d0-91be-82471575dc5f',
    idMethod,
    puzzle,
    group: 'ZBLS 25',
    algs: [
      { moves: "R' U' R' U' R' U R U R", id: '6266dd08-c978-4f51-b83d-313d512d4101' },
      { moves: "R' F' R U R U' R' F", id: 'a281ca7c-1d11-481e-804e-2b8ad70bdc88' },
      { moves: "U' F' R U R' U' R' F R", id: 'fa1d20a3-0861-4e4b-992f-2147fce7d4c7' }
    ]
  },
  {
    name: 'ZBLS 26.1',
    id: 'b4191756-5cc3-4602-bb44-c6d5c397f54d',
    idMethod,
    puzzle,
    group: 'ZBLS 26',
    algs: [
      { moves: "(U) R U R D L' B' L D' R2", id: '7a7facd3-0a35-43ae-bc80-6f46caa8b339' },
      { moves: "y' r' U2 R U' R' r U2 r' U r", id: '8c9c1931-fca2-4d4d-a959-4a329c087449' },
      { moves: "r U2 R' U R U' r' U2 r U' r'", id: 'e3f166e0-f60b-4677-9ea3-9e1fd68a8e47' },
      { moves: "U R U R D r' U' r D' R2'", id: 'd542e9da-311b-4f71-86da-c64e57af08bb' }
    ]
  },
  {
    name: 'ZBLS 26.2',
    id: '1bf0271f-aaf2-4b33-a4c5-fcd709aedde2',
    idMethod,
    puzzle,
    group: 'ZBLS 26',
    algs: [
      { moves: "y' (U') F R2 U R' U' R2 F'", id: 'a4a9b9c0-0e92-4d70-b938-7afe10904bcf' },
      { moves: "y' r U R U R U' R' U' r'", id: 'c2973d4b-24d2-40bc-9f3d-82e1689a9578' },
      { moves: "r U r' U2' r U' R' U2' R U' r'", id: 'cc684e5d-5603-4a03-bf07-a982a2550c6d' },
      { moves: "R' D' R U' M' U r' D R", id: '1715306b-f558-4473-9978-8fed17620224' }
    ]
  },
  {
    name: 'ZBLS 26.3',
    id: '48a1f05e-090a-4329-b6db-e77f892bbf32',
    idMethod,
    puzzle,
    group: 'ZBLS 26',
    algs: [
      { moves: "y' F R2 U R U' R2 F'", id: 'f561e951-3433-4daa-9149-4aa786ddd71c' },
      { moves: "r U2' f R f' U2 r'", id: '8f96f801-40fb-40ff-a7b4-885fb6da6477' },
      { moves: "R' D' r U r' D R U' R U R'", id: '64d789ae-0ec5-455f-b36e-5087b2c8230b' },
      { moves: "U F R U' R' r U2 r' U' F'", id: '83f309b7-9ba4-4b93-95a9-d5c03826af96' },
      { moves: "R' D r2 U r' U' r U' r2 D' R", id: '64b22b73-9bf3-4448-8d82-22ad1c168259' },
      { moves: "F2 R U' R2 F R2 U R' F2", id: 'd34a3036-b7fd-4810-a522-74c9b66c80db' }
    ]
  },
  {
    name: 'ZBLS 26.4',
    id: '07f5879f-c38c-4ab2-9123-539e4c80586b',
    idMethod,
    puzzle,
    group: 'ZBLS 26',
    algs: [
      { moves: "(U2) F' U2 L' U2 L U2 F", id: '07cc910b-f8ce-4fba-87eb-380eb1c97bf6' },
      { moves: "y' U2 r U R U R' U' R' U' r'", id: '3c98748c-7c3d-42f3-8de9-4549220ad121' },
      { moves: "r U R' U2 R U r' U2 r U' r'", id: 'ba826fb4-9f4e-4975-8dca-0712261c942d' },
      { moves: "R' D' R U M' U' r' D R", id: '21975e98-686a-4c9c-9582-215affc31b31' }
    ]
  },
  {
    name: 'ZBLS 26.5',
    id: '8a4d1313-3e23-451a-b25c-76df871213bf',
    idMethod,
    puzzle,
    group: 'ZBLS 26',
    algs: [
      { moves: "(U) R U R' U' F' U' F", id: '8183e85c-0a4c-4dbf-baaa-0dfcac970b7d' },
      { moves: "x U' R' L U' L' U R U x'", id: 'e3fd0813-35e1-4dce-84c5-14ea87364c22' },
      { moves: "U R U R' U' y' R' U' R", id: 'a338b575-178a-43be-b51e-06d6ff5c4234' },
      { moves: "F U' r U M U' R' U F'", id: '1163f52d-7309-44cf-b3c6-c91198e66f61' }
    ]
  },
  {
    name: 'ZBLS 26.6',
    id: 'baf52e34-a8b3-49d0-a3e8-43159ac8f378',
    idMethod,
    puzzle,
    group: 'ZBLS 26',
    algs: [
      { moves: "(U) R U' R' U' F' U F", id: 'd25a98e3-a9d7-464c-8ae6-c4477cfd35aa' },
      { moves: "U F' U2 L' U' L U2 F", id: '7d0ce5d4-a505-4810-9020-e490930f68e8' }
    ]
  },
  {
    name: 'ZBLS 26.7',
    id: 'c17d31aa-a4cc-4ada-b8b7-3590ac29b9c1',
    idMethod,
    puzzle,
    group: 'ZBLS 26',
    algs: [
      { moves: "(U) R U' R' F R' F' R", id: '05b50852-2504-408a-a034-b2f39c48f595' },
      { moves: "U R U R r' U' R' U R' r", id: '02bd77e3-5516-488f-b502-5f0c0e104208' },
      { moves: "U R U' M' U R' U' M", id: 'a048e280-3c9a-40ad-9819-f57ec0faefc3' },
      { moves: "R2 U R' U' R' F R F' R'", id: 'bba4f9f0-f572-4d25-b088-4c0b6a213df0' }
    ]
  },
  {
    name: 'ZBLS 26.8',
    id: 'b654582e-7210-4c1d-8b47-8852ea648c3f',
    idMethod,
    puzzle,
    group: 'ZBLS 26',
    algs: [
      { moves: "F U F U F U' F' U' F'", id: '280b7b3c-9adb-4aed-a90d-795d31e8fdb6' },
      { moves: "y' R U R U R U' R' U' R'", id: '5f21345c-80ba-4e08-9557-7c17ff1f0820' },
      { moves: "L E' L' U L E L'", id: '0a9cf294-40b4-443c-9c18-321bf706849e' },
      { moves: "U2 L E' L' U' L E L'", id: '9296ffdb-4767-48a7-be87-3c62d1988a8f' },
      { moves: "U2 R U' R' U' r U' R' U R U r'", id: '863ec93c-d8be-499b-aa95-b5fe6a96a335' },
      { moves: "r2 U2' R2' F R2 U2' r2' F", id: 'dbfbbcd6-7543-4e0d-ba51-1f5179a885c9' }
    ]
  },
  {
    name: 'ZBLS 27.1',
    id: 'e26ad99c-56d2-41bf-84f1-bc0738720dea',
    idMethod,
    puzzle,
    group: 'ZBLS 27',
    algs: [
      { moves: "y L' U2 L F U' R U' R' F'", id: '0be0a93f-3b93-44c3-875b-a6695d49803b' },
      { moves: "U' R U' R2 r U' M U2 r U' r'", id: '64698a7e-c07d-4c06-adb5-0b273f479b2a' },
      { moves: "R U' R' y R' F' R U2 M' U' M", id: '662e7ddf-062d-4349-ad38-f35a863194c4' }
    ]
  },
  {
    name: 'ZBLS 27.2',
    id: '429fd9c7-cf1b-4326-bd02-d6a9a4567adc',
    idMethod,
    puzzle,
    group: 'ZBLS 27',
    algs: [
      { moves: "U r' R2 U' R' U r U' R'", id: '53152a86-358b-4317-985c-3b135d4e9ee1' },
      { moves: "U2 r U' r' U r U r' R U2' R'", id: '1d32ce91-3a04-4d25-89fa-ec86be81e387' },
      { moves: "R U' R2 U' F U R2 U' R' F'", id: '89da7c78-77fb-4379-8fac-ea78071b3f35' },
      { moves: "R U' R' U R U R' U2' R' F R F'", id: 'aaed2fa8-e996-4578-b4b1-61f2ba1c873a' }
    ]
  },
  {
    name: 'ZBLS 27.3',
    id: 'fe5e8d1b-0a2b-4f54-a319-2e263850fd11',
    idMethod,
    puzzle,
    group: 'ZBLS 27',
    algs: [
      { moves: "R U' R2 U' F U R U' F'", id: 'aaace24b-edcd-4034-b461-13dda2b55c04' },
      { moves: "U2 R U R' U R U R2' F R F'", id: 'edc7fc97-cdf4-4919-875f-1dab0019e804' }
    ]
  },
  {
    name: 'ZBLS 27.4',
    id: '7bedd8fe-331a-41d7-bd70-09c464c2333b',
    idMethod,
    puzzle,
    group: 'ZBLS 27',
    algs: [
      { moves: "R U' R2 F R F'", id: 'b4ddea48-7e95-4b65-8732-584741af7d6e' },
      { moves: "R U' R2 r U R U' r'", id: 'b45e314e-6673-44e9-8eaf-5fa7a5d2677f' }
    ]
  },
  {
    name: 'ZBLS 27.5',
    id: 'c9ee6370-7ec9-49b5-8e86-d4643f092d19',
    idMethod,
    puzzle,
    group: 'ZBLS 27',
    algs: [
      { moves: "F' U2 F R U2 R'", id: 'a253909e-ac73-42dc-a9e7-7fbc45987f83' },
      { moves: "y' R' U2 R y R U2 R'", id: 'c29bbeb2-c0cd-4c30-9955-0048e9cf3416' },
      { moves: "R U' r' U R U' R' U' M'", id: 'e8de125b-1a88-438b-bc85-36551fa6659e' }
    ]
  },
  {
    name: 'ZBLS 27.6',
    id: '233b22f0-4f29-4e84-b20d-76689203513c',
    idMethod,
    puzzle,
    group: 'ZBLS 27',
    algs: [
      { moves: "y' R' U2 R' F R F' R", id: '25af4012-f792-448d-8cc2-8b3b8bb5c4d9' },
      { moves: "x' R2 U' R D R' U R2 u' z'", id: '87cbe09d-542b-471d-8ef5-afad4f8107d8' },
      { moves: "R' F2 r U' R U r' F2", id: '7856b6f5-095a-40c8-8148-5e280dd4165d' },
      { moves: "R' D' R U' R' D R U R' F R F'", id: '0e0ef070-f763-43db-971e-8d55eb9ac8e3' },
      { moves: "R' D' R U R' D R U' R' F R F'", id: 'a8e297ae-ee9a-4254-8c18-b24bffb84d42' }
    ]
  },
  {
    name: 'ZBLS 27.7',
    id: '50293d9d-0b9c-4164-be8f-24cb0bb35cb8',
    idMethod,
    puzzle,
    group: 'ZBLS 27',
    algs: [
      { moves: "F' U' F U' R U2 R'", id: 'e847fe7b-e7a4-4b31-a0e0-46a3763cb4ef' },
      { moves: "y' R' U' R y U' R U2 R'", id: '0058084e-9b19-4e24-a37e-c4bff6e0a219' },
      { moves: "R U' R2 F R2 U R' U' F'", id: '46351b88-63f0-4bad-b38c-82673356e681' }
    ]
  },
  {
    name: 'ZBLS 27.8',
    id: 'b70da04a-6cbd-4467-ae27-0df04ba23090',
    idMethod,
    puzzle,
    group: 'ZBLS 27',
    algs: [{ moves: "R U' R' U R U' R'", id: '93d135e2-4c90-4154-9530-a4d2abfe12f5' }]
  },
  {
    name: 'ZBLS 28.1',
    id: 'cdf62c01-08e1-4fb3-a0c0-c1ac8566382a',
    idMethod,
    puzzle,
    group: 'ZBLS 28',
    algs: [
      { moves: 'R U2 R2 F R F2 U2 F', id: 'a9f21035-e160-402c-b159-a155a6da4c60' },
      { moves: "U r U r' U2 M' U M R U R'", id: '0ca8b84d-17bb-4d18-9915-b5d7bc413527' },
      { moves: "R U2 R' F' U L' U L F", id: '7085002f-411b-4eda-bc12-d58d2f94a339' }
    ]
  },
  {
    name: 'ZBLS 28.2',
    id: 'b5faa2fe-583d-4b31-8c95-ee40af4a0b2d',
    idMethod,
    puzzle,
    group: 'ZBLS 28',
    algs: [
      { moves: "(U2) F' U' L' U' L U' F", id: '6484b0d4-8414-4072-876c-5ff5fa4cd4eb' },
      { moves: "y' U' r R2 U R U' r' U R", id: '1a507b41-76fc-438a-927f-c1bffea28829' },
      { moves: "R U2 R' U R2 D r' U r D' R2'", id: '23ce1b47-e551-4cb6-90bc-bb97726d9d91' },
      { moves: "R U R' F R U R' U' F2 U' F", id: 'b1a1830b-8103-4171-ba97-de575fa1af8b' }
    ]
  },
  {
    name: 'ZBLS 28.3',
    id: '72748553-5da8-4ca6-8763-7048cbbe9b97',
    idMethod,
    puzzle,
    group: 'ZBLS 28',
    algs: [
      { moves: "F' U F U' R B U B' R'", id: 'a548570b-6621-41e2-80e6-92fad9fd4e1e' },
      { moves: "y L' U L2 U F' U' L' U F", id: '2feceb4a-25fd-434d-9951-67aa76098a4a' },
      { moves: "y L' U L U' F R U R' F'", id: '3ea7c2c4-5afa-42e1-bd59-bd91524763ce' },
      { moves: "R U2 R' U' F R U R' U' F2 U' F", id: '45cab93c-7b85-4ef3-aefd-7b726eefc33b' },
      { moves: "R U' R' r U' R' U' R r' U' r U r'", id: '8e53f8c4-9f3f-405a-864e-7841e33fcee7' }
    ]
  },
  {
    name: 'ZBLS 28.4',
    id: '4c439240-def3-454b-b571-72c7721f743f',
    idMethod,
    puzzle,
    group: 'ZBLS 28',
    algs: [
      { moves: "F' U F2 R' F' R", id: 'eb811d1c-d154-410d-8b3d-d68b0f48ce63' },
      { moves: "y' R' U R2 r' U' R' U r", id: '2e84ffc2-4f41-48cb-a6ff-659f114f6e34' },
      { moves: "y r' F r2 U' r' F", id: 'a840347c-b5c5-450c-a1c9-9304eb09b0bf' },
      { moves: "F' U2' r U' r' F2", id: 'bc100762-78a6-42a7-9c60-b0b772ef6f4e' }
    ]
  },
  {
    name: 'ZBLS 28.5',
    id: '77154d33-95e8-4262-a670-8995d8720661',
    idMethod,
    puzzle,
    group: 'ZBLS 28',
    algs: [
      { moves: "R U2 R' F' U2 F", id: '20d4c07c-1d18-4d6e-91cc-84cbaaa2533c' },
      { moves: "R U2 R' y' R' U2 R", id: '708dae0a-a77d-4084-bff4-5e5830453729' },
      { moves: "U2 R' F R F' r U' r' U2' r U r'", id: 'ece0e8b8-e802-4461-88d3-42eeffa1351c' }
    ]
  },
  {
    name: 'ZBLS 28.6',
    id: '16c53051-c211-4069-b5cd-39879ff3b2a8',
    idMethod,
    puzzle,
    group: 'ZBLS 28',
    algs: [
      { moves: "R U2 R B' R' B R'", id: 'd03b42bd-00ae-4896-a149-17394da838db' },
      { moves: "x U R2 D' R U' R' D R2 x'", id: '8275d101-ec2d-4aea-afe1-f5ab2272a1c3' },
      { moves: "R U2 l U' R' U l'", id: '07f6d2ef-7109-41ef-ac5a-665fe9c6ba60' }
    ]
  },
  {
    name: 'ZBLS 28.7',
    id: '69b99ee0-a601-4370-868c-19cfaad74fbb',
    idMethod,
    puzzle,
    group: 'ZBLS 28',
    algs: [
      { moves: "R U R' U F' U2 F", id: '688e074a-f5e1-4413-8a8d-4d51da92b51a' },
      { moves: "R U R' U y' R' U2 R", id: 'f539a004-20fa-454b-9b7e-aaf824b2f278' },
      { moves: "R U R' d R' U2 R", id: '80daf446-1574-40a8-8db5-32d47ddcd608' },
      { moves: "R U R' r' D' r U' r' D r", id: '689a386f-3472-4975-a632-718f8b7bd3a6' },
      { moves: "F U R U' R2 F' R2 U R'", id: '5d5cab60-f027-43b6-88ac-81a44668f008' }
    ]
  },
  {
    name: 'ZBLS 28.8',
    id: 'd0d6f880-71af-44e7-a6ad-fd92dfb812af',
    idMethod,
    puzzle,
    group: 'ZBLS 28',
    algs: [
      { moves: "F' U F U' F' U F", id: 'ef8af5d3-9103-4613-ab81-581d1a67a9d0' },
      { moves: "y' R' U R U' R' U R", id: '156c144b-830f-48ff-a6f3-2775f80c746d' }
    ]
  },
  {
    name: 'ZBLS 29.1',
    id: '5dc21dfd-107a-4684-bde7-9c610ca3b8a5',
    idMethod,
    puzzle,
    group: 'ZBLS 29',
    algs: [
      { moves: "y' (U') R2 F R F2 U' F U2 R", id: '9195544e-c1a0-4f61-a653-1b3c2c48392f' },
      { moves: "U2 R U' R' F' U' L' U' L U F", id: '08796763-4d37-46d1-b9f8-e57fff69686e' },
      { moves: "M' U' M U2 r U' R' U R U' r'", id: '37f14a3c-813e-40ca-af69-ddf602aaf476' }
    ]
  },
  {
    name: 'ZBLS 29.2',
    id: '4a362eac-4b12-4f59-9c5b-57cd21a3c3fd',
    idMethod,
    puzzle,
    group: 'ZBLS 29',
    algs: [
      { moves: "y' R' U' L F R' F' L' R2", id: '145d3730-c8f3-48c9-863e-165380cc3e96' },
      { moves: "y' R' U' r U R' U' R2 r'", id: 'b9a90f43-68c1-4f46-979e-83e2a61a213b' },
      { moves: "U R2 D r' U' r D' R2' U' R U2 R'", id: '0cba0c79-f84d-418a-9f39-0f7445fea2ef' },
      { moves: "F' r2 D2 r' U r D2 r' U2 r' F2", id: 'd028f983-80a1-4036-bc05-ff4b597ef873' }
    ]
  },
  {
    name: 'ZBLS 29.3',
    id: '87981c8b-f759-442d-bb7d-b650ae4861c2',
    idMethod,
    puzzle,
    group: 'ZBLS 29',
    algs: [
      { moves: "(U) F' U L' U2 L F", id: '88dc0eed-747b-4da4-a381-8c1fe8eda724' },
      { moves: "U' R U R' U' r U' r' U2 r U r'", id: '2738073b-98ab-4c48-8a6a-a84a2b3b5c92' }
    ]
  },
  {
    name: 'ZBLS 29.4',
    id: 'e43792da-3dde-4352-84e6-90183f389abb',
    idMethod,
    puzzle,
    group: 'ZBLS 29',
    algs: [
      { moves: "y' (U2) R2 F R F' U2 R", id: '4a32f3df-a876-4bef-a145-d2f7af063a7c' },
      { moves: "y' U r' U' R U r R2 U' R", id: '66f10458-eaec-420f-a6d5-268a990d7315' },
      { moves: "U R' F R F2 U' F", id: '67498b23-654e-4f83-a735-714cf9697b61' }
    ]
  },
  {
    name: 'ZBLS 29.5',
    id: '821954ca-f43d-4df5-99a4-477ea9a5322d',
    idMethod,
    puzzle,
    group: 'ZBLS 29',
    algs: [
      { moves: "R' U' R2 U' R2 U2 R F' U' F", id: '93c9ad4d-374b-4a3f-aae2-9254324e8e95' },
      { moves: "y U L' U' F' L' U' L2 U L' F L", id: '1e3c7124-360a-4ddd-bce7-fbd5a66532ba' },
      { moves: "R' F R F' U R U R' U2' R' F R F'", id: 'f5201914-8a89-4d96-813a-2b85d374611d' },
      { moves: "U' F R' F' R2 U' R2' D' R U2 R' D R", id: 'a8d2222b-24bc-4bd9-adc8-c9ad667ed71b' },
      { moves: "U2 R U' R' U' R' F R U R U' R2' F' R", id: 'd39ddc9e-ab1b-41fc-914a-6e37cd7941ed' },
      { moves: "R U' R2' D' r U' r' D F R F'", id: '05ec3079-b239-4b16-ba4b-c24d1099716f' }
    ]
  },
  {
    name: 'ZBLS 29.6',
    id: 'f281b808-34ac-4232-9a4f-2f36ce836caa',
    idMethod,
    puzzle,
    group: 'ZBLS 29',
    algs: [
      { moves: "R' F R F' R' F R F'", id: '9e650ec8-7d07-4e89-9ff2-1aabe5b03e57' },
      { moves: "x (R' U R U') (R' U R U') x'", id: '4c06abae-8669-4aba-816d-cb961a52c3c3' }
    ]
  },
  {
    name: 'ZBLS 29.7',
    id: 'ecf72eea-57f4-4c76-8bb1-f2574e131e46',
    idMethod,
    puzzle,
    group: 'ZBLS 29',
    algs: [
      { moves: "(U2) R U' R' F' U' F", id: '53f6bbf5-e9ce-4761-a9f9-b98fa837345b' },
      { moves: "U2 R U' R' y' R' U' R", id: '554b72b4-5674-47f1-9d3d-d5011b8bf2f6' }
    ]
  },
  {
    name: 'ZBLS 29.8',
    id: 'df4ef588-68be-4f4c-92fe-777d0e2b6a44',
    idMethod,
    puzzle,
    group: 'ZBLS 29',
    algs: [
      { moves: "F' U' F U F' U' F", id: '415fa59a-5f2a-4983-b87f-ab16e5c05d21' },
      { moves: "y' R' U' R U R' U' R", id: '07064567-4e82-4daa-beff-975be231180c' },
      { moves: "R' F R F' U R U' R'", id: '42c43d75-74b1-4267-94c8-3f00df537f96' },
      { moves: "M' U R U' r' U R U' R'", id: 'f9a672d2-d4b8-4ea9-a4af-c5e1fdb819ad' }
    ]
  },
  {
    name: 'ZBLS 30.1',
    id: '119366d6-277c-47da-b919-65da576b70f3',
    idMethod,
    puzzle,
    group: 'ZBLS 30',
    algs: [
      { moves: "(U) R2 B' R' y R2 U R' U2 F'", id: '78eb31a6-76ca-45b9-be46-af31f803ece3' },
      { moves: "y U2 L' U L F U R U R' U' F'", id: '58ff12bd-0924-4fb2-90ea-73fdb1c8f8c9' },
      { moves: "R U R' U' R' D' r U r' D R2 U R'", id: 'da2b98fa-bd1c-4fd1-8110-c2e36c1c023f' },
      { moves: "r U R' U' R U r' U2' M' U M", id: '35c427b5-c470-4ee7-83b4-26c8b28d6a68' },
      { moves: "U' F' U2 r' F r2 U' r' F2", id: '6041c5d0-30d4-4d4c-9dc9-937d2fff7726' }
    ]
  },
  {
    name: 'ZBLS 30.2',
    id: '9ea797ef-ef33-4113-861b-07885e70d413',
    idMethod,
    puzzle,
    group: 'ZBLS 30',
    algs: [
      { moves: "R U L' B' R B R2 L", id: 'aaec85ab-c08c-4e87-8674-24ba4066f3e2' },
      { moves: "R U r' U' R U R2 r", id: '125f5790-acc1-40c1-a02c-785584ca0d8b' }
    ]
  },
  {
    name: 'ZBLS 30.3',
    id: '3b9ad521-25fe-4e97-8d34-db24da815272',
    idMethod,
    puzzle,
    group: 'ZBLS 30',
    algs: [
      { moves: "(U') R U' B U2 B' R'", id: '3c16940b-6a1c-4148-a6f2-7a05c97893ef' },
      { moves: "y U' F U' R U2 R' F'", id: '71da1835-0d0a-4245-8ab2-76a3b1d2aadb' },
      { moves: "R U R' U r U' r' U' r U r'", id: 'edc446a0-cf6a-445e-b4de-666bbbe0937c' }
    ]
  },
  {
    name: 'ZBLS 30.4',
    id: '1e239f1f-a76f-4834-a124-4a5fc4e26fee',
    idMethod,
    puzzle,
    group: 'ZBLS 30',
    algs: [
      { moves: "(U') F R' F' R2 U R'", id: '74400546-ab34-46d0-a07f-c5b0bc0303f4' },
      { moves: "U' r U R' U' r' R2 U R'", id: '6ea8fb9c-ecb3-4f05-9dc6-cd640f93ccb3' }
    ]
  },
  {
    name: 'ZBLS 30.5',
    id: 'f78798ea-363d-4f01-a7bd-e58283b75878',
    idMethod,
    puzzle,
    group: 'ZBLS 30',
    algs: [
      { moves: "(U) F' U' F U' F' U' F R U R'", id: '56c37809-7661-4b26-bace-b4efb03ef715' },
      { moves: "U F' L' U' L U L' U2 L U' F", id: '00c4b145-3d6e-4849-9717-9e5db01c9d6d' },
      { moves: "U2 R' F R F' R U' R' U2 R U R'", id: '797b5b3b-fa9b-4ae3-bf59-d954ed083fbf' }
    ]
  },
  {
    name: 'ZBLS 30.6',
    id: '709bfdeb-f83b-4c6c-9453-dfbe78206f62',
    idMethod,
    puzzle,
    group: 'ZBLS 30',
    algs: [
      { moves: "F R' F' R F R' F' R", id: '2b4d6856-1d26-462c-aa05-91b8af81b068' },
      { moves: "x (U R' U' R) (U R' U' R) x'", id: '1baa1dea-d171-44c2-84e0-574501ab6e8e' },
      { moves: "x U R' U' R U R' U' l", id: '3549e613-df9d-4b61-90d4-86d0709371d9' }
    ]
  },
  {
    name: 'ZBLS 30.7',
    id: '227c934b-ebb3-42e2-89d0-9be362d04936',
    idMethod,
    puzzle,
    group: 'ZBLS 30',
    algs: [
      { moves: "(U2) F' U F R U R'", id: '44100c7c-9e2c-42d9-a22f-13632e91de7a' },
      { moves: "y' U2 R' U R y R U R'", id: 'adc5d2a8-2142-4e3d-955a-e80d8f9af46b' },
      { moves: "R U R' F U R U' R2 F' R", id: '0667db5e-8d12-4b64-b3b5-bd1b87c49b84' }
    ]
  },
  {
    name: 'ZBLS 30.8',
    id: '6f577c78-aa4a-47f0-bbb3-d676d831d9b9',
    idMethod,
    puzzle,
    group: 'ZBLS 30',
    algs: [{ moves: "R U R' U' R U R'", id: 'a067dc11-edf5-4170-afcb-d8a54100b5c6' }]
  },
  {
    name: 'ZBLS 31.1',
    id: '3d090883-4237-4b61-a5dd-b63e991b06e1',
    idMethod,
    puzzle,
    group: 'ZBLS 31',
    algs: [
      { moves: "y' R2 F R F2 U' F R", id: '426fd954-e992-481c-84dd-42eeace0af4d' },
      { moves: "U' R' F R F' U' R' F R F'", id: '6a4c3c8e-35f9-4abe-98fe-767516460c2c' },
      { moves: "F2 r U r' U2 F R U' R'", id: 'd040e7cb-74b3-4e45-8243-48cc5603dcec' },
      { moves: "x U2 L U L2 x' U' L F", id: '863ab3d4-5f47-431e-9153-bf7a75d1eefd' }
    ]
  },
  {
    name: 'ZBLS 31.2',
    id: '4e614e4b-775d-41b0-b788-a676af3abdcf',
    idMethod,
    puzzle,
    group: 'ZBLS 31',
    algs: [
      { moves: "R U' R2 F R F2 U2 F", id: '0866d9f0-7a77-483f-8e54-21716f150292' },
      { moves: "y F U' R U' R' F' L' U2 L", id: '83d3fa25-e30d-4f6a-9b1d-6a1e66cf8f49' },
      { moves: "r U' r' U M' U R U r'", id: '5d111a58-bb6f-46b8-9e4f-ae3a9e730912' }
    ]
  },
  {
    name: 'ZBLS 31.3',
    id: '563cc18b-a7ca-48da-afdc-8f0b68604272',
    idMethod,
    puzzle,
    group: 'ZBLS 31',
    algs: [
      { moves: "R2 B' R' y R2 U2 R' U' F'", id: '60978f1b-63ae-4135-9793-9151d26ee348' },
      { moves: "r U' R' U' M U' r U r'", id: '08a8409f-a120-4b70-bb3b-3a4709e2321b' },
      { moves: "F' U L' U L F R U2 R'", id: '6e93773f-ef5a-4772-b21e-6475394a229a' }
    ]
  },
  {
    name: 'ZBLS 31.4',
    id: 'c6885405-83b0-4ca8-919c-1e87452fa60d',
    idMethod,
    puzzle,
    group: 'ZBLS 31',
    algs: [
      { moves: "R2 B' R' y R2 U R' F'", id: 'faa0c08b-42c3-4c3f-9228-2bcc25944076' },
      { moves: "x z' U2 R' U' R2 x' U R' F'", id: 'e17c5427-ff18-47a6-8e58-30a1381e1f37' },
      { moves: "R U2 R2 D' r U' r' D R", id: '5a4d80e8-8596-443b-b0b8-571d4e742118' }
    ]
  },
  {
    name: 'ZBLS 31.5',
    id: '129c85f9-c17b-42ff-b3db-d370dded5902',
    idMethod,
    puzzle,
    group: 'ZBLS 31',
    algs: [
      { moves: "R U' R' F' U2 F", id: '71e59b72-bb6a-4ad3-ab0c-ab24c9d61a21' },
      { moves: "R U' R' y' R' U2 R", id: '5c6c3abc-16bf-4e4b-8ae9-c444ddeb4f70' },
      { moves: "R U' R' U y' R' U R", id: 'adab746e-0d4f-491c-916f-0f2e20e26cc8' }
    ]
  },
  {
    name: 'ZBLS 31.6',
    id: '5e412ca0-5ea4-4371-a329-ff3c280daf4c',
    idMethod,
    puzzle,
    group: 'ZBLS 31',
    algs: [
      { moves: "F' U F R U2 R'", id: 'ce6384af-7ffe-4a73-aa11-986543f4a16b' },
      { moves: "y' R' U R y R U2 R'", id: '7e62e869-b186-4dd2-8453-b2bfc2e9d160' },
      { moves: "R' F' R U R U' R' U2 F", id: '6b25680e-02b1-4289-839b-bf088c1b5f0a' }
    ]
  },
  {
    name: 'ZBLS 31.7',
    id: '6fe6000f-9cb4-4908-add5-797baf96e1fc',
    idMethod,
    puzzle,
    group: 'ZBLS 31',
    algs: [
      { moves: "F' U2 F U' R U2 R'", id: '6704a173-ecd9-40f7-bbc0-064e9edd0cd8' },
      { moves: "y' R' U2 R U' y R U2 R'", id: '0ed2c2d1-2665-4119-9d5c-0d761d6defe1' },
      { moves: "R U2 R' U' F R' F' R", id: 'feb45436-1810-42d4-977a-c495499d3f2c' }
    ]
  },
  {
    name: 'ZBLS 31.8',
    id: '7e71f9fb-f42f-4a53-b02c-c366b0df428e',
    idMethod,
    puzzle,
    group: 'ZBLS 31',
    algs: [
      { moves: "R U2 R' U F' U2 F", id: '38670c5f-def9-46e6-b3ef-271143d8c208' },
      { moves: "R U2 R' U y' R' U2 R", id: 'ad89fe9b-4dcf-40d6-b189-5fbe8c71e932' },
      { moves: "U' R' F R F' R U' R'", id: '492de672-91ed-449e-857d-d77cf3eb5245' }
    ]
  },
  {
    name: 'ZBLS 32.1',
    id: '2e784d23-f1f2-478c-b9f4-cc4f904f9ab8',
    idMethod,
    puzzle,
    group: 'ZBLS 32',
    algs: [
      { moves: "y F R2 U2 F R' F' U2 R2 F'", id: '42ff174f-a5a9-4e80-a1c4-5df40924926b' },
      { moves: "y' U R' U2 F' U L' U L F R", id: '7f7ddbc4-e5a1-4649-bde2-64d9c8e5e0cb' },
      { moves: "U2' r U2' r' U2 r U' r' U2 r U2' r'", id: '511b7884-8275-4b81-b5fa-de85b8c747cc' },
      { moves: "U2' R' F R F' U2' r U' r' U2' r U r'", id: '0e09e599-65a2-4fc1-a091-8be51fd8e359' },
      { moves: "y U2 R' F2 R U2' R' F R U2' R' F2 R", id: '8d3557a6-0c24-45f7-8556-13cbcbb51d9e' },
      { moves: "r U M U2 r R2' U2' R U r'", id: '58b7989d-f90c-40e2-9a8f-7350db75b9e4' }
    ]
  },
  {
    name: 'ZBLS 32.2',
    id: 'c37494b0-b160-4cf6-bf81-0cb45d2a896d',
    idMethod,
    puzzle,
    group: 'ZBLS 32',
    algs: [
      { moves: "(U2) R U' B U B' U R'", id: 'c42ab680-4f5e-41b5-9ea3-ae4cd5370d0a' },
      { moves: "y U2 F U' R U R' U F'", id: '16c4f592-e47e-4651-8a35-8add38436cc9' },
      { moves: "U2 R U' f R f' U R'", id: '6b5b31f9-062a-4ed8-bac7-4a2c51148e8e' },
      { moves: "U' F R' F' R U' R U R'", id: 'c68aa3d0-c4d0-4baf-881f-a560f6ccdade' },
      { moves: "U' r U r' R' F R F' r U' r'", id: '776d9a7f-beb7-4cc4-8606-c2982b717ff4' },
      { moves: "r U' R2 U' R U' R' U2 R2 U r'", id: '7b94db54-203a-45d8-a04b-a565bbe4ac56' }
    ]
  },
  {
    name: 'ZBLS 32.3',
    id: 'cf033124-119f-4629-bc9b-b5eb6acf87f5',
    idMethod,
    puzzle,
    group: 'ZBLS 32',
    algs: [
      { moves: "r R U R2 U R2 U2 R' r'", id: '4058077b-af8b-4f9a-a4cf-6f6cac090932' },
      { moves: "U' R U R' U' R U R2 F R F'", id: '4be53ef4-2ae0-4ee4-ae03-f9a38fff247f' }
    ]
  },
  {
    name: 'ZBLS 32.4',
    id: '64d690d6-786c-4192-a689-6d92c173af4c',
    idMethod,
    puzzle,
    group: 'ZBLS 32',
    algs: [
      { moves: "U2 F' U L' U' L U' F", id: '383859a9-d24a-4df7-a17e-86d2872c258f' },
      { moves: "U R' F R F' d R' U' R", id: '20436e84-d534-4b6b-a5fd-bc376361a3a9' },
      { moves: "U2 F' U r' F' r U' F", id: 'ace4e40a-7c47-49ff-8424-e8306fa6707e' },
      { moves: "U2 R' F R F2 r U' r' F2", id: '5c924ce3-db2c-4c9b-a184-5532748d440f' }
    ]
  },
  {
    name: 'ZBLS 32.5',
    id: 'e5bb6101-0636-4c29-b4c4-d1d8b6912039',
    idMethod,
    puzzle,
    group: 'ZBLS 32',
    algs: [
      { moves: "R U R' U F' U F R U R'", id: '53ead3f6-c207-4053-a9ec-6392ed0031b7' },
      { moves: "y U F R U2 R' U R U' R' U F'", id: 'f403dfe4-06fd-40be-b97b-60c0781955a8' },
      { moves: "U2 F R' F' R2 U R' U R U' R'", id: '838d1668-d9d0-4951-9080-c190f1bf267a' },
      { moves: "U2 R U2 R' U2 R U' R2 F R F'", id: '58ba0765-0faa-4cea-98a1-efdd077241ee' }
    ]
  },
  {
    name: 'ZBLS 32.6',
    id: '25e5d8e2-442a-49ae-8fb1-90f081bc4888',
    idMethod,
    puzzle,
    group: 'ZBLS 32',
    algs: [
      { moves: "(U) R U' B U2 B' U R'", id: 'a9651be6-02ba-4b9e-8db8-d1e05674d74c' },
      { moves: "y U F U' R U2 R' U F'", id: 'cffdf4db-4cf1-444e-99fb-bd0da387ef5f' },
      { moves: "U R U' R' U R U' R2 F R F'", id: 'a651141a-5b5d-40f7-a6cc-9823b9389ca3' }
    ]
  },
  {
    name: 'ZBLS 32.7',
    id: 'fbd56d7c-8b54-43cd-87a9-a83687ee64df',
    idMethod,
    puzzle,
    group: 'ZBLS 32',
    algs: [
      { moves: "U' F' U L' U2 L U' F", id: '2038b038-5a7b-45a7-a37d-2f2968b98bc5' },
      { moves: "U2 r U S' r' U r S U' r'", id: 'f72b396a-d0fb-4c29-aa81-8860de07a888' },
      { moves: "U2 R U r' U R U R' U' r U' R'", id: 'fcd24f34-329e-44f6-8f43-44f035d0a2da' },
      { moves: "R U' R2 F2 r U r' F R2 U R'", id: 'fdbcaf17-e7b1-4982-a81f-799b48673739' },
      { moves: "U R U' R' U R U' r' U R U' R' U' M'", id: '204623d4-9174-49a1-9b39-82c773b11ee2' }
    ]
  },
  {
    name: 'ZBLS 32.8',
    id: '3a9abb39-a0d7-4d45-a942-dbebe4576156',
    idMethod,
    puzzle,
    group: 'ZBLS 32',
    algs: [
      { moves: 'R2 U R2 U R2 U2 R2', id: '1eb4db1a-7619-42b1-9181-3937d628d244' },
      { moves: "(U) R U' R' U R U' R' U R U' R'", id: '1f5dc5ba-b8cc-4614-9ada-9c55f4404cb4' }
    ]
  },
  {
    name: 'ZBLS 33.1',
    id: '15cc7920-3953-4b2d-be65-c5d1adebda96',
    idMethod,
    puzzle,
    group: 'ZBLS 33',
    algs: [
      { moves: "(U') F R' F' R2 U2 R2 F R F'", id: 'c9de1985-e53d-4f86-9e4d-fb33c0169452' },
      { moves: "y' U' R' F' U' L' U L U' F U R", id: '180e6c45-8c42-4787-ac73-47fce73725b9' },
      { moves: "D' r U' r' F2 U R' F R F2 D", id: 'e683c434-6c8a-40e3-a183-b0156e51cf5f' }
    ]
  },
  {
    name: 'ZBLS 33.2',
    id: '00395a44-a17b-48e3-9f89-75023cce4623',
    idMethod,
    puzzle,
    group: 'ZBLS 33',
    algs: [
      { moves: "(U') R U' R' U R' F R F'", id: '60c88718-8dd1-4ead-9e03-faf0ca41c54e' },
      { moves: "y U' F U' R U' R' U F'", id: '4647b5d9-e231-4091-9dd8-cf8c2aae1e72' },
      { moves: "(U') R U' R' U M' U R U' r'", id: 'dde57298-024d-4fcb-adca-092314a8c5bf' }
    ]
  },
  {
    name: 'ZBLS 33.3',
    id: '3acf070d-47c3-4180-b8bd-73a5ac125315',
    idMethod,
    puzzle,
    group: 'ZBLS 33',
    algs: [
      { moves: "y F R2 U R' U R U2 R2 F'", id: '1b54710a-7849-44f7-ad6e-d642dd60d7a9' },
      { moves: "U' r' R2 U' R' U' R U2 R2 r", id: '9ed83f0b-687b-4897-86c2-ff7a202f5605' },
      { moves: "U R U' R2 F R F' R U R'", id: 'a3f277f4-2701-4626-bb6e-15d5cbc09dd1' }
    ]
  },
  {
    name: 'ZBLS 33.4',
    id: 'e13baa39-fa03-411d-a92f-d936d962e57b',
    idMethod,
    puzzle,
    group: 'ZBLS 33',
    algs: [
      { moves: "(U) R U B U B' U2 R'", id: '493625d7-0de3-418d-8e0e-968e11ea530d' },
      { moves: "y U F U R U R' U2 F'", id: 'afc495e2-b783-4309-be4a-e561c87a7877' },
      { moves: "U r U' r' U r U r' R U' R'", id: 'abc2b666-baaf-4b63-aee3-9daf957246b7' },
      { moves: "M' U' R U r' U2 r U' r'", id: '9f543d95-0988-4e56-b053-5eef06c53dad' }
    ]
  },
  {
    name: 'ZBLS 33.5',
    id: '572b6fe0-0d35-4345-ac74-c3a7451ad1ee',
    idMethod,
    puzzle,
    group: 'ZBLS 33',
    algs: [
      { moves: "(U2) R B U2 B' U2 R'", id: 'd4397170-db42-4edd-802e-1366d7628223' },
      { moves: "U' F' U2 L' U2 L F", id: '952ffe80-ecc3-4792-bc74-3d6601b9f178' },
      { moves: "y U2 F R U2 R' U2 F'", id: '42a3b145-8245-4ab8-bed3-79dd116f52f4' },
      { moves: "R U R' U' F' U' F U' R U2 R'", id: 'c1cb3c8d-e95b-4be9-99c4-057f8490dbd3' }
    ]
  },
  {
    name: 'ZBLS 33.6',
    id: '8a58a581-67b3-4682-855d-d639f0007f89',
    idMethod,
    puzzle,
    group: 'ZBLS 33',
    algs: [
      { moves: "(U2) F' R L' U' L U R' F", id: 'c8a53517-148f-48bf-8be1-343cb7e9e2f1' },
      { moves: "y' r' U' r U R' U' R r' U r", id: '8a6f4f8d-687d-4db2-b9af-78bb5887bf02' },
      { moves: "U' R U' R' U2' R U R' U2' R' F R F'", id: 'b2998b5a-a38b-460d-a398-eb0d28a251a3' },
      { moves: "R' F R F' R2 U R' U' R' F R F' R'", id: 'c3676a79-0271-4dac-aa38-e889425910c9' },
      { moves: "r2 D r2 U' R2 r' U r2 D' R2 r'", id: '55034f82-94bf-4155-852d-35d186bb5e06' }
    ]
  },
  {
    name: 'ZBLS 33.7',
    id: '50c660d4-406c-452b-ad5b-f932f8251b56',
    idMethod,
    puzzle,
    group: 'ZBLS 33',
    algs: [
      { moves: "U' F' U2 L' U L U F", id: 'f7522f90-43a3-4d39-bb7c-caedfa60a2c6' },
      { moves: "R U M U' R' U r U' R'", id: '49325817-4820-462e-a8cb-3fb2fb318b3e' }
    ]
  },
  {
    name: 'ZBLS 33.8',
    id: '45f4f52d-d221-4a7a-bb8a-d8c7aad448cc',
    idMethod,
    puzzle,
    group: 'ZBLS 33',
    algs: [{ moves: "(U') R U' R' U2 R U' R'", id: 'c220fce9-4a82-4f53-a23a-c042899170a7' }]
  },
  {
    name: 'ZBLS 34.1',
    id: '724842d7-9f63-4af6-be38-f7a17924b54a',
    idMethod,
    puzzle,
    group: 'ZBLS 34',
    algs: [
      { moves: "y U' F R2 U2 F R F' U2 R2 F'", id: 'e72f7906-468f-46c0-98d0-d0bdd4fc3f9c' },
      { moves: "y' R' U' F' U L' U L U F U2 R", id: 'efedc6c4-5ed5-44e4-b88e-b22dfeebfdf3' },
      { moves: "U r U2' r' U2' r U r' U2' r U2' r'", id: '02496d28-60d4-4c3c-89b9-a1d158d268cd' },
      { moves: "R U R D r' U r D' R' U' R'", id: 'b3427c0f-f232-4507-b342-4097f2f8397a' }
    ]
  },
  {
    name: 'ZBLS 34.2',
    id: '6eab73fa-9b85-4d70-a5d0-eb3b66218a1f',
    idMethod,
    puzzle,
    group: 'ZBLS 34',
    algs: [
      { moves: "(U') F' U' L' U' L U2 F", id: 'f617240c-6ccb-4457-bed3-af0f5046892e' },
      { moves: "U R U M' U' r' U' r U r'", id: '4c36929a-737f-4e0b-909b-f6a84ac1c20b' },
      { moves: "F U' R2 D2 R' U' R D2 R2 U F'", id: '71cc6046-2646-4b89-9885-f34482a457d1' }
    ]
  },
  {
    name: 'ZBLS 34.3',
    id: '5a531799-3400-4879-a61a-1aa12a1559d2',
    idMethod,
    puzzle,
    group: 'ZBLS 34',
    algs: [
      { moves: "(U) R F' U' L' U L F R'", id: 'c982a8f4-e0bb-495d-a74e-556bb21d19b2' },
      { moves: "y' U r R2 U R U R' U2 R2 r'", id: '42c9e654-d4f6-4689-86fb-d224aa5675af' },
      { moves: "U r U' R' U R U r' U' R U R'", id: '1805d2f1-9880-41dc-8a3b-9ebb76790d8d' },
      { moves: "y' U R2' F R F' R U' R' U R", id: 'f4aace3f-f7d3-43b5-9fec-dccd4df593e6' },
      { moves: "U R U' R' U' F' U F R U R'", id: '08f2c4f2-7ace-4dec-bc12-f06ff200fa0e' },
      { moves: "F U R2 D2 R' U' R D2 R2 F'", id: 'd91575c7-f8c7-43d0-953f-52bb9c1f0ca5' }
    ]
  },
  {
    name: 'ZBLS 34.4',
    id: '228d0909-3268-4656-af83-4b8427589b87',
    idMethod,
    puzzle,
    group: 'ZBLS 34',
    algs: [
      { moves: "(U) F' U F U' F R' F' R", id: '896e5c31-d6e8-48a7-87b2-a293c070466d' },
      { moves: "U F' U L' U L U' F", id: '73c37aef-a5d8-4032-b27b-96e21146ffe9' },
      { moves: "y U L' U L U' L F' L' F", id: '73b2d4ee-bd84-4d15-b0dc-23e4fcf8a328' },
      { moves: "r' D' r U2 r' U' F2 U F2 D r", id: '675df793-4675-429b-b8d7-e9c4436eef0d' }
    ]
  },
  {
    name: 'ZBLS 34.5',
    id: 'd49e669c-5b6a-4545-a768-24ecc2fff853',
    idMethod,
    puzzle,
    group: 'ZBLS 34',
    algs: [
      { moves: "(U) R U2 B U2 B' R'", id: 'c3c9e1b2-89d3-4b3a-854f-a221ec3bdb0d' },
      { moves: "y U F U2 R U2 R' F'", id: '97d05f2e-3ae5-49bc-8356-f060b86082cc' },
      { moves: "R U R' U2 R' F R F' R U R'", id: '067205ea-16ac-4ee7-bbc8-b6aa0a2bad8f' },
      { moves: "U2 R U' R' U r U' R' U' R U r'", id: '07350468-59c2-4c3f-b9c7-142670906fbc' }
    ]
  },
  {
    name: 'ZBLS 34.6',
    id: '3e33818c-485d-4e73-965c-ff37b391f3bc',
    idMethod,
    puzzle,
    group: 'ZBLS 34',
    algs: [
      { moves: "(U) R U2 B U' B' U' R'", id: '1d35b30f-0ce8-412f-b713-932d7b5251a5' },
      { moves: "y U F U2 R U' R' U' F'", id: '4e7b7e6e-1ae9-4442-aa3e-614d92896d81' },
      { moves: "U R U' R' F R' F' R2 U R'", id: '1a1eb2a9-c7ad-4a93-8031-5dfa45de727e' },
      { moves: "U' R U2' R' U' r U' r' U' r U r'", id: 'bdf1bd97-f066-4bc8-9159-ea6dfc04b3e8' },
      { moves: "R U' R' U' R' F R F' U R U R'", id: '020603d7-e011-4af0-843c-75b597f0d024' },
      { moves: "U2 r U r' U R U2 R' U r U' r'", id: '3067cf0f-a602-478b-91a1-fd689bd88fcb' }
    ]
  },
  {
    name: 'ZBLS 34.7',
    id: '11c73297-130b-44f0-b2fb-074a95608f98',
    idMethod,
    puzzle,
    group: 'ZBLS 34',
    algs: [
      { moves: "(U) F D R U R' U' D' F'", id: 'adf63e53-bb6f-4970-92ca-1f700f5028dd' },
      { moves: "r U r' U' R U R' r U' r'", id: '6332994d-a6fe-4759-8213-e3c577a588df' },
      { moves: "U' R U R' U' r U' R' U' R U r'", id: 'b12d4a0d-a22d-42db-8448-824b48e6bfd7' }
    ]
  },
  {
    name: 'ZBLS 34.8',
    id: '5bcf70ab-24c4-4692-8958-d25189fd99c9',
    idMethod,
    puzzle,
    group: 'ZBLS 34',
    algs: [
      { moves: "U' R U2 R' U R U R'", id: 'bf83a746-af49-4f23-a474-6db73090ea24' },
      { moves: "U' R' D' R U R' D R", id: '80092e1b-7d44-41be-9049-ec2c3f794d2f' },
      { moves: "(U) R' D' R U' R' D R", id: '4acbdcd1-a657-4137-b02a-0717bc66032c' }
    ]
  },
  {
    name: 'ZBLS 35.1',
    id: 'c33abdda-50d9-48a5-b794-3863ee1bccc3',
    idMethod,
    puzzle,
    group: 'ZBLS 35',
    algs: [
      { moves: "y' R2 D' L F' L' D R U' R", id: '3d063a72-66b5-45f4-8cdb-e1c763f613a5' },
      { moves: "U2 r U' r' U r U2 R' U' R r'", id: '02bab2ef-edb2-4418-93bd-f7520c8f3f58' },
      { moves: "(U2) R U' R D r' U' r D' R2", id: '7835018c-8385-474c-9bfb-bf80411c471d' }
    ]
  },
  {
    name: 'ZBLS 35.2',
    id: 'ed41e4c4-f0bc-4bd7-9d9e-a0adfd535695',
    idMethod,
    puzzle,
    group: 'ZBLS 35',
    algs: [
      { moves: "(U') R U R2 U' F' U F2 R F'", id: 'bb648f34-7a4a-42f1-9381-4a2ba9724b77' },
      { moves: "U R U' R' F' U2 L' U2 L U2 F", id: 'b253f032-b394-4e82-9f17-5e87f0db9a73' },
      { moves: "R' D' r U' r' D R U R U' R'", id: '294c123b-8692-490e-a327-9d52ab79e27c' }
    ]
  },
  {
    name: 'ZBLS 35.3',
    id: '1a3e055c-bd2b-4235-8da2-0fc2608f9238',
    idMethod,
    puzzle,
    group: 'ZBLS 35',
    algs: [
      { moves: "(U) R' D' L F L' D R2 U2 R'", id: '0949619d-1ca5-4398-b02e-27ace329ff45' },
      { moves: "R U R' U F' U L' U2 L F", id: '73102888-3457-4ec2-a8b9-c727922d382e' },
      { moves: "(U) R' D' r U r' D R2 U2' R'", id: 'a99ef56b-7986-487d-9f59-e827d92f3a6b' },
      { moves: "R' F R F' U2' R' F R F' R U R'", id: 'cbac8ed7-1864-4f79-b7ec-b77f587c13c2' }
    ]
  },
  {
    name: 'ZBLS 35.4',
    id: '9ff9a449-c2c6-4340-a019-bb2718264d28',
    idMethod,
    puzzle,
    group: 'ZBLS 35',
    algs: [
      { moves: "R U R' U R' F R F2 U' F", id: 'f5035ada-8237-404e-bcc3-addb8519144a' },
      { moves: "R U R' U F' U L' U L U F", id: 'e2df21ca-4985-4523-bd36-91bbdf623e3e' },
      { moves: "R2 D r' U' r D' R2 U R U' R'", id: '98b9ff2d-c4a7-482c-b330-a57c8ffcfde1' },
      { moves: "U2 r U' r' U R' F R F' r U2' r'", id: '19f3cb54-8601-4645-b8e7-5df449bca1f6' }
    ]
  },
  {
    name: 'ZBLS 35.5',
    id: '0f0bce0f-e3b4-4a53-9775-4dac6d2a45ab',
    idMethod,
    puzzle,
    group: 'ZBLS 35',
    algs: [
      { moves: "(U2) R U R' U' F' U F", id: 'dfa154ad-c6cd-4e59-af52-85b49c1c1a33' },
      { moves: "U2 R U R' U' y' R' U R", id: 'cdd1095e-9bca-4e74-ac39-af612826b736' },
      { moves: "R' D' r U' r' D F R F'", id: '27e9a64b-76d3-4f35-9fb3-22bcba24b7c0' }
    ]
  },
  {
    name: 'ZBLS 35.6',
    id: '0a1a5f11-c27a-4e63-96b7-03dea7d5b25b',
    idMethod,
    puzzle,
    group: 'ZBLS 35',
    algs: [
      { moves: "(U') R U R' U F' U' F", id: '60b3c52d-a527-4fbd-aa07-42327fd6de31' },
      { moves: "U r R' U R U' r' R U' R'", id: '69f1ccc7-2492-4c38-83a6-3cf66084d2c8' },
      { moves: "U' R U R' d R' U' R", id: 'a1013cee-f37e-49f2-81c0-e91e5a34eeb7' },
      { moves: "U M' U R U' M U' R'", id: '36fb832e-5ead-48fb-a8a7-e020c483a6cb' },
      { moves: "R U R2 F R F' R' F R F'", id: 'ac53a3d7-b826-435a-9aad-707fce812a3f' },
      { moves: "R U R' l' U R U' R' U R U' x'", id: 'c9f88cab-ce75-4a3b-95c6-4ba6187a7522' }
    ]
  },
  {
    name: 'ZBLS 35.7',
    id: 'eddb5cc9-b8f3-4fa4-a625-69cd6fdc7638',
    idMethod,
    puzzle,
    group: 'ZBLS 35',
    algs: [
      { moves: "(U2) R U' R' U' F' U' F", id: 'f71a7a80-d9a6-4b8b-942f-968fb46330df' },
      { moves: "U2 R U' R' U' y' R' U' R", id: 'e5e93548-44ca-4341-9e24-60f53dc00b49' },
      { moves: "R U R2 F R F' U R U' R'", id: '70177d7f-0e94-4462-a84d-244a85cdc9c0' }
    ]
  },
  {
    name: 'ZBLS 35.8',
    id: '439ad103-8bf0-40e2-b1f3-60669dfadd88',
    idMethod,
    puzzle,
    group: 'ZBLS 35',
    algs: [
      { moves: "(U2) R U R' F R' F' R", id: '22f8295e-c0ff-4dc7-ace9-1b2644547a68' },
      { moves: "U2 R U R' r U R' U' R r'", id: '92d0a3ba-854e-4147-a6c7-c1bb5e703a3f' },
      { moves: "U2' R U R' F R' F' R", id: '12d0578a-1b7b-4ae9-afca-6b70bc1036a4' },
      { moves: "R2 D R' U2 R D' R2 F' U' F", id: '65fbd3b2-9ad5-451a-97e8-570efc182253' }
    ]
  },
  {
    name: 'ZBLS 36.1',
    id: 'adeac1e8-5727-481b-a60d-776712b90f0d',
    idMethod,
    puzzle,
    group: 'ZBLS 36',
    algs: [
      { moves: "F' U' F U' F R' F' R2 U R'", id: '209291a1-1bbe-4eb7-bc46-86a253eea19e' },
      { moves: "y L' U' L U' F U' R U' R' U' F'", id: '6d8f7683-4551-45fb-9c0b-05bbde5bb83c' },
      { moves: "U2 R' F R F' r U' r' U' r U r'", id: 'c1361642-16f6-4033-8a6b-de6dd39c54f5' }
    ]
  },
  {
    name: 'ZBLS 36.2',
    id: '1edb94d8-9dab-4f45-94ff-e513d54b8caf',
    idMethod,
    puzzle,
    group: 'ZBLS 36',
    algs: [
      { moves: "F R' F' R2 U2 R' U2 F' U' F", id: '0b263140-41b5-4071-8c34-962756d76733' },
      { moves: "y L' U' L U' F U' R U2 R' F'", id: 'f70958ce-b7fd-418e-b48e-e8fe70b0ff2e' },
      { moves: "U2 R2 D r' U' r D' R2' U' R U R'", id: '22e238b2-690e-43f6-ae42-71bb64396a9a' },
      { moves: "R' F' r U2 r' F2 R2 U2' R' U' F", id: '6b87d83c-a903-4940-bbb6-240027f5bf32' },
      { moves: "F' U2' r' F2 r2 U' r' F U' F", id: '37e97a03-98fb-4f9a-b2f3-7d6305d812fe' },
      { moves: "R2 D R' U2 R r' U' r D' R' U R'", id: '81cbb16d-ae2b-4a1d-90e6-41fff0f62b7f' }
    ]
  },
  {
    name: 'ZBLS 36.3',
    id: '5b77433f-598e-421e-a471-13996505b24d',
    idMethod,
    puzzle,
    group: 'ZBLS 36',
    algs: [
      { moves: "(U') R2 U2 F R F' U2 R2 F' U F", id: 'a9705115-3025-4db7-b00c-719e41de508f' },
      { moves: "U R U' R' F' U' L' U' L U' F", id: 'b78ea4a0-5c0d-4fde-b7af-69e8f2bf8ba0' },
      { moves: "R U M' U2 f R f' U2 r'", id: '707b8f88-b838-4092-86f6-90af061972e7' },
      { moves: "U F' U' F2 U R U' R2' F' R", id: '318a1b1b-74db-47b1-8b1a-2eabb7e157cd' },
      { moves: "R U R2' D' r U r' D R U' R U R'", id: '90bc8708-1428-42b4-83a9-5c55f5d997e2' },
      { moves: "R U R2' D' r U' r' D R U R U R'", id: '23d6478d-7e45-4746-bb8d-e6c7eb70469b' },
      { moves: "R' F2 D' F' D R U R U' R2 F' R", id: 'fba4b913-01f3-479a-9e5a-33421686807b' }
    ]
  },
  {
    name: 'ZBLS 36.4',
    id: 'e5c0765b-8066-4329-8596-9980f998e83e',
    idMethod,
    puzzle,
    group: 'ZBLS 36',
    algs: [
      { moves: "R2 D L' B L D' R' U R'", id: 'bcba21b0-569d-40e8-bc17-5ad447c983bb' },
      { moves: "y' U2 r' U r U' r' U2 R U R' r", id: '61f3b2b9-600f-47a3-846c-753cf320fd1f' },
      { moves: "R2 D r' U r D' R' U R'", id: '8bae139a-9622-4f58-9d93-7761da4f7f34' }
    ]
  },
  {
    name: 'ZBLS 36.5',
    id: '4645e4fb-2f25-41fe-9dfa-335c6287fd93',
    idMethod,
    puzzle,
    group: 'ZBLS 36',
    algs: [
      { moves: "(U) F' U' F U' R U R'", id: '7fcc201d-b8cd-4b91-92ed-e0f3bcea6b00' },
      { moves: "y' U' r' R U' R' U r R' U R", id: '3900006e-fc8a-4843-a020-e9d64b506f5a' }
    ]
  },
  {
    name: 'ZBLS 36.6',
    id: '4f0cbfdf-d65c-46a6-a0cc-d51a271531ac',
    idMethod,
    puzzle,
    group: 'ZBLS 36',
    algs: [
      { moves: "(U2) F' U' F U R U' R'", id: 'ac3e7eca-d423-4f3a-a575-cf25887dea23' },
      { moves: "y' U2 R' U' R U y R U' R'", id: '6d8328b2-2b47-487b-990a-300bf17924da' },
      { moves: "U2 F' U' F U R U' R'", id: '2b096603-abc6-4c78-981d-052cba8bb2e6' },
      { moves: "R U R' U R U' R' d' r' F r", id: '1116ef75-44b5-4163-b875-b6aa995481a7' },
      { moves: "R U R' F U2' r U r' U2' F'", id: 'df453695-5c86-4028-b2bc-ba2f6ea8b80f' }
    ]
  },
  {
    name: 'ZBLS 36.7',
    id: '5190d70e-0356-4f94-8e36-a67d62b40560',
    idMethod,
    puzzle,
    group: 'ZBLS 36',
    algs: [
      { moves: "(U2) F' U' F R' F R F'", id: '5d0d6e17-5cd5-4e84-9879-db1b72f5e75d' },
      { moves: "y' U2 R' U' R r' U' R U R' r", id: '0ba3efd5-1e70-4164-9a38-855196fc58f2' },
      { moves: "U2' R' F R F' U2 R U R'", id: 'ea547a33-7824-4d6b-af3d-7e0958899fdc' },
      { moves: "R U R' F R S R' F' R S' R'", id: '466b4b03-ebfc-4dd7-b155-7b007ad14b55' },
      { moves: "R U R2 U' R F' R' U R F", id: '80a9c7e5-8e23-49a8-b35c-77a6148ca887' }
    ]
  },
  {
    name: 'ZBLS 36.8',
    id: '96f57212-25ab-4bd3-8407-72c8b0c0a750',
    idMethod,
    puzzle,
    group: 'ZBLS 36',
    algs: [
      { moves: "(U2) F' U F U R U R'", id: '1eb45815-a3f0-4c27-8027-c59191340148' },
      { moves: "y' U2 R' U R U y R U R'", id: 'b2e3bc56-a86a-47b5-8726-81e3e238af1b' },
      { moves: "F' U' F R U R' U' R U R'", id: 'df6fd46f-7972-476a-b3a4-21559eeb684e' },
      { moves: "R U R U R' U' R' F R F' R'", id: '56c96b4d-4ba9-432d-a395-a758c36a02a1' }
    ]
  },
  {
    name: 'ZBLS 37.1',
    id: 'f24c5fd1-cf65-4019-a403-3920cecea217',
    idMethod,
    puzzle,
    group: 'ZBLS 37',
    algs: [{ moves: "R U2 R2 F R F' U2 R' F R F'", id: '5e35c4a3-a0fe-4cc5-9e50-4150d1a2f66e' }]
  },
  {
    name: 'ZBLS 37.2',
    id: '2feb910d-f78d-48e9-b134-b87970fd470e',
    idMethod,
    puzzle,
    group: 'ZBLS 37',
    algs: [{ moves: "F U R U' R' F'", id: 'a7772adc-be26-4228-a05c-cfb0a55607d2' }]
  },
  {
    name: 'ZBLS 37.3',
    id: '35080eee-c3db-4aca-8a84-ba612d00c69c',
    idMethod,
    puzzle,
    group: 'ZBLS 37',
    algs: [{ moves: "F R U R' U' F'", id: '024d9654-e04e-4e33-b4a3-acbe0f97cc4f' }]
  },
  {
    name: 'ZBLS 38.1',
    id: '1f97115a-5177-468a-9cef-0038c6486c00',
    idMethod,
    puzzle,
    group: 'ZBLS 38',
    algs: [
      { moves: "R2 B' R' U' y R2 U' R2 U2 R F'", id: 'af313abc-3fa1-4355-bf2d-a70d33bb9aec' },
      { moves: "U F2 L F U L2 U L2 U2 L' F", id: 'f6636c0c-b178-4304-9586-017d92b0886a' },
      { moves: "r U' r' R U R' U r U' r' R U R'", id: '6f093822-8479-40f6-a0ff-e623a83e10c3' },
      { moves: "U R' F R F' U F' U2' F U' R U R'", id: 'cea9833e-4335-44d5-96da-a06dc3d65b08' },
      { moves: "U R' F R F2 U' F U' R U R' U' R U R'", id: '97c299bd-4685-4c07-81db-db5fe7b174b7' },
      { moves: "R U' R' U R' F R F2 U2 F R U R'", id: '11c19839-0d3e-4404-afd8-38e01af6fe1d' }
    ]
  },
  {
    name: 'ZBLS 38.2',
    id: 'e636bb6f-98bd-44cc-97cd-2d32618ad3f5',
    idMethod,
    puzzle,
    group: 'ZBLS 38',
    algs: [
      { moves: "R U' R U2 F R2 F' U2 R2", id: '54721e8d-542f-4258-9e49-e9489ce9c37a' },
      { moves: "U2 r' U' R2 U' R2 U2 r R U R'", id: 'e88ab53a-b624-4a6f-847e-4677bebecc27' },
      { moves: "R' F R F' R U' R' U R U' R' U2 R U' R'", id: '898e4b33-3334-4561-af34-5b69c541b3a0' },
      { moves: "R' F R F' R' U2' R2 U R2' U R", id: '0a084ffe-bab9-4795-a19b-cbf017f4b3eb' },
      { moves: "U R U M' U2 M U R' F' R S R' F R S' R'", id: 'a4c941d8-ba77-445a-9ed2-a257f4e3bdbd' },
      { moves: "U2 L E' L' U' L E L2' E2 L U L' E2 L", id: 'd99fb463-6c14-4a3c-84f3-d8571d199897' },
      { moves: "L E' L' U L E L2' E2 L U' L' E2 L", id: '9cc1b45f-3242-42dc-b919-c17727577149' },
      { moves: "U2 R2 U R' U' R' U2' r U R U' r' R'", id: '147c4f19-0c1a-4075-963b-974ec1231906' },
      { moves: "U R U' R' B' R' U' R2 U R' B", id: '6f7d15b9-2ce7-4499-b457-74ec6fb3e244' }
    ]
  },
  {
    name: 'ZBLS 39.1',
    id: '62389fd7-0bc0-4975-b542-6152f229bc49',
    idMethod,
    puzzle,
    group: 'ZBLS 39',
    algs: [
      { moves: "y F R U2 R2 F R y' R2 U R U R'", id: 'e721ace3-62a4-4463-b808-d56cf3caa289' },
      { moves: "y' R' U' F' L' U L U' L' U L F R", id: '8e2b6eb0-ed5e-4a6e-8d46-cb6aed33bf7e' },
      { moves: "M' U R U' R' U' R U' r' U2 r U' r'", id: 'cf497475-91f2-4870-9694-74f513a1ecbd' },
      { moves: "R U' R' U' r U' r' U2' r U r' R U2 R'", id: 'fe897191-546f-460f-8063-07bcc7c4025c' },
      { moves: "R U2' B2 r' U' r B' R2 F R F'", id: '743f5baa-c050-4763-9e3a-904d941b7079' },
      { moves: "R U' R' U2 R2 D r' U' r D' R' U' R'", id: '275b2b88-9db6-432c-8d03-2118f667cae8' }
    ]
  },
  {
    name: 'ZBLS 39.2',
    id: 'f3811da4-3940-4831-94d9-59fc97e5a2f4',
    idMethod,
    puzzle,
    group: 'ZBLS 39',
    algs: [
      { moves: "R U2 R U2 F R F' U2 R2", id: 'd26b955a-e9fb-460b-98d4-cbc542838311' },
      { moves: "U r R U2 R' U' R U' r' U2 R'", id: 'e1d927c8-ee6d-42fa-96c3-e803dfd98960' },
      { moves: "F R' F' R2 U2' R' U' R U R'", id: '08935cfd-df7a-496c-b265-3877765b9224' }
    ]
  },
  {
    name: 'ZBLS 39.3',
    id: '82cfcc39-49cc-433a-94fd-c55209c4b905',
    idMethod,
    puzzle,
    group: 'ZBLS 39',
    algs: [
      { moves: "R U' R' U' R U B U' B' U R'", id: '4d0a3633-4b63-47a9-b50e-d179111db845' },
      { moves: "U' F' L' U2 L U' L' U2 L U' F", id: '9657cb59-0b2e-47ce-8eaa-c48f21ee9b21' },
      { moves: "R U' R' U' R U R' U R' F R F'", id: '9ea7f032-f4b4-4dfa-9b07-8e2a078d4548' },
      { moves: "U R' F R U R U' R2 F' R U' R U2' R'", id: '21c7fae8-e9ba-416c-a5e2-b5181000e37a' }
    ]
  },
  {
    name: 'ZBLS 39.4',
    id: 'ec846f2d-f289-45f9-90c2-7e158e320237',
    idMethod,
    puzzle,
    group: 'ZBLS 39',
    algs: [{ moves: "R2 U2 R' U' R U' R' U2 R'", id: '5f059791-adc0-4c42-b88d-6256255416d5' }]
  },
  {
    name: 'ZBLS 40.1',
    id: 'c0d47f3d-ff6b-4fc6-ae8d-6ddf1451804f',
    idMethod,
    puzzle,
    group: 'ZBLS 40',
    algs: [
      { moves: "R U' R' U' R2 B' R' y R2 U2 R' F'", id: 'ff406b62-9723-4247-abc5-b98da9b03759' },
      { moves: "y' R' F' L' U' L U L' U' L F U R", id: '195ae9a1-39e3-40fa-b286-6f6aa8d2d176' },
      { moves: "R U2' R' r U' r' U M' U2' R U r'", id: '4f46e81f-3298-4405-b314-5827ec43df71' },
      { moves: "r' U' R2 U' R2' U2' r F' r' F2 r F", id: 'df876ce8-38f0-4b2c-bcc7-31962335f18c' },
      { moves: "R U R D r' U r D' R2' U2' R U R'", id: 'd79c5f8f-ee92-4534-91f2-081c8a383aff' }
    ]
  },
  {
    name: 'ZBLS 40.2',
    id: '8ee0cfbd-ec43-4bae-8d6e-ddc04f289be0',
    idMethod,
    puzzle,
    group: 'ZBLS 40',
    algs: [
      { moves: "R2 U2 F R' F' U2 R' U2 R'", id: 'c6944404-2883-403b-a861-fe73f2cd7a47' },
      { moves: "R U2 r U R' U R U2 R' r'", id: 'f995e4c7-6d2f-412d-a04d-f087d1e54c3c' },
      { moves: "R U' R' U R U2 R2 F R F'", id: '1454a0c3-835e-43d4-8fc9-75dd3aff1e48' }
    ]
  },
  {
    name: 'ZBLS 40.3',
    id: '9e1c9b9c-57f5-4a64-9036-a70cbc7cf681',
    idMethod,
    puzzle,
    group: 'ZBLS 40',
    algs: [
      { moves: "y F R U2 R' U R U2 R' U F'", id: '48c2f2a5-b6b6-4c5b-8f18-778ec0557205' },
      { moves: "R U2' R' U R' F R2 U R' U' R' F' R", id: 'c146a81f-cab9-4f95-9441-d5b7c61fd3db' }
    ]
  },
  {
    name: 'ZBLS 40.4',
    id: 'e05f37f2-4942-4d7f-8697-14be488c33b6',
    idMethod,
    puzzle,
    group: 'ZBLS 40',
    algs: [
      { moves: "R U2 R U R' U R U2 R2", id: 'dcceec35-e628-4abb-a7b3-7d49c74d06af' },
      { moves: "R U2 R' U R U' R' U R U R'", id: '4b1cbeac-6faf-4d89-b355-14baeb583ee5' }
    ]
  },
  {
    name: 'ZBLS 41.1',
    id: 'd4d91f53-30b0-4089-b992-e22c0adf5d3e',
    idMethod,
    puzzle,
    group: 'ZBLS 41',
    algs: [
      { moves: "F' L' U2 L F R U R'", id: '0c8a0cca-dbe4-4f7a-812c-9b3ba5360b69' },
      { moves: "r U' r' U2 r U r' R U R'", id: 'dff714fd-664d-44c4-a691-1e4057c15cca' },
      { moves: "R' F R D R U R U' R2 D' F'", id: 'ae100f55-5b84-4934-8d42-0308df61c308' }
    ]
  },
  {
    name: 'ZBLS 41.2',
    id: 'bc6145b5-aead-4a6b-aaf2-77b8fce71ac0',
    idMethod,
    puzzle,
    group: 'ZBLS 41',
    algs: [
      { moves: "R U' R U B U' B' R2", id: '34737a35-7b87-484b-8d43-a788edd6e15e' },
      { moves: "R F U R U' R' F' U' R'", id: 'e49166b3-34f2-465c-a905-6ee03c526aba' },
      { moves: "U R U' R' F R U R' U' F' R U' R'", id: 'a9eccdf2-5d08-4c05-8d01-a596ca9f43c3' },
      { moves: "F2 r U r' F U2' R U R'", id: 'd195252a-8ae3-4014-a9e2-1d934b4ed020' }
    ]
  },
  {
    name: 'ZBLS 42.1',
    id: '49a296bc-4e43-43c6-b5f2-1dc31ae9ad47',
    idMethod,
    puzzle,
    group: 'ZBLS 42',
    algs: [
      { moves: "R U' R' F' L' U2 L F", id: '9ca86134-1cf2-430e-90fb-1a758892bd4a' },
      { moves: "R U' R' r U' r' U2 r U r'", id: 'b6421021-9758-46cb-bf40-f46101721973' },
      { moves: "R U' M' U' r' U2 r U r'", id: 'c03454fd-0d57-4493-987b-68e8e366c0ac' }
    ]
  },
  {
    name: 'ZBLS 42.2',
    id: 'e6bba2a1-f499-4740-8712-b844b9c1eaa5',
    idMethod,
    puzzle,
    group: 'ZBLS 42',
    algs: [
      { moves: "R2 B U B' U' R' U R'", id: '065a5136-2b48-4263-a977-aaef081b1eac' },
      { moves: "R U F R U R' U' F' R'", id: 'fa7e62e2-b2c2-48c0-a50b-b34873001c04' },
      { moves: "U2 R U R' F U R U' R' F' R U R'", id: '6accf2c4-ac18-4271-9aba-ba7a50cb8101' },
      { moves: "U' R U R' U' R U' R' U2 F' U' F", id: '602cb322-0ecd-423a-a1db-be19c5208b1e' }
    ]
  }
]
