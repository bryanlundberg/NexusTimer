import { AlgorithmCollection } from '@/interfaces/AlgorithmCollection';

export const L4E_ALGS: AlgorithmCollection[] = [
  // Last Layer
  {
    name: "Sune",
    alg: ["L' U' L U' L' U' L", "R U R' U R U R'", "L U L' U L U L'", "R' U R U R' U R", "L' U L U L' U L"],
    group: "Last Layer"
  },
  {
    name: "AntiSune",
    alg: ["R U R' U R U R'", "R U' R' U' R U' R'", "L' U' L U' L' U' L", "R' U' R U' R' U' R", "L U' L' U' L U' L'"],
    group: "Last Layer"
  },
  {
    name: "Lefty Bars",
    alg: ["R' L' U' L U R", "R' U' L' U L R", "U L R U R' U' L'"],
    group: "Last Layer"
  },
  {
    name: "Righty Bars",
    alg: ["L R U R' U' L'", "L U R U' R' L'", "U' R' L' U' L U R"],
    group: "Last Layer"
  },

  // L3E
  {
    name: "Sledge",
    alg: ["L R' L' R"],
    group: "L3E"
  },
  {
    name: "Hedge",
    alg: ["R' L R L'"],
    group: "L3E"
  },
  {
    name: "Clockwise",
    alg: ["L' U L U R U R'"],
    group: "L3E"
  },
  {
    name: "Counterclockwise",
    alg: ["R U' R' U' L' U' L"],
    group: "L3E"
  },
  {
    name: "Righty",
    alg: ["U' R U R'"],
    group: "L3E"
  },
  {
    name: "Lefty",
    alg: ["U L' U' L"],
    group: "L3E"
  },
  {
    name: "Sexy",
    alg: ["R U' R' U"],
    group: "L3E"
  },
  {
    name: "Left Sexy",
    alg: ["L' U L U'"],
    group: "L3E"
  },

  // Flipped Edges
  {
    name: "2 Flip",
    alg: ["U' R' U L' U L U' R"],
    group: "Flipped Edges"
  },
  {
    name: "DR Flip",
    alg: ["U' R U R' U L' U' L"],
    group: "Flipped Edges"
  },
  {
    name: "DL Flip",
    alg: ["U L' U' L U' R U R'"],
    group: "Flipped Edges"
  },
  {
    name: "DB Flip",
    alg: ["U L' U L U' R U' R'"],
    group: "Flipped Edges"
  },
  {
    name: "4 Flip",
    alg: ["L' U' L R U R' L' U' L R U R'"],
    group: "Flipped Edges"
  },

  // Polish Flip
  {
    name: "Right Polish Flip",
    alg: ["U L' U L R U R'"],
    group: "Polish Flip"
  },
  {
    name: "Left Polish Flip",
    alg: ["U' R U' R' L' U' L"],
    group: "Polish Flip"
  },
  {
    name: "SUS",
    alg: ["U' L R' L' R U L R' L' R"],
    group: "Polish Flip"
  },
  {
    name: "Anti SUS",
    alg: ["U R' L R L' U' R' L R L'"],
    group: "Polish Flip"
  },

  // Separated Bar
  {
    name: "Good Niky",
    alg: ["L' U' L R U R'"],
    group: "Separated Bar"
  },
  {
    name: "Good Sochi",
    alg: ["R U R' L' U' L"],
    group: "Separated Bar"
  },
  {
    name: "Super Sledge",
    alg: ["U' L R' L' R2 U R'"],
    group: "Separated Bar"
  },
  {
    name: "Super Hedge",
    alg: ["R' U' L' U L2 R L'"],
    group: "Separated Bar"
  },
  {
    name: "Bad Niky",
    alg: ["U' L' U' L U R U R'"],
    group: "Separated Bar"
  },
  {
    name: "Bad Sochi",
    alg: ["U R U R' U' L' U' L"],
    group: "Separated Bar"
  },

  // Connected Bar
  {
    name: "Right Spam",
    alg: ["R U R' L' U' L R U R' U'"],
    group: "Connected Bar"
  },
  {
    name: "Left Spam",
    alg: ["L' U' L R U R' L' U' L U"],
    group: "Connected Bar"
  },
  {
    name: "Bad Sledge",
    alg: ["U R U R' U R' L R L'"],
    group: "Connected Bar"
  },
  {
    name: "Bad Hedge",
    alg: ["U' L' U L R U R' L' U L U"],
    group: "Connected Bar"
  },

  // No Bar
  {
    name: "Bad Sexy",
    alg: ["R U R' U L' U L"],
    group: "No Bar"
  },
  {
    name: "Bad Ugly",
    alg: ["L' U' L U' R U' R'"],
    group: "No Bar"
  },
  {
    name: "Bad Righty",
    alg: ["U R U' R' U L' U' L"],
    group: "No Bar"
  },
  {
    name: "Bad Lefty",
    alg: ["U' L' U L U' R U R'"],
    group: "No Bar"
  },
  {
    name: "Double Sexy",
    alg: ["U' R U' R' U R U R'"],
    group: "No Bar"
  },
  {
    name: "Double Ugly",
    alg: ["U L' U L U' L' U' L"],
    group: "No Bar"
  }
];
