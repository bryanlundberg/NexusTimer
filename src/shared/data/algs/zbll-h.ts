import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

const idMethod = 'ZBLL_H_ALGS'
const puzzle = '333'

export const ZBLL_H_ALGS: AlgorithmCollection[] = [
  {
    name: 'ZBLL H 1',
    id: '61d3d90f-8e1c-41b4-8f6b-c7835ad58260',
    idMethod,
    puzzle,
    group: 'H1',
    setup: "R U R' U R U2' R2' F' r U R U' r' F y'",
    algs: [
      { moves: "y F' r U R' U' r' F R2 U2 R' U' R U' R'", id: '5aa97986-f31a-418e-875f-b1b02e8ebd41' },
      { moves: "R U2 R' U' R U' R' F R U' R' U' R U2 R' U' F'", id: '16f4ca84-e8c1-4a44-bdc0-15940fa37449' },
      { moves: "y R' U' F' U F R U R U R' U' R' F R F'", id: 'efbff8b9-1ffa-49c7-a29e-f6f100c32db0' },
      { moves: "y2 R U R' U' R' F R U R U' R' F' R U R' U R U2 R'", id: '329f6613-0666-47b2-bb36-92c47687a3b5' }
    ]
  },
  {
    name: 'ZBLL H 2',
    id: '3a50bda1-d5b6-49bb-b35a-3169db6bc357',
    idMethod,
    puzzle,
    group: 'H1',
    setup: "R U R D R' U' R D' R2' U R U2' R' U' R U' R' y",
    algs: [
      { moves: "y' F R' F' r U R U' r2 F2 r U L' U L", id: '2dce5c71-c57c-4b5f-9651-4dd81f2c1eb2' },
      { moves: "y' R U R' U R U2 R' U' R2 D R' U R D' R' U' R'", id: 'ed47316f-80b2-4dbc-9f4e-4c8b725099bd' },
      { moves: "y2 L' R U R' U R U' R' U2 L U' R U2 R'", id: '11208b60-aea5-4444-8e3c-5e879ea09c8f' },
      { moves: "y2 R U R' U' R' F R U R U' R' F' U' R' U2 R U R' U R", id: '3569c658-bd3c-424f-a91a-c2ab174e3765' }
    ]
  },
  {
    name: 'ZBLL H 3',
    id: '79c5a54e-9955-4550-87cc-a3672192e1eb',
    idMethod,
    puzzle,
    group: 'H1',
    setup: "R' U' R' D' R U R' D R' U R' U R U2' R'",
    algs: [
      { moves: "y' R U2 R' U' R U R' U2 R' F R2 U' R' U' R U R' F'", id: 'a87e0daf-24c0-4f22-ae68-3c4856561604' },
      { moves: "y R U R D R' U R' U' R U R2 D' R U' R U' R'", id: 'e980257a-5248-40ac-b217-c0848e30f2b6' },
      { moves: "R U2 R' U' R U' R D' R U' R' D R U R", id: '19134341-ce70-4a2f-bc40-4f9bbc532512' },
      { moves: "y' R' U2 R2 B' U R2 U R2 U' B U' R'", id: 'f2cfe755-d16e-4219-b227-bd37b3412bff' }
    ]
  },
  {
    name: 'ZBLL H 4',
    id: '06c64545-a560-4e8a-96f4-4030f16895cd',
    idMethod,
    puzzle,
    group: 'H1',
    setup: "R' U' F U' R2' U R2' U F' R2' U2' R' y",
    algs: [
      { moves: "y F' R U2 R' U2 R' F U' R U R U' R' U' R' U R", id: '29306605-adfd-4876-8187-7e66f347242e' },
      { moves: "y2 R' U2 R U R' U R' D R' U R D' R' U' R'", id: '943bfcb9-8a58-4ab4-a3b8-bb40e5d1a445' },
      { moves: "y R' D R2 U' R2 D' R U' R' D R2 U2 R2 D' R", id: '9ece323d-a843-4d46-8cc2-efc358af7e0e' },
      { moves: "y' R U2 R2 F U' R2 U' R2 U F' U R", id: 'cde9017b-ab66-41ef-8fbe-5b93a8baafd0' }
    ]
  },
  {
    name: 'ZBLL H 5',
    id: '1f4b998e-acea-4672-9f5a-971f4c12ab98',
    idMethod,
    puzzle,
    group: 'H1',
    setup: "R2' F2' r U r' F R2' U2' B' R B R' y",
    algs: [
      { moves: "y2 R' U2 R2 U R2 U R U2 R' F R U R U' R' F'", id: '99bb2e46-e0a3-427c-9f65-5fb3eb21d922' },
      { moves: "R U R' U R U' R' U R U' R2 F' R U R U' R' F R U' R'", id: 'b8ddd6e4-2ed4-47c8-8382-381947741c83' },
      { moves: "R' F' R U R' U' R' F D' R U' R' D R U2 R", id: '863e1a24-cc1b-4e76-8885-39592e1fee7a' },
      { moves: "y R U2 R' U L' U2 R U2 R' U2 L R U' R'", id: 'ad1f31e9-d71f-4fdd-934e-a789a43ac819' }
    ]
  },
  {
    name: 'ZBLL H 6',
    id: 'eafbeb73-b2e8-4bd3-9a3b-617ff81b4cbc',
    idMethod,
    puzzle,
    group: 'H1',
    setup: "R U2' R' U F2' R U2' R' U2' R' F2' R2' U R' y",
    algs: [
      { moves: "y' R U2 R' U' R U R' U' F' R U R' U' R' F R2 U' R'", id: '2f5dd365-54f3-4ee9-a9a6-1ae3eb58ece6' },
      { moves: "y' r U2 R' U' R U' r' U R U2 R' U2 R' F R F'", id: '0d20c2dd-ad3e-4d88-9ccd-157155a428d9' },
      { moves: "y R' U2 R U' L U2 R' U2 R U2 L' R' U R", id: '6a75b9f0-a19e-418a-a742-e42aad123b7f' },
      { moves: "L F L' U' L U L F' D L' U L D' L' U2 L' U'", id: '30c94d4f-7a26-4a3a-bd9c-6fd19a9272f1' }
    ]
  },
  {
    name: 'ZBLL H 7',
    id: 'c5aca724-713b-4fe1-8095-8e25dc7bf0df',
    idMethod,
    puzzle,
    group: 'H1',
    setup: "R U2' R2' U' R U' R' U2' F R U R U' R' F' y",
    algs: [
      { moves: "R U R' U R U' R2 F' R U2 R U2 R' F R U' R'", id: '0eeb55c3-aa44-4859-aea4-053a0ca8c0e1' },
      { moves: "y R' D' R U2 R' D R U R U2 R' U R U' R' U' R U' R'", id: 'f60a417d-401d-44be-8170-5b83bbf44003' },
      { moves: "y' F R U R' U' R' F' U2 R U R' U R2 U2 R'", id: 'af0d94b1-7f7b-4274-beac-7581ad2aeb75' },
      { moves: "y2 F R U' R' U' R U2 R' U' F' R U2 R' U' R U' R'", id: '325b2956-b8dd-4a3c-8501-22dd6671f60b' }
    ]
  },
  {
    name: 'ZBLL H 8',
    id: '0cbdf956-5ab2-410f-9a1f-f080898f210e',
    idMethod,
    puzzle,
    group: 'H1',
    setup: "F U R U' R' U R U2' R' U' R U R' F' y2'",
    algs: [
      { moves: "y2 F R U' R' U R U2 R' U' R U R' U' F'", id: '0c74b30a-011c-400b-8fe7-48dd7a9a619c' },
      { moves: "y2 f R U R' U' f' R U R' U' R' F R F'", id: '7a2800c8-e23b-4d8d-9fd2-c772d0338240' }
    ]
  },
  {
    name: 'ZBLL H 9',
    id: '769e14c0-5869-457a-bb9d-03f640baae9c',
    idMethod,
    puzzle,
    group: 'H1',
    setup: "R' U' F R' F' R U' R U R' F U R U' R' F' R",
    algs: [
      { moves: "y2 F R' F' R2 U2 R' U R U2 R' U R U' R2 F R F'", id: 'adb94777-0072-4ae1-9323-6151576796a9' },
      { moves: "R F R2 U' R2 U' R2 U2 R2 U' F' R'", id: 'e9d32aee-fb74-4b89-b3fc-fb13e49906cd' },
      { moves: "y' R' U R D' R U R' U2 R U R' U D R' U' R", id: '561c1ed0-cc74-48e3-b2be-ec9018db8694' },
      { moves: "R' F R U R' U' F' R U' R' U R' F R F' U R", id: 'a5adcb36-52cc-44bd-9f33-25a346b7eef0' }
    ]
  },
  {
    name: 'ZBLL H 10',
    id: '57c6a365-18b4-414c-b953-c539c19e418a',
    idMethod,
    puzzle,
    group: 'H1',
    setup: "R' U' F' R U R' U' R' F R2' U2' R' U2' R y",
    algs: [
      { moves: "y' R' U2 R U2 R2 F' R U R U' R' F U R", id: '8d008bf6-35af-425a-8b90-fc04f212e617' },
      { moves: "y L' U2 M' x' D R2 U R2 u' R2 B", id: 'bf4b925f-6193-41d3-86a7-0c813e952e65' },
      { moves: "y l F l2 U2 F l U2 l2 U' l2 U2 l' U2 l", id: '2dc55021-9352-430a-8f02-0e6c4a910617' },
      { moves: "F' B L2 B' L2 U L2 U L2 U' L2 F", id: '8782139b-201b-4273-a721-28a80ee62e1f' }
    ]
  },
  {
    name: 'ZBLL H 11',
    id: '284a7251-c04c-470e-94ee-4756c16c6d65',
    idMethod,
    puzzle,
    group: 'H1',
    setup: "R U R' U R U' R' U' R' F' R U2' R U2' R' F y'",
    algs: [
      { moves: "y F' R U2 R' U2 R' F R U R U R' U' R U' R'", id: '5d3443f0-ab2e-44c8-8219-053620569411' },
      { moves: "y2 f R2 S' U' R2 U' R2 U R2 F'", id: '4219c851-a4fc-4a92-840f-0aa59c19ed64' },
      { moves: "F B' R2 B R2 U' R2 U' R2 U R2 F'", id: '65976a6f-855f-4ee4-bc58-08a76aa1b9ad' },
      { moves: "U L U2 L' U2 L2 F L' U' L' U L F' U' L'", id: '2396c9d3-c7cb-464b-b881-1a4b012f6381' }
    ]
  },
  {
    name: 'ZBLL H 12',
    id: '88662f5c-d557-4508-a555-37d3cf8cb26d',
    idMethod,
    puzzle,
    group: 'H1',
    setup: "F U' R U' R' U R U R' U2' R U2' R' U F'",
    algs: [
      { moves: "F U' R U2 R' U2 R U' R' U' R U R' U F'", id: '941bb006-2177-40d3-9443-d4ea3d805f73' },
      { moves: "y' R D' R U2 R' U2 R U' R' U' R U R' D R'", id: 'abc7f8f1-b24c-44c6-b7fd-f5db3377a640' },
      { moves: "y f U2 R F R' F' R U2 R U2 R2 U2 f'", id: '7d203e7c-d73e-42a0-b7b5-5c93781bdc80' },
      { moves: "L' F' L2 U L2 U L2 U2 L2 U F L", id: 'e88dc582-8728-4b91-97a3-1acd0dbb9f7b' }
    ]
  },
  {
    name: 'ZBLL H 13',
    id: 'e62082f5-0662-4d5c-bd43-01401222ed34',
    idMethod,
    puzzle,
    group: 'H2',
    setup: "R2' D R' U2' R D' R2' U' R2' D R' U' R D' R2' y2'",
    algs: [
      { moves: "y' R' U2 R U R' U' F' R U R' U' R' F R U2 R", id: '769ba8c1-2c53-43fa-940b-1330ead8ad19' },
      { moves: "y2 R2 D R' U R D' R2 U R2 D R' U2 R D' R2", id: 'b99bbd3a-21c1-4c70-942a-c2b851fa6ea0' },
      { moves: "y r U R' U R U2 r2 F' r U' L' U L U L F' L' F", id: '60b78753-eb38-4e76-8697-66315fa0d408' },
      { moves: "L2 D L' U L D' L2 U L2 D L' U2 L D' L2", id: '7e9eac3e-dbc2-4edc-8c18-93acaf93de63' }
    ]
  },
  {
    name: 'ZBLL H 14',
    id: '47734a75-1eee-417c-8a54-bb346025e660',
    idMethod,
    puzzle,
    group: 'H2',
    setup: "R U R' U R2' D R' U' R D' R2' U R U2' R' y",
    algs: [
      { moves: "y' R U2 R' U' R2 D R' U R D' R2 U' R U' R'", id: '95a4cb2b-2510-4fc9-ac37-b44be839596e' },
      { moves: "y R' U2 R2 U R D' R U R' D R' U2 R'", id: '18084b7b-81f9-45da-980e-73b00ed35a11' },
      { moves: "y' L' U2 L2 U L D' L U L' D L' U2 L'", id: '0a64e5a5-310c-4492-83c9-eb9571ab1c65' },
      { moves: "y2 R2 D R' U2 R D' R U' R2 U' R2 U2 R", id: '2bd75461-6b5d-46d1-96b5-9111aabf3b9c' }
    ]
  },
  {
    name: 'ZBLL H 15',
    id: '58750095-1490-4422-9e41-2914d5196b0d',
    idMethod,
    puzzle,
    group: 'H2',
    setup: "R2' D' R U2' R' D R2' U R2' D' R U R' D R2' y2'",
    algs: [
      { moves: "y2 R2 D' R U' R' D R2 U' R2 D' R U2 R' D R2", id: '95a98ef0-5f5f-436f-9735-983fa0409ade' },
      { moves: "R' U2 R U R' U R2 y R U' R' U' R U2 R' U' F'", id: '83f2f704-104b-4a9d-b45c-9893d2e0ec0b' },
      { moves: "y' R' U L' U' R U2 L U' L' U' L U L' U' L", id: 'a9adec2e-d637-4f66-b052-6545771ea0d5' },
      { moves: "y L' U R' U' L U2 R U' R' U' R U R' U' R", id: '067f2fff-72e7-433d-a47f-887725aac0f1' }
    ]
  },
  {
    name: 'ZBLL H 16',
    id: '5084a03b-c4d3-455e-af9b-a6714b09ae90',
    idMethod,
    puzzle,
    group: 'H2',
    setup: "R' U2' R' D R' U R D' R U R2' U2' R' y",
    algs: [
      { moves: "y R' U2 R U R2 D' R U' R' D R2 U R' U R", id: '6729725c-c821-4f11-96d6-567f9719c374' },
      { moves: "y2 R2 D' R U2 R' D R' U R2 U R2 U2 R'", id: '70a1cc6f-72ef-41c6-b7fd-0cf90cc95656' },
      { moves: "y' R U2 R2 U' R' D R' U' R D' R U2 R", id: '6a76d661-2233-48cd-9ec5-f0f800993ed6' },
      { moves: "y L U2 L2 U' L' D L' U' L D' L U2 L", id: '703dfa91-d7e5-46fc-87d5-4d6e0d6ce862' }
    ]
  },
  {
    name: 'ZBLL H 17',
    id: '404a021c-1a0b-4bb4-8d6b-49d8f83d1e55',
    idMethod,
    puzzle,
    group: 'H2',
    setup: "L U' R' U L' U R2' U R2' U R U' R U' R' y2'",
    algs: [
      { moves: "F R' F' R U2 R U2 R' U' R' F2 r U r' F R", id: 'dae4d091-6b0e-464e-84c6-94b6059cd4ba' },
      { moves: "y2 R U R' U R' U' R2 U' R2 U' L U' R U L'", id: 'a75e4a80-3552-4dfc-973b-53f3359e09c5' },
      { moves: "y R' D' R U R' D R2 U R' U2 R U2 R' U R U2 R'", id: 'b3978a24-4c29-4158-bfec-27030dbfc695' },
      { moves: "R' U2 R' D' R2 D2 R' U R D2 R' U R' D R2", id: '96edcfb1-1eb7-4351-9703-8473c0b113e3' }
    ]
  },
  {
    name: 'ZBLL H 18',
    id: 'dcc6c92e-6578-4944-acb3-b4aacd79f813',
    idMethod,
    puzzle,
    group: 'H2',
    setup: "L' U R U' L U' R2' U' R2' U' R' U R' U R y2'",
    algs: [
      { moves: "y2 R' U' R U' R' U F' R U R' U' R' F R2 U' R' U R", id: 'f93e7344-13cb-49df-a19e-e80f56b23426' },
      { moves: "y2 R' U' R U' R U R2 U R2 U L' U R' U' L", id: '68ab1b67-2f59-4bf6-8fc6-bc8962cea4e7' },
      { moves: "U' R' U' R F D R' U R U' R' U R D' R' U' R F'", id: 'c78b4702-53bb-46ca-a642-ce8c1b838188' },
      { moves: "R U2 R D R2 D2 R U' R' D2 R U' R D' R2 U", id: '363eb998-2418-4e90-b9e3-bf5f37113a3f' }
    ]
  },
  {
    name: 'ZBLL H 19',
    id: '056601cb-5f10-446d-b8ec-50cef57b8433',
    idMethod,
    puzzle,
    group: 'H2',
    setup: "R2' U R' U' R' U2' R' U2' R U R' D R' U R D'",
    algs: [
      { moves: "y' F R U' R' U' R U2 R' U' F' U R U R' U R U2 R'", id: '80267312-e974-48a2-b853-1d4856dd1de7' },
      { moves: "y' R' U' R f U R U2 R' U2 R' U2 R2 U R' f'", id: 'fabff438-ff6b-4e18-8ed5-a9a591a5ff7e' },
      { moves: "y R U R' U' R' U2 R2 D R' U R D' R2 U R2 U2 R'", id: 'c80e418f-de56-400a-8acb-1818bcb788f7' },
      { moves: "R' U' R D' R U' R' U2 R U2 R U R U' R2 D", id: 'a7c7ad88-144d-41e9-9cb2-5a8e78bf2bf9' }
    ]
  },
  {
    name: 'ZBLL H 20',
    id: 'be5cb8df-6942-4c96-87cc-1ce1d79ab378',
    idMethod,
    puzzle,
    group: 'H2',
    setup: "F U R U2' R' U R U R' F' R U2' R' U' R U' R' y'",
    algs: [
      { moves: "y R U R' U R U2 R' F R U' R' U' R U2 R' U' F'", id: '9d71a2c4-9a5e-437f-b14b-98b2ed28b545' },
      { moves: "y2 R2 D' r U2 r' D R' U R2 U R2 U2 R'", id: '89af3566-f252-4be9-bdd9-b298115f01a6' },
      { moves: "y R U' L U L2 R' U2 L U L' U L U L U' L'", id: 'db17735c-166a-4f6b-a047-f50d21e6e0e3' },
      { moves: "y' L U' R U R2 L' U2 R U R' U R U R U' R'", id: 'dffd7924-a184-40cd-9340-3fe671bfd4b3' }
    ]
  },
  {
    name: 'ZBLL H 21',
    id: '7f3addaa-4ccd-43dd-ae68-a1369176bc09',
    idMethod,
    puzzle,
    group: 'H2',
    setup: "L U' R' U L' U R U R' U R",
    algs: [
      { moves: "R' F' R U2 R U2 R' F U' R U' R'", id: '9514e71f-e56e-4f00-8f79-12e9fcd3e538' },
      { moves: "R' U' R U' R' U' L U' R U L'", id: '448b4df1-c3d4-423e-958d-ad827a245d27' },
      { moves: "R' U' R2 D R' U2 R D' R' U R' U2 R", id: '0fb49ffb-de46-4c86-8a57-e80c9b38b6a0' },
      { moves: "y2 L' U' L U' L' U' R U' L U R'", id: '1a7c45e9-62af-48a6-a060-b67cda1a03d9' }
    ]
  },
  {
    name: 'ZBLL H 22',
    id: '3e9fe69d-16b5-484b-8fcd-7072b13ae147',
    idMethod,
    puzzle,
    group: 'H2',
    setup: "L' U R U' L U' R' U' R U' R'",
    algs: [
      { moves: "R U R' U R U r' F R' F' r", id: '3c921d04-9eb6-495a-9120-49ba6b529d7b' },
      { moves: "R U R' U R U L' U R' U' L", id: '36e98437-4038-47d1-99c1-378dc589f0e0' },
      { moves: "y R' F R U R' U' R' F' R U' R U R' U R", id: '621257af-4be9-47cf-ba0c-2b42371756b4' },
      { moves: "R U R2 D' R U2 R' D R U' R U2 R'", id: 'd6fe1505-54b8-448f-896c-c40436c89784' }
    ]
  },
  {
    name: 'ZBLL H 23',
    id: 'af384fdc-2bd5-4d50-8d4b-9ba935f7423b',
    idMethod,
    puzzle,
    group: 'H2',
    setup: "r' U r U r' U' r U R2' F R F' R y'",
    algs: [
      { moves: "y R' F R' F' R2 U' r' U r U' r' U' r", id: '52e33c0d-7a95-4bb9-965d-28fcbf605fc6' },
      { moves: "y R U R' U R U2 R D' R U' R' D R U R", id: '0b14a5f6-0d7b-409d-87d4-fb4d23840663' },
      { moves: "y R U' L' U R2 U' R L U2 R' U' R", id: 'bb2214ef-6c4a-4d75-b2e0-06034dc0f6f1' },
      { moves: "y l' U R' U' x' R2 U' r' U r U' r' U' r", id: '57e6c5a7-dc9e-405a-801d-17a572a51144' }
    ]
  },
  {
    name: 'ZBLL H 24',
    id: '7f38d074-3962-4206-a54a-8165e8840ee3',
    idMethod,
    puzzle,
    group: 'H2',
    setup: "r U' r' U' r U r' U' l R U' R' U l' y",
    algs: [
      { moves: "y' R U R2 F R F' r U' r' U r U r'", id: 'c840934f-0980-4f54-a647-1687e7a39654' },
      { moves: "y' l U' R U R' l' U r U' r' U r U r'", id: '1c8543c1-f546-4151-a727-4a4b4b0caff7' },
      { moves: "y R U2 R' U' R U' R' U L' U R U' L U R'", id: '4620ba03-1363-49d7-a38a-aba5ee1a28cf' },
      { moves: "y' R' U' R U' R' U2 R' D R' U R D' R' U' R'", id: '7c70decc-5239-4b51-b721-9a35ed0fd8af' }
    ]
  },
  {
    name: 'ZBLL H 25',
    id: '976594f7-36e1-432e-98ff-dde875b90158',
    idMethod,
    puzzle,
    group: 'H3',
    setup: "F R' U R U2' R2' U' R U2' R' U' R2' U F'",
    algs: [
      { moves: "y' R' U' R y U' R U' R' U R l U' R' U l'", id: '6f13ce89-65e2-4f53-84db-3225aa79372f' },
      { moves: "F' U' F U' R U' R' U R l U' R' U l'", id: '5460d510-dbfc-4bc3-8af0-fcbb846b2857' },
      { moves: "F U' R2 U R U2 R' U R2 U2 R' U' R F'", id: 'e617f3b4-343d-414c-bd5c-ed944046fd92' },
      { moves: "y2 R' F R' F' R2 U R' U' R U' f R' f'", id: 'b25eb39f-272f-4480-9fe2-dd252c66111b' }
    ]
  },
  {
    name: 'ZBLL H 26',
    id: 'f8e03fbb-111d-46f8-977d-72e61eb4785f',
    idMethod,
    puzzle,
    group: 'H3',
    setup: "R U R' L' U2' R U R' U2' L R U2' R' U' R U' R' y",
    algs: [
      { moves: "y R U' R2 U' F2 U' R2 U R2 U F2 R2 U R'", id: 'dd8b2289-3bfe-4ce3-b4d8-2eaa0efac12a' },
      { moves: "y r U2 R2 F R F' R U2 r' L' U2 L U L' U L", id: '1e560b47-1e40-4096-aef8-35eb6afff560' },
      { moves: "y' F R U R' U' R U R' U' F' U R' F' U' F U R", id: '95bb7a2a-1243-476d-bec3-665b58e1c1e1' },
      { moves: "y r U2 R2 F R F' R U2 r' U2 R' U2 R U R' U R", id: '8932bcde-3791-45bc-87ba-c8b7244498fb' }
    ]
  },
  {
    name: 'ZBLL H 27',
    id: 'e286a07d-910d-49aa-8614-d460ba923f2c',
    idMethod,
    puzzle,
    group: 'H3',
    setup: "F U R U' R' U R U' R' U R U' R' F' y'",
    algs: [
      { moves: "y F R U R' U' R U R' U' R U R' U' F'", id: '4286dfa0-3820-4e93-9cf2-9bcf66828d2d' },
      { moves: "y F U R U' R' U R U' R' U R U' R' F'", id: '8cea3b4f-bb57-40fe-b693-8637b2a01719' },
      { moves: "y f U R U' R' U R U' R' U R U' R' f'", id: 'a0e10f7b-9e6e-4b07-a928-2527c868d902' },
      { moves: "y f R U R' U' R U R' U' R U R' U' f'", id: '3dd50996-40ea-425b-b8e2-1369b72fc54c' }
    ]
  },
  {
    name: 'ZBLL H 28',
    id: 'dc5fa593-b8f9-48eb-a8e1-20ae3c22d3df',
    idMethod,
    puzzle,
    group: 'H3',
    setup: "x' U' R U' R' U R' F2' R U' R U R' U x",
    algs: [
      { moves: "x' U' R U' R' U R' F2 R U' R U R' U x", id: '5e9fcf8c-9748-4219-abe7-e5cbe3e7e143' },
      { moves: "R U' L' U R' U' L R U' L' U R' U' L", id: '0031e105-eeab-4aac-9bb7-2faa30c80ffd' },
      { moves: "R U' r' F R' F' r R U' r' F R' F' r", id: 'aa4ebe9d-18f6-4c17-aa2e-b7f08551e151' },
      { moves: "F R' F R F' R U2 R' F R' F' R F'", id: 'fa224b05-e832-4bd7-9358-770430eb4bc8' }
    ]
  },
  {
    name: 'ZBLL H 29',
    id: 'eb66dd80-81d0-4ff1-8f1b-ca028276390a',
    idMethod,
    puzzle,
    group: 'H3',
    setup: "R' U' R U' L U' R' U L' U2' R2' U2' R' U' R U' R'",
    algs: [
      { moves: "R' U2 R U R' U R U R' U' R U R' F' R U R' U' R' F R2", id: 'd244dfd5-0d59-4d8d-b4a2-7768968da4c2' },
      { moves: "R' U2 R U R' U R U' r U2 R2 F R F' R U2 r'", id: 'cc70bc85-56c6-4af3-b6d0-dd3e4dc2f323' },
      { moves: "L' U L U' L' U' L U R' U' R U L' U' L U2 R' U' R", id: 'bc870a91-d858-47bb-9846-efbd408d9acb' },
      { moves: "R U R' U R U2 R2 U2 L U' R U L' U R' U R", id: 'f7b1ed53-6c42-442a-a775-1e8087dc26c8' }
    ]
  },
  {
    name: 'ZBLL H 30',
    id: 'cfe28c25-a7ab-4e1e-9954-5c4355fea897',
    idMethod,
    puzzle,
    group: 'H3',
    setup: "R U R' U L' U R U' L U2' R2' U2' R U R' U R",
    algs: [
      { moves: "R' U' R U' R' U2 R2 U2 L' U R' U' L U' R U' R'", id: '279f8d4b-afe6-47e1-883a-d41c02aed535' },
      { moves: "R U' R' U R U R' U' L U L' U' R U R' U2 L U L'", id: '4c7e4be4-3328-450d-a569-f5f2541a55f9' },
      { moves: "R' F2 r2 U' r' F r' F2 R2 U R' U R U2 R'", id: '712ec76a-4205-4bbf-ac78-15b849d394de' },
      { moves: "r D r2 U' F2 r U2 L' U2 r' D' r F L2", id: 'c626ba10-095e-4b82-96ce-f5fab9cca379' }
    ]
  },
  {
    name: 'ZBLL H 31',
    id: '8e8be12c-221c-4e71-b3bb-8e09bbcf851a',
    idMethod,
    puzzle,
    group: 'H3',
    setup: "L U2' R' U R U2' L' R' U R U' R' U2' R U R' U R y",
    algs: [
      { moves: "R' U' F' U F R U' F U R U' R' U R U' R' F'", id: 'a7e207e7-2553-402a-b4bb-b7ab196cd1ea' },
      {
        moves: "y' R' U' R U' R' U2 R U R' U' R U R' F' R U R' U' R' F R2",
        id: 'ec217e27-1229-4fa6-8395-679f5d7f310b'
      },
      { moves: "y R U' R2 F2 U' R2 U' R2 U F2 U R2 U R'", id: '987101d7-1e41-428d-a72b-f760a9fe804a' },
      { moves: "y R' U2 R F' r' F r U F U' R' U2 F R F'", id: 'ad11a2b7-1d44-4001-b724-e3d388a43a7f' }
    ]
  },
  {
    name: 'ZBLL H 32',
    id: 'c06cc750-58ad-4473-8042-b76007b94dff',
    idMethod,
    puzzle,
    group: 'H3',
    setup: "R' F R' F' R2' U R' U' R y U' R U' R' y",
    algs: [
      { moves: "y' R U R' U y' R' U R U' R2 F R F' R", id: 'dc3e4fa6-68ff-442d-aea4-f012760e04e4' },
      { moves: "F R' U R U2 R2 U' R U2 R' U' R2 U F'", id: '85a5e77a-a76f-4513-977b-15b3fb8eca77' },
      { moves: "y2 f R f' U R' U R U' R2 F R F' R", id: 'af8f6cc7-392a-436f-a1ee-00383d5424d5' },
      { moves: "y' F U F' U2 L2 U' L2 U' L2 U2 L2 F U' F'", id: '36ba5be7-c127-4cbc-98ab-c8c457d0ed7b' }
    ]
  },
  {
    name: 'ZBLL H 33',
    id: 'cd2756fe-d21c-42da-a45f-2b4a6ba61c50',
    idMethod,
    puzzle,
    group: 'H4',
    setup: "R U2' R' U' R U R' U' R U' R'",
    algs: [{ moves: "R U R' U R U' R' U R U2 R'", id: 'bd7a9d75-afd3-4930-8c7d-8254267a335d' }]
  },
  {
    name: 'ZBLL H 34',
    id: '353f05cd-dc5e-4828-aee6-0909d4288d6a',
    idMethod,
    puzzle,
    group: 'H4',
    setup: "R' U2' R U R' U' R U R' U R",
    algs: [
      { moves: "R' U' R U' R' U R U' R' U2 R", id: 'a94659f6-6198-474d-a9ff-4b09c9697ee9' },
      { moves: "y2 L' U' L U' L' U L U' L' U2 L", id: '88511163-44b3-4278-968f-1d536fb38863' }
    ]
  },
  {
    name: 'ZBLL H 35',
    id: 'd99b8497-e381-4910-b3a4-74b73ba99101',
    idMethod,
    puzzle,
    group: 'H4',
    setup: "R' U' R U' R' U R U' R' U2' R y",
    algs: [
      { moves: "y' R' U2 R U R' U' R U R' U R", id: '15e0c58d-a140-4129-b222-b5beceae180c' },
      { moves: "y L' U2 L U L' U' L U L' U L", id: 'e5e6430d-4cd7-4ceb-9a6a-ebfa017e2305' }
    ]
  },
  {
    name: 'ZBLL H 36',
    id: 'a428cdeb-9d2a-452e-8ff9-f791e0a4d305',
    idMethod,
    puzzle,
    group: 'H4',
    setup: "R U R' U R U' R' U R U2' R' y",
    algs: [{ moves: "y' R U2 R' U' R U R' U' R U' R'", id: '81208e67-9c7c-482a-ba9e-1680991efbf0' }]
  },
  {
    name: 'ZBLL H 37',
    id: '048de59c-66c5-4901-90ab-c14e08310790',
    idMethod,
    puzzle,
    group: 'H4',
    setup: "R U2' R' U' R U' R' U' R' U' R U' R' U2' R y",
    algs: [
      { moves: "y' R' U2 R U R' U R U R U R' U R U2 R'", id: '54f62309-fb18-412b-8e29-5a2f41743c41' },
      { moves: "y' R U2 R2 U2 R' U2 R U2 R' U2 R2 U2 R", id: '0c7876e6-24a0-4033-a20e-fda2b11e5f4b' },
      { moves: "R U R2 U' R2 U R2 U2 R2 U2 R' U R' U R", id: '0f030bc0-3057-4cd9-83d4-d33a6df312ea' },
      { moves: "y R' U R U R' U R U R U R' U R' U' R2 U' R'", id: 'd8d4ec0f-7827-4a99-823c-7670b2f0ffee' }
    ]
  },
  {
    name: 'ZBLL H 38',
    id: 'dff9ec4d-3d18-47e8-8fb7-b5d42ba3a4bf',
    idMethod,
    puzzle,
    group: 'H4',
    setup: "R' U2' R U R' U R U R U R' U R U2' R' y'",
    algs: [
      { moves: "y R U2 R' U' R U' R' U' R' U' R U' R' U2 R", id: '8d45e84d-bffd-4f38-857f-f4e4175975f2' },
      { moves: "y R U2 R' U' R U' R' U r' F' r U' r' F2 r", id: '658fe9ae-d3bc-4f7c-9f59-0e967aba9768' },
      { moves: "r R U2 r' R U2 R' l' U2 y U' R2 U' R2 U' R2 U' R2 U", id: '7a8e3046-b0a1-45ba-a1ba-98d4e21bfd5d' },
      { moves: "R L F2 L' R U2 R2 F U2 y' R' U2 R' U2 R' U2 R", id: '8619a1b7-f8ea-47b7-80e0-ffa0450b2b9f' }
    ]
  },
  {
    name: 'ZBLL H 39',
    id: '3423ce43-08ce-4488-a085-fb47fd589fdc',
    idMethod,
    puzzle,
    group: 'H4',
    setup: "R' U' R U' R' U2' R U R U2' R' U' R U' R'",
    algs: [
      { moves: "R U R' U R U2 R' U' R' U2 R U R' U R", id: 'd044536f-c00a-4fe2-a9ba-d9cf77c6d1c7' },
      { moves: "y2 R' U' R U' R' U2 R U R U2 R' U' R U' R'", id: '4df328d1-00e6-4ae7-bdef-e020e2d3ccbc' },
      { moves: "R' U' R' r2 U' R' U R' r2 U' r' U2 r", id: 'e82d9357-d1e8-43c2-bdac-b598e71c62b0' },
      { moves: "R' U' R U' R' U2 R U R U2 R' U' R U' R'", id: 'b7a57984-17f1-4040-8802-5ef99953a88e' }
    ]
  },
  {
    name: 'ZBLL H 40',
    id: '53fed231-fdd5-4c34-8062-48312a4b45c3',
    idMethod,
    puzzle,
    group: 'H4',
    setup: "R' U' R U' R U R2' U R U' R U R' U' R U R' U' R U' R'",
    algs: [
      { moves: "R U R' U R U' R' U R U' R' U R' U' R2 U' R' U R' U R", id: '2c45d321-6b48-4063-939e-5d6f2113bf6e' },
      { moves: "F U R' F R F' R U' R' U R' F R F' R U' R' F'", id: 'cb9ab67e-90b5-460b-8c6a-88cf729b6919' },
      { moves: "R U R' U R U' R' U R2 U R U R U' R' U' R' U R'", id: '1987630b-00b6-498c-b662-b6a0ac735953' },
      { moves: "R' F R U R' F R U' R' F' R U' R' F R U R' F R U' R' F' R", id: 'cf25306a-6ab6-41a6-b35c-18fdcdd61d33' }
    ]
  }
]
