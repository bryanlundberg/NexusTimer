import { Solve } from "@/interfaces/Solve";

export default function calculateCurrentAo(solves: Solve[], ao: number) {
  let result = 0;
  if (solves.length < ao) {
    return result;
  }

  const cubeAo = solves.slice(0, ao);
  const sum = cubeAo.reduce(
    (accumulator, currentValue) => accumulator + currentValue.time,
    0
  );
  result = sum / ao;
  return result;
}
