import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

const idMethod = 'CLL_ALGS'
const puzzle = '222'

export const CLL_ALGS: AlgorithmCollection[] = [
  {
    name: 'CLL AS 1',
    id: '4f711cc9-0483-4ef6-bd94-8bf2511f5dcf',
    idMethod,
    puzzle,
    group: 'AS',
    setup: '',
    algs: [
      { moves: "y R U2 R' U' R U' R'", id: '59e8592a-1e8e-430c-8d1b-459d907ac012' },
      { moves: "y2 L' U' L U' L' U2 L", id: '7592cf85-5ecc-41e1-adab-3b039976d226' },
      { moves: "R' U' R U' R' U2 R", id: 'd8e0b789-1696-461f-a517-680ccddae5b9' },
      { moves: "U2 L' U' L U' L' U2 L", id: 'd689c54c-2806-4438-b804-cfdb64b145d6' }
    ]
  },
  {
    name: 'CLL AS 2',
    id: 'ddc77530-83ba-4f16-92d0-5294532054e6',
    idMethod,
    puzzle,
    group: 'AS',
    setup: '',
    algs: [
      { moves: "R U2 R' F R' F' R U' R U' R'", id: '81d2c271-3596-40ca-8694-46b29de5c046' },
      { moves: "y2 R' U R U' R2 F R F' R U R' U' R", id: '46d64a3b-318d-49e4-bba0-e0d29b477d99' },
      { moves: "L' U' L U' L F' L' F L' U2 L", id: '7570e1b8-920b-4f53-a48c-5e61790bb24a' },
      { moves: "y' R U' R2 U R U B U2 B' R", id: 'dd938a44-7b08-4843-85bd-b5c52fc9c8f3' }
    ]
  },
  {
    name: 'CLL AS 3',
    id: '6f703d05-0d5c-40f3-a413-395af16b04be',
    idMethod,
    puzzle,
    group: 'AS',
    setup: '',
    algs: [
      { moves: "y2 F' L F L' U2 L' U2 L", id: '268099f1-845a-460f-8b8a-1f06aa1a2d95' },
      { moves: "R' U L U' R U L'", id: '90409e35-2f23-4aae-8dd3-396c10a9d7ef' },
      { moves: "y2 F' R U R' U2 R' F2 R", id: '00547383-0abd-4766-a9a2-f026f82e9252' },
      { moves: "y R' F R F' R U2 R' U' R' F R F'", id: '330fb723-782e-4153-a754-7b1d0745fccd' }
    ]
  },
  {
    name: 'CLL AS 4',
    id: 'e1abec52-6830-463e-b1b1-cc0a41ea43fd',
    idMethod,
    puzzle,
    group: 'AS',
    setup: '',
    algs: [
      { moves: "y2 R' F R F' R U R'", id: 'c61a3dd0-16e2-41f5-bcc7-5317643cd287' },
      { moves: "U2 L' U R U' L U R'", id: '054bf615-3796-4a6d-9e51-81cf5ab086e5' },
      { moves: "y2 L' U L F' R U R'", id: '211735e6-ba2f-450f-8d7b-665529408e93' },
      { moves: "x' R' F R U' R U R'", id: '53869bbf-bbc8-4189-9966-f2fb95b317ef' }
    ]
  },
  {
    name: 'CLL AS 5',
    id: '01e59e1b-349f-48f0-a1ac-21d50ec2a3cd',
    idMethod,
    puzzle,
    group: 'AS',
    setup: '',
    algs: [
      { moves: "y2 R U2 R' U2 R' F R F'", id: '3690d925-7a81-474b-b44c-2f9c286fabef' },
      { moves: "L U2 L' U2 x' L' U L U'", id: '7e2b796e-87f1-4c35-8433-bccf4eb28347' },
      { moves: "x' R U2 R' F2 R' F R U'", id: '22090c5f-1976-4f22-912d-470a89a81ebd' },
      { moves: "y' z F R2 F' R' U' R' U z' y' R U' R'", id: 'd5003298-5be8-459e-ba88-5f434c555297' }
    ]
  },
  {
    name: 'CLL AS 6',
    id: 'b3e371e3-3233-427c-a93e-4ba42ff2a0dd',
    idMethod,
    puzzle,
    group: 'AS',
    setup: '',
    algs: [
      { moves: "y' R U2 R' U' R U' R' F R' F' R U R U' R' U'", id: '378b0a6a-6790-443d-960e-693068c06266' },
      { moves: "R2 F R U2 R U' R' U2 F' R", id: 'c0a702ba-32f6-4c59-b84e-c9799d2877b8' },
      { moves: "y R U R2 F' R F R U' R2 F R", id: 'a59f128b-c23f-4801-a021-2601afbb54a5' },
      { moves: "R2 F' U' R2 F' R2 U F R2", id: 'a993c5af-7705-49ec-a1ce-e72a6fe94209' }
    ]
  },
  {
    name: 'CLL H 1',
    id: '6cfb42fb-1aa5-48e5-9124-6ee2398b0d7b',
    idMethod,
    puzzle,
    group: 'H',
    setup: '',
    algs: [
      { moves: "F R2 U' R2 U' R2 U R2 F'", id: '960c9ffa-07ab-453b-b074-362e1305c66f' },
      { moves: "F R U' R' U R U2 R' U' R U R' U' F'", id: 'df1a3a56-81bb-413f-8ee3-ab05ec9e3b75' },
      { moves: "y' R' U2 R y R' U R' U' R U' R", id: '403033bb-8256-4abd-82ee-b52f03e1d643' },
      { moves: "y2 F R U R' U' R F' R U R' U' R'", id: '2fece1a3-29fd-4a2f-9f5f-ca26142c80ed' }
    ]
  },
  {
    name: 'CLL H 2',
    id: '18d62412-c6c8-4bc5-864d-433b42ad3e15',
    idMethod,
    puzzle,
    group: 'H',
    setup: '',
    algs: [
      { moves: "R U R' U R U R' F R' F' R", id: '3a8213cc-c03f-4788-b7aa-7ac651bc0f79' },
      { moves: "y2 R' F' R U' R' F' R F' R U R'", id: '4fa4afd0-b5be-4409-a731-73c799bb68bc' },
      { moves: "R U R' U R U L' U R' U' L", id: 'f148362a-62f7-467f-a880-8e0f728d82cc' },
      { moves: "y R U' R' F U2 R2 F R U' R", id: '4b157479-d010-493d-8241-35efc85a8de7' }
    ]
  },
  {
    name: 'CLL H 3',
    id: 'e5e69681-3c2e-4398-9448-192deb5c1be5',
    idMethod,
    puzzle,
    group: 'H',
    setup: '',
    algs: [
      { moves: "y F R U R' U' R U R' U' R U R' U' F'", id: '47068933-7edc-4d04-a182-2bceb1815716' },
      { moves: "y x' U2 R U2 R2 F2 R U2 x", id: '53f469fd-2fff-4ce0-b8a4-7b75ba2b70f8' },
      { moves: "R U' R' F R' F' R2 U' R' F R' F' R", id: 'a12f8db9-9b64-4624-811c-0262467f7e8e' },
      { moves: "R' F R F' R U R2 F R F' R U R'", id: 'b7da3b5f-6d04-424d-b1bf-efc2107c24e1' }
    ]
  },
  {
    name: 'CLL H 4',
    id: '19c7d886-2f11-4d64-8058-88fb210ce88e',
    idMethod,
    puzzle,
    group: 'H',
    setup: '',
    algs: [
      { moves: "y R2 U2 R' U2 R2", id: '7f71b7a7-a07f-4de4-b2f2-ad493cfba1aa' },
      { moves: 'y R2 U2 R U2 R2', id: '3ec49795-9292-4ee4-a186-6b29f4c423b7' },
      { moves: "R U R' U R U' R' U R U2 R'", id: 'e9fc1175-d9e8-4d80-859f-c887068b477e' },
      { moves: "y' R U2 R' U' R U R' U' R U' R'", id: 'ca76348f-125a-4d65-b1f2-8e2ed9e044b5' }
    ]
  },
  {
    name: 'CLL L 1',
    id: '8a88f88b-f66d-4ad9-b69d-36fe5e5e5441',
    idMethod,
    puzzle,
    group: 'L',
    setup: '',
    algs: [
      { moves: "y R U2 R' F' R U2 R' U R' F2 R", id: '6f0a434d-e484-4a57-9fcb-1c3de4ba782a' },
      { moves: "y R' U' R U2 R' F R' F' R U' R", id: '8d5fba25-7784-417e-9278-9bae84d6c2d9' },
      { moves: "R' F' R U R' U' R' F R2 U' R' U2 R", id: 'ecd407cf-8e96-450c-a6cc-af7128addde9' },
      { moves: "y2 L' U2 L U y' R2 U R U' R2", id: 'e2f18a6f-5c4b-4abd-a79f-403a19efc403' }
    ]
  },
  {
    name: 'CLL L 2',
    id: '3f98ec5e-95aa-465a-a77b-d28618fc3e5a',
    idMethod,
    puzzle,
    group: 'L',
    setup: '',
    algs: [
      { moves: "y2 R U2 R2 F2 R U R' F2 R F'", id: 'b8e469b1-9dff-4d0a-aa06-a1be84173738' },
      { moves: "R U' R' U R U' R' F R' F' R2 U R'", id: 'a7545916-85d5-4e9a-aeee-fa120fc726eb' },
      { moves: "R' U2 R' U' F R2 F' U R2", id: '6620dde3-1618-4aaa-a23c-c4098dcf2197' },
      { moves: "y2 R' F2 R2 U2 R' U R' F2 R F'", id: '6e7b195d-b4ac-4dee-ac78-4b59400d04ea' }
    ]
  },
  {
    name: 'CLL L 3',
    id: '53229f91-0463-45a6-8302-784909329e0f',
    idMethod,
    puzzle,
    group: 'L',
    setup: '',
    algs: [
      { moves: "y2 R' U R' U2 R U' R' U R U' R2", id: 'a5291b72-6fe8-49b6-87f0-c599cfa2ef07' },
      { moves: "y2 R2 U' R U2 R' U2 R U' R2", id: 'a8d5caa6-1144-4aaf-809c-95f0183a5066' },
      { moves: "y' R U R' U R U' R' U R U' R' U R U2 R'", id: '179c4914-19b8-4f6f-8938-c9ab97b8493c' },
      { moves: "y R U' R U' R U2 R' U R' U R'", id: 'a3240160-0f76-4293-bb96-7aa091ec345d' }
    ]
  },
  {
    name: 'CLL L 4',
    id: '6c75dab2-b2b3-4f84-8af2-85f67d1f71fa',
    idMethod,
    puzzle,
    group: 'L',
    setup: '',
    algs: [
      { moves: "y R U2 R2 F R F' R U2 R'", id: 'e3595655-7c1e-4960-90db-c2116cda103c' },
      { moves: "R U2 R' F R' F' R2 U2 R'", id: 'fa21e40b-9e1f-4fe2-a896-31f2b18938e3' },
      { moves: "y2 R U R' L' U2 R U R' U2 L", id: '3e06c03d-251a-4e54-8b79-8141656f231f' },
      { moves: "y' R' U' R U R' F' R U R' U' R' F R2", id: 'a11f61ce-da7f-4a9f-afda-645f63ff72e3' }
    ]
  },
  {
    name: 'CLL L 5',
    id: '3c7a4b13-f6ef-47b2-9d9a-9bcf7be7631b',
    idMethod,
    puzzle,
    group: 'L',
    setup: '',
    algs: [
      { moves: "y F R' F' R U R U' R'", id: 'c4bac46b-429e-49f4-a84e-4fb5e47f063b' },
      { moves: "y F R' F' U' R' U R", id: '2cc3520b-51cd-48c6-b5c5-04fc51ad5360' },
      { moves: "y F' U R U' R' F2 R U' R'", id: '60412069-6e0a-4fc4-86d5-687b53469815' },
      { moves: "y' R' F' L' F R F' L F", id: '325ff851-86f9-4fbb-8a4c-2c4e3f1c13fc' }
    ]
  },
  {
    name: 'CLL L 6',
    id: '6c3a9320-e34d-410a-8185-0d61790115e6',
    idMethod,
    puzzle,
    group: 'L',
    setup: '',
    algs: [
      { moves: "y2 F' R U R' U' R' F R", id: '57c11d5a-e804-48aa-8171-e122ad1e7fb6' },
      { moves: "y F R U' R' U' R U R' F'", id: '624b1d24-7876-495e-a64a-a4b6458c20bf' },
      { moves: "R U R U' R' F R' F'", id: '231e9894-7bb0-4686-ba0b-6eb4742705ff' },
      { moves: "y R' F R U F U' F'", id: '7883d95e-cdaf-4808-9419-963b8af2528f' }
    ]
  },
  {
    name: 'CLL Pi 1',
    id: 'c367fcc7-e326-40cc-85d3-33cf5d5e8e28',
    idMethod,
    puzzle,
    group: 'Pi',
    setup: '',
    algs: [
      { moves: "y F R' F' R U2 R U' R' U R U2 R'", id: '8e902447-ac0e-43c0-910c-d476bfd374c3' },
      { moves: "R' F2 R F' U2 R U' R' U' F", id: '75d56e82-94ff-453b-8410-a47ea1412b78' },
      { moves: "U F U R U' R' U R U' R2 F' R U R U' R'", id: 'f6eb24aa-2ddb-449c-b819-7a731a4d201e' },
      { moves: "y2 L' U2 L U L' U' L U2 L F' L' F", id: '727b31ef-91db-4042-a016-1acdd28cc3e5' }
    ]
  },
  {
    name: 'CLL Pi 2',
    id: '5695d98c-b532-4a55-bf21-b1b8eb38b5c6',
    idMethod,
    puzzle,
    group: 'Pi',
    setup: '',
    algs: [
      { moves: "R U2 R' U' R U R' U2 R' F R F'", id: 'cd355b50-e75f-42a5-bb6a-044a0c2e0d08' },
      { moves: "y F' R U R' U2 R' F R U' R' F2 R", id: '59dc3895-8de0-4b11-bdef-a73e196577c7' },
      { moves: "R U R' U' R' F R2 U R' U' R U R' U' F'", id: '7389a602-2ff0-490e-9173-f07d446bfb42' },
      { moves: "R2 U' R' U' F R2 U2 F' R2 F", id: '7b594eeb-11c9-4635-a7bf-459764f00572' }
    ]
  },
  {
    name: 'CLL Pi 3',
    id: '12369cb0-5ed3-497c-888c-805bd6f685ca',
    idMethod,
    puzzle,
    group: 'Pi',
    setup: '',
    algs: [
      { moves: "y F R2 U' R2 U R2 U R2 F'", id: 'e0b2edb5-9da5-4e68-9dae-923df4d1c596' },
      { moves: "y' R U' R U' R' U R' F R2 F'", id: '34d7d325-2a5d-4bf0-b30d-939770fbfae9' },
      { moves: "y2 F R' F' R U2 F R' F' R2 U2 R'", id: 'b50c3767-efe4-4f74-89ca-1d78ce6c235a' },
      { moves: "U' R' F R U F U' R U R' U' F'", id: 'd2a663c6-a41e-4758-bb0b-e8070f6399c3' }
    ]
  },
  {
    name: 'CLL Pi 4',
    id: '5bc89dc6-b963-4fa1-b49a-285f2be7520f',
    idMethod,
    puzzle,
    group: 'Pi',
    setup: '',
    algs: [
      { moves: "y2 R' F R F' R U' R' U' R U' R'", id: '7ea4c590-c8d5-45fc-bf11-fb1b8c1bbde7' },
      { moves: "R U' R' F R' F R U R' F R", id: '2e590e95-b635-4b4f-a18c-be29ea36d956' },
      { moves: "R U' R' F L' U L U L' U L", id: 'b44abbac-594e-4e2d-b654-02ef79bac9a2' },
      { moves: "y' R U' R2 D' R U R' D R2 U R'", id: 'f3fedb25-110c-4c91-be28-8a7150925528' }
    ]
  },
  {
    name: 'CLL Pi 5',
    id: 'bf63d64b-275c-4e13-86a4-c95c191f5323',
    idMethod,
    puzzle,
    group: 'Pi',
    setup: '',
    algs: [
      { moves: "y' R' U' R' F R F' R U' R' U2 R", id: '21ca3cad-1caf-407b-b00e-d3a877d572e2' },
      { moves: "R2 U R' U' F R F' R U' R2", id: 'afd823b4-7293-44b8-8f90-c7d8048fc009' },
      { moves: "U' R' U' R' F R F' R U' R' U2 R", id: '3c237245-d016-4a83-9e9d-976bd5a62e66' },
      { moves: "y' R U R' U R' F R F' R U' R' U R U2 R'", id: 'ff41eacb-4f81-4e04-b90b-9202e34e7135' }
    ]
  },
  {
    name: 'CLL Pi 6',
    id: 'e6183edf-af59-4faa-b1d2-8703ff1a4ffd',
    idMethod,
    puzzle,
    group: 'Pi',
    setup: '',
    algs: [
      { moves: "R U' R2 U R2 U R2 U' R", id: '33eee67f-f80e-4d52-b6da-5df4d6f316a9' },
      { moves: "F R U R' U' R U R' U' F'", id: '548f2e72-1dfc-4536-8f67-61ffc926c1b7' },
      { moves: "R' U R2 U' R2 U' R2 U R'", id: '78948f14-f52d-4e19-af13-6bfe3918ebc2' },
      { moves: "R U2 R2 U' R2 U' R2 U2 R", id: '7b831263-cdea-4b9c-bf2c-6a0636e2c21a' }
    ]
  },
  {
    name: 'CLL Sune 1',
    id: '15cabccd-1d9b-4e16-8823-20faa610a03c',
    idMethod,
    puzzle,
    group: 'Sune',
    setup: '',
    algs: [
      { moves: "L' U2 L U2 L F' L' F", id: '60035431-9dbe-49ea-a3a7-11dbdf80b5df' },
      { moves: "y2 R' U2 R U2 R B' R' B", id: '86a785f5-bd4c-44aa-a388-b6af36d3c1e1' },
      { moves: "R' F2 R U2 R U' R' F", id: '2962a6f9-a98b-4081-adcd-9385c19593ca' },
      { moves: "R' F2 R U2 L F' L' F", id: 'ef859258-1c08-49c1-a7ca-38bb3bbe7520' }
    ]
  },
  {
    name: 'CLL Sune 2',
    id: 'c05bf123-8e99-47eb-b2af-128218e6a0d3',
    idMethod,
    puzzle,
    group: 'Sune',
    setup: '',
    algs: [
      { moves: "R U R' U' R' F R F' R U R' U R U2 R'", id: '3e72cb1f-920f-4bf9-98b3-83ffb64fa858' },
      { moves: "R U2 R' F R U2 R' U R U' R' F", id: '922584c6-bb65-476b-b980-513a78ce08da' },
      { moves: "y2 R U' R U' R' U R' U' y R U' R'", id: '63621617-00bc-4463-95cb-7618fdebf7cd' },
      { moves: "R2 F' U' R2 F R2 U F R2", id: '42f2c8d0-0a27-4e59-8f14-91bc387a5091' }
    ]
  },
  {
    name: 'CLL Sune 3',
    id: 'dbf7234e-ed39-4955-9fc9-b127f2dab1da',
    idMethod,
    puzzle,
    group: 'Sune',
    setup: '',
    algs: [
      { moves: "R U' R' F R' F' R", id: '14e142c3-9532-45b0-8887-71ddc766328f' },
      { moves: "R U' R' F L' U' L", id: 'a8e24587-7477-4959-883f-3b2a7d3ae660' },
      { moves: "L F' L' F L' U' L", id: '6d0abd40-4e24-45e6-86af-b03d18a3ba17' },
      { moves: "R U' L' U R' U' L", id: 'ca7fd628-5027-4d18-97b1-2c3f9a130142' }
    ]
  },
  {
    name: 'CLL Sune 4',
    id: '8d195f97-bbc7-400f-b1fe-3ffe5c4fc4e3',
    idMethod,
    puzzle,
    group: 'Sune',
    setup: '',
    algs: [
      { moves: "F R' F' R U2 R U2 R'", id: '1e9169ee-1227-4bb6-8249-6de39f1a4250' },
      { moves: "y2 x' U R' F' R F2 R U2 R'", id: '2f3488b8-a2fd-4b13-af8a-6a7952ecc1af' },
      { moves: "y R U' R' F R' F2 R U R U' R' F", id: '4689ca9d-1090-4b8d-9ce4-89182594e932' },
      { moves: "y' x' R U' R' U R' F2 R F R U' R' U x", id: '373d23cb-d601-471d-bbfb-3040427b0e1f' }
    ]
  },
  {
    name: 'CLL Sune 5',
    id: '03ed0cc9-24fe-465d-922b-2f8de401255b',
    idMethod,
    puzzle,
    group: 'Sune',
    setup: '',
    algs: [
      { moves: "y2 R U R' U R' F R F' R U2 R'", id: '803bf62c-3e00-4dff-b472-186df10e1a31' },
      { moves: "U2 R U R' U R' F R F' R U2 R'", id: '5a29b4ad-0832-4a1f-9603-d31de9040e1c' },
      { moves: "y' R' F R2 F' U' R' U' R2 U R'", id: '928f7d43-1d19-4ac1-9328-f6f5f94a1e6b' },
      { moves: "R U R' U' R' F R F' R U' R' F R' F' R", id: '93c23ccf-bc93-452e-b499-9c970c33675d' }
    ]
  },
  {
    name: 'CLL Sune 6',
    id: 'd7830cb3-f004-4fec-b24e-b896fdaccf5d',
    idMethod,
    puzzle,
    group: 'Sune',
    setup: '',
    algs: [
      { moves: "R U R' U R U2 R'", id: '9b0600d4-6ed5-4440-811f-e1278bfc84e8' },
      { moves: "R U R2 U' R2 U R", id: '1488ee65-a660-4c6a-9955-c73a79fbab9b' },
      { moves: "y' R' U2 R U R' U R", id: '466a314e-a96e-48b5-9568-d304bd9af7af' },
      { moves: "y L' U2 L U L' U L", id: '5eb22a02-7a7c-49e8-8b72-91f91be4f134' }
    ]
  },
  {
    name: 'CLL T 1',
    id: 'fc1cc04e-2623-46be-8306-9172ab84ea8e',
    idMethod,
    puzzle,
    group: 'T',
    setup: '',
    algs: [
      { moves: "y' R U R' U' R' F R F'", id: 'ff09ce25-c739-4596-b658-9b18f0cc173e' },
      { moves: "y2 R' U' R U F R F'", id: '886cc35b-3e55-4161-8fe7-6aefaaa5f269' },
      { moves: "U' x L U R' U' L' U R U' x'", id: 'b981b7e9-74bc-4309-b402-854cc5693a44' },
      { moves: "y R B R' U' R' U R F' z", id: 'e891dd24-7b09-404d-a947-0339b1b76b2c' }
    ]
  },
  {
    name: 'CLL T 2',
    id: 'c78758ed-f296-4873-8d68-1320d3dcfde1',
    idMethod,
    puzzle,
    group: 'T',
    setup: '',
    algs: [
      { moves: "y L' U' L U L F' L' F", id: '39949be8-e07b-4f83-8016-cb00b810a48b' },
      { moves: "y R' F' R U R U' R' F", id: 'b20d833f-3604-41bc-90d7-f64c8462868f' },
      { moves: "R U R' U' y L' U' L", id: 'a3159711-d65b-4428-9eb2-824977c2e0e0' },
      { moves: "y' F R U' R' U R U R' F'", id: '5fb5998e-db57-4758-9707-55c94dfb84a2' }
    ]
  },
  {
    name: 'CLL T 3',
    id: 'aa5810f4-bbe9-4932-a7c6-b0ce2d2089b4',
    idMethod,
    puzzle,
    group: 'T',
    setup: '',
    algs: [
      { moves: "F U' R U2 R' U' F2 R U R'", id: 'a468d33c-88e6-4330-bfc9-16c06487825d' },
      { moves: "y R U2 R2 F R F' R U' R' U R U2 R'", id: '5e15673c-ca08-4c5c-960f-ff6262e8c8b2' },
      { moves: "y2 R U F R' F' R U2 R U2 R2", id: 'b70b864b-1f88-4998-9ec6-f4a891cdf9f9' },
      { moves: "y' R U' B U2 B' U' R2 F R F'", id: '25326173-002a-4503-9de0-d667a6f7443f' }
    ]
  },
  {
    name: 'CLL T 4',
    id: 'fbe421dd-6a34-4bf0-91df-41e30ab6cdad',
    idMethod,
    puzzle,
    group: 'T',
    setup: '',
    algs: [
      { moves: "R' U R U2 R2 F' R U' R' F2 R2", id: 'bd2793f4-69de-422e-9e21-5f231f46f88b' },
      { moves: "y R' U R' F U' R U F2 R2", id: '688f414f-e674-47da-b626-2074770b436d' },
      { moves: "y2 R' U R' U2 R U2 R' U R2 U' R'", id: '5a25c9ef-a786-45f2-b53b-1ad273bfe39d' },
      { moves: "u' R U R' U R U2 R' L' U' L U' L' U2 L U", id: 'e0c78fa8-1129-4bed-aa6b-3fc35857489d' }
    ]
  },
  {
    name: 'CLL T 5',
    id: '29c078e5-aa2c-413c-a9f2-92e6ae9d559a',
    idMethod,
    puzzle,
    group: 'T',
    setup: '',
    algs: [
      { moves: "y2 F R U R' U' R U' R' U' R U R' F'", id: 'f22d3356-65e9-43d2-9eb3-f711dda2496c' },
      { moves: "y' R U R' U' R U' R' F' U' F R U R'", id: 'b8ab4b84-66bd-47e5-8c1c-c6e7a4366bc0' },
      { moves: "y R U R' U2 R U R' U R' F R F'", id: '571c2fc8-794b-43d7-9820-4e0dfece0192' },
      { moves: "y R2 F' R U' R' F2 R F R' F' R2", id: '43d8ab94-1d21-4f51-9a39-312fa4f726b4' }
    ]
  },
  {
    name: 'CLL T 6',
    id: '46a19cb1-145f-4617-bfcb-8b14de0d07d9',
    idMethod,
    puzzle,
    group: 'T',
    setup: '',
    algs: [
      { moves: "R' U R U2 R2 F R F' R", id: 'df9d7855-29fb-4550-99cf-366a2cad7853' },
      { moves: "U2 y z R U R' U' R' F R2 U' R' U' R U R' F'", id: '673bd881-085b-443c-8c52-37a0dd297972' },
      { moves: "y2 R U' R' U2 L2 F' L' U L'", id: '043dc7f6-91f3-4280-b2dc-6846b98cb0e1' },
      { moves: "y2 R' F R U2 R2 F R U' R", id: '4a61e463-94fb-456c-8bf6-116730db1f7e' }
    ]
  },
  {
    name: 'CLL U 1',
    id: '299e0c31-73e8-4a8d-9172-4010556d844b',
    idMethod,
    puzzle,
    group: 'U',
    setup: '',
    algs: [
      { moves: "y' F R U R' U' F'", id: '0d0861f6-6725-4271-befe-0dbb15668da9' },
      { moves: "y F U R U' R' F'", id: 'fa964d10-5e01-449b-a94c-4492e24498f6' },
      { moves: "R' F' U' F U R", id: 'be7ba5d9-f60c-447d-81fa-5efb03ce07f6' },
      { moves: "y' R' U' F R' F' R U R", id: 'c192fc79-f23b-4260-8be7-6d963930f1fe' }
    ]
  },
  {
    name: 'CLL U 2',
    id: '05fec443-687f-4349-935d-667fd46cd9a4',
    idMethod,
    puzzle,
    group: 'U',
    setup: '',
    algs: [
      { moves: "R' U' R2 U R' U2 R U2 R' U R'", id: '212c4ada-f63a-4b0d-b8b0-c9f88b1d3a1f' },
      { moves: "y' R2 F2 R U R' F R2 U2 R' U' R", id: '2b171502-bde8-48ea-8fe6-bc2714672e96' },
      { moves: "R' F U' R U' R' U2 F2 R", id: '8393d633-dcbe-44bf-8e9e-60e2bc1723cc' },
      { moves: "y2 R2 F2 R U R' F U' R U R2", id: '2e70395d-31bf-4705-9123-16ad081a3d51' }
    ]
  },
  {
    name: 'CLL U 3',
    id: '88a5a45d-5624-43ef-b298-a260ea869e33',
    idMethod,
    puzzle,
    group: 'U',
    setup: '',
    algs: [
      { moves: "y2 F R U R' U2 F' R U' R' F", id: 'da8d72d5-90e4-4af1-85c8-3ee93ff6f97a' },
      { moves: "R' F R U' R' U' R U R' F' R U R' U' R' F R F' R", id: '2846d129-21d3-498f-9b82-50a03666ba27' },
      { moves: "y' R U2 R U' R' F R' F2 U' F", id: '242b40d3-3c53-48ee-ad08-4d5986605af8' },
      { moves: "y' z' U2 R' U' R2 U' R' U' R U' R' U' x2", id: 'ac80b59b-60a6-4333-a979-bf20a8086d3a' }
    ]
  },
  {
    name: 'CLL U 4',
    id: 'a7b21c2c-bc56-43a8-abaf-84f9a2dd5c16',
    idMethod,
    puzzle,
    group: 'U',
    setup: '',
    algs: [
      { moves: "y' F R' F' R U' R U' R' U2 R U' R'", id: '3ab1d0e0-ba76-4c7d-92d8-9e77207e08ee' },
      { moves: "F R U' R' U R U R' U R U' R' F'", id: '155b9170-ef21-43a5-8b7c-546b971d210d' },
      { moves: "R2 F R F' R' F2 R U R' F R2", id: '60780ab3-8cf3-43fa-ba6d-45cffcdb4b5b' },
      { moves: "F' L' U' L U' L' U' L U L' U L F U'", id: 'c3cdf2cb-5dc9-41d8-b29d-a659a114cc0a' }
    ]
  },
  {
    name: 'CLL U 5',
    id: 'f43153b1-39e8-4706-8571-b1c357f45736',
    idMethod,
    puzzle,
    group: 'U',
    setup: '',
    algs: [
      { moves: "R U' R2 F R F' R U R' U' R U R'", id: 'a9847c80-7c6f-4d94-8559-499c253209af' },
      { moves: "y2 R U2 R' U R' F2 R F' R' F2 R", id: '25c34b0d-1f06-4e37-9654-988a5edd419c' },
      { moves: "R2 D' R U2 R' D R U2 R", id: 'e9aebc54-38cf-4a42-af11-1d5ea5bb3612' },
      { moves: "y2 R2 U R2 F' R U R U' R' F R U' R2", id: '5fd9e107-ef23-43ad-821c-883dee97500d' }
    ]
  },
  {
    name: 'CLL U 6',
    id: '75a5c7a5-5f27-4bcf-ab0c-310cc77c7b84',
    idMethod,
    puzzle,
    group: 'U',
    setup: '',
    algs: [
      { moves: "R' U R' F R F' R U2 R' U R", id: '76ac4279-2796-43b4-8305-197aa11faaa2' },
      { moves: "L' U L2 F' L' F L' U' L U L' U' L", id: '520cf9ea-ff92-48aa-ad93-30d54b1e0e2c' },
      { moves: "y' R' U' R2 U' R' U2 R B' R2 F z'", id: '530d52f3-2e1f-4952-8129-93f544d5a130' },
      { moves: "R F' U' R' U' R2 U R' U' R' F R", id: '9ddbbe17-41c6-4037-a82c-e76f00b52ca0' }
    ]
  }
]
