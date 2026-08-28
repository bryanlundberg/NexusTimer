import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

const idMethod = 'L2E_555_ALGS'
const puzzle = '555'
const group = 'Last Two Edges'

export const L2E_555_ALGS: AlgorithmCollection[] = [
  {
    name: 'L2E 1',
    id: '1f776aef-f69a-4021-b53a-e0a9f44cea3b',
    idMethod,
    puzzle,
    group,
    algs: [{ moves: "Rw' U' R' U R' F R F' Rw", id: '95288800-485f-4851-841e-32fe1a57f2cf' }]
  },
  {
    name: 'L2E 2',
    id: '316ced52-004b-4e57-a249-3d1152b015b2',
    idMethod,
    puzzle,
    group,
    algs: [
      { moves: "Lw U' R' U R' F R F' Lw'", id: '7d593f41-8173-47ca-bc21-1721c6200ca1' },
      { moves: "z y Uw F' D' F D' L D L' Uw' y' z'", id: '8b9cdd22-0a0e-4347-b80b-ce07b4cf0735' }
    ]
  },
  {
    name: 'L2E 3',
    id: '3599b8c4-0426-4e69-b10e-f7b449415b35',
    idMethod,
    puzzle,
    group,
    algs: [
      { moves: "x' M' U' R' U R' F R F' M x", id: '7c1c04a2-2978-4a2f-a7d3-4949bec7dafd' },
      { moves: "r' l U' R' U R' F R F' r l'", id: '06b30cc7-e345-4d40-acf4-4d0ae2dcc87c' },
      { moves: "x' z' E' L' U' L U' F U F' E z x", id: '514aed5a-f336-4014-8bcf-06318476878e' }
    ]
  },
  {
    name: 'L2E 4',
    id: 'ee8b399d-bdd2-44ff-a798-79860a97831e',
    idMethod,
    puzzle,
    group,
    algs: [
      { moves: 'Rw2 F2 U2 Rw2 U2 F2 Rw2', id: 'aac68586-9f88-4443-92b7-1986f4fbebcc' },
      { moves: 'Rw2 F2 U2 r2 U2 F2 Rw2', id: '4240aa4e-49e0-4db9-a031-a1199dd62cab' },
      { moves: "z' y' Uw2' R2 F2 Uw2' F2 R2' Uw2'", id: '44ab7b09-777a-47b9-90a4-4aa305369ade' },
      { moves: "y x' Uw2 L2 F2 Uw2 F2 L2 Uw2", id: 'a9495cb1-3442-4f1c-aeb5-079240ca975d' }
    ]
  },
  {
    name: 'L2E 5',
    id: '908f025d-7265-4cbd-bbf7-e83c80441bed',
    idMethod,
    puzzle,
    group,
    algs: [
      {
        moves: "Rw2 B2 Rw' U2 Rw' U2' x' U2 Rw' U2' Rw U2 Rw' U2' Rw2 U2 x",
        id: '248ed3ba-a53c-446e-afd0-5ce4e2812d88'
      },
      { moves: "r2 B2 r' U2 r' U2 x' U2 r' U2 r U2 r' U2 r2 U2", id: '2775ceb8-c78a-4e38-852f-5537448808a8' }
    ]
  },
  {
    name: 'L2E 6',
    id: 'c9d8949f-de67-40ca-9e0e-0ea5ea1e7bf6',
    idMethod,
    puzzle,
    group,
    algs: [
      { moves: "Rw' U2 3Rw U2 3Rw' F2 Rw2 U2 Rw U2 Rw' U2 F2 Rw2 F2", id: '7e823abf-f72c-4bac-8913-17d954f825bb' },
      {
        moves: "Rw U2 x Rw U2 Rw U2 3Rw' U2 Lw U2 Rw' U2 Rw U2 Rw' U2 Rw'",
        id: 'bf4a249a-867e-41c3-88d4-2133ce0efc2f'
      },
      {
        moves: "Rw U2 x Rw U2 Rw U2 Rw' U2 Lw U2 3Rw' U2 Rw U2 Rw' U2 Rw'",
        id: '0e4f1fa9-9c82-43e2-804a-0920d4e8ea90'
      },
      { moves: "Rw2 B2 U2 Lw U2 Rw' U2 Rw U2 F2 Rw F2 Lw' B2 Rw2", id: '3162f67b-b8fa-4a80-9e3d-ac8a2ae09a28' }
    ]
  },
  {
    name: 'L2E 7',
    id: '20275d4f-2712-4958-9d14-008405ac2741',
    idMethod,
    puzzle,
    group,
    algs: [
      { moves: "y2 Rw U2 Rw U2' x U2 Rw U2' 3Rw' U2 Lw U2' Rw2", id: '3b7513bb-7377-48fd-bb44-9505af6fc705' },
      { moves: "Lw' U2 Lw' U2 F2 Lw' F2 Rw U2 Rw' U2 Lw2", id: '4ce1dbf1-e8df-4d16-9991-f42d5c988c4b' }
    ]
  },
  {
    name: 'L2E 8',
    id: 'c71f8658-34ec-43e5-89cb-296a8dc02100',
    idMethod,
    puzzle,
    group,
    algs: [
      { moves: "Lw2 F2 U2 Lw' U2 Lw2 F2 Lw' U2 Lw2 U2 F2 Lw' F2", id: 'c64b884c-c7a5-4685-ad9e-81f97afb8034' },
      { moves: "l2 F2 U2 r U2 r2 F2 r U2 l2 U2 F2 l' F2", id: 'edeb84a3-fea5-4c70-82e9-a74508fac3fe' },
      { moves: "F2 Rw U2 Rw U2' Rw' F2 Rw' U2 Rw' U2' Rw U2 Rw' U2' Rw2", id: '2702dd21-dc90-4d79-b106-450f30b36d2d' }
    ]
  },
  {
    name: 'L2E 9',
    id: 'cf3ffc13-aa40-46e0-9cb7-c2cebcf45839',
    idMethod,
    puzzle,
    group,
    algs: [
      { moves: "B2 Rw' U2 Rw' U2' Rw B2 Rw U2 Rw U2' Rw' U2 Rw U2' Rw2", id: '6b0b2ec3-7c41-42a7-bdf6-304a37f912fd' },
      { moves: 'r2 F2 U2 r U2 r2 F2 r U2 r2 U2 F2 r F2', id: 'f536148c-5b0d-4859-8022-f8a173e03c3b' },
      {
        moves: "x' U2 Rw U2 Rw U2' Rw' F2 Rw' U2 Rw' U2' Rw U2 Rw' U2' Rw2 U2 F2 U2 F2 x",
        id: '946a16c3-ca86-441a-ad16-f220c970a49a'
      },
      { moves: "Rw2 F2 U2 Lw' U2 Lw2 F2 Lw' U2 Rw2 U2 F2 Rw F2", id: '6cef05eb-99e7-4aeb-8ad3-e572b577e90d' }
    ]
  },
  {
    name: 'L2E 10',
    id: '4e656ef7-ee85-4b79-83cf-90cf53d43d13',
    idMethod,
    puzzle,
    group,
    algs: [{ moves: "Rw' U2 Rw2 U2 Rw U2 Rw' U2 Rw U2 Rw2 U2 Rw'", id: 'd4e22a13-a032-49dc-9466-bf0429f581b5' }]
  },
  {
    name: 'L2E 11',
    id: 'bbfadb3b-0db4-4a2d-aec8-1c0345356369',
    idMethod,
    puzzle,
    group,
    algs: [{ moves: "Rw U2 Rw2 U2 Rw' U2 Rw U2 Rw' U2 Rw2 U2 Rw", id: 'b1ca74d3-7b68-41ca-ad99-1baf3f6169c8' }]
  },
  {
    name: 'L2E 12',
    id: 'b4b582b2-eaf0-4055-94cf-3ebda672ff90',
    idMethod,
    puzzle,
    group,
    algs: [
      {
        moves: "Rw' U2 Rw U2 3Lw' U2 Rw U2 Rw U2' Rw' U2 Rw U2' Rw2 D2 F2 U2 D2",
        id: 'a4bf82e0-10de-4d8f-bdfb-562d4bb7ca6b'
      },
      { moves: "Rw' U2 Rw' U2 B2 Rw' B2 Rw' F2 Lw2 F2 Rw U2 Rw2", id: 'ed05d91c-5760-4ca1-b850-e1d5e7263961' }
    ]
  },
  {
    name: 'L2E 13',
    id: '1af5c6a3-9410-40a7-8f15-0fe66d37b855',
    idMethod,
    puzzle,
    group,
    algs: [
      { moves: "r U R' U' r2 U' R' U r2 U R' U' r'", id: 'aab8497f-cedd-4547-9672-70bc286874b9' },
      { moves: "Rw U R U' Rw2 U' R U Rw2 U R U' Rw'", id: 'b7380375-2747-45b0-b769-827c5e2d3a8c' }
    ]
  }
]
