import { AlgorithmCollection } from '@/interfaces/AlgorithmCollection';

export const SARAH_ALGS: AlgorithmCollection[] = [
  {
    "name": "1a",
    "group": "Pi + Swirl Perm",
    "setup": "",
    "algs": [
      "y x R b' r' R' r z B' r B",
      "R r' z' r' z r' R r' R r",
      "H z S z' H z H",
      "H z H z' S z H"
    ]
  },
  {
    "name": "1b",
    "group": "Pi + Swirl Perm",
    "setup": "",
    "algs": [
      "y2 x r' B R r R' B r' B'",
      "x r' R r R r' R' r z' r' R r R' B'",
      "z' S z' S z S z' H",
      "y x r' R r R z2 r' R r R' z' R r' R' r'"
    ]
  },
  {
    "name": "2a",
    "group": "Pi + Swirl Perm",
    "setup": "",
    "algs": [
      "z2 H z' S z S z' S",
      "y2 x r B R' B' r R r R' r' R r",
      "y' x b' r' R r R' z' R r' R' r R r R'",
      "y2 x b' r' R r R r' R' r z r B r' B'"
    ]
  },
  {
    "name": "2b",
    "group": "Pi + Swirl Perm",
    "setup": "",
    "algs": [
      "z S z' H z H z' H",
      "x R b R' z' R r' R' B' r",
      "x z R' r' R' r z R r R' r z' r' R r R'",
      "y2 x B' r' R r R z R r R' r' R' r R'"
    ]
  },
  {
    "name": "1c",
    "group": "Pi + Swirl Perm",
    "setup": "",
    "algs": [
      "S z H z' S z H",
      "x y2 r' R r R b' r R' b'",
      "y x R r' R r R' B R' B' r' R' r R",
      "y' x r B' b' r' B' r B b"
    ]
  },
  {
    "name": "1d",
    "group": "Pi + Swirl Perm",
    "setup": "",
    "algs": [
      "z' H z' S z H z' H",
      "x r' R r z R r R' z' r' R' r R'",
      "y x R' r' R' r z R r' R' r' R r R'",
      "y x' R r' R' r' B R' r B"
    ]
  },
  {
    "name": "2c",
    "group": "Pi + Swirl Perm",
    "setup": "",
    "algs": [
      "z2 S z' H z H z' H",
      "z2 H z' H z S z' H",
      "x r' R r' R' z' r' R r B R B'",
      "y2 x R' r' B' r B R r B'"
    ]
  },
  {
    "name": "2d",
    "group": "Pi + Swirl Perm",
    "setup": "",
    "algs": [
      "z S z S z' H z S",
      "y' x R r' R r B R' B' r' R' r",
      "x b r B r' B' z' r' R' b",
      "y2 z B' b' R r' b r B r'"
    ]
  },
  {
    "name": "3a",
    "group": "Pi + Wat Perm",
    "setup": "",
    "algs": [
      "z' S z2 H z' S z' S",
      "x r2' R r B R r' R B",
      "y x R B R' B' R' r' R r R r' R' r",
      "y' x r' R r R' r' R' r R B R B' R'"
    ]
  },
  {
    "name": "3b",
    "group": "Pi + Wat Perm",
    "setup": "",
    "algs": [
      "x B' R' B' r' R' B R' r'",
      "y x R' r' R r R B R' B' R' B R B'",
      "y2 x R r R' r' R' z' r' R r z R r'",
      "y x B R' B' R B R B' R' r' R' r R"
    ]
  },
  {
    "name": "4a",
    "group": "Pi + Wat Perm",
    "setup": "",
    "algs": [
      "x r' R' r B R' B' R' r' R r R'",
      "y2 x r R' r B r' z r R' r' R' r",
      "z S y S z2 S"
    ]
  },
  {
    "name": "4b",
    "group": "Pi + Wat Perm",
    "setup": "",
    "algs": [
      "y x r' R r R B' r' R' r B R'",
      "x B R B' r' R r R B R' B' R",
      "y' x R r' R' r R r' R r B R' B' R'",
      "z2 H y' S z2 S"
    ]
  },
  {
    "name": "3c",
    "group": "Pi + Wat Perm",
    "setup": "",
    "algs": [
      "z S z S z H z2 S",
      "y' x R r' R' r R' r' R r z r R r' R'",
      "y x B R B' R' r' R' r R r' R r R'",
      "y' x R' r R r' R' r R' r' z R r' R'"
    ]
  },
  {
    "name": "3d",
    "group": "Pi + Wat Perm",
    "setup": "",
    "algs": [
      "H z' H z' S z2 H",
      "x r' R r R' r R r' R' z' R' r' R r",
      "x r R' r' R r R' z' R B r' R r",
      "y' x r' R' r R z R r R' r' R r' R' r"
    ]
  },
  {
    "name": "4c",
    "group": "Pi + Wat Perm",
    "setup": "",
    "algs": [
      "y' x R r' R r z R r' R' r R r R'",
      "y2 x r' R r R B R' B' R' r' R' r R",
      "x R r' R' r' R r R' z' r' R' r R'",
      "z H y S z2 S"
    ]
  },
  {
    "name": "4d",
    "group": "Pi + Wat Perm",
    "setup": "",
    "algs": [
      "y x R r' R ' r' z' r' R r R z R r R' r'",
      "y' x r' R r R r' R' r B R B' R",
      "y x R' B R' B' r' R r R' r' R' r",
      "z2 S y' S z2 S"
    ]
  },
  {
    "name": "5a",
    "group": "Pi  + X Perm",
    "setup": "",
    "algs": [
      "x' S z2 S y2 x' H",
      "x z' r' R z' r' R r z r R r' R",
      "x R' r' R r R z B R' B' R r'",
      "x z' r' R' r B r' R r z R r' R r"
    ]
  },
  {
    "name": "5b",
    "group": "Pi  + X Perm",
    "setup": "",
    "algs": [
      "y2 x R r' B R' B' R' r' R r'",
      "y z' S z2 S x y2 S",
      "y x b' r' R r R' z2 r' R' r R'",
      "r R' r B x r' l r l' r"
    ]
  },
  {
    "name": "6a",
    "group": "Pi  + X Perm",
    "setup": "",
    "algs": [
      "y x R r' R r z2 R r' R' r b",
      "y x R r' R r z B R' B' R r",
      "x r2' R' r z r R r R' b r'",
      "z H z2 x' S z2 S"
    ]
  },
  {
    "name": "6b",
    "group": "Pi  + X Perm",
    "setup": "",
    "algs": [
      "y' x R' r R' r' z' r' R' r z R' r",
      "y2 x r' R r' R' z2 r' R r R' B'",
      "z2 S y2 x' S z2 S"
    ]
  },
  {
    "name": "5c",
    "group": "Pi  + X Perm",
    "setup": "",
    "algs": [
      "x' S z2 S y2 x' S",
      "y' x r' R r' R' r' R r R' z' R r' R r",
      "x r' R' r R' z2 r' R r R' b'",
      "y' x R r R' r R r' R' r z' r' R r"
    ]
  },
  {
    "name": "5d",
    "group": "Pi  + X Perm",
    "setup": "",
    "algs": [
      "y z' S z2 S z2 x' H",
      "x r' R' r R' r' R r R' B R' B'",
      "x z R r R' z' R r z' r' R' r B",
      "x R r' R r R r' R' r z r' R r' R'"
    ]
  },
  {
    "name": "6c",
    "group": "Pi  + X Perm",
    "setup": "",
    "algs": [
      "y' x B' r' R r R' z2 r' R r' R'",
      "x r' R r R' z' R' r' R r R B R' B'",
      "y2 x B R B' R r' R' r R r' R r",
      "z S z2 y' S z2 S"
    ]
  },
  {
    "name": "6d",
    "group": "Pi  + X Perm",
    "setup": "",
    "algs": [
      "y x r B R' B' R r z' r' R r",
      "x z R r' R' r R B R' B' R' r' R r",
      "x z r R' B r z' r2' R r B' R'",
      "y2 x r' R' r z r' R r R' r2/r' R r' R'"
    ]
  },
  {
    "name": "7a",
    "group": "Pi + Horizontal U Perm",
    "setup": "",
    "algs": [
      "y' x B r' R r' R' r B r'",
      "z S S y2 x' S z2 S"
    ]
  },
  {
    "name": "7b",
    "group": "Pi + Horizontal U Perm",
    "setup": "",
    "algs": [
      "y2 x r' z R r' R r z r' B' r",
      "y x b' R r' R r R' b' R",
      "z S S y' S z2 S"
    ]
  },
  {
    "name": "7c",
    "group": "Pi + Horizontal U Perm",
    "setup": "",
    "algs": [
      "y' x r B' r' R r R' r B'",
      "z' S S z2 y' S z2 S"
    ]
  },
  {
    "name": "7d",
    "group": "Pi + Horizontal U Perm",
    "setup": "",
    "algs": [
      "y2 x B' r z R r' R' r z' B' r",
      "y z' r' R r B' r' b B' l",
      "S S y S z2 S"
    ]
  },
  {
    "name": "8a",
    "group": "Pi + Horizontal U Perm",
    "setup": "",
    "algs": [
      "x R' r R' B b r' R r'",
      "y2 x r' R r B R' B' R' r' R' r R'",
      "S z' S z' S"
    ]
  },
  {
    "name": "8b",
    "group": "Pi + Horizontal U Perm",
    "setup": "",
    "algs": [
      "x R' r B R' B' r2' R' r",
      "y x r' B R B' z' r' R r B'",
      "y' x B R' B r' R' r B R'",
      "y' x r' R r R z' r' R' r B r' R r"
    ]
  },
  {
    "name": "8c",
    "group": "Pi + Horizontal U Perm",
    "setup": "",
    "algs": [
      "H z H z H",
      "x r R' r b' B' R r' R",
      "y2 x R r' R' z' r' R r R z R r R' r",
      "S z H z S"
    ]
  },
  {
    "name": "8d",
    "group": "Pi + Horizontal U Perm",
    "setup": "",
    "algs": [
      "H z S z H",
      "y x R B' r' R r z R' r R'",
      "x B r' R' r z B R' B' r",
      "y2 x r' R r' B R B' r' R"
    ]
  },
  {
    "name": "9a",
    "group": "Pi + Vertical U Perm",
    "setup": "",
    "algs": [
      "y' x B' r' R r R B' R' r' R' r B'",
      "y' x R r R' r B r' z' r' R r R' b",
      "y' r' R r B' R B r' R' r R'",
      "r' l r l' r' R' F r' R r"
    ]
  },
  {
    "name": "9b",
    "group": "Pi + Vertical U Perm",
    "setup": "",
    "algs": [
      "S z2 S z' S S",
      "y' x B r' R r z R r' R' r R' r'",
      "x z r B R' B' z' r' R' r B",
      "y2 x r' B R' B' r' R r R' r R"
    ]
  },
  {
    "name": "10a",
    "group": "Pi + Vertical U Perm",
    "setup": "",
    "algs": [
      "x z r B r B' r' B'",
      "y' z' B R r R' B' R'",
      "S z2 H"
    ]
  },
  {
    "name": "10b",
    "group": "Pi + Vertical U Perm",
    "setup": "",
    "algs": [
      "x B' r' B' r B r",
      "x B' r' y' r' R r b",
      "z2 H z2 S"
    ]
  },
  {
    "name": "11a",
    "group": "Pi + O Perm",
    "setup": "",
    "algs": [
      "y' x R r' R' r' R r R' z' r' R r",
      "z2 H z' S z2 S"
    ]
  },
  {
    "name": "11b",
    "group": "Pi + O Perm",
    "setup": "",
    "algs": [
      "x r' R r R r' R' r z R r' R'",
      "z S z S z2 S"
    ]
  },
  {
    "name": "12a",
    "group": "Pi + O Perm",
    "setup": "",
    "algs": [
      "z S z' x' S z2 S",
      "y' x r' R' r z R r' R' r R r R'",
      "y' x r' R' r B' R z R r R' r' R",
      "y2 x R r' R' r b r' R r R' z' R r' R'"
    ]
  },
  {
    "name": "12b",
    "group": "Pi + O Perm",
    "setup": "",
    "algs": [
      "z2 H z x S z2 S",
      "y x B R B' r' R r R' r' R' r",
      "y2 x R r' z r R r R' z2 r' R r",
      "z S z2 S z' H"
    ]
  },
  {
    "name": "11c",
    "group": "Pi + O Perm",
    "setup": "",
    "algs": [
      "y x r R' r B r' R B",
      "y x r2' R' r B r' R B",
      "z2 S z' S z2 S"
    ]
  },
  {
    "name": "11d",
    "group": "Pi + O Perm",
    "setup": "",
    "algs": [
      "z H z H z2 H",
      "y2 x R' r R' z' r' B R' r'",
      "z H z S z2 S"
    ]
  },
  {
    "name": "12c",
    "group": "Pi + O Perm",
    "setup": "",
    "algs": [
      "z H y' z' S z2 S",
      "x B' R' r B' r' R r'",
      "z2 S z2 S z H"
    ]
  },
  {
    "name": "12d",
    "group": "Pi + O Perm",
    "setup": "",
    "algs": [
      "z2 S x y' S z2 S",
      "x r R B' r B R' B",
      "z S z2 S z S"
    ]
  },
  {
    "name": "13a",
    "group": "Pi + Z Perm Conjugates",
    "setup": "",
    "algs": [
      "y x r' R' r' R' z' r' R r R B'",
      "y x r' R' r B' r' R r B",
      "H x' y S z2 S"
    ]
  },
  {
    "name": "13b",
    "group": "Pi + Z Perm Conjugates",
    "setup": "",
    "algs": [
      "y' x B R B' r B R' B' r'",
      "y' r B r' R r B' r' R'",
      "z' S x' y S z2 S"
    ]
  },
  {
    "name": "13c",
    "group": "Pi + Z Perm Conjugates",
    "setup": "",
    "algs": [
      "x r B R B' r' B R' B'",
      "H x' y S z2 S"
    ]
  },
  {
    "name": "13d",
    "group": "Pi + Z Perm Conjugates",
    "setup": "",
    "algs": [
      "x B' r' R' r B r' R r",
      "z' S x' y S z2 S"
    ]
  },
  {
    "name": "14a",
    "group": "Pi + Z Perm Conjugates",
    "setup": "",
    "algs": [
      "z' H z' S z S",
      "x R' r' R' r R r' R' r R r' R r",
      "x z R' r' R r B' r' R' r B R",
      "y x r R r R' r' R r' R' r R r' R'"
    ]
  },
  {
    "name": "14b",
    "group": "Pi + Z Perm Conjugates",
    "setup": "",
    "algs": [
      "z H z' H z S",
      "y x R' B' r' R r B r' R' r R",
      "y2 x B R' B' r' R r R' z' R r' R' r B",
      "z S z' H z H"
    ]
  },
  {
    "name": "14c",
    "group": "Pi + Z Perm Conjugates",
    "setup": "",
    "algs": [
      "z' S z H z' H",
      "y2 x r R r R' r' R' r R r R' r' R r",
      "y2 x R' r' R r' R' r R r' R r R' r",
      "y z r' R' r R r' R' r' R r R' r R"
    ]
  },
  {
    "name": "14d",
    "group": "Pi + Z Perm Conjugates",
    "setup": "",
    "algs": [
      "z S z S z' H",
      "z H z S z' S",
      "y' x R r R' B R B' R r2' R r",
      "x R r R' r R r' R' r R r' R' r'"
    ]
  },
  {
    "name": "15a",
    "group": "Pi + Triple Sledge",
    "setup": "",
    "algs": [
      "S S y S S S",
      "x r' R r R r' z' r' R r z r R r'",
      "x R r' R' r' R B R' B' R' r' R",
      "y2 x R r R' B' R r' R' r R r R' B'"
    ]
  },
  {
    "name": "15b",
    "group": "Pi + Triple Sledge",
    "setup": "",
    "algs": [
      "y' S S y' S S S",
      "x r R' r' z' r' R' r z r R' r' R' r",
      "x R' r' R r z r b r' R r R' z' R r' R",
      "y2 x b' r' R r R r' R' r b' r' R r"
    ]
  },
  {
    "name": "16",
    "group": "Pi + H or Z Perm",
    "setup": "",
    "algs": [
      "z' S z2 S z2 S",
      "z S z2 S z2 H",
      "x r B R B' r2' R r R",
      "y2 x R' r' R' r' B R' B' r'"
    ]
  },
  {
    "name": "17a",
    "group": "Pi + H or Z Perm",
    "setup": "",
    "algs": [
      "z S z' H z H z' S z H",
      "y2 x r' R' r R B R' B' r' R r",
      "x r' R' r B R B' R' r' R r"
    ]
  },
  {
    "name": "17b",
    "group": "Pi + H or Z Perm",
    "setup": "",
    "algs": [
      "z S z H z' H z S z' H",
      "y2 x R r R' r' z' r' R r z R r' R'",
      "y x R r2' R' r B r' R r' R' r B",
      "x R r R' z' r' R' r R z R r' R'"
    ]
  },
  {
    "name": "18a",
    "group": "Peanut + Swirl Perm",
    "setup": "",
    "algs": [
      "H z H z' H z H",
      "S z' H x y S z2 S",
      "z2 H z H x S z2 S",
      "y x b' r' R r R' z' R r' R' r'"
    ]
  },
  {
    "name": "18b",
    "group": "Peanut + Swirl Perm",
    "setup": "",
    "algs": [
      "z' S z' S z S z' S",
      "z' H z S x' y S z2 S",
      "z S z' S y' S z2 S",
      "x r R r R' z R r' R' r b"
    ]
  },
  {
    "name": "18c",
    "group": "Peanut + Swirl Perm",
    "setup": "",
    "algs": [
      "z2 S z' H z S z' H",
      "S z' H x y S z2 S",
      "z2 H z H x S z2 S",
      "x R r' R r z R r' R' r'"
    ]
  },
  {
    "name": "18d",
    "group": "Peanut + Swirl Perm",
    "setup": "",
    "algs": [
      "z H z S z' H z S",
      "z' H z S y S z2 S",
      "z S z' S x' y S z2 S",
      "x z r' R r' R' z' r' R r R"
    ]
  },
  {
    "name": "18e",
    "group": "Peanut + Swirl Perm",
    "setup": "",
    "algs": [
      "y' x B r' R r R' z R r' R r",
      "S z S z' S z S",
      "z2 S z S y S z2 S",
      "H z' S x y S z2 S"
    ]
  },
  {
    "name": "18f",
    "group": "Peanut + Swirl Perm",
    "setup": "",
    "algs": [
      "z' H z' H z H z' H",
      "z H z' H y' S z2 S",
      "z' S z H x' y S z2 S",
      "y2 x B r' R r R' z R r' R' r R'"
    ]
  },
  {
    "name": "18g",
    "group": "Peanut + Swirl Perm",
    "setup": "",
    "algs": [
      "z2 H z' S z H z' S",
      "H z' S y' S z2 S",
      "z2 S z' S x' y S z2 S",
      "x R' r' R' r z R r R' r"
    ]
  },
  {
    "name": "18h",
    "group": "Peanut + Swirl Perm",
    "setup": "",
    "algs": [
      "z S z H z' S z H",
      "z H z' H x' y S z2 S",
      "z' S z H y S z2 S",
      "x z r R r R' z' r' R' r R'"
    ]
  },
  {
    "name": "19a",
    "group": "Peanut + Wat Perm",
    "setup": "",
    "algs": [
      "z' H z S y' S z2 S",
      "y' x r R r R' B R' B' R' r R'",
      "z2 S z2 S z' H z' H",
      "S z S z S z2 S"
    ]
  },
  {
    "name": "19b",
    "group": "Peanut + Wat Perm",
    "setup": "",
    "algs": [
      "S z' H y S z2 S",
      "z S z2 S z S z S",
      "z' H z' H z' S z2 S",
      "y2 x r' R r z R r R' z R r' R' r b"
    ]
  },
  {
    "name": "19c",
    "group": "Peanut + Wat Perm",
    "setup": "",
    "algs": [
      "z S z' S y S z2 S",
      "z2 S z2 S z S z H",
      "S z' H z' S z2 S",
      "x r2' R r R' z' r' R r"
    ]
  },
  {
    "name": "19d",
    "group": "Peanut + Wat Perm",
    "setup": "",
    "algs": [
      "z2 H z' H y' S z2 S",
      "z S z2 S z' H z' S",
      "z' H z S z S z2 S",
      "x R r R' z' r' R r R"
    ]
  },
  {
    "name": "19e",
    "group": "Peanut + Wat Perm",
    "setup": "",
    "algs": [
      "z2 S z2 S z' S z' S",
      "H z H z S z2 S",
      "y x B' R r R' r' R r R' B' r",
      "y2 x b r' R' r z2 r' R r b'"
    ]
  },
  {
    "name": "19f",
    "group": "Peanut + Wat Perm",
    "setup": "",
    "algs": [
      "z S z2 S z H z H",
      "S z' S z' S z2 S",
      "y r' R r b' B z' R' r' R",
      "x z' B' R r R' z2 R r' R' B"
    ]
  },
  {
    "name": "19g",
    "group": "Peanut + Wat Perm",
    "setup": "",
    "algs": [
      "z2 S z2 S z H z S",
      "H z S z' S z2 S",
      "x z R' r' R r z r R r R' r",
      "x r' R r' R' r' z' r' R' r R"
    ]
  },
  {
    "name": "19h",
    "group": "Peanut + Wat Perm",
    "setup": "",
    "algs": [
      "z S z2 S z' S z' H",
      "S z H z S z2 S",
      "x r R r' R' z' R' r' R' r R'",
      "y' x R r' R r R z R r R' r'"
    ]
  },
  {
    "name": "20a",
    "group": "Peanut + X Perm",
    "setup": "",
    "algs": [
      "z S z' S"
    ]
  },
  {
    "name": "20b",
    "group": "Peanut + X Perm",
    "setup": "",
    "algs": [
      "S z S"
    ]
  },
  {
    "name": "20c",
    "group": "Peanut + X Perm",
    "setup": "",
    "algs": [
      "z2 H z H"
    ]
  },
  {
    "name": "20d",
    "group": "Peanut + X Perm",
    "setup": "",
    "algs": [
      "y r' B r' R r R' r2 B",
      "z' H z' H"
    ]
  },
  {
    "name": "20e",
    "group": "Peanut + X Perm",
    "setup": "",
    "algs": [
      "y2 x B' R r' R' r z r' R r",
      "S z' H"
    ]
  },
  {
    "name": "20f",
    "group": "Peanut + X Perm",
    "setup": "",
    "algs": [
      "y' x r' R' r z' r' R r R' B",
      "z S z H"
    ]
  },
  {
    "name": "20g",
    "group": "Peanut + X Perm",
    "setup": "",
    "algs": [
      "x y b r' R r R' z' R r' R'",
      "y x R' r' R r R' z' R r' R' r B",
      "z' H z S"
    ]
  },
  {
    "name": "20h",
    "group": "Peanut + X Perm",
    "setup": "",
    "algs": [
      "x R r R' z R r' R' r b'",
      "x B' r' R r R' z R r' R' r R",
      "z2 H z' S"
    ]
  },
  {
    "name": "21a",
    "group": "Peanut + Horizontal U Perm",
    "setup": "",
    "algs": [
      "y x b' r' R r R z' r' B' r B r'",
      "y' x R r' R' z' r' R r z r R r' R' r' R r R'",
      "z H z H z S"
    ]
  },
  {
    "name": "21b",
    "group": "Peanut + Horizontal U Perm",
    "setup": "",
    "algs": [
      "y' x R r R' z R r' R' r z' r2' R r R'",
      "x z R r R r' R' r' z' r' R r B'",
      "y2 x B r' R r R z R r R' B R' B'",
      "z H z' S z' S"
    ]
  },
  {
    "name": "21c",
    "group": "Peanut + Horizontal U Perm",
    "setup": "",
    "algs": [
      "x B' r R' r' B r R r'",
      "x B' r' B r B' z r' R' r z' r'",
      "x r' R z R r' z' r' R' r' R' r R' B",
      "z2 S z' S z' H"
    ]
  },
  {
    "name": "21d",
    "group": "Peanut + Horizontal U Perm",
    "setup": "",
    "algs": [
      "x r' R' r' R r R B R' B' r",
      "x r' R' r z' r' R r R' z R' r' R' r",
      "y x b' R r' R' r' z' r' R' r z' r' R r",
      "y2 x r R' r' B' r R r' B"
    ]
  },
  {
    "name": "21e",
    "group": "Peanut + Horizontal U Perm",
    "setup": "",
    "algs": [
      "y x R' r R' r' z' r' R' r z r R'",
      "y2 x R r R' B R B' r' R r R r'",
      "y2 x R r R' r' R' z' r' R' r B R",
      "z' S z' H z' H"
    ]
  },
  {
    "name": "21f",
    "group": "Peanut + Horizontal U Perm",
    "setup": "",
    "algs": [
      "y' x R r' z' r' R r z r R r' R",
      "x r' R' z' r' R r z R r R r' R'",
      "z' S z S z H"
    ]
  },
  {
    "name": "21g",
    "group": "Peanut + Horizontal U Perm",
    "setup": "",
    "algs": [
      "x R' B' R r' y' r' R' z' R r R'",
      "x R' r' R' r B R' B' R r' R' r",
      "y2 x r R' r z r R r R' r' z' r",
      "x z B r' R r R r' R' r B r' R' r B"
    ]
  },
  {
    "name": "21h",
    "group": "Peanut + Horizontal U Perm",
    "setup": "",
    "algs": [
      "x r' R B R' B' R' r' R r'",
      "y2 x r' R r R' r' R' z' r' R' r B R'",
      "H z' H z' S"
    ]
  },
  {
    "name": "22a",
    "group": "Peanut + Vertical U Perm",
    "setup": "",
    "algs": [
      "x r R' r' R r R B R' B' r'",
      "x z2 r B R B' R' r' R' r R r'",
      "x r R' r' R r R B R' B' r'"
    ]
  },
  {
    "name": "22b",
    "group": "Peanut + Vertical U Perm",
    "setup": "",
    "algs": [
      "x B' R B R' B' R' r' R r B",
      "x z2 B' r' R' r R B R B' R' B",
      "y' R' r' R r z' r' R r R'"
    ]
  },
  {
    "name": "22c",
    "group": "Peanut + Vertical U Perm",
    "setup": "",
    "algs": [
      "y r' R' r R z' R r' R' r",
      "y x r R' r' z' r' R' r z r R",
      "y' x R' r' z' r' R r z r R r'"
    ]
  },
  {
    "name": "22d",
    "group": "Peanut + Vertical U Perm",
    "setup": "",
    "algs": [
      "y r R r' R' x r' R r R'",
      "z2 R r R' r' z r' R r R'",
      "x r R z R r' R' z' R' r' R"
    ]
  },
  {
    "name": "23a",
    "group": "Peanut + O Perm",
    "setup": "",
    "algs": [
      "x z r R r' R' z' R' r' R r",
      "z2 H z' H z2 S"
    ]
  },
  {
    "name": "23b",
    "group": "Peanut + O Perm",
    "setup": "",
    "algs": [
      "x R' r' R r z r R r' R'",
      "y2 x B r R' r' B' r R r'",
      "z S z S z2 H"
    ]
  },
  {
    "name": "23c",
    "group": "Peanut + O Perm",
    "setup": "",
    "algs": [
      "x r' R' r R z R r R' r'",
      "z H z H z2 S"
    ]
  },
  {
    "name": "23d",
    "group": "Peanut + O Perm",
    "setup": "",
    "algs": [
      "x z R r R' r' z' r' R' r R",
      "z2 S z' S z2 H"
    ]
  },
  {
    "name": "23e",
    "group": "Peanut + O Perm",
    "setup": "",
    "algs": [
      "y' R r R B R' B' R' r'",
      "x z2 r R r R' r' R' z' r' R' r B",
      "S z H z2 S"
    ]
  },
  {
    "name": "23f",
    "group": "Peanut + O Perm",
    "setup": "",
    "algs": [
      "y x B' r' R r R' z R' r' R r R",
      "y x R B' r' B' r B r B R' B'",
      "y r R B R B' R' r' R'",
      "x2 r' R' z' R' r' R r z r R"
    ]
  },
  {
    "name": "23g",
    "group": "Peanut + O Perm",
    "setup": "",
    "algs": [
      "y2 x b r' R r R' z' R r R' r",
      "y' z' r' R' r l' r' R r R",
      "y x r B' r' R r R' r z r' R' r",
      "H z S z2 H"
    ]
  },
  {
    "name": "23h",
    "group": "Peanut + O Perm",
    "setup": "",
    "algs": [
      "y r' R' r' R r z' r' R r",
      "y x r' R r' R' z R r' R' r b'",
      "z' S z' H z2 S"
    ]
  },
  {
    "name": "24a",
    "group": "Peanut + Z Perm Conjugates",
    "setup": "",
    "algs": [
      "x z R r R' r' R r R' r z' r' R r",
      "z' S z' H z S"
    ]
  },
  {
    "name": "24b",
    "group": "Peanut + Z Perm Conjugates",
    "setup": "",
    "algs": [
      "x r' R' r R r' R' r R' z R r' R'",
      "x R B R' B' r' R' r R r' R' r R",
      "y x B r' R r' R' r B z' r' R' r",
      "y' x R' r' R' r' z' r' R' r R r' R' r B'"
    ]
  },
  {
    "name": "24c",
    "group": "Peanut + Z Perm Conjugates",
    "setup": "",
    "algs": [
      "x r' R' r R' z R r' R' r R r' R'",
      "x r' B R' B' R B R' B' R' r' R' r'",
      "x z2 r R r z B r' B' z' r' R' r' z' r",
      "z' H z' S z H"
    ]
  },
  {
    "name": "24d",
    "group": "Peanut + Z Perm Conjugates",
    "setup": "",
    "algs": [
      "y' x R r' R r R' z R r' R' r R r' R'",
      "y x R r R' r z' r' R r R' r' R r",
      "x B r' R r R' r' R r z r R r R",
      "S z H z' S"
    ]
  },
  {
    "name": "25a",
    "group": "Peanut + Z Perm Conjugates",
    "setup": "",
    "algs": [
      "y' x r' R' r' z' r' R' r R r' R' r B",
      "y2 x r R r R' r' R r R' z' R r' R' r R",
      "x z' r B r' R' r B r' R r' B'",
      "z2 S z' S z S"
    ]
  },
  {
    "name": "25b",
    "group": "Peanut + Z Perm Conjugates",
    "setup": "",
    "algs": [
      "y2 r B R' B' R B R' B' R' r' R'",
      "z' S z S z' S"
    ]
  },
  {
    "name": "25c",
    "group": "Peanut + Z Perm Conjugates",
    "setup": "",
    "algs": [
      "y' x b' R r R' r' R r R' r z' r' R r'",
      "x R r z r R r R' r' R r R' z' r'",
      "z H z H z' H"
    ]
  },
  {
    "name": "25d",
    "group": "Peanut + Z Perm Conjugates",
    "setup": "",
    "algs": [
      "y2 x B' r' R r R' r' R r z r R r",
      "x z r' R r R' z' b' r' R r R' z' R r' R' r'",
      "H z' H z H"
    ]
  },
  {
    "name": "26a",
    "group": "Peanut+ Triple Sledge",
    "setup": "",
    "algs": [
      "S z H H",
      "S z' S S"
    ]
  },
  {
    "name": "26b",
    "group": "Peanut+ Triple Sledge",
    "setup": "",
    "algs": [
      "S z' H H",
      "x r R r' R' r B R' B' R' r' R'",
      "x B r' R r R z R r R' r' R r R",
      "z2 S S z' S"
    ]
  },
  {
    "name": "26c",
    "group": "Peanut+ Triple Sledge",
    "setup": "",
    "algs": [
      "z2 S S z H",
      "z' H z H H"
    ]
  },
  {
    "name": "26d",
    "group": "Peanut+ Triple Sledge",
    "setup": "",
    "algs": [
      "z H H z H",
      "x z' r' B R' B' R' r' R' r R r' R' r'",
      "z2 H z S S"
    ]
  },
  {
    "name": "27",
    "group": "Peanut + H or Z Perm and Pure Peanut",
    "setup": "",
    "algs": [
      "y2 B r' R r R' B' z' R r' R' r",
      "z2 S S z S S",
      "y2 x r' R' z' r B r' R r y' r' R' r",
      "x z' B' r' R r R' B' z2 R r' R' r b'"
    ]
  },
  {
    "name": "28",
    "group": "Peanut + H or Z Perm and Pure Peanut",
    "setup": "",
    "algs": [
      "S z' S S z' S z2 S",
      "x z' r' R' r z r' R r R' r z' r' R' r R",
      "x z R' r' R r R' z R r' R' r z' r' R r",
      "x z r' R r x R r' R z R r' R' r"
    ]
  },
  {
    "name": "29a",
    "group": "Peanut + H or Z Perm and Pure Peanut",
    "setup": "",
    "algs": [
      "y x r' R' r R r' R' r' z' r' R' r B",
      "y x r R r' R' z' r' R' r z r' R r' R'",
      "x z' B' r' R r R z R r R' r' R r",
      "x z2 R r R' r' R r R z R r R' b'"
    ]
  },
  {
    "name": "29b",
    "group": "Peanut + H or Z Perm and Pure Peanut",
    "setup": "",
    "algs": [
      "y' r' R r y' r l B r' l B'",
      "y z' r' R' r y z' r' R r b r' R' r",
      "z S z' H z S z' H z H",
      "x R r' R r' R' z' r' R r B' R"
    ]
  },
  {
    "name": "30a",
    "group": "L4C",
    "setup": "",
    "algs": [
      "y2 x B' r' B r B R r' R'",
      "y2 x r B r' z' b' r' R' r b",
      "y' x R' r' R' r b z r B r' z' b' R",
      "y' x R' r' B' r B R r R' B'"
    ]
  },
  {
    "name": "30b",
    "group": "L4C",
    "setup": "",
    "algs": [
      "y x B r' B' z' r' R' r b R",
      "x B' r B r' B' z' r' R' r b'",
      "y' x R r R' r' R r R' r2 R r R' r'",
      "x B r B' r' B' z' r' R r"
    ]
  },
  {
    "name": "31",
    "group": "L4C",
    "setup": "",
    "algs": [
      "y2 x b' r' R' r b z r B r'",
      "y2 x b z r B r' B' z' r' R' r",
      "x z2 B R r R' B' r' B' r",
      "x z2 B' r' B' r B R r R'"
    ]
  },
  {
    "name": "U Perm",
    "group": "L4C",
    "setup": "",
    "algs": [
      "z' x S z2 S",
      "y x b' r' R r R' z2 r' R r",
      "y x' r' R' r z2 R r' R' r b"
    ]
  },
  {
    "name": "32",
    "group": "L4C",
    "setup": "",
    "algs": [
      "y x r' B r' B' z' r' R' r z B r'",
      "y x r B' r B R r R' B' r",
      "y x R2' B' r' B' r B R r R",
      "x r' B' r' B' r B R r R r"
    ]
  },
  {
    "name": "33",
    "group": "L4C",
    "setup": "",
    "algs": [
      "r R' r R' b' r B' r",
      "r R' r R' x' B' R r' B",
      "r R' r R' y L' l L' l",
      "x r' R r R' B' r' B' r B r"
    ]
  },
  {
    "name": "34a",
    "group": "L4C",
    "setup": "",
    "algs": [
      "x b r' R r R' z2 r' R r R"
    ]
  },
  {
    "name": "34b",
    "group": "L4C",
    "setup": "",
    "algs": [
      "x B' r' R r R' z2 r' R r R' r",
      "y x R' r' R' r z2 R r' R' r b'"
    ]
  },
  {
    "name": "35a",
    "group": "L5C",
    "setup": "",
    "algs": [
      "y' x r' R r R' r R y' r' R r B' r",
      "y' x b R r' b r R' b' r R' r'",
      "y x r' R r R' b' R r' R r R' b' R",
      "z' S z2 S x y' S z2 S"
    ]
  },
  {
    "name": "35b",
    "group": "L5C",
    "setup": "",
    "algs": [
      "y2 x R r' R' r B r' R r' R' r B r'",
      "x r B' r' R r R' r B' r' R r R'",
      "y x B' r' R r R' r R y' r' R r B' r'",
      "x z R r' b z' R B' r' R B' R' r"
    ]
  },
  {
    "name": "36a",
    "group": "L5C",
    "setup": "",
    "algs": [
      "H z2 H z H z2 H",
      "y' x r' R' r B r' R r' R' r B r' R",
      "y x R' r B r' R r' R' r B r' R r'",
      "y x r' R r R' r B' r' R r R' r B'"
    ]
  },
  {
    "name": "36b",
    "group": "L5C",
    "setup": "",
    "algs": [
      "S z2 S x' y S z2 S",
      "y' x B r' R r' R' r B r' R r' R' r",
      "x B' r' R' r B r' R r z' r' R r R'",
      "y2 x B r' R r R' r R y' r' R r B'"
    ]
  },
  {
    "name": "37a",
    "group": "L5C",
    "setup": "",
    "algs": [
      "S z S z' H z H",
      "x B' r' R r R' r B' r' R r R' r",
      "y' x r' R' r B r' R r z' r' R r R' z' r'",
      "y2 x R r' R r R' z' r2' R' r B r' R"
    ]
  },
  {
    "name": "37b",
    "group": "L5C",
    "setup": "",
    "algs": [
      "x r' R r z' r B' R r' R' B' r",
      "z' H z' H z S z' S",
      "x r B r' R r' R' r B r' R r' R'",
      "y2 x r' R r' R' r B r' R r' R' r B"
    ]
  }
]
