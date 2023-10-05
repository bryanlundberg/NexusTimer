import { Solve } from "@/interfaces/Solve";

export default function calcPlus2Rate(solves: Solve[]) {
  return solves.reduce((total, acc) => (acc.plus2 ? total + 1 : total), 0);
}
