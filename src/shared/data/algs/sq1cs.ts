import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

const idMethod = 'SQ1CS_ALGS'
const puzzle = 'sq1'

export const SQ1CS_ALGS: AlgorithmCollection[] = [
  {
    name: 'Kite / Kite',
    id: '4069664b-55ef-412c-a882-a83fa9476a10',
    idMethod,
    puzzle,
    group: '1 Slice',
    setup: '/',
    algs: [{ moves: '/', id: '3e3901f7-e3fe-4278-aeb0-412d4d5784e4' }]
  },
  {
    name: 'Left fist / Right fist',
    id: 'a3d568d5-dde7-4d3b-abdb-e8fc2340cced',
    idMethod,
    puzzle,
    group: '2 Slices',
    setup: '(1,-1) / (-3,0) /',
    algs: [
      { moves: '/ (3,0) / (-1,1)', id: '5b116092-d2e7-4c5c-b426-324364e6c139' },
      { moves: '/ (-3,0) / (-1,1)', id: '8238e55e-50e8-4237-99d9-4654a8d728f7' }
    ]
  },
  {
    name: 'Right fist / Left fist',
    id: '887b16aa-128a-4f3d-83d1-98453abcb41e',
    idMethod,
    puzzle,
    group: '2 Slices',
    setup: '/ (-3,0) /',
    algs: [
      { moves: '/ (3,0) /', id: 'f423985b-14c8-4310-8ae7-bce20d74d954' },
      { moves: '/ (-3,0) /', id: '61471fa8-5ecd-4099-80ff-b60604a9683f' }
    ]
  },
  {
    name: 'Barrel / Barrel',
    id: 'fcd2ec64-c9b3-4c0a-a019-02982668d339',
    idMethod,
    puzzle,
    group: '2 Slices',
    setup: '/ (-3,-3) /',
    algs: [
      { moves: '/ (3,3) /', id: 'd18d9f19-8b85-4da5-89ea-11b6a5c43dd5' },
      { moves: '/ (-3,-3) /', id: '3ba734d8-2af9-4eb8-a2a6-afe0f949d71e' }
    ]
  },
  {
    name: 'Muffin / Square',
    id: '2ad75a6d-48d4-4f8b-ba2f-462b55b9cca5',
    idMethod,
    puzzle,
    group: '3 Slices',
    setup: '/ (-3,0) / (-2,0) /',
    algs: [{ moves: '/ (2,0) / (3,0) /', id: '57903aae-067b-47f9-999c-f0f53cc9d808' }]
  },
  {
    name: 'Square / Muffin',
    id: '2225fbc4-1e9b-4688-940e-0cd20a6fb28a',
    idMethod,
    puzzle,
    group: '3 Slices',
    setup: '/ (0,3) / (0,2) /',
    algs: [{ moves: '/ (0,-2) / (0,-3) /', id: '7851824d-dfc9-4da7-9142-2b11df541907' }]
  },
  {
    name: 'Shield / Square',
    id: '5854bc76-2816-404f-ab93-53572326eebb',
    idMethod,
    puzzle,
    group: '3 Slices',
    setup: '/ (3,0) / (1,0) /',
    algs: [{ moves: '/ (-1,0) / (-3,0) /', id: '471e9904-a841-48a7-9175-8c9d44d80865' }]
  },
  {
    name: 'Square / Shield',
    id: 'f376cd8f-8f00-41d4-88ba-fbf60089ab77',
    idMethod,
    puzzle,
    group: '3 Slices',
    setup: '/ (0,-3) / (0,-1) /',
    algs: [{ moves: '/ (0,1) / (0,3) /', id: '15516dd0-3f20-4888-bd03-2ea98deb8702' }]
  },
  {
    name: 'Right paw / Left paw',
    id: '39c9372d-3711-4462-9d71-8fdbb5d01d65',
    idMethod,
    puzzle,
    group: '3 Slices',
    setup: '/ (3,0) / (-5,2) /',
    algs: [{ moves: '/ (-4,1) / (3,0) /', id: '1e82e8f8-565e-42cf-86bc-d716f834eef6' }]
  },
  {
    name: 'Left paw / Right paw',
    id: '1f0af1f7-a6ef-4792-9b5f-609eb514b269',
    idMethod,
    puzzle,
    group: '3 Slices',
    setup: '/ (3,0) / (1,-4) /',
    algs: [{ moves: '/ (-1,4) / (-3,0) /', id: 'f032de39-7488-4eb5-94a8-59fdf19c72aa' }]
  },
  {
    name: 'Muffin / Muffin',
    id: '93b195f8-c4a4-4e07-af06-b0eb0ea06265',
    idMethod,
    puzzle,
    group: '3 Slices',
    setup: '/ (-3,-3) / (2,0) /',
    algs: [{ moves: '/ (-2,0) / (3,3) /', id: 'a8752937-9548-4b38-ba7e-06e67d15a478' }]
  },
  {
    name: 'Shield / Shield',
    id: 'c675cd1e-e721-4977-be62-762be9f5372e',
    idMethod,
    puzzle,
    group: '3 Slices',
    setup: '/ (3,3) / (-1,0) /',
    algs: [{ moves: '/ (1,0) / (-3,-3) /', id: '4a926cc4-e2e5-43e7-b7c0-693d94ceda8e' }]
  },
  {
    name: 'Scallop / Scallop',
    id: '16de9aeb-1f25-4c07-a591-e4f2af0e0880',
    idMethod,
    puzzle,
    group: '3 Slices',
    setup: '/ (-3,-3) / (2,1) /',
    algs: [
      { moves: '/ (1,2) / (-3,-3) /', id: 'ebd14751-1c65-4a9c-b654-572cf4ad04aa' },
      { moves: '/ (-2,-1) / (3,3) /', id: '59589c89-1377-4eec-8e34-eee7afe35f1b' }
    ]
  },
  {
    name: 'Barrel / Kite',
    id: '50b95a65-f0e8-485c-bb51-b6c8c7895d59',
    idMethod,
    puzzle,
    group: '3 Slices',
    setup: '/ (3,0) / (3,0) /',
    algs: [{ moves: '/ (-3,0) / (-3,0) /', id: '76ff5ec0-2924-4cf5-92be-da47c4b34d3d' }]
  },
  {
    name: 'Kite / Barrel',
    id: 'e8d1a3fd-4c25-4b3e-8392-045c6c029357',
    idMethod,
    puzzle,
    group: '3 Slices',
    setup: '/ (0,-3) / (0,-3) /',
    algs: [{ moves: '/ (0,3) / (0,3) /', id: '244a4d97-186d-4f17-a614-3e308c23ee84' }]
  },
  {
    name: 'Scallop / Kite',
    id: '3107e565-cefa-4270-be4f-6960a368390f',
    idMethod,
    puzzle,
    group: '3 Slices',
    setup: '/ (3,0) / (1,2) /',
    algs: [{ moves: '/ (-1,-2) / (-3,0) /', id: '49af9f76-11b4-490d-bdf1-2f335da8dba6' }]
  },
  {
    name: 'Kite / Scallop',
    id: 'e2183a13-bc70-4b48-ba26-d4720300078f',
    idMethod,
    puzzle,
    group: '3 Slices',
    setup: '/ (0,-3) / (-2,-1) /',
    algs: [{ moves: '/ (2,1) / (0,3) /', id: '2df579e4-834d-4712-a14a-12d235dfc0e0' }]
  },
  {
    name: 'Star / 6-2',
    id: 'c65d22c3-6591-4662-b6a8-1b2265ff7f86',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (0,-3) / (4,-1) / (-2,-4) /',
    algs: [{ moves: '/ (2,4) / (-4,1) / (0,3) /', id: '3d6e6935-e216-436b-aafa-9c01e66ffa27' }]
  },
  {
    name: '6-2 / Star',
    id: '73287471-fad5-4ce6-bcae-feac08ff3158',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (3,0) / (1,-4) / (4,2) /',
    algs: [{ moves: '/ (-4,-2) / (-1,4) / (-3,0) /', id: '09672470-fcb6-4196-a8c4-15195ea53654' }]
  },
  {
    name: 'Star / 8',
    id: 'c2fba2b8-a6ab-4a94-ae4c-e98b77d25067',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (3,3) / (-1,-2) / (4,2) /',
    algs: [{ moves: '/ (-4,-2) / (1,2) / (-3,-3) /', id: '90a08848-fe45-4c66-9bc6-eca7c24dbb91' }]
  },
  {
    name: '8 / Star',
    id: '321d4194-a486-4c7f-88e5-3973d6a27b8f',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (-3,-3) / (2,1) / (-2,-4) /',
    algs: [{ moves: '/ (2,4) / (-2,-1) / (3,3) /', id: '083f9275-e854-4d4d-8d27-40f72d09f89e' }]
  },
  {
    name: 'Star / 4-4',
    id: 'f6580ef8-f940-448b-9451-337e307793db',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (3,3) / (-1,0) / (2,2) /',
    algs: [{ moves: '/ (-2,-2) / (1,0) / (-3,-3) /', id: '602ef4c5-8c51-446b-920a-7905e2b4ea5f' }]
  },
  {
    name: '4-4 / Star',
    id: '793f640e-137a-414e-9df9-bb0e0de3c76d',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (-3,-3) / (0,1) / (-2,-2) /',
    algs: [{ moves: '/ (2,2) / (0,-1) / (3,3) /', id: '38a37efa-4f8c-4e43-8dd4-0bb49b8cd0be' }]
  },
  {
    name: 'Left 4-2 / Parallel Edges',
    id: '33a2928e-2739-421c-94c3-da766b6d36c3',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '(1,-1) / (3,0) / (2,1) / (-2,-3) /',
    algs: [{ moves: '/ (2,3) / (-2,-1) / (-3,0) / (-1,1)', id: 'c0044af8-3df5-44dc-b250-4c5b252e4616' }]
  },
  {
    name: 'Parallel Edges / Left 4-2',
    id: '8ba73318-fb04-4a76-8de9-9cb0d2795e22',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (0,3) / (1,2) / (-3,-2) /',
    algs: [{ moves: '/ (3,2) / (-1,-2) / (0,-3) /', id: '69f82aee-5808-48cc-ae42-00b86c9d3727' }]
  },
  {
    name: 'Right 4-2 / Parallel Edges',
    id: 'b56f5093-71f9-4b4c-a019-e72132552e65',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (3,0) / (1,2) / (2,3) /',
    algs: [{ moves: '/ (-2,-3) / (-1,-2) / (-3,0) /', id: 'f9df76af-c4ce-4265-819f-0406ece29983' }]
  },
  {
    name: 'Parallel Edges / Right 4-2',
    id: '5264418c-cc59-4790-a232-ef056a034165',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (3,0) / (1,2) / (-2,3) / (-4,0) /',
    algs: [{ moves: '/ (4,0) / (2,-3) / (-1,-2) / (-3,0) /', id: '8985ad7b-d963-41a5-880d-f7367834afa6' }]
  },
  {
    name: 'Right 5-1 / Perpendicular Edges',
    id: '8b1b1087-2215-4852-9feb-1fd8c6448cdb',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (0,-3) / (-2,-1) / (0,4) /',
    algs: [{ moves: '/ (0,-4) / (2,1) / (0,3) /', id: '6b7f4499-63f0-4ffc-985f-05458441568b' }]
  },
  {
    name: 'Perpendicular Edges / Right 5-1',
    id: 'bfeeefc8-b0a8-4f6d-b0de-c616bfa52a50',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '(1,-1) / (3,0) / (2,1) / (4,0) /',
    algs: [{ moves: '/ (-4,0) / (-2,-1) / (-3,0) / (-1,1)', id: '6e8cd706-f9a3-4c64-baca-a788fa647597' }]
  },
  {
    name: 'Left 5-1 / Perpendicular Edges',
    id: '68805536-8c02-4571-b43c-871c465ba316',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '(1,-1) / (0,-3) / (-1,-2) / (0,-4) /',
    algs: [{ moves: '/ (0,4) / (1,2) / (0,3) / (-1,1)', id: 'a34acabc-ef3d-49cf-83dc-bf22acd2195e' }]
  },
  {
    name: 'Perpendicular Edges / Left 5-1',
    id: 'ca96f7a5-1a98-45f1-a1e1-23e9f4a7388a',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (3,0) / (1,2) / (-4,0) /',
    algs: [{ moves: '/ (4,0) / (-1,-2) / (-3,0) /', id: '3c70a3ae-ef92-448f-9776-0048ecef6363' }]
  },
  {
    name: '4-1-1 / Perpendicular Edges',
    id: 'e05c1fce-ca8a-45f8-a2da-dd2c16a8ff9b',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (3,0) / (1,2) / (-2,0) /',
    algs: [{ moves: '/ (2,0) / (-1,-2) / (-3,0) /', id: '26b63653-7924-49e2-92b7-52a87d280381' }]
  },
  {
    name: 'Perpendicular Edges / 4-1-1',
    id: 'a8000439-4b17-4d29-b64c-7efdaca679b2',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (0,-3) / (-2,-1) / (0,2) /',
    algs: [{ moves: '/ (0,-2) / (2,1) / (0,3) /', id: 'c0e6b5f8-8fd0-4219-9d9f-4d0c1730341f' }]
  },
  {
    name: '3-2-1 / Perpendicular Edges',
    id: '51b1b359-d99a-4b99-a107-f1dcacef48d6',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (0,-3) / (0,-1) / (0,2) /',
    algs: [{ moves: '/ (0,-2) / (0,1) / (0,3) /', id: 'a575fb33-7ba5-4b7c-8b76-c612dc9e130c' }]
  },
  {
    name: 'Perpendicular Edges / 3-2-1',
    id: '48476f07-564e-4652-b428-78c440b8972a',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (3,0) / (1,0) / (-2,-1) /',
    algs: [{ moves: '/ (2,1) / (-1,0) / (-3,0) /', id: '741dbeaa-7204-4b9c-abd2-746395ce1137' }]
  },
  {
    name: '3-1-2 / Perpendicular Edges',
    id: '2890490d-3915-41cf-9c0a-44f9c1cb6a11',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (0,-3) / (0,-1) / (1,2) /',
    algs: [{ moves: '/ (-1,-2) / (0,1) / (0,3) /', id: '16814748-f970-46ba-a938-8cc99d07edbb' }]
  },
  {
    name: 'Perpendicular Edges / 3-1-2',
    id: '171c2d16-6508-4c1a-af9b-481afce0e90b',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (3,0) / (1,0) / (-2,0) /',
    algs: [{ moves: '/ (2,0) / (-1,0) / (-3,0) /', id: '91a81777-fe3b-4946-8cd1-ae1d09238fff' }]
  },
  {
    name: '3-3 / Perpendicular Edges',
    id: '94d42427-a90d-4a79-afad-24994202abf8',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (3,0) / (1,-4) / (0,2) /',
    algs: [{ moves: '/ (0,-2) / (-1,4) / (-3,0) /', id: '350b7f86-a71c-4b2c-8fbb-692ad87ff4d7' }]
  },
  {
    name: 'Perpendicular Edges / 3-3',
    id: 'f527eaef-89b1-40b3-bd9b-39d1a7d0a186',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '(1,-1) / (0,-3) / (5,-2) / (2,0) /',
    algs: [{ moves: '/ (-2,0) / (-5,2) / (0,3) / (-1,1)', id: '112881a8-4361-4ab1-baf0-5bde99325f2d' }]
  },
  {
    name: 'Right 5-1 / Pair',
    id: '9f88ed04-5a71-4e4a-a70f-8bb8e5824bc3',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (0,3) / (1,2) / (-3,2) /',
    algs: [{ moves: '/ (3,-2) / (-1,-2) / (0,-3) /', id: '40ebf674-a9c5-44d0-8af9-99157f3d29f0' }]
  },
  {
    name: 'Pair / Right 5-1',
    id: '3ad5a578-aaa8-4be1-b883-7e28186432df',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '(1,-1) / (3,0) / (2,1) / (2,-3) /',
    algs: [{ moves: '/ (-2,3) / (-2,-1) / (-3,0) / (-1,1)', id: '7c8b4534-1e35-437c-a64a-1bd4b5f54a88' }]
  },
  {
    name: 'Left 5-1 / Pair',
    id: 'd5c658fe-08e8-4b85-8b86-6e6345edb47a',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '(1,-1) / (0,3) / (2,1) / (3,-2) /',
    algs: [{ moves: '/ (-3,2) / (-2,-1) / (0,-3) / (-1,1)', id: '4f503b04-a54b-428e-9e8d-7a04ababdcf4' }]
  },
  {
    name: 'Pair / Left 5-1',
    id: 'a01224ce-2f3a-4929-87a8-c74246d4ac07',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '(1,-1) / (3,0) / (2,1) / (2,-3) /',
    algs: [{ moves: '/ (-2,3) / (-2,-1) / (-3,0) / (-1,1)', id: 'f197e07c-d648-43c3-97b0-255340967f3f' }]
  },
  {
    name: '4-1-1 / Pair',
    id: '20dcd15c-1d07-4502-aea9-6c7c2fd5ddaf',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '(1,-1) / (3,0) / (-4,1) / (0,-4) /',
    algs: [{ moves: '/ (0,4) / (4,-1) / (-3,0) / (-1,1)', id: '154c5734-096f-4898-a404-00dca53b2ffa' }]
  },
  {
    name: 'Pair / 4-1-1',
    id: 'b7d64e21-497f-40cb-8773-11c7584c1a56',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '(1,-1) / (3,0) / (-4,1) / (4,0) /',
    algs: [{ moves: '/ (-4,0) / (4,-1) / (-3,0) / (-1,1)', id: 'c12c5bc6-5655-44c9-94bd-d9f1d2f2569a' }]
  },
  {
    name: '2-2-2 / Pair',
    id: 'c654e3cd-909f-48e3-b080-cc1d481a3a0e',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (-3,-3) / (0,-1) / (2,0) /',
    algs: [{ moves: '/ (-2,0) / (0,1) / (3,3) /', id: 'da7b7a9c-e401-44a4-94ca-636402ed9160' }]
  },
  {
    name: 'Pair / 2-2-2',
    id: '02ff10f7-d25b-4dc0-8332-a087b5b22f2e',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (3,3) / (1,0) / (0,-2) /',
    algs: [{ moves: '/ (0,2) / (-1,0) / (-3,-3) /', id: 'afecf8f8-f928-4eda-89ed-3ca2c823fc15' }]
  },
  {
    name: 'Left 4-2 / Pair',
    id: 'c126aea9-5d66-4c50-8722-08f8edacf7e8',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (-3,-3) / (2,1) / (-2,0) /',
    algs: [{ moves: '/ (2,0) / (-2,-1) / (3,3) /', id: 'e4a658da-8334-4bff-8cc7-7a9368b97c39' }]
  },
  {
    name: 'Pair / Left 4-2',
    id: '4ce7808d-16d7-4323-a32e-fad6a33720fe',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (-3,-3) / (-2,-1) / (0,-2) /',
    algs: [{ moves: '/ (0,2) / (2,1) / (3,3) /', id: '86f3800a-66c8-4451-9743-004b9c413823' }]
  },
  {
    name: 'Right 4-2 / Pair',
    id: 'f4dfc9db-217c-43d6-98cb-fd229ca24fe9',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (3,3) / (-1,0) / (0,-4) /',
    algs: [{ moves: '/ (0,4) / (1,0) / (-3,-3) /', id: '452c9ec9-ee92-4a30-afd4-918e80f35483' }]
  },
  {
    name: 'Pair / Right 4-2',
    id: 'ff40ad01-90cd-4def-b692-eb270499e4c1',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (3,3) / (-1,-2) / (2,0) /',
    algs: [{ moves: '/ (-2,0) / (1,2) / (-3,-3) /', id: '6cf8af53-8f36-4f2f-9a31-17a371d53826' }]
  },
  {
    name: '6 / Pair',
    id: '786e590b-3412-44ca-988d-2ab57b715004',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (3,3) / (-1,-2) / (0,-4) /',
    algs: [{ moves: '/ (0,4) / (1,2) / (-3,-3) /', id: '227fdca4-e8a1-4ebd-b745-1f6802dcf120' }]
  },
  {
    name: 'Pair / 6',
    id: '3bd7ebe8-55c0-4e82-b9a8-515373a0e099',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (-3,-3) / (2,1) / (4,0) /',
    algs: [{ moves: '/ (-4,0) / (-2,-1) / (3,3) /', id: '78eead82-d919-43d3-90bb-1fc0034a1309' }]
  },
  {
    name: 'Right fist / Left paw',
    id: 'a5ae2bb1-803e-442c-804c-c81e268f15cc',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (0,-3) / (0,-1) / (0,4) /',
    algs: [{ moves: '/ (0,-4) / (0,1) / (0,3) /', id: 'dd600547-754c-4c9c-8093-1de923994f73' }]
  },
  {
    name: 'Left paw / Right fist',
    id: '0abf47a0-fb76-4d2d-9b9e-840ae5e91984',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (3,0) / (1,0) / (-4,0) /',
    algs: [{ moves: '/ (4,0) / (-1,0) / (-3,0) /', id: '663aab7b-63bf-40cb-96cd-ce81263faa5c' }]
  },
  {
    name: 'Left fist / Right paw',
    id: '32f238a0-9054-474f-998b-879c5a243db3',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (0,-3) / (0,-1) / (1,0) /',
    algs: [{ moves: '/ (-1,0) / (0,1) / (0,3) /', id: '9613fac6-3a05-42c5-a597-7d2ce1e146ac' }]
  },
  {
    name: 'Right paw / Left fist',
    id: '74c6ff63-c0a6-4ad5-bb4b-88f921b279cf',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (3,0) / (1,0) / (0,-1) /',
    algs: [{ moves: '/ (0,1) / (-1,0) / (-3,0) /', id: 'a88f6e72-f769-467d-8470-0507e3e83a7e' }]
  },
  {
    name: 'Right paw / Right paw',
    id: '2654c68a-86b6-4eba-930b-e397c26645fd',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (-3,-3) / (0,1) / (-2,-2) / (1,-2) /',
    algs: [{ moves: '/ (-1,2) / (2,2) / (0,-1) / (3,3) /', id: 'f8f10633-b9db-4c69-9cbe-e6e8867c0c35' }]
  },
  {
    name: 'Muffin / Shield',
    id: 'd962a086-b8a1-4065-97bf-2352dad63d5f',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (0,3) / (1,2) / (-3,0) /',
    algs: [{ moves: '/ (3,0) / (-1,-2) / (0,-3) /', id: '9f703017-b7ff-44b4-a2d8-481517a09ef1' }]
  },
  {
    name: 'Shield / Muffin',
    id: 'b557595b-f2ae-41b7-832d-efe5215427ef',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (-3,0) / (-2,-1) / (0,3) /',
    algs: [{ moves: '/ (0,-3) / (2,1) / (3,0) /', id: '9f40652e-04d9-40d2-af58-fd73b5222b81' }]
  },
  {
    name: 'Scallop / Barrel',
    id: '2e65fab4-c949-46d0-88f6-397cca7853b7',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (3,3) / (1,0) / (-4,0) /',
    algs: [{ moves: '/ (4,0) / (-1,0) / (-3,-3) /', id: '1a5c69f8-0372-4cae-a1e2-7f1e3e0ec211' }]
  },
  {
    name: 'Barrel / Scallop',
    id: 'b877a969-19b8-4a11-b896-a4d37eb26674',
    idMethod,
    puzzle,
    group: '4 Slices',
    setup: '/ (-3,-3) / (0,-1) / (0,4) /',
    algs: [{ moves: '/ (0,-4) / (0,1) / (3,3) /', id: 'f014b8bb-8358-4222-8471-805220947b3b' }]
  },
  {
    name: 'Right paw / Square',
    id: '90feb973-df84-4a63-912b-b2478976ffc1',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (3,0) / (1,2) / (2,0) / (-1,0) / (0,1)',
    algs: [{ moves: '(0,-1) / (1,0) / (-2,0) / (-1,-2) / (-3,0) /', id: '0fcf22ba-2266-49f0-8e11-4f1dc6978c5e' }]
  },
  {
    name: 'Square / Right paw',
    id: 'a93ac781-dcfc-4b9d-80c1-54128db9e328',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (0,-3) / (-2,-1) / (0,-2) / (0,1) / (-1,0)',
    algs: [{ moves: '(1,0) / (0,-1) / (0,2) / (2,1) / (0,3) /', id: '1c69beda-ed91-42ee-a9ce-4f292c75f169' }]
  },
  {
    name: 'Left paw / Square',
    id: '15eec75f-d267-4572-95c7-d247ca97dfdf',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '(1,-1) / (3,0) / (2,1) / (2,0) / (-2,3) /',
    algs: [{ moves: '/ (2,-3) / (-2,0) / (-2,-1) / (-3,0) / (-1,1)', id: '73d882dd-648c-4de8-ada0-10204037534d' }]
  },
  {
    name: 'Square / Left paw',
    id: '4316d1ee-fbfb-4829-9be5-5e8c1a00b41a',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '(1,-1) / (0,-3) / (-1,-2) / (0,-2) / (-3,2) /',
    algs: [{ moves: '/ (3,-2) / (0,2) / (1,2) / (0,3) / (-1,1)', id: '7cd01a33-69d2-4cef-bc82-3082c4028516' }]
  },
  {
    name: 'Scallop / Square',
    id: '2c02132f-6e0c-4263-b824-a20270c133fd',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '(1,-1) / (-3,0) / (-1,-2) / (4,0) / (-2,0) /',
    algs: [{ moves: '/ (2,0) / (-4,0) / (1,2) / (3,0) / (-1,1)', id: 'c365f773-c1ef-43d7-91d5-103b5205179e' }]
  },
  {
    name: 'Square / Scallop',
    id: '50e3ff9a-ffe1-4eb1-83b1-12273fa36702',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '(1,-1) / (0,3) / (2,1) / (0,-4) / (0,2) /',
    algs: [{ moves: '/ (0,-2) / (0,4) / (-2,-1) / (0,-3) / (-1,1)', id: '102b1e9d-8e1b-405a-8f11-38f8be1e38c6' }]
  },
  {
    name: '4-1-1 / Parallel Edges',
    id: '5337c3ae-ad98-4974-b56c-c6b762ce96ba',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '(1,-1) / (0,-3) / (-1,-2) / (0,-4) / (-3,2) /',
    algs: [{ moves: '/ (3,-2) / (0,4) / (1,2) / (0,3) / (-1,1)', id: '627b7a7f-9170-42cc-8501-3ae501d03234' }]
  },
  {
    name: 'Parallel Edges / 4-1-1',
    id: '7a8d8d60-2663-496b-909d-e10ccd137461',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (3,0) / (1,2) / (-4,0) / (2,-3) /',
    algs: [{ moves: '/ (-2,3) / (4,0) / (-1,-2) / (-3,0) /', id: 'cdb02f50-7ce4-4b6b-ae55-0372f34de97c' }]
  },
  {
    name: '6 / Parallel Edges',
    id: '2ba81311-df8e-4c82-9653-de0ae3bd9d9a',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (3,3) / (-1,-2) / (-2,-4) / (-3,-2) /',
    algs: [{ moves: '/ (3,2) / (2,4) / (1,2) / (-3,-3) /', id: 'e568652f-1f35-4190-8173-ff78c6440647' }]
  },
  {
    name: 'Parallel Edges / 6',
    id: 'f167e90a-f5e0-4b1c-8f3e-e3f9815a316d',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (3,3) / (-1,-2) / (-2,-4) / (-3,-2) /',
    algs: [{ moves: '/ (3,2) / (2,4) / (1,2) / (-3,-3) /', id: '49cc2d85-7efa-4c9e-9e7a-1b9b5b06ae2d' }]
  },
  {
    name: '3-2-1 / Parallel Edges',
    id: '27f467a7-133d-4b14-a128-9029cfccf857',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (3,0) / (1,0) / (-4,0) / (2,3) /',
    algs: [{ moves: '/ (4,0) / (2,-3) / (-1,-2) / (-3,0) /', id: '2dcde3c1-31c2-439d-a2af-ad75fcf53d7a' }]
  },
  {
    name: 'Parallel Edges / 3-2-1',
    id: 'b80e12d8-2292-4811-ad7d-d487f6ec8080',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (3,3) / (1,2) / (-2,0) / (-4,1) /',
    algs: [{ moves: '/ (-3,-2) / (1,2) / (0,3) / (-1,1)', id: '25f88861-a1b1-4091-acae-5524be44eab4' }]
  },
  {
    name: '3-1-2 / Parallel Edges',
    id: '67373bd5-878f-4dfd-bc3b-f75abe7348c7',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (3,3) / (-1,-2) / (2,0) / (4,-1) /',
    algs: [{ moves: '/ (2,3) / (-2,-1) / (-3,0) / (-1,1)', id: '95a3bf20-c5a6-4918-89bd-3aca919e4d4b' }]
  },
  {
    name: 'Parallel Edges / 3-1-2',
    id: 'b222b46f-6b0e-4ccf-a39e-a891c3b2eb9a',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (3,0) / (1,0) / (0,-1) / (-2,-3) /',
    algs: [{ moves: '/ (3,2) / (-1,-2) / (0,-3) /', id: '01804f47-0f62-47c7-9cb9-79f6e07a763e' }]
  },
  {
    name: '3-3 / Parallel Edges',
    id: '4d6fa34b-2815-407b-b420-2e0132568c83',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (3,3) / (-1,-2) / (2,0) / (2,-1) /',
    algs: [{ moves: '/ (-2,1) / (-2,0) / (1,2) / (-3,-3) /', id: 'de1cfd02-ef7e-4c2d-b02c-d48c0c6053c5' }]
  },
  {
    name: 'Parallel Edges / 3-3',
    id: 'f251a425-d34f-432d-8804-50116406a46c',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (3,3) / (1,2) / (0,2) / (-1,2) /',
    algs: [{ moves: '/ (1,-2) / (0,-2) / (-1,-2) / (-3,-3) /', id: '8309555f-6242-477a-8306-1045290a5f5a' }]
  },
  {
    name: 'Left 5-1 / Parallel Edges',
    id: 'ee99ebc6-a85a-4498-b24b-6de0a0cafc72',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (0,3) / (1,2) / (0,4) / (3,0) /',
    algs: [{ moves: '/ (-3,0) / (0,-4) / (-1,-2) / (0,-3) /', id: 'a3770168-c9c5-4cbc-aaab-355a1c1a4e20' }]
  },
  {
    name: 'Parallel Edges / Left 5-1',
    id: '6d1d8db0-b7d0-4024-a8a8-a7c0bd150029',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (-3,-3) / (0,1) / (0,4) / (4,-1) /',
    algs: [{ moves: '/ (-4,1) / (0,-4) / (0,-1) / (3,3) /', id: '35a27f3e-8713-4fb5-bbba-3857998c22b3' }]
  },
  {
    name: 'Right 5-1 / Parallel Edges',
    id: '7dd20462-d23e-45ee-b0cb-979a1d967dea',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '(1,-1) / (0,-3) / (-1,-2) / (0,-4) / (-3,0) /',
    algs: [{ moves: '/ (3,0) / (0,4) / (1,2) / (0,3) / (-1,1)', id: '18dbc201-822b-4ca9-8849-29969d3c3387' }]
  },
  {
    name: 'Parallel Edges / Right 5-1',
    id: 'e4fd6f6d-66a9-4ffd-b6fb-052006fd4f0e',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (3,0) / (1,2) / (-4,0) / (0,-3) /',
    algs: [{ moves: '/ (0,3) / (4,0) / (-1,-2) / (-3,0) /', id: '1d5b5b0b-8f62-4a48-b4ca-cefbcb5983ed' }]
  },
  {
    name: 'Right 4-2 / Perpendicular Edges Odd',
    id: '0e86c437-f475-4efe-867b-db00497ef1bb',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (0,3) / (1,2) / (3,-2) / (4,-3) /',
    algs: [{ moves: '/ (-4,3) / (-3,2) / (-1,-2) / (0,-3) /', id: 'c00ed9bd-8b66-4754-a502-ba553659e726' }]
  },
  {
    name: 'Perpendicular Edges / Right 4-2',
    id: '896ba580-5aca-48bf-9c53-47e4c3ccf034',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (0,3) / (1,2) / (3,-2) / (4,-3) /',
    algs: [{ moves: '/ (-4,3) / (-3,2) / (-1,-2) / (0,-3) /', id: '1db875e1-bdcf-4c18-9440-272081961cad' }]
  },
  {
    name: 'Right 4-2 / Perpendicular Edges Even',
    id: '2daa85b6-c88b-4fc8-aeab-1778a389d45d',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (3,0) / (1,2) / (2,-3) / (3,-4) /',
    algs: [{ moves: '/ (-3,4) / (-2,3) / (-1,-2) / (-3,0) /', id: 'b8ce902d-0a20-4f4a-ac40-1400ba2ff2fc' }]
  },
  {
    name: 'Perpendicular Edges / Left 4-2',
    id: '763286d5-fe4c-4b12-8111-ea0b1e1cddaf',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '(1,-1) / (3,0) / (2,1) / (4,-3) / (0,3) /',
    algs: [{ moves: '/ (0,-3) / (-4,3) / (-2,-1) / (-3,0) / (-1,1)', id: '3533711b-2c95-465a-986f-792628739637' }]
  },
  {
    name: '6 / Perpendicular Edges',
    id: '40f6cc26-496d-49ab-9da1-d0c7f6fd5e9d',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (3,0) / (1,2) / (2,-3) / (3,4) /',
    algs: [{ moves: '/ (-3,-4) / (-2,3) / (-1,-2) / (-3,0) /', id: '543a74ff-60b8-4817-9107-d86bfc9619a8' }]
  },
  {
    name: 'Perpendicular Edges / 6',
    id: '24029c00-863f-492a-ad41-4db5476b0d35',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '(1,-1) / (3,0) / (2,1) / (-2,3) / (3,2) /',
    algs: [{ moves: '/ (-3,-2) / (2,-3) / (-2,-1) / (-3,0) / (-1,1)', id: 'fafcef8d-8100-4b39-82f0-16042c85164c' }]
  },
  {
    name: '3-2-1 / Pair',
    id: 'e7bf93c2-5188-4724-b8ec-43759dfa7c2e',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (0,3) / (1,2) / (3,-2) / (0,-5) /',
    algs: [{ moves: '/ (0,5) / (-3,2) / (-1,-2) / (0,-3) /', id: '3a6697c1-e5ad-41b7-818d-8eca422e3a15' }]
  },
  {
    name: 'Pair / 3-2-1',
    id: '6618cc55-8899-472e-8329-54c7598eb511',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (-3,0) / (-2,-1) / (2,-3) / (5,0) /',
    algs: [{ moves: '/ (-5,0) / (-2,3) / (2,1) / (3,0) /', id: 'bc0d4c90-75ce-44cb-9e65-a3761bd1c5c0' }]
  },
  {
    name: '3-1-2 / Pair',
    id: '5868f913-de62-48ed-af8a-da3266634f7b',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (0,3) / (1,2) / (3,-4) / (0,5) /',
    algs: [{ moves: '/ (0,-5) / (-3,4) / (-1,-2) / (0,-3) /', id: '833e3093-eca4-4fdb-888c-cd1dabacaee9' }]
  },
  {
    name: 'Pair / 3-1-2',
    id: 'fd70e95f-216e-4146-b72b-b66eefd99948',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (0,-3) / (-2,-1) / (0,4) / (2,-2) / (0,-2)',
    algs: [{ moves: '(0,2) / (-2,2) / (0,-4) / (2,1) / (0,3) /', id: '9daaa383-5bfa-47ce-8c9c-d976023976e4' }]
  },
  {
    name: '3-3 / Pair',
    id: '181b8aed-2700-4e57-9684-91a60d4f1146',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (0,3) / (1,2) / (-3,0) / (0,2) /',
    algs: [{ moves: '/ (0,-2) / (3,0) / (-1,-2) / (0,-3) /', id: '9f68cd50-7b8e-43ba-98fc-f6aa0d880947' }]
  },
  {
    name: 'Pair / 3-3',
    id: '0789cb57-e772-4b0d-9f27-3ffdd11867f5',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (-3,0) / (-2,-1) / (0,3) / (-2,0) /',
    algs: [{ moves: '/ (2,0) / (0,-3) / (2,1) / (3,0) /', id: '2c6e6e8e-0956-41cf-80e9-5a4a265a2185' }]
  },
  {
    name: 'Left paw / Left paw',
    id: '57939afe-5236-4bf9-ad40-53e33e9ede1e',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (3,3) / (1,2) / (2,2) / (-1,0) /',
    algs: [{ moves: '/ (1,0) / (-2,-2) / (-1,-2) / (-3,-3) /', id: '77ff1b70-1aba-475c-be9f-35c79fcf84fe' }]
  },
  {
    name: 'Left fist / Left paw',
    id: 'e0f7696d-21e6-4aa7-81b4-df94b5772412',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (3,0) / (-5,2) / (0,4) / (0,-2) /',
    algs: [{ moves: '/ (0,2) / (0,-4) / (5,-2) / (-3,0) /', id: '18fdc088-3d92-4ff3-8d7e-2121889739da' }]
  },
  {
    name: 'Left paw / Left fist',
    id: 'ede791e6-808c-4316-8e90-30bada16ad51',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (0,-3) / (-2,5) / (-4,0) / (2,0) /',
    algs: [{ moves: '/ (-2,0) / (4,0) / (2,-5) / (0,3) /', id: 'f4331249-e7c6-427a-9829-062eca220d05' }]
  },
  {
    name: 'Right fist / Right paw',
    id: '05d0fa74-88d7-48a7-9d55-539c38c30cda',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (3,0) / (1,0) / (2,0) /',
    algs: [{ moves: '/ (-2,0) / (-1,0) / (-3,0) /', id: 'c601daa3-be2c-4562-8a82-44d4db8d1481' }]
  },
  {
    name: 'Right paw / Right fist',
    id: '087e7269-2820-4ed5-aa89-86fcdfb5fde5',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (0,-3) / (0,-1) / (0,-2) /',
    algs: [{ moves: '/ (0,2) / (0,1) / (0,3) /', id: 'd26ccc1a-8054-4b1b-908a-8150074b0cb0' }]
  },
  {
    name: 'Right paw / Muffin',
    id: 'b7439b0d-b017-4e74-8e9b-5e30d08487bc',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (-3,-3) / (2,1) / (-2,0) / (1,0) /',
    algs: [{ moves: '/ (-1,0) / (2,0) / (-2,-1) / (3,3) /', id: '33da24fa-d456-4d58-8787-0674f1fb8f1f' }]
  },
  {
    name: 'Muffin / Right paw',
    id: '4256ad7a-6031-43e2-be39-935ae9435178',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (3,3) / (-1,-2) / (0,-2) / (1,0) /',
    algs: [{ moves: '/ (0,-1) / (0,2) / (1,2) / (-3,-3) /', id: '1cfac09a-1f91-4a47-a4f3-7406e2ea8f11' }]
  },
  {
    name: 'Left paw / Muffin',
    id: '6f92f9e2-a35a-4065-90bb-1bf565590b60',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (-3,-3) / (-2,-1) / (2,0) / (-1,0) /',
    algs: [{ moves: '/ (1,0) / (-2,0) / (2,1) / (3,3) /', id: 'fab56648-1cbd-4a05-9fee-286d35ba1b69' }]
  },
  {
    name: 'Muffin / Left paw',
    id: 'e72a9f2a-cf9c-4b8d-87e6-2cb9494d7c39',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (3,3) / (1,2) / (0,-2) / (0,1) /',
    algs: [{ moves: '/ (0,-1) / (0,2) / (-1,-2) / (-3,-3) /', id: 'c2ad7a4a-61cc-40d8-bd21-e5f051a53e87' }]
  },
  {
    name: 'Left paw / Shield',
    id: '5956b46d-7d75-4b8c-b3f4-f3d3619263b1',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (3,0) / (1,2) / (-2,3) / (0,1) /',
    algs: [{ moves: '/ (0,-1) / (2,-3) / (-1,-2) / (-3,0) /', id: 'eb52f2d1-1418-4592-9cd5-8739f8af95a3' }]
  },
  {
    name: 'Shield / Left paw',
    id: 'a7690153-6dbb-4753-abef-ed9cb2369365',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (0,-3) / (-2,-1) / (-3,2) / (-1,0) /',
    algs: [{ moves: '/ (1,0) / (3,-2) / (2,1) / (0,3) /', id: '933556b8-1996-4867-978e-155d8b92c67c' }]
  },
  {
    name: 'Right paw / Shield',
    id: 'e80bb3d7-3070-48d5-b060-79b743bc8a80',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (3,0) / (1,2) / (2,-3) / (-1,0) /',
    algs: [{ moves: '/ (1,0) / (-2,3) / (-1,-2) / (-3,0) /', id: '7d52321f-e434-4837-9a00-adef60a1a392' }]
  },
  {
    name: 'Shield / Right paw',
    id: '31374cc6-f467-46dc-adf0-57f711d51a64',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (0,-3) / (-2,-1) / (3,-2) / (0,1) /',
    algs: [{ moves: '/ (0,-1) / (-3,2) / (2,1) / (0,3) /', id: 'c5d5fe2e-d60d-44b4-a659-f2012c8ae9bf' }]
  },
  {
    name: 'Right fist / Shield',
    id: '0c5d64fe-d36d-41be-b23f-122b2bfd89bb',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '(1,-1) / (0,-3) / (5,-2) / (0,-2) / (1,2) /',
    algs: [{ moves: '/ (-1,-2) / (0,2) / (-5,2) / (0,3) / (-1,1)', id: '4b4d06a9-c929-429d-8ddd-d61272fd2878' }]
  },
  {
    name: 'Shield / Right fist',
    id: 'f4c340c9-27ee-4ef2-8caf-362e75f70a80',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '(1,-1) / (0,-3) / (5,-2) / (0,-2) / (1,2) /',
    algs: [{ moves: '/ (-1,-2) / (0,2) / (-5,2) / (0,3) / (-1,1)', id: '9c7a8a0d-2ea6-47c6-9a67-ec2f156505d9' }]
  },
  {
    name: 'Left fist / Shield',
    id: '412838aa-22b6-4e46-b9f0-a0d444140196',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '(1,-1) / (0,-3) / (5,-2) / (0,-2) / (1,0) /',
    algs: [{ moves: '/ (-1,0) / (0,2) / (-5,2) / (0,3) / (-1,1)', id: '569fc369-02d5-4f58-9ef0-c8268472ad13' }]
  },
  {
    name: 'Shield / Left fist',
    id: '9ab00185-0137-49fc-a3a5-05b5c4d0de3e',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '(1,-1) / (3,0) / (2,-5) / (2,0) / (0,-1) /',
    algs: [{ moves: '/ (0,1) / (-2,0) / (-2,5) / (-3,0) / (-1,1)', id: 'd6f38f5c-2293-40f5-a1f6-54cdd46bfb50' }]
  },
  {
    name: 'Muffin / Scallop',
    id: '23102220-7818-4dca-9929-0c38bf3a5ef8',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '(1,-1) / (0,-3) / (-1,-2) / (3,-4) / (0,-2) /',
    algs: [{ moves: '/ (0,2) / (-3,4) / (1,2) / (0,3) / (-1,1)', id: 'abb7b5d3-9406-48e6-b51d-208d577c7382' }]
  },
  {
    name: 'Scallop / Muffin',
    id: '240cffce-84c0-46d2-8b99-f7da1aff8393',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '(1,-1) / (3,0) / (2,1) / (4,-3) / (2,0) /',
    algs: [{ moves: '/ (-2,0) / (-4,3) / (-2,-1) / (-3,0) / (-1,1)', id: 'ac07f721-c4f2-4916-9db3-539635e39a3b' }]
  },
  {
    name: 'Left fist / Scallop',
    id: 'f22be01f-2ac3-493b-a616-4e4b8aa73322',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (0,3) / (1,-4) / (0,4) / (-1,0) /',
    algs: [{ moves: '/ (1,0) / (0,-4) / (-1,4) / (0,-3) /', id: '91b18a4b-55fa-4589-ac3d-892c2064a1d0' }]
  },
  {
    name: 'Scallop / Left fist',
    id: 'd3f7eab9-ac48-4b90-aa30-caf14522827f',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (-3,0) / (4,-1) / (-4,0) / (0,1) /',
    algs: [{ moves: '/ (0,-1) / (4,0) / (-4,1) / (3,0) /', id: '6807659c-778b-4827-900f-0b53c83b21ff' }]
  },
  {
    name: 'Right fist / Scallop',
    id: 'a3dbfd5e-2232-488a-854e-0f459c293ad7',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '(1,-1) / (0,-3) / (-1,4) / (0,-4) / (1,0) /',
    algs: [{ moves: '/ (-1,0) / (0,4) / (1,-4) / (0,3) / (-1,1)', id: 'd0f3c2bb-bb3b-4660-b0ff-aeb9ad7dab92' }]
  },
  {
    name: 'Scallop / Right fist',
    id: 'd3d07327-9240-4ea9-acc7-0d141ee0c4a6',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '(1,-1) / (3,0) / (-4,1) / (4,0) / (0,-1) /',
    algs: [{ moves: '/ (0,1) / (-4,0) / (4,-1) / (-3,0) / (-1,1)', id: '6b8372f0-bd6a-4f06-9085-6fe9a2e39f6b' }]
  },
  {
    name: 'Left paw / Scallop',
    id: '4d78a016-3a77-4501-b1b0-762721906fe0',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '(1,-1) / (0,-3) / (-1,-2) / (3,-2) / (-3,-2) /',
    algs: [{ moves: '/ (3,2) / (-3,2) / (1,2) / (0,3) / (-1,1)', id: 'bb79ec17-2f40-4984-8d34-5d6a0260a685' }]
  },
  {
    name: 'Scallop / Left paw',
    id: 'ce5118f5-9494-4f05-aefa-32a48ba7614d',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '(1,-1) / (3,0) / (2,1) / (2,-3) / (2,3) /',
    algs: [{ moves: '/ (-2,-3) / (-2,3) / (-2,-1) / (-3,0) / (-1,1)', id: '8e01e094-9566-4557-a51a-51c9b3f1e809' }]
  },
  {
    name: 'Right paw / Scallop',
    id: 'db6b3e1c-3f95-4f3e-88d6-c1fc213d810d',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (0,3) / (1,2) / (-3,2) / (3,2) /',
    algs: [{ moves: '/ (-3,-2) / (3,-2) / (-1,-2) / (0,-3) /', id: '48fc31c1-cc21-4351-8cd1-717e93f4ec04' }]
  },
  {
    name: 'Scallop / Right paw',
    id: '7cca7fa5-912f-4f53-a7c5-5d7fc18cf12a',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (-3,0) / (-2,-1) / (-2,3) / (-2,-3) /',
    algs: [{ moves: '/ (2,3) / (2,-3) / (2,1) / (3,0) /', id: 'a3dc0a47-4d48-4600-92a4-0bc71e7c4ae2' }]
  },
  {
    name: 'Shield / Scallop',
    id: '2c02f025-e3b1-4a96-8627-7d3921f4345b',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (3,3) / (1,2) / (0,4) / (0,-2) /',
    algs: [{ moves: '/ (0,2) / (0,-4) / (-1,-2) / (-3,-3) /', id: '60b4a2fe-1fce-4b2f-a889-e9284d50d484' }]
  },
  {
    name: 'Scallop / Shield',
    id: '9189d4a9-c5f7-41f3-bdd9-c47b2a2e3f74',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (-3,-3) / (-2,-1) / (-4,0) / (2,0) /',
    algs: [{ moves: '/ (-2,0) / (4,0) / (2,1) / (3,3) /', id: 'b3802bef-ee9d-4a25-807d-7484424d8167' }]
  },
  {
    name: 'Left paw / Barrel',
    id: 'b3f913e5-31b3-4bc7-9686-198c4283fbaf',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '(1,-1) / (3,0) / (2,1) / (4,-3) / (-2,1) /',
    algs: [{ moves: '/ (2,-1) / (-4,3) / (-2,-1) / (-3,0) / (-1,1)', id: 'f7bee6fa-4ba8-47ea-970f-ddbe1da1d5b4' }]
  },
  {
    name: 'Barrel / Left paw',
    id: 'a4902ece-03fd-4d35-9e1b-aed8721090ba',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '(1,-1) / (0,-3) / (-1,-2) / (3,-4) / (-1,2) /',
    algs: [{ moves: '/ (1,-2) / (-3,4) / (1,2) / (0,3) / (-1,1)', id: 'a12922ad-5e8e-465e-9ebf-e2e02627397a' }]
  },
  {
    name: 'Right paw / Barrel',
    id: 'a1cf3550-9d97-4958-8e42-e31504f01ff0',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '(1,-1) / (0,-3) / (-1,-2) / (-3,4) / (-2,1) /',
    algs: [{ moves: '/ (2,-1) / (3,-4) / (1,2) / (0,3) / (-1,1)', id: '46b22fa3-7969-4db8-9a37-0a12888382f7' }]
  },
  {
    name: 'Barrel / Right paw',
    id: '6cb4a859-f60e-48f4-8178-4da612a6e805',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '(1,-1) / (3,0) / (2,1) / (-4,3) / (-1,2) /',
    algs: [{ moves: '/ (1,-2) / (4,-3) / (-2,-1) / (-3,0) / (-1,1)', id: '0779fd85-6afd-4901-ab27-b4b5ed36a4d0' }]
  },
  {
    name: 'Shield / Barrel',
    id: '26b6c081-ffbb-448c-acfa-587fa9d93698',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (3,3) / (1,0) / (-2,0) / (2,0) /',
    algs: [{ moves: '/ (-2,0) / (2,0) / (-1,0) / (-3,-3) /', id: '3931296a-0641-45ba-8f0a-350d2dc00729' }]
  },
  {
    name: 'Barrel / Shield',
    id: '946ecb91-23f0-4d7d-b009-30acc6652d8a',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (-3,-3) / (0,-1) / (0,2) / (0,-2) /',
    algs: [{ moves: '/ (0,2) / (0,-2) / (0,1) / (3,3) /', id: 'd32a2653-91b2-4a48-9d6b-98a29bc773b3' }]
  },
  {
    name: 'Left paw / Kite',
    id: '50314a7a-1c3f-4dbc-b078-b1da287c18de',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (3,0) / (1,0) / (-2,0) / (0,-1) /',
    algs: [{ moves: '/ (0,1) / (2,0) / (-1,0) / (-3,0) /', id: '697acdc7-5110-42c0-bd4c-0bc9d15a8423' }]
  },
  {
    name: 'Kite / Left paw',
    id: '9361b1bc-4c17-4fb5-a35f-a794344a7696',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (0,-3) / (0,-1) / (1,2) / (-1,0) /',
    algs: [{ moves: '/ (1,0) / (-1,-2) / (0,1) / (0,3) /', id: 'b3740c53-4bce-4bd1-9137-c02b9e364209' }]
  },
  {
    name: 'Shield / Kite',
    id: '8a66eac9-1174-4dd8-bb2f-b4e9ce5d737b',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (0,-3) / (0,-1) / (1,2) / (0,2) /',
    algs: [{ moves: '/ (0,-2) / (-1,-2) / (0,1) / (0,3) /', id: '3fa7fca8-df34-4332-b0f8-0051b4934b5d' }]
  },
  {
    name: 'Kite / Shield',
    id: 'a7c7152d-16a0-4ab7-b950-9d1c43396687',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (3,0) / (1,0) / (-2,0) / (2,0) /',
    algs: [{ moves: '/ (-2,0) / (2,0) / (-1,0) / (-3,0) /', id: 'e6a9a4ba-55a3-4f70-9ca6-c672cf684d05' }]
  },
  {
    name: 'Right paw / Kite',
    id: '4148a7ee-df57-4268-9c83-9970638ded0f',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (3,0) / (1,0) / (-2,-1) / (0,1) /',
    algs: [{ moves: '/ (0,-1) / (2,1) / (-1,0) / (-3,0) /', id: '947a30ae-426a-4d39-b2dc-fd774570fef5' }]
  },
  {
    name: 'Kite / Right paw',
    id: '6fb48366-b736-4191-ba22-5e8359437365',
    idMethod,
    puzzle,
    group: '5 Slices',
    setup: '/ (0,-3) / (0,-1) / (0,2) / (1,0) /',
    algs: [{ moves: '/ (-1,0) / (0,-2) / (0,1) / (0,3) /', id: '25bd1408-9d0e-4210-8be2-699cb1b9e718' }]
  },
  {
    name: 'Left fist / Square',
    id: 'd9b0cde5-dab3-4646-b8a2-3b5fa07dcd8c',
    idMethod,
    puzzle,
    group: '6 Slices',
    setup: '/ (3,0) / (1,2) / (2,0) / (-1,-2) / (4,0) /',
    algs: [{ moves: '/ (-4,0) / (1,2) / (-2,0) / (-1,-2) / (-3,0) /', id: '69c4c321-ac08-4f1b-826b-ab574dd274c1' }]
  },
  {
    name: 'Square / Left fist',
    id: '97b439fd-1330-4318-8ae3-4ab8dd5804e9',
    idMethod,
    puzzle,
    group: '6 Slices',
    setup: '/ (0,-3) / (-2,-1) / (0,-2) / (2,1) / (0,-4) /',
    algs: [{ moves: '/ (0,4) / (-2,-1) / (0,2) / (2,1) / (0,3) /', id: 'cd6170fd-5c04-4986-8500-75b60e7302f0' }]
  },
  {
    name: 'Right fist / Square',
    id: 'c180ddbe-e85f-4b4e-8e53-3b36df613fe6',
    idMethod,
    puzzle,
    group: '6 Slices',
    setup: '/ (3,0) / (1,2) / (-2,0) / (2,1) / (-4,0) / (0,-1)',
    algs: [
      {
        moves: '(0,-1) / (0,1) / (4,0) / (-2,-1) / (2,0) / (-1,-2) / (-3,0) /',
        id: 'ddb62513-f5c0-4fb5-beed-754ba338c64b'
      }
    ]
  },
  {
    name: 'Square / Right fist',
    id: 'a3648483-5390-4a6b-bbd4-54563dc1f59f',
    idMethod,
    puzzle,
    group: '6 Slices',
    setup: '/ (0,-3) / (-2,-1) / (0,2) / (-1,-2) / (0,4) / (1,0)',
    algs: [
      {
        moves: '(1,0) / (-1,0) / (0,-4) / (1,2) / (0,-2) / (2,1) / (0,3) /',
        id: 'fbf986c7-505f-4647-8706-a6888ab8e741'
      }
    ]
  },
  {
    name: 'Barrel / Square',
    id: 'c5e97733-c532-494f-89f6-abc5bea61675',
    idMethod,
    puzzle,
    group: '6 Slices',
    setup: '/ (3,3) / (1,0) / (-2,-2) / (2,1) / (-2,-2) /',
    algs: [{ moves: '/ (2,2) / (-2,-1) / (2,2) / (-1,0) / (-3,-3) /', id: '2458d4f0-6e36-467d-b47d-75439b9c0af5' }]
  },
  {
    name: 'Square / Barrel',
    id: '0d5f9f0a-0a6c-47a3-af83-5d91feb8e041',
    idMethod,
    puzzle,
    group: '6 Slices',
    setup: '/ (-3,-3) / (0,1) / (-2,-2) / (1,-2) / (-2,-2) /',
    algs: [{ moves: '/ (2,2) / (-1,2) / (2,2) / (0,-1) / (3,3) /', id: '69df525a-d344-4b3f-846f-5a966abb6ffe' }]
  },
  {
    name: 'Star / 7-1',
    id: 'a254197f-bda5-47f5-bf57-27ecfd75431a',
    idMethod,
    puzzle,
    group: '6 Slices',
    setup: '/ (0,3) / (1,2) / (3,-2) / (2,1) / (2,0) /',
    algs: [{ moves: '/ (-2,0) / (-2,-1) / (-3,2) / (-1,-2) / (0,-3) /', id: '6929b382-9d63-4e7b-9d46-679dfc15a12d' }]
  },
  {
    name: '7-1 / Star',
    id: '3a488b23-fbbe-4e87-b745-cd8c16a15556',
    idMethod,
    puzzle,
    group: '6 Slices',
    setup: '(1,-1) / (3,0) / (2,1) / (-2,3) / (1,2) / (0,2) / (-1,0)',
    algs: [
      {
        moves: '(1,0) / (0,-2) / (-1,-2) / (2,-3) / (-2,-1) / (-3,0) / (-1,1)',
        id: '2ca74743-7048-41c3-a0bf-e7202cddbc82'
      }
    ]
  },
  {
    name: 'Star / 5-3',
    id: '2a408984-89ab-4573-8a2e-3b89a2a06c4b',
    idMethod,
    puzzle,
    group: '6 Slices',
    setup: '/ (0,-3) / (-2,-1) / (3,-2) / (2,1) / (4,0) / (0,-3)',
    algs: [{ moves: '(0,3) / (-4,0) / (-2,-1) / (-3,2) / (2,1) / (0,3) /', id: 'b2b66b35-b77b-41f1-a490-cd821aabf74d' }]
  },
  {
    name: '5-3 / Star',
    id: '5f79d65f-66bc-4b37-be1d-1eed0606a69e',
    idMethod,
    puzzle,
    group: '6 Slices',
    setup: '/ (3,0) / (1,2) / (2,-3) / (-1,-2) / (0,-4) /',
    algs: [{ moves: '/ (0,4) / (1,2) / (-2,3) / (-1,-2) / (-3,0) /', id: 'fe0ef977-0251-4395-81dc-62a2a377824a' }]
  },
  {
    name: '2-2-2 / Parallel Edges',
    id: '8652e00e-989f-4967-9097-d0b44aa0059a',
    idMethod,
    puzzle,
    group: '6 Slices',
    setup: '/ (3,0) / (1,0) / (-2,-1) / (-2,0) / (-6,3) /',
    algs: [{ moves: '/ (6,-3) / (2,0) / (2,1) / (-1,0) / (-3,0) /', id: '2cd16b87-c59f-407a-8a85-3661f8aeaf96' }]
  },
  {
    name: 'Parallel Edges / 2-2-2',
    id: 'b5a64799-e222-48f4-a262-0b36b9b783a2',
    idMethod,
    puzzle,
    group: '6 Slices',
    setup: '/ (3,0) / (1,0) / (-2,-1) / (-2,0) / (0,-3) /',
    algs: [{ moves: '/ (0,3) / (2,0) / (2,1) / (-1,0) / (-3,0) /', id: 'd97fe220-f7b8-4d73-b20a-c1354d934587' }]
  },
  {
    name: '2-2-2 / Perpendicular Edges',
    id: '87c12778-2ecd-41ea-b66e-c8de09ee992f',
    idMethod,
    puzzle,
    group: '6 Slices',
    setup: '/ (0,-3) / (0,-1) / (0,2) / (-2,0) / (1,0) /',
    algs: [{ moves: '/ (-1,0) / (2,0) / (0,-2) / (0,1) / (0,3) /', id: '47d0068e-5bcd-4a61-89b9-8aff393c0b10' }]
  },
  {
    name: 'Perpendicular Edges / 2-2-2',
    id: '0e8ee4a9-81ca-4ed9-a1a1-dd7558fee1eb',
    idMethod,
    puzzle,
    group: '6 Slices',
    setup: '/ (3,0) / (1,0) / (-2,-1) / (0,-2) / (0,1) /',
    algs: [{ moves: '/ (0,-1) / (0,2) / (2,1) / (-1,0) / (-3,0) /', id: '260af288-4053-4a95-b06d-687778219c2a' }]
  },
  {
    name: 'Left fist / Left fist',
    id: 'cbd89aa5-41d7-4874-afb3-110ca258f91f',
    idMethod,
    puzzle,
    group: '6 Slices',
    setup: '/ (0,-3) / (0,-1) / (0,2) / (0,-2) / (0,2) /',
    algs: [{ moves: '/ (0,-2) / (0,2) / (0,-2) / (0,1) / (0,3) /', id: '570aeea9-0389-4ce9-8244-0cbac397624b' }]
  },
  {
    name: 'Right fist / Right fist',
    id: '2b6e6004-cbe4-42be-9909-7e6137461ec4',
    idMethod,
    puzzle,
    group: '6 Slices',
    setup: '/ (3,0) / (1,0) / (-2,0) / (2,0) / (-2,0) /',
    algs: [{ moves: '/ (2,0) / (-2,0) / (2,0) / (-1,0) / (-3,0) /', id: '428872a7-c700-4ab5-b11c-68aaeef89810' }]
  },
  {
    name: 'Right fist / Muffin',
    id: 'bff70dea-3f39-44b0-adef-db9e38b29d82',
    idMethod,
    puzzle,
    group: '6 Slices',
    setup: '/ (3,0) / (1,-4) / (-2,0) / (2,1) / (-4,0) /',
    algs: [{ moves: '/ (4,0) / (-2,-1) / (2,0) / (-1,4) / (-3,0) /', id: 'd30bea28-0b62-442e-bde2-0050bea15d2a' }]
  },
  {
    name: 'Muffin / Right fist',
    id: '6d39b7f8-3926-4148-a554-9fc73016241e',
    idMethod,
    puzzle,
    group: '6 Slices',
    setup: '/ (0,-3) / (4,-1) / (0,2) / (-1,-2) / (0,4) /',
    algs: [{ moves: '/ (0,-4) / (1,2) / (0,-2) / (-4,1) / (0,3) /', id: '0f475ff5-f581-4c90-9c20-e6da8710fdb4' }]
  },
  {
    name: 'Left fist / Muffin',
    id: '929a6587-ce66-4c35-8342-6329c1979e48',
    idMethod,
    puzzle,
    group: '6 Slices',
    setup: '/ (3,0) / (1,-4) / (-2,0) / (0,1) / (-4,0) /',
    algs: [{ moves: '/ (4,0) / (0,-1) / (2,0) / (-1,4) / (-3,0) /', id: '7ce98a55-e941-4990-8fc5-c394fd65603a' }]
  },
  {
    name: 'Muffin / Left fist',
    id: '9565723f-a095-476e-9763-1bd8216dc2fd',
    idMethod,
    puzzle,
    group: '6 Slices',
    setup: '/ (0,-3) / (4,-1) / (0,2) / (-1,0) / (0,4) /',
    algs: [{ moves: '/ (0,-4) / (1,0) / (0,-2) / (-4,1) / (0,3) /', id: '5c29d70b-da42-43d6-8144-fec913124c47' }]
  },
  {
    name: 'Right fist / Barrel',
    id: '0e078718-fea5-4507-96c8-1a25c3b2cf82',
    idMethod,
    puzzle,
    group: '6 Slices',
    setup: '/ (3,3) / (-1,-2) / (-2,0) / (1,0) / (2,0) /',
    algs: [{ moves: '/ (-2,0) / (-1,0) / (2,0) / (1,2) / (-3,-3) /', id: 'd90b78de-7455-430e-ba42-3a12d41a8664' }]
  },
  {
    name: 'Barrel / Right fist',
    id: 'e15bfab2-1c8b-404a-94ca-10d3882ebf74',
    idMethod,
    puzzle,
    group: '6 Slices',
    setup: '/ (-3,-3) / (2,1) / (0,2) / (0,-1) / (0,-2) /',
    algs: [{ moves: '/ (0,2) / (0,1) / (0,-2) / (-2,-1) / (3,3) /', id: '467c3a01-18f7-4770-9b47-a9cf86afa218' }]
  },
  {
    name: 'Left fist / Barrel',
    id: '75094364-18cb-4cc3-9e0f-762154e0bc9d',
    idMethod,
    puzzle,
    group: '6 Slices',
    setup: '/ (3,3) / (1,2) / (2,0) / (-1,0) / (-2,0) /',
    algs: [{ moves: '/ (2,0) / (1,0) / (-2,0) / (-1,-2) / (-3,-3) /', id: 'f4109832-b64a-4f82-8e14-314c5a01c0b4' }]
  },
  {
    name: 'Barrel / Left fist',
    id: '5b3afa76-3696-433b-b444-a7478d175d19',
    idMethod,
    puzzle,
    group: '6 Slices',
    setup: '/ (-3,-3) / (-2,-1) / (0,-2) / (0,1) / (0,2) /',
    algs: [{ moves: '/ (0,-2) / (0,-1) / (0,2) / (2,1) / (3,3) /', id: '44d13c0e-9663-431e-856e-8f17a952c5e9' }]
  },
  {
    name: 'Muffin / Barrel',
    id: '0c850145-ef08-4d76-bf81-55dfe4f072ce',
    idMethod,
    puzzle,
    group: '6 Slices',
    setup: '(1,-1) / (-3,0) / (-1,0) / (2,0) / (-2,0) / (-2,-3) /',
    algs: [{ moves: '/ (2,3) / (2,0) / (-2,0) / (1,0) / (3,0) / (-1,1)', id: '7fe3db7f-7d6f-42f5-b349-9856ad9df5bb' }]
  },
  {
    name: 'Barrel / Muffin',
    id: 'fcadc0c2-324e-429d-a429-b55d10e682be',
    idMethod,
    puzzle,
    group: '6 Slices',
    setup: '(1,-1) / (0,3) / (0,1) / (0,-2) / (0,2) / (3,2) /',
    algs: [
      { moves: '/ (-3,-2) / (0,-2) / (0,2) / (0,-1) / (0,-3) / (-1,1)', id: '0bd2d0c9-ba6f-4a5a-8827-38c0ba8041f0' }
    ]
  },
  {
    name: 'Left fist / Kite',
    id: '8bb3a174-dad3-4d0f-964a-e14be594b838',
    idMethod,
    puzzle,
    group: '6 Slices',
    setup: '/ (3,0) / (1,2) / (-2,0) / (0,1) / (2,0) /',
    algs: [{ moves: '/ (-2,0) / (0,-1) / (2,0) / (-1,-2) / (-3,0) /', id: 'c71216f1-373a-4242-b6d5-1e2a66ed18c2' }]
  },
  {
    name: 'Kite / Left fist',
    id: '3ff7f2b5-c137-475c-9650-2610946931f6',
    idMethod,
    puzzle,
    group: '6 Slices',
    setup: '/ (0,3) / (1,2) / (0,2) / (-1,0) / (0,-2) /',
    algs: [{ moves: '/ (0,2) / (1,0) / (0,-2) / (-1,-2) / (0,-3) /', id: '0d08ca06-b06b-4cff-958a-6fbfe5a6d7fc' }]
  },
  {
    name: 'Right fist / Kite',
    id: '56965690-6085-498c-9cec-ecf8ddfc5453',
    idMethod,
    puzzle,
    group: '6 Slices',
    setup: '/ (3,0) / (1,2) / (-2,0) / (0,1) / (2,0) /',
    algs: [{ moves: '/ (-2,0) / (0,-1) / (2,0) / (-1,-2) / (-3,0) /', id: 'a5bffed2-8481-4ac8-9bf2-e0a4cf86a083' }]
  },
  {
    name: 'Kite / Right fist',
    id: '79667bcd-a97c-4756-9cfd-6e84e925c48f',
    idMethod,
    puzzle,
    group: '6 Slices',
    setup: '/ (0,-3) / (-2,-1) / (0,2) / (-1,0) / (0,-2) /',
    algs: [{ moves: '/ (0,2) / (1,0) / (0,-2) / (2,1) / (0,3) /', id: 'f17193c2-b120-45c2-868e-10d78840663f' }]
  },
  {
    name: 'Muffin / Kite',
    id: '7fb528e5-c82f-424a-9186-aa7416c2becc',
    idMethod,
    puzzle,
    group: '6 Slices',
    setup: '/ (3,3) / (1,0) / (-2,0) / (2,0) / (-2,-3) /',
    algs: [{ moves: '/ (2,3) / (-2,0) / (2,0) / (-1,0) / (-3,-3) /', id: '3db52392-f079-43b2-bcd1-53bd45e71e7b' }]
  },
  {
    name: 'Kite / Muffin',
    id: '80679169-c82c-4fdc-850d-13f0ed8037d7',
    idMethod,
    puzzle,
    group: '6 Slices',
    setup: '/ (-3,-3) / (0,1) / (0,-2) / (0,2) / (-3,-2) /',
    algs: [{ moves: '/ (3,2) / (0,-2) / (0,2) / (0,-1) / (3,3) /', id: 'c08f18ba-f5d1-4e8a-b9ec-c86017ea3f70' }]
  },
  {
    name: 'Kite / Square',
    id: 'c7165751-2940-49ca-8600-e40ea918e7aa',
    idMethod,
    puzzle,
    group: '7 Slices',
    setup: '/ (3,0) / (1,0) / (-2,0) / (2,0) / (-2,0) / (1,0) /',
    algs: [
      { moves: '/ (-1,0) / (2,0) / (-2,0) / (2,0) / (-1,0) / (-3,0) /', id: 'c9c41e0f-3f95-4b9d-8131-16724f2d66d9' }
    ]
  },
  {
    name: 'Square / Kite',
    id: 'ebfcd92b-b4b8-48ec-9b88-6f220afb0c3d',
    idMethod,
    puzzle,
    group: '7 Slices',
    setup: '/ (0,-3) / (0,-1) / (0,2) / (0,-2) / (0,2) / (0,-1) /',
    algs: [{ moves: '/ (0,1) / (0,-2) / (0,2) / (0,-2) / (0,1) / (0,3) /', id: '592cca98-c9b3-4492-90f9-f3e3a51eed10' }]
  }
]
