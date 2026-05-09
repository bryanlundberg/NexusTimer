import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

const idMethod = 'SARAH_ALGS'
const puzzle = 'skewb'

export const SARAH_ALGS: AlgorithmCollection[] = [
  {
    name: '1a',
    id: '76e1081a-7c54-481e-a41b-9655f4c4e7b6',
    idMethod,
    puzzle,
    group: 'Pi + Swirl Perm',
    setup: '',
    algs: [
      { moves: "y x R b' r' R' r z B' r B", id: 'bb3a6307-d545-4b90-b625-862cb08ce5ab' },
      { moves: "R r' z' r' z r' R r' R r", id: '4b809878-3608-46a9-8ad7-3b13ae372397' },
      { moves: "H z S z' H z H", id: 'b55c968a-81bb-4d86-bec8-ba70735534d0' },
      { moves: "H z H z' S z H", id: 'ac544249-6041-4424-acee-572b5f80259b' }
    ]
  },
  {
    name: '1b',
    id: '762bb37c-1a85-4105-8e69-53e62c702275',
    idMethod,
    puzzle,
    group: 'Pi + Swirl Perm',
    setup: '',
    algs: [
      { moves: "y2 x r' B R r R' B r' B'", id: '59cda4a4-14bf-4e64-b2a1-5a6a494d0181' },
      { moves: "x r' R r R r' R' r z' r' R r R' B'", id: 'bc036d64-332c-4d0a-b2ff-df648152dc6e' },
      { moves: "z' S z' S z S z' H", id: '32382eb4-eb20-4740-9e2b-5e88ed734099' },
      { moves: "y x r' R r R z2 r' R r R' z' R r' R' r'", id: '118c3818-f8c5-4090-b47e-27f777309fb5' }
    ]
  },
  {
    name: '2a',
    id: 'd6f1cf2e-f7ee-49a5-b10b-d75c09d5e07a',
    idMethod,
    puzzle,
    group: 'Pi + Swirl Perm',
    setup: '',
    algs: [
      { moves: "z2 H z' S z S z' S", id: '06f0e9e7-9b9c-4ba3-872f-1a7638aa3806' },
      { moves: "y2 x r B R' B' r R r R' r' R r", id: '39b0a347-a8fe-46d4-bfbe-084650285df7' },
      { moves: "y' x b' r' R r R' z' R r' R' r R r R'", id: '160eefd9-4804-4a84-acdf-cefe9d0a7088' },
      { moves: "y2 x b' r' R r R r' R' r z r B r' B'", id: 'afccc921-2aef-4964-8109-ad3fab8e7dbf' }
    ]
  },
  {
    name: '2b',
    id: '00efa2c8-ab33-4478-9193-1840fba2f4bb',
    idMethod,
    puzzle,
    group: 'Pi + Swirl Perm',
    setup: '',
    algs: [
      { moves: "z S z' H z H z' H", id: '1b325183-ce33-4b0d-b1bc-3801956da96e' },
      { moves: "x R b R' z' R r' R' B' r", id: '2384788a-e258-4490-8e1d-8b174f76d1da' },
      { moves: "x z R' r' R' r z R r R' r z' r' R r R'", id: 'cb841a5a-864d-4068-8955-8e1d8e3e8c65' },
      { moves: "y2 x B' r' R r R z R r R' r' R' r R'", id: 'fbdd1943-0d49-4b39-be9f-534a2864dcd5' }
    ]
  },
  {
    name: '1c',
    id: '2d51c75e-a11a-47e6-8f81-c166b7d3473d',
    idMethod,
    puzzle,
    group: 'Pi + Swirl Perm',
    setup: '',
    algs: [
      { moves: "S z H z' S z H", id: 'e94ea87d-8236-4cb0-94da-396f4445525d' },
      { moves: "x y2 r' R r R b' r R' b'", id: 'fa0f6b3a-8fd1-4cdc-9f0c-cfb0355068c0' },
      { moves: "y x R r' R r R' B R' B' r' R' r R", id: 'b04b05e1-8328-4b31-973a-8e3ab83f4eaf' },
      { moves: "y' x r B' b' r' B' r B b", id: '6b42b6e5-8d5c-4210-8237-830a41b268bf' }
    ]
  },
  {
    name: '1d',
    id: '49cfae8c-3ae4-4cb0-ae01-a2c5fbb16f45',
    idMethod,
    puzzle,
    group: 'Pi + Swirl Perm',
    setup: '',
    algs: [
      { moves: "z' H z' S z H z' H", id: '6991a94f-bec0-4131-b6ad-150e440428de' },
      { moves: "x r' R r z R r R' z' r' R' r R'", id: '1019613d-626f-45c1-b087-9ceff3a93f5b' },
      { moves: "y x R' r' R' r z R r' R' r' R r R'", id: 'ed82b1ae-3e26-4318-a428-5f9477998221' },
      { moves: "y x' R r' R' r' B R' r B", id: 'd65ee691-d251-4ad8-9716-059fcc67fe53' }
    ]
  },
  {
    name: '2c',
    id: 'ff95f6b3-cfa1-48bd-9562-087c8d57d5c5',
    idMethod,
    puzzle,
    group: 'Pi + Swirl Perm',
    setup: '',
    algs: [
      { moves: "z2 S z' H z H z' H", id: 'd8e42f45-3c33-4a0e-bfef-1411d1ffba86' },
      { moves: "z2 H z' H z S z' H", id: '108a8c82-5659-4808-ac0b-bb592c3f9e50' },
      { moves: "x r' R r' R' z' r' R r B R B'", id: 'ca282f39-5541-47b8-9cd3-cc9658a30b07' },
      { moves: "y2 x R' r' B' r B R r B'", id: '720ea3ac-d970-43b5-b393-d4af2474fbcb' }
    ]
  },
  {
    name: '2d',
    id: '90f4830e-2e02-423a-8f44-a13e27bf6998',
    idMethod,
    puzzle,
    group: 'Pi + Swirl Perm',
    setup: '',
    algs: [
      { moves: "z S z S z' H z S", id: '2c51744f-2e88-48a2-a20f-2dca9cb8ecee' },
      { moves: "y' x R r' R r B R' B' r' R' r", id: 'fa4ea7eb-ecd1-49ef-9e5e-70ee89d0e4c3' },
      { moves: "x b r B r' B' z' r' R' b", id: '18381a21-5427-4103-b117-e9c34ce256b6' },
      { moves: "y2 z B' b' R r' b r B r'", id: '2ff4de64-2d4d-4db8-9d61-3fc92859e604' }
    ]
  },
  {
    name: '3a',
    id: '60135e5d-07a0-4556-9acd-305d09476cc2',
    idMethod,
    puzzle,
    group: 'Pi + Wat Perm',
    setup: '',
    algs: [
      { moves: "z' S z2 H z' S z' S", id: 'd276205c-1b4c-4008-830e-d7e3c4e79978' },
      { moves: "x r2' R r B R r' R B", id: '976b1d7d-4e23-4481-9326-7dcacf325046' },
      { moves: "y x R B R' B' R' r' R r R r' R' r", id: '0fb2409f-56c9-4e67-b2aa-3dd0fa88816f' },
      { moves: "y' x r' R r R' r' R' r R B R B' R'", id: '8561c1c1-1bf5-41ee-9b2b-e5404bdea695' }
    ]
  },
  {
    name: '3b',
    id: 'c0467f36-7153-4604-a15e-bf8bcb224151',
    idMethod,
    puzzle,
    group: 'Pi + Wat Perm',
    setup: '',
    algs: [
      { moves: "x B' R' B' r' R' B R' r'", id: '8c2db846-a528-4bdd-8c8b-9f69612109a8' },
      { moves: "y x R' r' R r R B R' B' R' B R B'", id: 'dc7fd5d9-9b2e-4d6b-afe0-071f972d18f7' },
      { moves: "y2 x R r R' r' R' z' r' R r z R r'", id: 'd0666b81-363b-422c-b38c-d986adae1601' },
      { moves: "y x B R' B' R B R B' R' r' R' r R", id: 'a310fc90-5941-4b26-88f9-4bda55a972c8' }
    ]
  },
  {
    name: '4a',
    id: '63135c7b-0d60-4860-aa5d-4bad703206d1',
    idMethod,
    puzzle,
    group: 'Pi + Wat Perm',
    setup: '',
    algs: [
      { moves: "x r' R' r B R' B' R' r' R r R'", id: 'd1b2dd13-37fd-4fa0-8032-4b488c59f883' },
      { moves: "y2 x r R' r B r' z r R' r' R' r", id: '23481721-706b-4b3c-8b58-11b218a6daf4' },
      { moves: 'z S y S z2 S', id: 'b8f1b320-d16e-4c27-a094-3850647674a1' }
    ]
  },
  {
    name: '4b',
    id: 'c5d88eab-bc4c-4c61-8af2-8932ea479875',
    idMethod,
    puzzle,
    group: 'Pi + Wat Perm',
    setup: '',
    algs: [
      { moves: "y x r' R r R B' r' R' r B R'", id: '0346de9e-8ec6-47c9-b13c-5abf022f99e3' },
      { moves: "x B R B' r' R r R B R' B' R", id: '22b983aa-f7cd-4563-8f6d-91d644d5f1ae' },
      { moves: "y' x R r' R' r R r' R r B R' B' R'", id: 'b658a17d-606b-4a8f-b046-a0bfdf111ebc' },
      { moves: "z2 H y' S z2 S", id: 'c06a1741-1936-4542-8919-73e750c666c3' }
    ]
  },
  {
    name: '3c',
    id: '06b5989b-e714-4a65-aa82-dd86e64d999c',
    idMethod,
    puzzle,
    group: 'Pi + Wat Perm',
    setup: '',
    algs: [
      { moves: 'z S z S z H z2 S', id: '2d68d7ff-58ba-44b7-b3f9-43356267c605' },
      { moves: "y' x R r' R' r R' r' R r z r R r' R'", id: '2dede3a5-748a-4599-abcc-7b870864acd4' },
      { moves: "y x B R B' R' r' R' r R r' R r R'", id: 'f6c5e93b-147f-4474-9b01-562fc0fd6a2f' },
      { moves: "y' x R' r R r' R' r R' r' z R r' R'", id: '8fc4d508-119a-4dca-b6e8-ead69ab75aa9' }
    ]
  },
  {
    name: '3d',
    id: '166eed5a-2724-40e4-bde2-be86e463c46e',
    idMethod,
    puzzle,
    group: 'Pi + Wat Perm',
    setup: '',
    algs: [
      { moves: "H z' H z' S z2 H", id: '070cf87e-9408-44c6-9ed7-1e6ca0477f89' },
      { moves: "x r' R r R' r R r' R' z' R' r' R r", id: '50ae4fa7-7a2a-4602-a00e-e09c3d5481a0' },
      { moves: "x r R' r' R r R' z' R B r' R r", id: '8f3224c0-0edc-4d9c-8110-5d139b43d0f2' },
      { moves: "y' x r' R' r R z R r R' r' R r' R' r", id: '5dd57d59-4622-480c-9ee3-f94a80cb367d' }
    ]
  },
  {
    name: '4c',
    id: '435b7fe0-81df-45f1-80d2-e2f8a4451476',
    idMethod,
    puzzle,
    group: 'Pi + Wat Perm',
    setup: '',
    algs: [
      { moves: "y' x R r' R r z R r' R' r R r R'", id: 'b98ef564-b7b9-4ace-922c-ecbce3f21b21' },
      { moves: "y2 x r' R r R B R' B' R' r' R' r R", id: '5e695ca3-00ea-44c1-9bb9-ed5f1f097100' },
      { moves: "x R r' R' r' R r R' z' r' R' r R'", id: '4efe417d-73cc-4898-a0b2-c5adf36bfb8b' },
      { moves: 'z H y S z2 S', id: '84fc6414-4c4a-4afe-a708-027f42a01ec8' }
    ]
  },
  {
    name: '4d',
    id: 'e1716c27-8237-4c9f-bfeb-d25b22edc2e4',
    idMethod,
    puzzle,
    group: 'Pi + Wat Perm',
    setup: '',
    algs: [
      { moves: "y x R r' R ' r' z' r' R r R z R r R' r'", id: 'ccdf8ed4-2cdc-4dd3-9bdb-9f6f8723e5a2' },
      { moves: "y' x r' R r R r' R' r B R B' R", id: '69eea217-6122-44a3-bf02-0c80a32074f1' },
      { moves: "y x R' B R' B' r' R r R' r' R' r", id: '0455ebd0-0bd8-4473-8ad4-10969df75b98' },
      { moves: "z2 S y' S z2 S", id: '00016870-1c05-43d0-82f1-ded7f47b4c60' }
    ]
  },
  {
    name: '5a',
    id: 'f75d3945-775b-48cc-9ecc-3eade916d324',
    idMethod,
    puzzle,
    group: 'Pi  + X Perm',
    setup: '',
    algs: [
      { moves: "x' S z2 S y2 x' H", id: '60a077a7-ddac-4090-bf10-45872dda8c14' },
      { moves: "x z' r' R z' r' R r z r R r' R", id: '71dd98cc-cbae-4609-a685-89646eebad39' },
      { moves: "x R' r' R r R z B R' B' R r'", id: '844fda9f-4dc6-4fc2-8dae-0129838f51c1' },
      { moves: "x z' r' R' r B r' R r z R r' R r", id: '0dafe2f7-0fe4-465a-bf6b-96252eb392a4' }
    ]
  },
  {
    name: '5b',
    id: 'd31b5114-c908-435f-a215-ca39d567f35b',
    idMethod,
    puzzle,
    group: 'Pi  + X Perm',
    setup: '',
    algs: [
      { moves: "y2 x R r' B R' B' R' r' R r'", id: '29b59344-d336-4914-9b44-f377e61d7dd4' },
      { moves: "y z' S z2 S x y2 S", id: 'f9880d9b-a246-418b-9dfb-ad5a7a2a0bfb' },
      { moves: "y x b' r' R r R' z2 r' R' r R'", id: 'edc54479-7cce-4e30-841d-f8b73f3998c7' },
      { moves: "r R' r B x r' l r l' r", id: '736d5f2a-c771-43b1-ba5d-767fa48a5264' }
    ]
  },
  {
    name: '6a',
    id: 'c3ac044e-92b8-4e2d-a3e6-e90cc95c3678',
    idMethod,
    puzzle,
    group: 'Pi  + X Perm',
    setup: '',
    algs: [
      { moves: "y x R r' R r z2 R r' R' r b", id: 'e5393bb5-6c95-4ff8-ad9c-4d41291fb506' },
      { moves: "y x R r' R r z B R' B' R r", id: '5fce5c23-80ca-414f-b03c-6c200569e618' },
      { moves: "x r2' R' r z r R r R' b r'", id: 'b71d6284-d87d-4287-b4c8-fa07979acb30' },
      { moves: "z H z2 x' S z2 S", id: 'c480c20b-9063-4666-98f6-3a3898e2db38' }
    ]
  },
  {
    name: '6b',
    id: '0c31089c-109d-47af-a43d-1ac9a1c92866',
    idMethod,
    puzzle,
    group: 'Pi  + X Perm',
    setup: '',
    algs: [
      { moves: "y' x R' r R' r' z' r' R' r z R' r", id: '63bab2b7-903d-4871-a3f0-2b7021c0edf6' },
      { moves: "y2 x r' R r' R' z2 r' R r R' B'", id: 'b250f166-10c4-4411-aa60-ee1e1b74156d' },
      { moves: "z2 S y2 x' S z2 S", id: 'a2f05e3c-1ad9-4669-a420-39fe1deda019' }
    ]
  },
  {
    name: '5c',
    id: '791a13c0-3447-4e6f-876a-ff3af7313085',
    idMethod,
    puzzle,
    group: 'Pi  + X Perm',
    setup: '',
    algs: [
      { moves: "x' S z2 S y2 x' S", id: '68b39e3b-472d-4821-8ac1-d13669134b77' },
      { moves: "y' x r' R r' R' r' R r R' z' R r' R r", id: '48f11300-093c-4ac4-86c3-8b0d09f8ea2a' },
      { moves: "x r' R' r R' z2 r' R r R' b'", id: '7211d4cc-72e6-400a-925d-ad9d98e00659' },
      { moves: "y' x R r R' r R r' R' r z' r' R r", id: 'a4f887a5-62ba-44cb-b8aa-efb3716fb953' }
    ]
  },
  {
    name: '5d',
    id: '0506a575-62e8-4b15-a8ba-6ab9d46699fc',
    idMethod,
    puzzle,
    group: 'Pi  + X Perm',
    setup: '',
    algs: [
      { moves: "y z' S z2 S z2 x' H", id: '189da5dd-bc9a-4130-a330-529b1b8f9871' },
      { moves: "x r' R' r R' r' R r R' B R' B'", id: '3cfd834b-59e2-48b3-9305-7be7da4e6924' },
      { moves: "x z R r R' z' R r z' r' R' r B", id: '2b37bde5-b2b1-406c-8e25-b3d03fab9583' },
      { moves: "x R r' R r R r' R' r z r' R r' R'", id: 'b6c842a6-0896-4d72-8818-bfa8ef0d1642' }
    ]
  },
  {
    name: '6c',
    id: 'df4ab31d-1db6-4aed-b2c0-477b1fbfb7af',
    idMethod,
    puzzle,
    group: 'Pi  + X Perm',
    setup: '',
    algs: [
      { moves: "y' x B' r' R r R' z2 r' R r' R'", id: '40b12126-df2c-4151-9e67-de33c0f6f17f' },
      { moves: "x r' R r R' z' R' r' R r R B R' B'", id: '0ef9901d-dd7a-4f8f-aeca-98c0607d7dc0' },
      { moves: "y2 x B R B' R r' R' r R r' R r", id: 'ba1d94d5-7e13-47b1-b6f0-da9282d5071d' },
      { moves: "z S z2 y' S z2 S", id: '04f90e24-d2f0-4ddc-8ab4-adf7ad448c0a' }
    ]
  },
  {
    name: '6d',
    id: 'df055a28-fcc4-4916-b1c5-f8511aadbeaf',
    idMethod,
    puzzle,
    group: 'Pi  + X Perm',
    setup: '',
    algs: [
      { moves: "y x r B R' B' R r z' r' R r", id: '2e3dabc8-0d1c-4a5e-8ca2-1cb1e39e8828' },
      { moves: "x z R r' R' r R B R' B' R' r' R r", id: '6991596d-0539-4ef6-b49e-5e91fbb4a07b' },
      { moves: "x z r R' B r z' r2' R r B' R'", id: '31015c50-ae31-47cc-804c-c77406376f12' },
      { moves: "y2 x r' R' r z r' R r R' r2/r' R r' R'", id: '8e67e652-1e24-4bbe-8fcf-cfd893333fcf' }
    ]
  },
  {
    name: '7a',
    id: 'c5b55612-8e03-4a52-933a-93adb01217e8',
    idMethod,
    puzzle,
    group: 'Pi + Horizontal U Perm',
    setup: '',
    algs: [
      { moves: "y' x B r' R r' R' r B r'", id: '8a8fc517-6b73-412e-95b5-f85c7f88e960' },
      { moves: "z S S y2 x' S z2 S", id: '6c51d86c-e021-4ee4-a0b4-6a87a305b535' }
    ]
  },
  {
    name: '7b',
    id: 'f32b2138-0733-4bcc-9aa6-28fadc17c433',
    idMethod,
    puzzle,
    group: 'Pi + Horizontal U Perm',
    setup: '',
    algs: [
      { moves: "y2 x r' z R r' R r z r' B' r", id: '1d943984-e251-452e-b838-014fc2554e70' },
      { moves: "y x b' R r' R r R' b' R", id: '7166bf22-1b42-4c66-8585-b597653f9756' },
      { moves: "z S S y' S z2 S", id: 'f90fb8ec-43cf-4d50-8622-0806134b3418' }
    ]
  },
  {
    name: '7c',
    id: '3a40d2f0-1c53-4c9c-9a9b-5eff0d283968',
    idMethod,
    puzzle,
    group: 'Pi + Horizontal U Perm',
    setup: '',
    algs: [
      { moves: "y' x r B' r' R r R' r B'", id: '0737eff3-a7d0-4491-b709-7b39f0665ef1' },
      { moves: "z' S S z2 y' S z2 S", id: 'df566a71-b324-4df5-9535-237d431310b2' }
    ]
  },
  {
    name: '7d',
    id: '3b8f84c7-ccbb-49cb-a259-08ca178aec1c',
    idMethod,
    puzzle,
    group: 'Pi + Horizontal U Perm',
    setup: '',
    algs: [
      { moves: "y2 x B' r z R r' R' r z' B' r", id: '6e2a5cbb-ed23-4ae6-8c68-aa3638d537d9' },
      { moves: "y z' r' R r B' r' b B' l", id: '4efe66df-2b29-4f1b-81c1-bbaa22762a3f' },
      { moves: 'S S y S z2 S', id: 'd5ad1749-9d83-4739-a48a-b3af956e52e9' }
    ]
  },
  {
    name: '8a',
    id: '95629b5a-b91c-41c7-9630-a621cbc641c9',
    idMethod,
    puzzle,
    group: 'Pi + Horizontal U Perm',
    setup: '',
    algs: [
      { moves: "x R' r R' B b r' R r'", id: 'b6807b6f-e32e-43ea-8e1d-65e67647c79c' },
      { moves: "y2 x r' R r B R' B' R' r' R' r R'", id: '77b5e93f-3ef8-4e2a-a1e5-9b94a575cd7d' },
      { moves: "S z' S z' S", id: 'f1dc53c5-6ebc-474d-8bf2-d6453995da36' }
    ]
  },
  {
    name: '8b',
    id: '768ab936-3d80-451b-876d-661fe3132aae',
    idMethod,
    puzzle,
    group: 'Pi + Horizontal U Perm',
    setup: '',
    algs: [
      { moves: "x R' r B R' B' r2' R' r", id: '1de8f7fa-64be-4794-9f5a-2dd40a67548e' },
      { moves: "y x r' B R B' z' r' R r B'", id: 'b89e8c8e-2aaa-4106-abd4-8fafc27053c9' },
      { moves: "y' x B R' B r' R' r B R'", id: '1b8fe3a4-8ee7-4805-9ebe-17e1f034add5' },
      { moves: "y' x r' R r R z' r' R' r B r' R r", id: '1a48b584-7bce-4f25-a642-81be897bd9b8' }
    ]
  },
  {
    name: '8c',
    id: '95cf6c90-641e-4d69-89af-248e6b02eceb',
    idMethod,
    puzzle,
    group: 'Pi + Horizontal U Perm',
    setup: '',
    algs: [
      { moves: 'H z H z H', id: 'b4e9d1ab-691a-40a8-a0e5-2e8bf343fc2f' },
      { moves: "x r R' r b' B' R r' R", id: '4bea2833-bfd9-4953-9c3b-3b0fabc15528' },
      { moves: "y2 x R r' R' z' r' R r R z R r R' r", id: '74b43c56-896a-4d0f-b4d6-4b29db0d74d0' },
      { moves: 'S z H z S', id: '279d572e-bec6-486d-a9c7-feac8b5f85f5' }
    ]
  },
  {
    name: '8d',
    id: '1f2bad03-b9e6-410e-9231-75015cfaad6f',
    idMethod,
    puzzle,
    group: 'Pi + Horizontal U Perm',
    setup: '',
    algs: [
      { moves: 'H z S z H', id: '19d45c41-baf6-4fd4-bf94-c61b8d86538c' },
      { moves: "y x R B' r' R r z R' r R'", id: '2a7d12eb-ad0b-4059-9f19-eeb1199a80d5' },
      { moves: "x B r' R' r z B R' B' r", id: '804bbcac-1b50-4e9a-b935-fd633b4ce48c' },
      { moves: "y2 x r' R r' B R B' r' R", id: '899c6b0d-34f8-4e58-bd39-234346648a12' }
    ]
  },
  {
    name: '9a',
    id: '0c7f4aa3-b1e8-4d68-82a9-acf494445ca9',
    idMethod,
    puzzle,
    group: 'Pi + Vertical U Perm',
    setup: '',
    algs: [
      { moves: "y' x B' r' R r R B' R' r' R' r B'", id: '782c9453-6050-45eb-8cb3-bdcf44d378ce' },
      { moves: "y' x R r R' r B r' z' r' R r R' b", id: '19cb0dbc-1fa6-4249-a316-f4ddc8d65da5' },
      { moves: "y' r' R r B' R B r' R' r R'", id: '1b964fa0-ab19-4df9-b987-bed569bc5324' },
      { moves: "r' l r l' r' R' F r' R r", id: '8bd6c84a-eb32-4879-8507-0fe972885eca' }
    ]
  },
  {
    name: '9b',
    id: 'd4cdf500-1436-41a2-af0a-0f249097687c',
    idMethod,
    puzzle,
    group: 'Pi + Vertical U Perm',
    setup: '',
    algs: [
      { moves: "S z2 S z' S S", id: '13bb3fae-de34-4815-bb57-74a9e69c0a69' },
      { moves: "y' x B r' R r z R r' R' r R' r'", id: '6c9b2876-9d2e-43d5-bb6d-48a5567d123a' },
      { moves: "x z r B R' B' z' r' R' r B", id: '93b15eb0-2059-4694-b62c-05dbaf694470' },
      { moves: "y2 x r' B R' B' r' R r R' r R", id: 'd34b1422-b399-46ce-9602-9bb784c93a38' }
    ]
  },
  {
    name: '10a',
    id: 'c5d8bd72-3ac7-4dfd-91aa-e65a71b19fb9',
    idMethod,
    puzzle,
    group: 'Pi + Vertical U Perm',
    setup: '',
    algs: [
      { moves: "x z r B r B' r' B'", id: '0ab38923-f88d-43fd-aec1-881085f59604' },
      { moves: "y' z' B R r R' B' R'", id: '1bad3b6b-986c-44b7-bd59-980d8a15028f' },
      { moves: 'S z2 H', id: 'a45e79f3-7bea-4c05-bcf1-76da7e53d370' }
    ]
  },
  {
    name: '10b',
    id: '69fabc78-0fce-4543-a5dd-8f2c063b323a',
    idMethod,
    puzzle,
    group: 'Pi + Vertical U Perm',
    setup: '',
    algs: [
      { moves: "x B' r' B' r B r", id: '7f970748-d6e0-4d88-bfcd-2cd898c21f45' },
      { moves: "x B' r' y' r' R r b", id: '2506f0a5-c7d7-4bd5-a3e0-8b58f09ffef8' },
      { moves: 'z2 H z2 S', id: 'e1b87557-abe0-4936-9e39-5a432d4cd938' }
    ]
  },
  {
    name: '11a',
    id: 'd9d58281-6a06-46b3-ae5c-fde3654f7f72',
    idMethod,
    puzzle,
    group: 'Pi + O Perm',
    setup: '',
    algs: [
      { moves: "y' x R r' R' r' R r R' z' r' R r", id: 'c9eebb0b-7166-4e3c-a617-ca1611275dcc' },
      { moves: "z2 H z' S z2 S", id: '59b6c831-8d11-41d5-a73d-26804c456828' }
    ]
  },
  {
    name: '11b',
    id: 'c50846ba-c2b6-4d49-a600-8a56cd4810d8',
    idMethod,
    puzzle,
    group: 'Pi + O Perm',
    setup: '',
    algs: [
      { moves: "x r' R r R r' R' r z R r' R'", id: '85ff25ec-589a-47de-ace0-e570858974da' },
      { moves: 'z S z S z2 S', id: 'd69277cf-7943-4932-ad20-4e7340975601' }
    ]
  },
  {
    name: '12a',
    id: 'a6d8af30-5ed6-470b-8a8c-de2f398bd9fa',
    idMethod,
    puzzle,
    group: 'Pi + O Perm',
    setup: '',
    algs: [
      { moves: "z S z' x' S z2 S", id: 'a71ed84b-ca27-4005-9479-f4797600a624' },
      { moves: "y' x r' R' r z R r' R' r R r R'", id: 'decd0a63-0067-4431-87ad-c0425352f367' },
      { moves: "y' x r' R' r B' R z R r R' r' R", id: '6a773b36-721e-42e8-accd-b5f20cb9d647' },
      { moves: "y2 x R r' R' r b r' R r R' z' R r' R'", id: '077edb20-4795-4816-b5de-959c7860b987' }
    ]
  },
  {
    name: '12b',
    id: '9d1e08b7-1fa2-4d75-8346-d197e7df4aa8',
    idMethod,
    puzzle,
    group: 'Pi + O Perm',
    setup: '',
    algs: [
      { moves: 'z2 H z x S z2 S', id: '472cdb9f-33da-4b64-b3ae-49b461f9f6d3' },
      { moves: "y x B R B' r' R r R' r' R' r", id: '69c88b6b-c395-4207-9c25-59305609e886' },
      { moves: "y2 x R r' z r R r R' z2 r' R r", id: '6b7a57e0-d64f-47bf-8328-d6ed785dcefa' },
      { moves: "z S z2 S z' H", id: '937b6f16-d745-4c4a-ae17-f90b4e09ef23' }
    ]
  },
  {
    name: '11c',
    id: 'e5067d5d-096c-4ecd-ad14-738597443c9d',
    idMethod,
    puzzle,
    group: 'Pi + O Perm',
    setup: '',
    algs: [
      { moves: "y x r R' r B r' R B", id: '2b7e4dab-d117-422e-8d0b-2a6769ccf777' },
      { moves: "y x r2' R' r B r' R B", id: 'ab9a48df-1a24-47ff-9aad-0b7c3de39e7f' },
      { moves: "z2 S z' S z2 S", id: 'b3d4db34-01c2-4676-83d4-d3a929e54283' }
    ]
  },
  {
    name: '11d',
    id: '3edbbcc4-2d31-417c-997c-e90b7d28c46b',
    idMethod,
    puzzle,
    group: 'Pi + O Perm',
    setup: '',
    algs: [
      { moves: 'z H z H z2 H', id: '50f43b56-bd99-4e79-8019-ff8ccb98f5e0' },
      { moves: "y2 x R' r R' z' r' B R' r'", id: 'ae3b69aa-b751-44a9-a40c-7cf51a79dc11' },
      { moves: 'z H z S z2 S', id: '98f07f60-c259-44dd-91da-793282794e12' }
    ]
  },
  {
    name: '12c',
    id: '91b3331e-ed0b-4983-b77e-c0c487cc0b37',
    idMethod,
    puzzle,
    group: 'Pi + O Perm',
    setup: '',
    algs: [
      { moves: "z H y' z' S z2 S", id: '9c7647e9-84e1-4de3-94b1-09d79ae0ea75' },
      { moves: "x B' R' r B' r' R r'", id: 'dafdd28c-42e7-4bae-b934-804c04f4a398' },
      { moves: 'z2 S z2 S z H', id: '5886fc7e-23fc-4434-8df1-d5c5db2d1b10' }
    ]
  },
  {
    name: '12d',
    id: '5b9e2ff6-ff0c-45a8-a566-436b17269480',
    idMethod,
    puzzle,
    group: 'Pi + O Perm',
    setup: '',
    algs: [
      { moves: "z2 S x y' S z2 S", id: '9876dda3-5bbf-4bbc-9c9a-545b15f8b8f3' },
      { moves: "x r R B' r B R' B", id: '77bd2629-5541-4e49-9ae3-7a0c66b890a4' },
      { moves: 'z S z2 S z S', id: 'd00c2690-7b58-4fab-87c3-a2ad9d14a2c2' }
    ]
  },
  {
    name: '13a',
    id: '6255b0a2-bbbc-4fd7-9ebb-dd54c1d0f797',
    idMethod,
    puzzle,
    group: 'Pi + Z Perm Conjugates',
    setup: '',
    algs: [
      { moves: "y x r' R' r' R' z' r' R r R B'", id: '76a4a0a3-643c-4040-97d4-bdf3d3fb9b11' },
      { moves: "y x r' R' r B' r' R r B", id: '2e9dc1bc-72dc-44f2-9341-54062ff3b955' },
      { moves: "H x' y S z2 S", id: '5fd69356-2b17-43bc-868b-6c0b7de4af23' }
    ]
  },
  {
    name: '13b',
    id: '2877f095-3742-4cf0-8a3e-d39938e6f6c8',
    idMethod,
    puzzle,
    group: 'Pi + Z Perm Conjugates',
    setup: '',
    algs: [
      { moves: "y' x B R B' r B R' B' r'", id: '1f0e17c8-21b6-4841-b600-5a312d359286' },
      { moves: "y' r B r' R r B' r' R'", id: 'c7fdcf34-7049-41be-944c-50b837217516' },
      { moves: "z' S x' y S z2 S", id: '937fbae2-dc4d-4be4-9000-62a9f53729f1' }
    ]
  },
  {
    name: '13c',
    id: '51a95220-1dd8-4472-bfa5-ade5d89bff55',
    idMethod,
    puzzle,
    group: 'Pi + Z Perm Conjugates',
    setup: '',
    algs: [
      { moves: "x r B R B' r' B R' B'", id: '3ac3564c-a296-4075-a462-0506ef95ac5f' },
      { moves: "H x' y S z2 S", id: '7f52d566-b571-40a1-9f01-f1c3607d62ca' }
    ]
  },
  {
    name: '13d',
    id: '97894706-a9a0-4769-81b4-72c92a3418ad',
    idMethod,
    puzzle,
    group: 'Pi + Z Perm Conjugates',
    setup: '',
    algs: [
      { moves: "x B' r' R' r B r' R r", id: 'f4dfb623-d3dc-4d93-8948-b8f02cc48a35' },
      { moves: "z' S x' y S z2 S", id: 'd0ee2fa7-fd24-4e4b-a9bc-c0c3507e7159' }
    ]
  },
  {
    name: '14a',
    id: '20ba9f8e-615a-4048-b1ff-3b51a17c8e95',
    idMethod,
    puzzle,
    group: 'Pi + Z Perm Conjugates',
    setup: '',
    algs: [
      { moves: "z' H z' S z S", id: '86813bd5-602e-49fe-8cd5-ca81ecb1dc74' },
      { moves: "x R' r' R' r R r' R' r R r' R r", id: 'f0afcfaa-830d-4201-a282-69ed8e4ae9a2' },
      { moves: "x z R' r' R r B' r' R' r B R", id: 'cd5872ac-d2e7-4ded-9b90-e5a6a5565e0e' },
      { moves: "y x r R r R' r' R r' R' r R r' R'", id: '43cb5781-faea-48e9-acf3-46a3d4e66556' }
    ]
  },
  {
    name: '14b',
    id: '0efdb819-e40c-494c-a0b0-9d12bbfa8fcd',
    idMethod,
    puzzle,
    group: 'Pi + Z Perm Conjugates',
    setup: '',
    algs: [
      { moves: "z H z' H z S", id: '4f43a1b4-2275-4dc9-8ae4-d48e556e1721' },
      { moves: "y x R' B' r' R r B r' R' r R", id: '48a09f76-e9bb-4517-ad5d-294807201d01' },
      { moves: "y2 x B R' B' r' R r R' z' R r' R' r B", id: '9a5da602-1106-4080-bdf9-ab6b7bb18916' },
      { moves: "z S z' H z H", id: 'f31e9a18-7b9a-4803-bacc-296ba22c67de' }
    ]
  },
  {
    name: '14c',
    id: 'c8529d89-7717-489f-8d10-94a286175c6f',
    idMethod,
    puzzle,
    group: 'Pi + Z Perm Conjugates',
    setup: '',
    algs: [
      { moves: "z' S z H z' H", id: 'e853ab88-533b-4275-97de-7ab4a2249fac' },
      { moves: "y2 x r R r R' r' R' r R r R' r' R r", id: 'fde245e0-48ba-4b1e-b252-100462d09818' },
      { moves: "y2 x R' r' R r' R' r R r' R r R' r", id: 'be15c27d-a0aa-4c51-b33e-260a7495e400' },
      { moves: "y z r' R' r R r' R' r' R r R' r R", id: '6fd941fe-ba70-49df-a07a-2945a448eabf' }
    ]
  },
  {
    name: '14d',
    id: '40867914-2875-4440-8627-020ac668f660',
    idMethod,
    puzzle,
    group: 'Pi + Z Perm Conjugates',
    setup: '',
    algs: [
      { moves: "z S z S z' H", id: 'ddd2293a-d065-4f03-8267-8d1f6b1f13f1' },
      { moves: "z H z S z' S", id: 'dcae166a-89da-4175-9f3b-880ba70e4a6b' },
      { moves: "y' x R r R' B R B' R r2' R r", id: '38836af6-c93f-4a79-aaad-1a5a6768eb17' },
      { moves: "x R r R' r R r' R' r R r' R' r'", id: '93c6e551-e255-474f-97d6-b0404eba11e9' }
    ]
  },
  {
    name: '15a',
    id: '3e73ef47-edd3-4a34-b13d-7758a43d0198',
    idMethod,
    puzzle,
    group: 'Pi + Triple Sledge',
    setup: '',
    algs: [
      { moves: 'S S y S S S', id: '7fbe21ce-97e0-4561-a58c-8442341ef696' },
      { moves: "x r' R r R r' z' r' R r z r R r'", id: 'cfa57d53-a9cc-43eb-a00b-beb508b5de0c' },
      { moves: "x R r' R' r' R B R' B' R' r' R", id: 'f6576e2d-056c-4b85-b22f-4b2218c917ae' },
      { moves: "y2 x R r R' B' R r' R' r R r R' B'", id: '1b170618-4e14-4ca2-abb3-0589d329d341' }
    ]
  },
  {
    name: '15b',
    id: '9d39b31a-fba6-46bd-9f8d-2c327f952681',
    idMethod,
    puzzle,
    group: 'Pi + Triple Sledge',
    setup: '',
    algs: [
      { moves: "y' S S y' S S S", id: '8f376732-7895-4c35-82da-a3338bc5a0a2' },
      { moves: "x r R' r' z' r' R' r z r R' r' R' r", id: '24a1a974-7b25-4b53-be52-3c97186574b8' },
      { moves: "x R' r' R r z r b r' R r R' z' R r' R", id: 'e4246800-e456-4b0f-9b8d-031a90ee122a' },
      { moves: "y2 x b' r' R r R r' R' r b' r' R r", id: 'c53af344-053a-4680-992b-ee26b995ba13' }
    ]
  },
  {
    name: '16',
    id: '753d2fe1-4a74-4665-9a8b-da04ddbb4eb1',
    idMethod,
    puzzle,
    group: 'Pi + H or Z Perm',
    setup: '',
    algs: [
      { moves: "z' S z2 S z2 S", id: '2d615c53-3cb4-46c0-9d27-9a2e1d56085d' },
      { moves: 'z S z2 S z2 H', id: 'e9cc7d75-99cf-4f8f-b95e-d1db56482b83' },
      { moves: "x r B R B' r2' R r R", id: 'f9e76d83-1183-4c01-b86e-45b45f8f82f8' },
      { moves: "y2 x R' r' R' r' B R' B' r'", id: '5d75b09e-d525-460b-9b2f-4734f0c69478' }
    ]
  },
  {
    name: '17a',
    id: 'b15a2c56-738a-4c5a-95d5-7743b9c5ab4c',
    idMethod,
    puzzle,
    group: 'Pi + H or Z Perm',
    setup: '',
    algs: [
      { moves: "z S z' H z H z' S z H", id: 'e8d6f2a4-d021-4e9b-9395-84369a1f9214' },
      { moves: "y2 x r' R' r R B R' B' r' R r", id: '001e12a5-bf6d-4efd-b13d-c7f6d348afef' },
      { moves: "x r' R' r B R B' R' r' R r", id: 'd0bf105f-7ea4-409b-8be8-0d2b1367c9ff' }
    ]
  },
  {
    name: '17b',
    id: '6e3bdf90-69f3-4a33-a8d1-1f637299ab33',
    idMethod,
    puzzle,
    group: 'Pi + H or Z Perm',
    setup: '',
    algs: [
      { moves: "z S z H z' H z S z' H", id: 'cea4e14d-6b9e-4e06-a381-ae9eb7e58786' },
      { moves: "y2 x R r R' r' z' r' R r z R r' R'", id: 'af57446c-a12f-4f46-8dc6-5b527f284571' },
      { moves: "y x R r2' R' r B r' R r' R' r B", id: '3d6e7865-ea90-4604-b12c-7fe17eb93be5' },
      { moves: "x R r R' z' r' R' r R z R r' R'", id: '3d0f6853-a460-4ef4-8da4-d4a1167d7e87' }
    ]
  },
  {
    name: '18a',
    id: '74713dcb-320f-4251-8162-e0c0b61a4e22',
    idMethod,
    puzzle,
    group: 'Peanut + Swirl Perm',
    setup: '',
    algs: [
      { moves: "H z H z' H z H", id: '7d39bce5-5dc3-403a-a55d-bc4c3837e5b5' },
      { moves: "S z' H x y S z2 S", id: 'd07cec34-e86b-47bb-82a3-60db66362566' },
      { moves: 'z2 H z H x S z2 S', id: '36360f82-46fd-47c2-bfd6-b60ba214f879' },
      { moves: "y x b' r' R r R' z' R r' R' r'", id: '57bc39d3-6dc0-4d05-b082-78a2a58f8d20' }
    ]
  },
  {
    name: '18b',
    id: '34740d7a-cf35-43b7-bee4-23eceefb2720',
    idMethod,
    puzzle,
    group: 'Peanut + Swirl Perm',
    setup: '',
    algs: [
      { moves: "z' S z' S z S z' S", id: 'a83cd16d-ef94-471b-9817-0d07b02b189e' },
      { moves: "z' H z S x' y S z2 S", id: '07d5aa17-0a7d-4def-8ce1-ad3b326efa0f' },
      { moves: "z S z' S y' S z2 S", id: '0095fab1-ce5c-47a2-99c3-0e19219e6849' },
      { moves: "x r R r R' z R r' R' r b", id: '9c5ed02d-717b-4a87-9df4-4aebf7f51ade' }
    ]
  },
  {
    name: '18c',
    id: '64658a02-9330-4f0f-ac60-a24fea5c9025',
    idMethod,
    puzzle,
    group: 'Peanut + Swirl Perm',
    setup: '',
    algs: [
      { moves: "z2 S z' H z S z' H", id: 'c0489f3e-7769-4215-9ea1-9d8a042f2b3d' },
      { moves: "S z' H x y S z2 S", id: 'd34a96d5-31a5-4416-8164-f38f5babb487' },
      { moves: 'z2 H z H x S z2 S', id: 'd92f2fbf-3ecf-4db9-b09a-e3a6ceb5c1ee' },
      { moves: "x R r' R r z R r' R' r'", id: 'bd39cd0f-21c4-4dee-8841-fd946f00c8b9' }
    ]
  },
  {
    name: '18d',
    id: '9312da6a-dc20-4efd-b52b-839ca364024f',
    idMethod,
    puzzle,
    group: 'Peanut + Swirl Perm',
    setup: '',
    algs: [
      { moves: "z H z S z' H z S", id: 'a430490b-ded2-4074-beb4-e7f555333ed8' },
      { moves: "z' H z S y S z2 S", id: 'af13f603-6776-4317-b5fd-07b368fa8c47' },
      { moves: "z S z' S x' y S z2 S", id: '3517e36a-f27a-4298-a406-2bb177d71fda' },
      { moves: "x z r' R r' R' z' r' R r R", id: '251fe247-e5cc-44b0-ace5-2e14d6682d5c' }
    ]
  },
  {
    name: '18e',
    id: 'a11a5e09-0090-47ed-9406-757396ccdb0b',
    idMethod,
    puzzle,
    group: 'Peanut + Swirl Perm',
    setup: '',
    algs: [
      { moves: "y' x B r' R r R' z R r' R r", id: 'bcec83fd-4bc2-4e52-97d4-0bbcb6ddaa27' },
      { moves: "S z S z' S z S", id: '423e6807-3278-45e8-b660-5f3ef825c138' },
      { moves: 'z2 S z S y S z2 S', id: '214e06fe-81f2-4173-a7da-f46ffc2639ab' },
      { moves: "H z' S x y S z2 S", id: '2707e36e-d08e-4e60-8820-cf95201e01a2' }
    ]
  },
  {
    name: '18f',
    id: '25f82118-bf39-4278-9135-f9f52bbbf117',
    idMethod,
    puzzle,
    group: 'Peanut + Swirl Perm',
    setup: '',
    algs: [
      { moves: "z' H z' H z H z' H", id: '53250f92-bff9-4f14-bfb6-23abaca94604' },
      { moves: "z H z' H y' S z2 S", id: '7f035f22-979b-4ff7-8638-878eafb901b1' },
      { moves: "z' S z H x' y S z2 S", id: 'ad53236b-21de-4032-8c26-78c186639266' },
      { moves: "y2 x B r' R r R' z R r' R' r R'", id: '014e27e5-7ab3-4ad9-a50c-c7052ff3062e' }
    ]
  },
  {
    name: '18g',
    id: '5728a005-b6d8-4567-bc70-1d43225172fc',
    idMethod,
    puzzle,
    group: 'Peanut + Swirl Perm',
    setup: '',
    algs: [
      { moves: "z2 H z' S z H z' S", id: 'ee9eebf3-369b-4559-9cc0-b63f74ca05bf' },
      { moves: "H z' S y' S z2 S", id: '600a483a-62c9-429c-8056-19c5633ea4d5' },
      { moves: "z2 S z' S x' y S z2 S", id: '43f72722-7901-4f36-bb5e-cd37e9805b57' },
      { moves: "x R' r' R' r z R r R' r", id: 'e1b3f613-69f8-4e20-996c-4c87c8963fa1' }
    ]
  },
  {
    name: '18h',
    id: '20a6a07b-7da5-4fa8-b128-b0cd9c0800e7',
    idMethod,
    puzzle,
    group: 'Peanut + Swirl Perm',
    setup: '',
    algs: [
      { moves: "z S z H z' S z H", id: '2d6fba32-dc23-47a8-b511-b8c82441342a' },
      { moves: "z H z' H x' y S z2 S", id: '8e407d0e-27b8-4079-91fc-1015518c888a' },
      { moves: "z' S z H y S z2 S", id: 'cf083a34-deff-450c-a518-903c7762e88f' },
      { moves: "x z r R r R' z' r' R' r R'", id: '723d641c-2f84-409c-bdb6-1298f9a2d4ee' }
    ]
  },
  {
    name: '19a',
    id: '05ab4928-54a5-4191-ae35-87a0a0650a7d',
    idMethod,
    puzzle,
    group: 'Peanut + Wat Perm',
    setup: '',
    algs: [
      { moves: "z' H z S y' S z2 S", id: 'd7682444-fd3d-4df2-ae74-710d924fe800' },
      { moves: "y' x r R r R' B R' B' R' r R'", id: '73e04074-b44f-4f74-b399-5ba4ab4e9a1d' },
      { moves: "z2 S z2 S z' H z' H", id: 'ed5dd6cf-4bb2-47c0-8d3f-61ee662e2660' },
      { moves: 'S z S z S z2 S', id: 'a46942ca-13b9-4dbf-aa94-dbb59c5c679e' }
    ]
  },
  {
    name: '19b',
    id: '10702bb0-6591-4a4b-bf43-0b0a8099a705',
    idMethod,
    puzzle,
    group: 'Peanut + Wat Perm',
    setup: '',
    algs: [
      { moves: "S z' H y S z2 S", id: '26ef7d7b-1875-4bbd-ab88-da6bce7c920c' },
      { moves: 'z S z2 S z S z S', id: 'cc1f36a6-8442-4a27-91a9-0475ff9a580e' },
      { moves: "z' H z' H z' S z2 S", id: '0cb9201b-8494-4a86-b5b6-fe6607e0eee3' },
      { moves: "y2 x r' R r z R r R' z R r' R' r b", id: '1b3803ac-fba8-442e-a8b6-262e72cb4fe4' }
    ]
  },
  {
    name: '19c',
    id: '20c0e4ed-c15e-4115-9e4b-3ef1388a54de',
    idMethod,
    puzzle,
    group: 'Peanut + Wat Perm',
    setup: '',
    algs: [
      { moves: "z S z' S y S z2 S", id: '6ab15ea6-9cb8-4517-b852-f3921e94c093' },
      { moves: 'z2 S z2 S z S z H', id: 'e9309dd8-9853-4874-a511-9fd0f3893a4b' },
      { moves: "S z' H z' S z2 S", id: '03e08a50-e6c1-4c7e-a89e-3e4ca12c6dd4' },
      { moves: "x r2' R r R' z' r' R r", id: '3b35e852-e0e5-4917-b2b8-ebc5af76a90a' }
    ]
  },
  {
    name: '19d',
    id: 'bfd9df1c-b529-4109-9a09-3c414b36518a',
    idMethod,
    puzzle,
    group: 'Peanut + Wat Perm',
    setup: '',
    algs: [
      { moves: "z2 H z' H y' S z2 S", id: '5042394c-036f-4b76-acb9-0f64bb1827c9' },
      { moves: "z S z2 S z' H z' S", id: 'ece1f93b-e423-4b3e-9b75-c03be3cfa5a8' },
      { moves: "z' H z S z S z2 S", id: '53d881e5-2a6f-45b4-ae29-042259b37bf9' },
      { moves: "x R r R' z' r' R r R", id: '3ea0c1a6-a6e4-4c52-b127-873dc6bb73be' }
    ]
  },
  {
    name: '19e',
    id: 'f24ad427-953e-48dd-851b-a34f88ce260c',
    idMethod,
    puzzle,
    group: 'Peanut + Wat Perm',
    setup: '',
    algs: [
      { moves: "z2 S z2 S z' S z' S", id: 'ec21cb98-adac-4a80-8386-9164ce0eafce' },
      { moves: 'H z H z S z2 S', id: 'fd22eee2-4dcf-4ef4-ab24-0056cd891e7c' },
      { moves: "y x B' R r R' r' R r R' B' r", id: '1bf91197-c32e-4b4d-b0fe-ca90351c91de' },
      { moves: "y2 x b r' R' r z2 r' R r b'", id: '74f43ef0-fc27-42ce-bb10-95f59b92d558' }
    ]
  },
  {
    name: '19f',
    id: '96072546-12d9-4da8-8a11-fd3687af7090',
    idMethod,
    puzzle,
    group: 'Peanut + Wat Perm',
    setup: '',
    algs: [
      { moves: 'z S z2 S z H z H', id: 'ac510c4b-3a72-4b3b-8694-76fbd9ba12a3' },
      { moves: "S z' S z' S z2 S", id: 'e4245de0-e9be-4589-91fc-d0def5c3bd39' },
      { moves: "y r' R r b' B z' R' r' R", id: '631e19da-d726-41c7-a3ac-b9191d8c45dc' },
      { moves: "x z' B' R r R' z2 R r' R' B", id: '07f5d188-2920-48f9-9faf-998d33906743' }
    ]
  },
  {
    name: '19g',
    id: '14080a28-6e7c-43b3-9882-51632b067f00',
    idMethod,
    puzzle,
    group: 'Peanut + Wat Perm',
    setup: '',
    algs: [
      { moves: 'z2 S z2 S z H z S', id: 'aa78ecf3-e46d-49f4-acc9-ee3576727eca' },
      { moves: "H z S z' S z2 S", id: 'b8f72554-682a-4c1a-8e19-8aeb4a01234d' },
      { moves: "x z R' r' R r z r R r R' r", id: '0583753e-79cd-446c-b02c-e03528e93617' },
      { moves: "x r' R r' R' r' z' r' R' r R", id: '9de2b5f5-6557-4a12-9ad6-65154b5a3567' }
    ]
  },
  {
    name: '19h',
    id: 'f277e821-47bd-4b86-8dbf-408206ca5e92',
    idMethod,
    puzzle,
    group: 'Peanut + Wat Perm',
    setup: '',
    algs: [
      { moves: "z S z2 S z' S z' H", id: '74d3fe1f-a524-454b-9977-dd017c016cd8' },
      { moves: 'S z H z S z2 S', id: '2f35399f-46a5-4841-8099-a9ce91bf89b9' },
      { moves: "x r R r' R' z' R' r' R' r R'", id: '127ff22d-ce0e-48bf-b945-83a6c86aae55' },
      { moves: "y' x R r' R r R z R r R' r'", id: '3910ad46-cdfe-4472-8436-0a93d6899aef' }
    ]
  },
  {
    name: '20a',
    id: '443e332e-94ed-4c46-9da1-4add44c618f9',
    idMethod,
    puzzle,
    group: 'Peanut + X Perm',
    setup: '',
    algs: [{ moves: "z S z' S", id: 'e493186d-9766-4a93-8e51-d702ff2f0462' }]
  },
  {
    name: '20b',
    id: '5403d19c-0126-4468-b8df-c5f985544463',
    idMethod,
    puzzle,
    group: 'Peanut + X Perm',
    setup: '',
    algs: [{ moves: 'S z S', id: '6613ab2b-118a-4e2b-bbbf-12af9a1074f9' }]
  },
  {
    name: '20c',
    id: '1733fa9b-7eaa-402d-9254-83c9ead0569b',
    idMethod,
    puzzle,
    group: 'Peanut + X Perm',
    setup: '',
    algs: [{ moves: 'z2 H z H', id: 'dd1d9dda-dea4-43f9-98cc-c43310a56527' }]
  },
  {
    name: '20d',
    id: '94dd0c90-1d37-4133-8770-d9033b48f888',
    idMethod,
    puzzle,
    group: 'Peanut + X Perm',
    setup: '',
    algs: [
      { moves: "y r' B r' R r R' r2 B", id: '47a40778-b37e-43b8-9bff-c8fc10eaba0a' },
      { moves: "z' H z' H", id: 'f8f0d9e5-a436-4b99-90b2-e81b9d4c7faa' }
    ]
  },
  {
    name: '20e',
    id: 'dcca3910-5344-4aaf-b281-bea97c4f5919',
    idMethod,
    puzzle,
    group: 'Peanut + X Perm',
    setup: '',
    algs: [
      { moves: "y2 x B' R r' R' r z r' R r", id: 'c6ce10a2-2f04-420b-acf7-2a7beab344b1' },
      { moves: "S z' H", id: 'f92c3159-01e0-4cfe-b4e0-17848934ac4a' }
    ]
  },
  {
    name: '20f',
    id: '89ccf274-c42c-48c4-8f5b-8eec7a679842',
    idMethod,
    puzzle,
    group: 'Peanut + X Perm',
    setup: '',
    algs: [
      { moves: "y' x r' R' r z' r' R r R' B", id: '70872a68-49bf-4688-9ca6-929534486e9f' },
      { moves: 'z S z H', id: '67b98591-0a77-4b8f-a136-87dc7e72d086' }
    ]
  },
  {
    name: '20g',
    id: 'd1fc4231-a18c-4fcb-a225-879d9dd0c4d9',
    idMethod,
    puzzle,
    group: 'Peanut + X Perm',
    setup: '',
    algs: [
      { moves: "x y b r' R r R' z' R r' R'", id: '46ce4d20-05ff-4d4b-a989-53b63d75cf74' },
      { moves: "y x R' r' R r R' z' R r' R' r B", id: '99f29720-1e1c-4d38-8ea3-ac38e0e141fa' },
      { moves: "z' H z S", id: 'ccb4973c-09f7-48bf-8a1f-4e6b7a59f19c' }
    ]
  },
  {
    name: '20h',
    id: '64a5463b-5ba6-4dc3-847d-81e5ec63bd20',
    idMethod,
    puzzle,
    group: 'Peanut + X Perm',
    setup: '',
    algs: [
      { moves: "x R r R' z R r' R' r b'", id: '04fc5f9f-4f33-4fdf-8725-f498add0f1df' },
      { moves: "x B' r' R r R' z R r' R' r R", id: '5bcd7ddb-f171-4771-9a60-5ee4a49c235e' },
      { moves: "z2 H z' S", id: '1ce5c1a6-e15d-413c-bbb6-d19f2f139089' }
    ]
  },
  {
    name: '21a',
    id: '13c18fbc-f6ce-403a-87aa-b74866f2fc41',
    idMethod,
    puzzle,
    group: 'Peanut + Horizontal U Perm',
    setup: '',
    algs: [
      { moves: "y x b' r' R r R z' r' B' r B r'", id: '2ad243b9-061d-4850-9c01-574e38c34fa9' },
      { moves: "y' x R r' R' z' r' R r z r R r' R' r' R r R'", id: '08654aab-cfbc-40c9-bbef-5a7ba6d1f7fb' },
      { moves: 'z H z H z S', id: '0a84f28c-3f5e-4d7a-8b8d-938dbf0cbc1f' }
    ]
  },
  {
    name: '21b',
    id: '322e07c1-e338-4c4d-bb7d-f25b5bc1f514',
    idMethod,
    puzzle,
    group: 'Peanut + Horizontal U Perm',
    setup: '',
    algs: [
      { moves: "y' x R r R' z R r' R' r z' r2' R r R'", id: 'f4d89ad6-f1da-4bf7-98db-1cca4857a604' },
      { moves: "x z R r R r' R' r' z' r' R r B'", id: '8aab6e5d-bbbf-4d81-bab3-c8c28fe112d0' },
      { moves: "y2 x B r' R r R z R r R' B R' B'", id: 'ee36b728-3e67-4e1f-9c86-5307a56f9246' },
      { moves: "z H z' S z' S", id: '512b8911-6f85-4610-a367-8d785b1a5ebc' }
    ]
  },
  {
    name: '21c',
    id: '62539cca-f54b-4e28-9a93-4d5ad400d957',
    idMethod,
    puzzle,
    group: 'Peanut + Horizontal U Perm',
    setup: '',
    algs: [
      { moves: "x B' r R' r' B r R r'", id: 'd052fff7-d8ba-49e4-a721-5bf6855afee8' },
      { moves: "x B' r' B r B' z r' R' r z' r'", id: '4c7d9080-6614-47ff-9018-b2c46de2d182' },
      { moves: "x r' R z R r' z' r' R' r' R' r R' B", id: 'e4975bcd-c4e3-4c08-a5e6-48b04b6ddf6e' },
      { moves: "z2 S z' S z' H", id: '26e31009-2118-4ffb-90ee-7eea1fbcd93d' }
    ]
  },
  {
    name: '21d',
    id: 'b5544b4c-406e-4e92-ae76-c8ff22b8fd91',
    idMethod,
    puzzle,
    group: 'Peanut + Horizontal U Perm',
    setup: '',
    algs: [
      { moves: "x r' R' r' R r R B R' B' r", id: '381b3441-d447-40b5-8c65-d2e95f9baa47' },
      { moves: "x r' R' r z' r' R r R' z R' r' R' r", id: '6a4d54b0-07a5-4214-b00d-008b646dc689' },
      { moves: "y x b' R r' R' r' z' r' R' r z' r' R r", id: '1d428d86-1136-4b23-9b7f-d9e804a11334' },
      { moves: "y2 x r R' r' B' r R r' B", id: '3d3c50d6-1437-4f8b-b2e9-463873ca3c6e' }
    ]
  },
  {
    name: '21e',
    id: 'c266fa37-859a-43bc-bf8a-69135a0843ad',
    idMethod,
    puzzle,
    group: 'Peanut + Horizontal U Perm',
    setup: '',
    algs: [
      { moves: "y x R' r R' r' z' r' R' r z r R'", id: '093b38dd-3188-4bac-8729-4d7e76c34f78' },
      { moves: "y2 x R r R' B R B' r' R r R r'", id: '3f41af5b-903d-4eb0-86b9-37b3aa787c3f' },
      { moves: "y2 x R r R' r' R' z' r' R' r B R", id: '54d9e95e-e36f-4368-a281-aacdc9504fe3' },
      { moves: "z' S z' H z' H", id: '74d85584-b0ac-460b-b0fe-f3aebff80c4a' }
    ]
  },
  {
    name: '21f',
    id: '1298763f-a811-4a03-8333-c2ee9042c577',
    idMethod,
    puzzle,
    group: 'Peanut + Horizontal U Perm',
    setup: '',
    algs: [
      { moves: "y' x R r' z' r' R r z r R r' R", id: '1c1c80fd-f6d9-4627-8ba1-6ce1d6908611' },
      { moves: "x r' R' z' r' R r z R r R r' R'", id: '976b20fd-4631-4ce6-b2c9-18b90baf1580' },
      { moves: "z' S z S z H", id: '680e8fa5-0524-46a1-b401-f315e6739cae' }
    ]
  },
  {
    name: '21g',
    id: 'ab96f93b-bc76-48ce-8f93-d9e0e3cd8bcf',
    idMethod,
    puzzle,
    group: 'Peanut + Horizontal U Perm',
    setup: '',
    algs: [
      { moves: "x R' B' R r' y' r' R' z' R r R'", id: '5dea00d2-02b4-4c3f-90d1-9d0f84667706' },
      { moves: "x R' r' R' r B R' B' R r' R' r", id: '18ca1037-e00f-40c0-a83a-7d77f9236611' },
      { moves: "y2 x r R' r z r R r R' r' z' r", id: '129755c9-7f2f-4687-a470-4398937209e8' },
      { moves: "x z B r' R r R r' R' r B r' R' r B", id: 'de664c12-bad9-4592-98ec-f2ab40317c03' }
    ]
  },
  {
    name: '21h',
    id: '7c2b0874-573d-4db3-bb45-8cf093213ebb',
    idMethod,
    puzzle,
    group: 'Peanut + Horizontal U Perm',
    setup: '',
    algs: [
      { moves: "x r' R B R' B' R' r' R r'", id: 'a8f679d7-7171-4183-9e3d-cecae5b7465d' },
      { moves: "y2 x r' R r R' r' R' z' r' R' r B R'", id: '9067c2f3-99f5-467c-8f48-5f2acd8251d7' },
      { moves: "H z' H z' S", id: '38f44f15-92e2-4c02-ab7b-b840fd93b681' }
    ]
  },
  {
    name: '22a',
    id: '7a61f84f-2bd6-42ce-9c45-7e7cb17b4a2f',
    idMethod,
    puzzle,
    group: 'Peanut + Vertical U Perm',
    setup: '',
    algs: [
      { moves: "x r R' r' R r R B R' B' r'", id: '1878b2fd-4bc3-4943-8c41-e93ebbc07763' },
      { moves: "x z2 r B R B' R' r' R' r R r'", id: '2e86f37e-f014-4155-bc43-78313a38c858' },
      { moves: "x r R' r' R r R B R' B' r'", id: '0c5e4061-cde6-445b-8058-7865a70190d8' }
    ]
  },
  {
    name: '22b',
    id: '18d7723e-4212-4db4-9e34-df6228087abb',
    idMethod,
    puzzle,
    group: 'Peanut + Vertical U Perm',
    setup: '',
    algs: [
      { moves: "x B' R B R' B' R' r' R r B", id: 'f8791a9d-b1a1-43e6-9c9b-aa5fdc361a1d' },
      { moves: "x z2 B' r' R' r R B R B' R' B", id: '85d83aa7-d9f4-411e-96d6-e7f6d15de783' },
      { moves: "y' R' r' R r z' r' R r R'", id: '2687f205-6715-4185-b2a7-c4474857d34d' }
    ]
  },
  {
    name: '22c',
    id: '88bceedc-f44f-4128-b466-ed1de04d8e63',
    idMethod,
    puzzle,
    group: 'Peanut + Vertical U Perm',
    setup: '',
    algs: [
      { moves: "y r' R' r R z' R r' R' r", id: '7983c78c-8d4f-4152-a4d7-b5724a9e0457' },
      { moves: "y x r R' r' z' r' R' r z r R", id: 'a132071b-41ff-4ec0-86de-7a6d3109ea29' },
      { moves: "y' x R' r' z' r' R r z r R r'", id: '211cd173-256b-4a70-8a02-4a655eb9271f' }
    ]
  },
  {
    name: '22d',
    id: 'cf4376fb-482c-4d4f-8453-7773dadf20be',
    idMethod,
    puzzle,
    group: 'Peanut + Vertical U Perm',
    setup: '',
    algs: [
      { moves: "y r R r' R' x r' R r R'", id: 'bb5afbd9-5e76-4741-800d-c096d88c7d37' },
      { moves: "z2 R r R' r' z r' R r R'", id: '0d8ebaa4-2530-4bca-8a87-3c5a117e1500' },
      { moves: "x r R z R r' R' z' R' r' R", id: 'a7782f04-4e6e-4348-af7e-f32ae6acef68' }
    ]
  },
  {
    name: '23a',
    id: '74fcd9b4-aed6-472c-9c71-1cef27cbdac9',
    idMethod,
    puzzle,
    group: 'Peanut + O Perm',
    setup: '',
    algs: [
      { moves: "x z r R r' R' z' R' r' R r", id: '7fdd803d-1b1a-47a8-9ffe-2165db6d4551' },
      { moves: "z2 H z' H z2 S", id: '6f40b09a-bd37-4363-8f6e-f88261dcb5c6' }
    ]
  },
  {
    name: '23b',
    id: '0ff4a8d9-ba5c-4c30-ba3a-390f31f4873f',
    idMethod,
    puzzle,
    group: 'Peanut + O Perm',
    setup: '',
    algs: [
      { moves: "x R' r' R r z r R r' R'", id: 'fbbf4e4f-7d32-46a7-9682-5a8265327ad6' },
      { moves: "y2 x B r R' r' B' r R r'", id: '1144b368-9780-4596-80a5-5702c90edea8' },
      { moves: 'z S z S z2 H', id: '26236ab7-4535-43fb-a131-d8e5e7297a8a' }
    ]
  },
  {
    name: '23c',
    id: '17ba9017-068d-4e80-928c-fe0f065181e4',
    idMethod,
    puzzle,
    group: 'Peanut + O Perm',
    setup: '',
    algs: [
      { moves: "x r' R' r R z R r R' r'", id: '1e0df416-bb12-4f60-9972-3c14eeb3dc7a' },
      { moves: 'z H z H z2 S', id: 'eb2d884e-3964-4685-9bb3-8f86dfe833c9' }
    ]
  },
  {
    name: '23d',
    id: 'c1392d17-8b77-4ed1-943c-291212f659cb',
    idMethod,
    puzzle,
    group: 'Peanut + O Perm',
    setup: '',
    algs: [
      { moves: "x z R r R' r' z' r' R' r R", id: '742829b9-b232-4673-8982-40107b0e589f' },
      { moves: "z2 S z' S z2 H", id: '3fa77ec9-62b5-455d-821f-b0d30a96b6b7' }
    ]
  },
  {
    name: '23e',
    id: '9233b79f-6836-47fd-b405-30f4f1228533',
    idMethod,
    puzzle,
    group: 'Peanut + O Perm',
    setup: '',
    algs: [
      { moves: "y' R r R B R' B' R' r'", id: 'e4ec3a9b-2ca9-4de6-af52-23aed287d8e4' },
      { moves: "x z2 r R r R' r' R' z' r' R' r B", id: '0f658ec2-f41e-43f3-977c-4ccf64ccff7e' },
      { moves: 'S z H z2 S', id: 'faecef4f-8d99-4e80-8657-6d4dc9722e46' }
    ]
  },
  {
    name: '23f',
    id: '5d8823ae-eca1-479c-9f71-f3ad8c1b3c16',
    idMethod,
    puzzle,
    group: 'Peanut + O Perm',
    setup: '',
    algs: [
      { moves: "y x B' r' R r R' z R' r' R r R", id: 'bc6a8e59-3f99-4acf-8c7d-bd1a4a16038a' },
      { moves: "y x R B' r' B' r B r B R' B'", id: 'cdbcc997-9c23-4360-81f6-02459d7c951d' },
      { moves: "y r R B R B' R' r' R'", id: 'df93e097-4584-4250-aaa8-93a9c465c218' },
      { moves: "x2 r' R' z' R' r' R r z r R", id: '2797858c-7b3a-4bb0-90ad-4a2a979c325c' }
    ]
  },
  {
    name: '23g',
    id: 'cd6b4059-24fb-4826-bd99-6e6067669935',
    idMethod,
    puzzle,
    group: 'Peanut + O Perm',
    setup: '',
    algs: [
      { moves: "y2 x b r' R r R' z' R r R' r", id: 'af8eb885-e3dd-44cd-a54b-0ba6c0b5bc27' },
      { moves: "y' z' r' R' r l' r' R r R", id: 'eeda173b-bf39-45d7-9048-83dcce3d7f76' },
      { moves: "y x r B' r' R r R' r z r' R' r", id: 'd7388717-538e-4087-875c-229760b44be0' },
      { moves: 'H z S z2 H', id: '3d374420-ddee-4372-bcb8-cf856eed8111' }
    ]
  },
  {
    name: '23h',
    id: '8f1588d0-c819-4c6c-909a-ffc06fc4528d',
    idMethod,
    puzzle,
    group: 'Peanut + O Perm',
    setup: '',
    algs: [
      { moves: "y r' R' r' R r z' r' R r", id: 'f4da19da-46a8-43f3-a45e-05033842638f' },
      { moves: "y x r' R r' R' z R r' R' r b'", id: '68df7329-569d-4056-9b93-b94e0e561f7e' },
      { moves: "z' S z' H z2 S", id: '90404e80-63c8-4e53-b2ac-39bc46570779' }
    ]
  },
  {
    name: '24a',
    id: 'ebec085b-f3ea-4b9f-b3cc-0e4bed365dac',
    idMethod,
    puzzle,
    group: 'Peanut + Z Perm Conjugates',
    setup: '',
    algs: [
      { moves: "x z R r R' r' R r R' r z' r' R r", id: '68845264-5529-492f-bbe5-4c2f26ad66fb' },
      { moves: "z' S z' H z S", id: '860f86a3-0884-4df5-850f-4e8c7fe3caf1' }
    ]
  },
  {
    name: '24b',
    id: 'e36fe73e-700d-412b-b730-1f5894c2369c',
    idMethod,
    puzzle,
    group: 'Peanut + Z Perm Conjugates',
    setup: '',
    algs: [
      { moves: "x r' R' r R r' R' r R' z R r' R'", id: '9d54cd7d-bbd0-4460-8ed7-8cf338c0d1be' },
      { moves: "x R B R' B' r' R' r R r' R' r R", id: '13d92d0a-dbfd-43b5-9f7f-fc57377bfdfe' },
      { moves: "y x B r' R r' R' r B z' r' R' r", id: '6912d642-7d14-4264-aa8d-2d10478ae2cc' },
      { moves: "y' x R' r' R' r' z' r' R' r R r' R' r B'", id: '29d2bde2-0dc6-4456-8e6c-95e8f2a206a3' }
    ]
  },
  {
    name: '24c',
    id: 'b2c97408-b1c9-4d8f-b48f-1cecd0f7dff9',
    idMethod,
    puzzle,
    group: 'Peanut + Z Perm Conjugates',
    setup: '',
    algs: [
      { moves: "x r' R' r R' z R r' R' r R r' R'", id: 'df0e0c4e-3adf-40c7-bdaa-da32ba70dcc1' },
      { moves: "x r' B R' B' R B R' B' R' r' R' r'", id: '596a90fd-6605-4741-8430-994d6c198287' },
      { moves: "x z2 r R r z B r' B' z' r' R' r' z' r", id: '63f46d85-8980-4f26-acb0-3e05f66dfec4' },
      { moves: "z' H z' S z H", id: 'afcf74b6-7067-4b58-80ab-aa2f3e1d9e49' }
    ]
  },
  {
    name: '24d',
    id: '24ca8205-15cb-4110-a762-dc3bc70cd76e',
    idMethod,
    puzzle,
    group: 'Peanut + Z Perm Conjugates',
    setup: '',
    algs: [
      { moves: "y' x R r' R r R' z R r' R' r R r' R'", id: '8ddf9673-777c-4559-b212-e12639aaa106' },
      { moves: "y x R r R' r z' r' R r R' r' R r", id: '5320ea65-14f3-4fa1-b439-9f0a263bacf5' },
      { moves: "x B r' R r R' r' R r z r R r R", id: 'e7be742c-8823-4364-84c2-036724d005b7' },
      { moves: "S z H z' S", id: '5516b2a6-f907-4af6-9ce5-1babf7d70d9d' }
    ]
  },
  {
    name: '25a',
    id: '649f65bd-9f6f-4d69-8595-fe1cd8d38857',
    idMethod,
    puzzle,
    group: 'Peanut + Z Perm Conjugates',
    setup: '',
    algs: [
      { moves: "y' x r' R' r' z' r' R' r R r' R' r B", id: '5b4119fc-47cb-40be-aed1-d759bd97f0c7' },
      { moves: "y2 x r R r R' r' R r R' z' R r' R' r R", id: '4a23d068-2669-4894-a96e-1067ff2cd058' },
      { moves: "x z' r B r' R' r B r' R r' B'", id: 'e5765f82-be1e-4cce-b3e1-a7a14661c31f' },
      { moves: "z2 S z' S z S", id: '2e28efc6-1e69-4e59-b3c2-34a36713ccf8' }
    ]
  },
  {
    name: '25b',
    id: '7786a390-ba53-4312-8db9-f50ad8636294',
    idMethod,
    puzzle,
    group: 'Peanut + Z Perm Conjugates',
    setup: '',
    algs: [
      { moves: "y2 r B R' B' R B R' B' R' r' R'", id: '0b7583b9-b04d-4c93-8940-efb6a8e4bce5' },
      { moves: "z' S z S z' S", id: 'bc40b382-adda-4de9-b33d-da610e3ad7d6' }
    ]
  },
  {
    name: '25c',
    id: '7fec1179-4d2e-4c47-b8a1-d16ec681d4f4',
    idMethod,
    puzzle,
    group: 'Peanut + Z Perm Conjugates',
    setup: '',
    algs: [
      { moves: "y' x b' R r R' r' R r R' r z' r' R r'", id: '2dcf58c8-9616-4930-bac9-8c04a528a0e6' },
      { moves: "x R r z r R r R' r' R r R' z' r'", id: 'f9a7e348-9248-40e9-99f1-99b77b53cdee' },
      { moves: "z H z H z' H", id: '41e0b224-37f1-4db0-92a0-ab176d1aa41a' }
    ]
  },
  {
    name: '25d',
    id: 'fc8e0c40-1714-44c3-a3e9-6713cb6ad8d7',
    idMethod,
    puzzle,
    group: 'Peanut + Z Perm Conjugates',
    setup: '',
    algs: [
      { moves: "y2 x B' r' R r R' r' R r z r R r", id: '8c4109f4-74b0-469d-9e33-19415f9a551c' },
      { moves: "x z r' R r R' z' b' r' R r R' z' R r' R' r'", id: '0fc2f5e6-dae4-496a-99e4-7f8f8d230750' },
      { moves: "H z' H z H", id: '6c5ea277-e6ce-4558-a991-e79589e2f55b' }
    ]
  },
  {
    name: '26a',
    id: '5a9898e7-667e-4e4f-9db6-4889ee8421e1',
    idMethod,
    puzzle,
    group: 'Peanut+ Triple Sledge',
    setup: '',
    algs: [
      { moves: 'S z H H', id: '9fb1179c-aa56-477a-ab22-cea00b2d0562' },
      { moves: "S z' S S", id: 'b40487a2-9daf-4b03-be26-960fff71cc3d' }
    ]
  },
  {
    name: '26b',
    id: '3886a62d-e002-4b33-b8d7-870ad1631322',
    idMethod,
    puzzle,
    group: 'Peanut+ Triple Sledge',
    setup: '',
    algs: [
      { moves: "S z' H H", id: '5074996a-a1b9-4ce7-b69b-bdff0378236c' },
      { moves: "x r R r' R' r B R' B' R' r' R'", id: '52299806-aed9-41e0-b106-0b4e8d89d307' },
      { moves: "x B r' R r R z R r R' r' R r R", id: '2896e328-0baf-4ea7-9833-a715b543e727' },
      { moves: "z2 S S z' S", id: 'ef663613-e349-48d5-bb7b-7e7b09a2630c' }
    ]
  },
  {
    name: '26c',
    id: 'c1416e24-6633-4ab0-94a9-74eb10a6561a',
    idMethod,
    puzzle,
    group: 'Peanut+ Triple Sledge',
    setup: '',
    algs: [
      { moves: 'z2 S S z H', id: 'b9d9895e-019a-4e21-83ed-6f01b2733f25' },
      { moves: "z' H z H H", id: 'bc4ad12a-e40b-47ff-b539-cee5320044e8' }
    ]
  },
  {
    name: '26d',
    id: '32bcf301-bfae-4f95-b795-e98d46538dfe',
    idMethod,
    puzzle,
    group: 'Peanut+ Triple Sledge',
    setup: '',
    algs: [
      { moves: 'z H H z H', id: 'bf60971e-94a2-4147-b90c-ebd95d10e388' },
      { moves: "x z' r' B R' B' R' r' R' r R r' R' r'", id: 'c13921f9-9484-4fd6-8c9a-c5de15b1ad61' },
      { moves: 'z2 H z S S', id: '29d1b857-5484-4c3a-9e6a-43a6769956f0' }
    ]
  },
  {
    name: '27',
    id: '70571b83-d784-49d3-8f07-62d74b1bbf59',
    idMethod,
    puzzle,
    group: 'Peanut + H or Z Perm and Pure Peanut',
    setup: '',
    algs: [
      { moves: "y2 B r' R r R' B' z' R r' R' r", id: 'b42b1d1e-6916-4961-8d73-5683824d5851' },
      { moves: 'z2 S S z S S', id: '4bfb8f5b-3960-4548-a334-a396713ed48e' },
      { moves: "y2 x r' R' z' r B r' R r y' r' R' r", id: 'e048ff5d-2c84-4efd-bd1f-638d18ddcbdd' },
      { moves: "x z' B' r' R r R' B' z2 R r' R' r b'", id: '437db578-3aa6-41af-80fd-dad5fdeb488d' }
    ]
  },
  {
    name: '28',
    id: 'fbf1267c-74ff-4ac1-90e7-364f188876c5',
    idMethod,
    puzzle,
    group: 'Peanut + H or Z Perm and Pure Peanut',
    setup: '',
    algs: [
      { moves: "S z' S S z' S z2 S", id: 'af03cf09-b560-422c-8a25-5b4e1edb33d5' },
      { moves: "x z' r' R' r z r' R r R' r z' r' R' r R", id: '6b86cf7a-e35f-43ac-8cc4-977202b70685' },
      { moves: "x z R' r' R r R' z R r' R' r z' r' R r", id: '572822d3-06cb-4a86-a032-e6604365ad9c' },
      { moves: "x z r' R r x R r' R z R r' R' r", id: '8d7659ca-7400-4815-b66c-d52f17691814' }
    ]
  },
  {
    name: '29a',
    id: '101562c5-ff99-4d40-a8fb-116092f81563',
    idMethod,
    puzzle,
    group: 'Peanut + H or Z Perm and Pure Peanut',
    setup: '',
    algs: [
      { moves: "y x r' R' r R r' R' r' z' r' R' r B", id: 'db23b989-6d06-4b7f-9f5f-fb94d1ef9ff8' },
      { moves: "y x r R r' R' z' r' R' r z r' R r' R'", id: 'b514ba63-d031-4a0c-a424-db8fc548d209' },
      { moves: "x z' B' r' R r R z R r R' r' R r", id: 'bee46b84-bf1a-4326-bb5a-eacc9ac84f03' },
      { moves: "x z2 R r R' r' R r R z R r R' b'", id: '1c1e4bc3-a062-4b08-92dc-f5ac18bd90c3' }
    ]
  },
  {
    name: '29b',
    id: '9caa7cc9-1bbe-4ecb-894a-e0a886407cac',
    idMethod,
    puzzle,
    group: 'Peanut + H or Z Perm and Pure Peanut',
    setup: '',
    algs: [
      { moves: "y' r' R r y' r l B r' l B'", id: '993ece6c-a272-40b2-a9a2-6ddcd674b814' },
      { moves: "y z' r' R' r y z' r' R r b r' R' r", id: '3ec516c2-37e9-4527-80c1-e58d72420e8e' },
      { moves: "z S z' H z S z' H z H", id: 'b5051999-cb42-42e9-b4b1-891969a78f13' },
      { moves: "x R r' R r' R' z' r' R r B' R", id: 'a68f456f-1924-440a-8bac-248ec03eba6f' }
    ]
  },
  {
    name: '30a',
    id: 'f7d3eb0b-8233-4f2e-b122-247b1abc3e6a',
    idMethod,
    puzzle,
    group: 'L4C',
    setup: '',
    algs: [
      { moves: "y2 x B' r' B r B R r' R'", id: '91a68b3a-b612-437f-865a-c33af835bed0' },
      { moves: "y2 x r B r' z' b' r' R' r b", id: 'bb38705d-b114-47ef-882c-5d689f106146' },
      { moves: "y' x R' r' R' r b z r B r' z' b' R", id: '63bacc74-8668-4ecd-bdd4-82ea8b001ab9' },
      { moves: "y' x R' r' B' r B R r R' B'", id: 'db1f6700-047d-4cb6-8506-a4263f226cd8' }
    ]
  },
  {
    name: '30b',
    id: '8e1f753f-34d8-4318-b72d-0e282c39d024',
    idMethod,
    puzzle,
    group: 'L4C',
    setup: '',
    algs: [
      { moves: "y x B r' B' z' r' R' r b R", id: 'd71255fd-4602-40af-b3d6-79f8a39c946e' },
      { moves: "x B' r B r' B' z' r' R' r b'", id: '79b1edf9-fe9a-46fa-9531-01b10a90921f' },
      { moves: "y' x R r R' r' R r R' r2 R r R' r'", id: '0e98a37f-33e1-47c5-a8a7-1951eab3afbd' },
      { moves: "x B r B' r' B' z' r' R r", id: '3885e332-30d3-4c80-9ef1-10d2589c9772' }
    ]
  },
  {
    name: '31',
    id: 'de9da162-68ff-4210-b31f-a82fa450e173',
    idMethod,
    puzzle,
    group: 'L4C',
    setup: '',
    algs: [
      { moves: "y2 x b' r' R' r b z r B r'", id: '38709d29-bfb0-4445-8c24-76fd68851614' },
      { moves: "y2 x b z r B r' B' z' r' R' r", id: '3548655d-17c9-4b0f-a5d9-38241a776755' },
      { moves: "x z2 B R r R' B' r' B' r", id: '65759624-0908-4d2a-a7ee-2dd165433990' },
      { moves: "x z2 B' r' B' r B R r R'", id: 'c5328fe1-c2a6-474e-8217-9f0dd6f79fb6' }
    ]
  },
  {
    name: 'U Perm',
    id: 'f4959f66-c9ec-4a48-a244-bf83fccbb613',
    idMethod,
    puzzle,
    group: 'L4C',
    setup: '',
    algs: [
      { moves: "z' x S z2 S", id: '7939c28b-98b9-49fa-9b1d-36bc3f4b91cd' },
      { moves: "y x b' r' R r R' z2 r' R r", id: '98544c2f-b733-4ac2-9545-855fa0ce6aac' },
      { moves: "y x' r' R' r z2 R r' R' r b", id: '2b51b6ff-5b8c-47cd-b74e-bdee08b1d55f' }
    ]
  },
  {
    name: '32',
    id: '9d71c22f-25a2-4f11-a21a-4a13c3fce3ba',
    idMethod,
    puzzle,
    group: 'L4C',
    setup: '',
    algs: [
      { moves: "y x r' B r' B' z' r' R' r z B r'", id: '27b8aa1d-9878-44bc-a161-9153992c5e17' },
      { moves: "y x r B' r B R r R' B' r", id: '4a76db3b-78a7-4e43-936f-edacca951bc2' },
      { moves: "y x R2' B' r' B' r B R r R", id: '83220a65-da7f-4eae-99c7-5a1e5f2b08a2' },
      { moves: "x r' B' r' B' r B R r R r", id: '5669acd4-0e64-4654-b496-4114d63f5508' }
    ]
  },
  {
    name: '33',
    id: 'f76dd557-c527-42f8-aca4-740579fcfe08',
    idMethod,
    puzzle,
    group: 'L4C',
    setup: '',
    algs: [
      { moves: "r R' r R' b' r B' r", id: '85f0f83a-7b9d-49d1-9d03-79bf818a87bb' },
      { moves: "r R' r R' x' B' R r' B", id: 'ac530368-c54f-4569-90de-20bc494df7d5' },
      { moves: "r R' r R' y L' l L' l", id: '012312b4-8e91-4cd2-9e92-a84fddcf22de' },
      { moves: "x r' R r R' B' r' B' r B r", id: '4573daaf-4e31-4c65-b0bb-d5ff220e65dc' }
    ]
  },
  {
    name: '34a',
    id: 'b7ffbfb6-9cbf-40c7-8a85-bcc9460bd212',
    idMethod,
    puzzle,
    group: 'L4C',
    setup: '',
    algs: [{ moves: "x b r' R r R' z2 r' R r R", id: '7e885aa9-7305-44f5-9a1a-07d2077318ad' }]
  },
  {
    name: '34b',
    id: 'b311393c-4819-474b-ba4f-c4a046a7ca5b',
    idMethod,
    puzzle,
    group: 'L4C',
    setup: '',
    algs: [
      { moves: "x B' r' R r R' z2 r' R r R' r", id: '18762dbc-b7ab-4e5f-93a4-fca8ccc79378' },
      { moves: "y x R' r' R' r z2 R r' R' r b'", id: 'c50adb73-c7c4-492c-acfe-4c72fee816cf' }
    ]
  },
  {
    name: '35a',
    id: '8413a0e3-28ab-4250-9316-dd443ac8bae5',
    idMethod,
    puzzle,
    group: 'L5C',
    setup: '',
    algs: [
      { moves: "y' x r' R r R' r R y' r' R r B' r", id: '193b22aa-b948-4692-9cd3-93bdb7e20817' },
      { moves: "y' x b R r' b r R' b' r R' r'", id: '5bdec9cd-01a7-4869-bc77-9bf357cd11ff' },
      { moves: "y x r' R r R' b' R r' R r R' b' R", id: '62904cc5-ffc1-49d1-aeeb-d5c61ca42911' },
      { moves: "z' S z2 S x y' S z2 S", id: '355fe6ec-53e1-441a-b2dd-64475f5cecab' }
    ]
  },
  {
    name: '35b',
    id: 'd0c96bbc-9c4f-4d33-949f-60bca15c668b',
    idMethod,
    puzzle,
    group: 'L5C',
    setup: '',
    algs: [
      { moves: "y2 x R r' R' r B r' R r' R' r B r'", id: 'eb6214bf-8be4-4f76-b290-e1bc5342cb4d' },
      { moves: "x r B' r' R r R' r B' r' R r R'", id: '96bb6596-90bb-4429-86e7-e5308599b457' },
      { moves: "y x B' r' R r R' r R y' r' R r B' r'", id: '84925eb4-45d9-4085-b63a-c2d182a3e9df' },
      { moves: "x z R r' b z' R B' r' R B' R' r", id: '019ce362-908c-48fe-b371-33b398531488' }
    ]
  },
  {
    name: '36a',
    id: '1a59f8c3-0afd-4717-8ca8-7925edd3b577',
    idMethod,
    puzzle,
    group: 'L5C',
    setup: '',
    algs: [
      { moves: 'H z2 H z H z2 H', id: 'f1f2649c-3364-4ee6-8f31-484c1f732801' },
      { moves: "y' x r' R' r B r' R r' R' r B r' R", id: '0ea39259-af49-4aac-b7ab-98e62f7a6a67' },
      { moves: "y x R' r B r' R r' R' r B r' R r'", id: '394b6dc5-5af4-4187-aea5-e06e11f670eb' },
      { moves: "y x r' R r R' r B' r' R r R' r B'", id: 'c36fe5c7-c5d6-4384-907f-c1267c660eb5' }
    ]
  },
  {
    name: '36b',
    id: '9e82cabe-47e6-4972-83f9-d2e97032269f',
    idMethod,
    puzzle,
    group: 'L5C',
    setup: '',
    algs: [
      { moves: "S z2 S x' y S z2 S", id: 'f23a6d7b-e399-49fb-a86c-7451d53757ff' },
      { moves: "y' x B r' R r' R' r B r' R r' R' r", id: '7bddf208-d5f5-4cc4-bb1d-bbf69b2a33d6' },
      { moves: "x B' r' R' r B r' R r z' r' R r R'", id: '393c5be1-7fef-4615-b5fc-dc9a35f1a5e3' },
      { moves: "y2 x B r' R r R' r R y' r' R r B'", id: '908b6d74-9859-42f8-b9a5-6b41176539fe' }
    ]
  },
  {
    name: '37a',
    id: '90adbe8f-3efa-43ae-ba52-b04f8ec89b08',
    idMethod,
    puzzle,
    group: 'L5C',
    setup: '',
    algs: [
      { moves: "S z S z' H z H", id: 'a37153a7-9076-4fa2-a65f-14abe2dea5c9' },
      { moves: "x B' r' R r R' r B' r' R r R' r", id: '48d44258-1014-4ef1-8c16-4ddec5777d57' },
      { moves: "y' x r' R' r B r' R r z' r' R r R' z' r'", id: '309ecaeb-89f5-45d2-ae87-5d26fc879693' },
      { moves: "y2 x R r' R r R' z' r2' R' r B r' R", id: '5599b67d-47d3-40cf-a9d6-36a40b4d25f4' }
    ]
  },
  {
    name: '37b',
    id: '350215f4-5732-4db7-99fa-21e658e8f964',
    idMethod,
    puzzle,
    group: 'L5C',
    setup: '',
    algs: [
      { moves: "x r' R r z' r B' R r' R' B' r", id: '3925a2ba-339c-446d-aa20-ba0ee118bd6f' },
      { moves: "z' H z' H z S z' S", id: 'bb77d4a2-1977-4c13-89bb-dab165727d19' },
      { moves: "x r B r' R r' R' r B r' R r' R'", id: 'bc08b708-b599-422b-a034-69488ea5d2fe' },
      { moves: "y2 x r' R r' R' r B r' R r' R' r B", id: '07707d80-ad6a-4b3e-b449-af9c5b317616' }
    ]
  }
]
