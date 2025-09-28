import { AlgorithmCollection } from "@/interfaces/AlgorithmCollection";

export const BLE_ALGS: AlgorithmCollection[] = [
  // H Cases + Corners Oriented Case
  {
    name: "H Case 1",
    alg: ["U' (R U' R' U') (R U R' U R U R')"],
    group: "H Cases + Corners Oriented Case"
  },
  {
    name: "H Case 2",
    alg: ["(R U' R' U') (R U' R' U R U R')"],
    group: "H Cases + Corners Oriented Case"
  },
  {
    name: "H Case 3",
    alg: ["U (R U' R' U') (R U2' R' U R U R')"],
    group: "H Cases + Corners Oriented Case"
  },

  // Sune Cases
  {
    name: "Sune Case 1",
    alg: ["(R U R' U2') (R U R' U2' R U' R')"],
    group: "Sune Cases"
  },
  {
    name: "Sune Case 2",
    alg: ["U' (R U' R' U R U R')"],
    group: "Sune Cases"
  },
  {
    name: "Sune Case 3",
    alg: ["U (R U2' R' U R U R')"],
    group: "Sune Cases"
  },
  {
    name: "Sune Case 4 - To OLL",
    alg: ["U' (F' R U R') (U' R' F R)"],
    group: "Sune Cases"
  },
  {
    name: "Sune Case 5",
    alg: ["U (R U' R' U) (R U R' U2' R U R')"],
    group: "Sune Cases"
  },

  // Anti-Sune Cases
  {
    name: "Anti-Sune Case 1",
    alg: ["U' (F' R U R2') U' R' F R U R"],
    group: "Anti-Sune Cases"
  },
  {
    name: "Anti-Sune Case 2 - To OLL",
    alg: ["U' (F' R U R') (U' R' F R)"],
    group: "Anti-Sune Cases"
  },
  {
    name: "Anti-Sune Case 3",
    alg: ["U' (R U' R' U2) (R U' R' U' R U R')"],
    group: "Anti-Sune Cases"
  },
  {
    name: "Anti-Sune Case 4",
    alg: ["U' (R U R' U2') (R U' R' U2 R U' R')"],
    group: "Anti-Sune Cases"
  },

  // L Cases
  {
    name: "L Case 1",
    alg: ["U (R U' R' U) y' (R' U R U R' U2' R)"],
    group: "L Cases"
  },
  {
    name: "L Case 2 - To OLL",
    alg: ["(R' F' R U) (R U' R' F)"],
    group: "L Cases"
  },
  {
    name: "L Case 3 - To OLL",
    alg: ["U' (F' R U R') (U' R' F R)"],
    group: "L Cases"
  },
  {
    name: "L Case 4",
    alg: ["U2 (R U2' R' U') y' (R' U2 R U' R' U' R)"],
    group: "L Cases"
  },

  // T Cases
  {
    name: "T Case 1 - To OLL",
    alg: ["(R' F' R U) (R U' R' F)"],
    group: "T Cases"
  },
  {
    name: "T Case 2 - To OLL",
    alg: ["(R' F' R U) (R U' R' F)"],
    group: "T Cases"
  },
  {
    name: "T Case 3 - To OLL",
    alg: ["U' (F' R U R') (U' R' F R)"],
    group: "T Cases"
  },
  {
    name: "T Case 4 - To OLL",
    alg: ["U' (F' R U R') (U' R' F R)"],
    group: "T Cases"
  },

  // U Cases
  {
    name: "U Case 1 - To OLL",
    alg: ["U' (F' R U R') (U' R' F R)"],
    group: "U Cases"
  },
  {
    name: "U Case 2 - To OLL",
    alg: ["U' (F' R U R') (U' R' F R)"],
    group: "U Cases"
  },
  {
    name: "U Case 3",
    alg: ["U' (R' D' R U') (R' D R U) (R U R')"],
    group: "U Cases"
  },
  {
    name: "U Case 4",
    alg: ["U (R U' R') (U' R' D' R) (U R' D R)"],
    group: "U Cases"
  },

  // Pi Cases
  {
    name: "Pi Case 1",
    alg: ["(R U2' R' U) (R U2 R' U') (R U2 R')"],
    group: "Pi Cases"
  },
  {
    name: "Pi Case 2",
    alg: ["(R U R' U2') (R U R' U') (R U2 R')"],
    group: "Pi Cases"
  },
  {
    name: "Pi Case 3",
    alg: ["U2 (R U2' R' U) (R U' R' U2 R U' R')"],
    group: "Pi Cases"
  },
  {
    name: "Pi Case 4",
    alg: ["U2' (R U R' U2') (R U2' R' U2 R U' R')"],
    group: "Pi Cases"
  }
];
