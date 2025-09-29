import { AlgorithmCollection } from "@/interfaces/AlgorithmCollection";

export const CLL_ALGS: AlgorithmCollection[] = [
  // AS Group (6 cases)
  { name: "AS 1", alg: ["R U2 R' U' R U' R'"], group: "AS", prob: 1/54 },
  { name: "AS 2", alg: ["R U2 R' F R' F' R U' R U' R'"], group: "AS", prob: 1/54 },
  { name: "AS 3", alg: ["F' L F L' U2 L' U2 L"], group: "AS", prob: 1/54 },
  { name: "AS 4", alg: ["R' F R F' R U R'"], group: "AS", prob: 1/54 },
  { name: "AS 5", alg: ["R U2 R' U2 R' F R F'"], group: "AS", prob: 1/54 },
  { name: "AS 6", alg: ["R2 F R U2 R U' R' U2 F' R"], group: "AS", prob: 1/54 },

  // H Group (4 cases)
  { name: "H 1", alg: ["F R2 U' R2 U' R2 U R2 F'"], group: "H", prob: 1/162 },
  { name: "H 2", alg: ["R U R' U R U R' F R' F' R"], group: "H", prob: 1/162 },
  { name: "H 3", alg: ["F R U R' U' R U R' U' R U R' U' F'"], group: "H", prob: 1/162 },
  { name: "H 4", alg: ["R2 U2 R' U2 R2"], group: "H", prob: 1/162 },

  // L Group (6 cases)
  { name: "L 1", alg: ["R U2 R' F' R U2 R' U R' F2 R"], group: "L", prob: 2/81 },
  { name: "L 2", alg: ["R U2 R2 F2 R U R' F2 R F'"], group: "L", prob: 2/81 },
  { name: "L 3", alg: ["R' U R' U2 R U' R' U R U' R2"], group: "L", prob: 2/81 },
  { name: "L 4", alg: ["R U2 R2 F R F' R U2 R'"], group: "L", prob: 2/81 },
  { name: "L 5", alg: ["F R' F' R U R U' R'"], group: "L", prob: 2/81 },
  { name: "L 6", alg: ["F' R U R' U' R' F R"], group: "L", prob: 2/81 },

  // Pi Group (6 cases)
  { name: "Pi 1", alg: ["F R' F' R U2 R U' R' U R U2 R'"], group: "Pi", prob: 2/81 },
  { name: "Pi 2", alg: ["R U2 R' U' R U R' U2 R' F R F'"], group: "Pi", prob: 2/81 },
  { name: "Pi 3", alg: ["F R2 U' R2 U R2 U R2 F'"], group: "Pi", prob: 2/81 },
  { name: "Pi 4", alg: ["R' F R F' R U' R' U' R U' R'"], group: "Pi", prob: 2/81 },
  { name: "Pi 5", alg: ["R' U' R' F R F' R U' R' U2 R"], group: "Pi", prob: 2/81 },
  { name: "Pi 6", alg: ["R U' R2 U R2 U R2 U' R"], group: "Pi", prob: 2/81 },

  // Sune Group (6 cases)
  { name: "Sune 1", alg: ["L' U2 L U2 L F' L' F"], group: "Sune", prob: 2/81 },
  { name: "Sune 2", alg: ["R U2 R' F R U2 R' U R U' R' F"], group: "Sune", prob: 2/81 },
  { name: "Sune 3", alg: ["R U' R' F R' F' R"], group: "Sune", prob: 2/81 },
  { name: "Sune 4", alg: ["F R' F' R U2 R U2 R'"], group: "Sune", prob: 2/81 },
  { name: "Sune 5", alg: ["R U R' U R' F R F' R U2 R'"], group: "Sune", prob: 2/81 },
  { name: "Sune 6", alg: ["R U R' U R U2 R'"], group: "Sune", prob: 2/81 },

  // T Group (6 cases)
  { name: "T 1", alg: ["R U R' U' R' F R F'"], group: "T", prob: 2/81 },
  { name: "T 2", alg: ["L' U' L U L F' L' F"], group: "T", prob: 2/81 },
  { name: "T 3", alg: ["F U' R U2 R' U' F2 R U R'"], group: "T", prob: 2/81 },
  { name: "T 4", alg: ["R' U R U2 R2 F' R U' R' F2 R2"], group: "T", prob: 2/81 },
  { name: "T 5", alg: ["F R U R' U' R U' R' U' R U R' F'"], group: "T", prob: 2/81 },
  { name: "T 6", alg: ["R' U R U2 R2 F R F' R"], group: "T", prob: 2/81 },

  // U Group (6 cases)
  { name: "U 1", alg: ["F R U R' U' F'"], group: "U", prob: 2/81 },
  { name: "U 2", alg: ["R' U' R2 U R' U2 R U2 R' U R'"], group: "U", prob: 2/81 },
  { name: "U 3", alg: ["F R U R' U2 F' R U' R' F"], group: "U", prob: 2/81 },
  { name: "U 4", alg: ["F R' F' R U' R U' R' U2 R U' R'"], group: "U", prob: 2/81 },
  { name: "U 5", alg: ["R U' R2 F R F' R U R' U' R U R'"], group: "U", prob: 2/81 },
  { name: "U 6", alg: ["R' U R' F R F' R U2 R' U R"], group: "U", prob: 2/81 }
];
