import { Solve } from "../interfaces/Solve";

export const SortSolve = (
  displaySolves: Solve[] | null,
  sortBy: string,
  sortOn: string
) => {
  if (sortBy === "Time") {
    if (sortOn === "Ascending") {
      displaySolves?.sort((a, b) => a.time - b.time);
    } else if (sortOn === "Descending") {
      displaySolves?.sort((a, b) => b.time - a.time);
    }
  } else if (sortBy === "Date") {
    if (sortOn === "Ascending") {
      displaySolves?.sort((a, b) => a.endTime - b.endTime);
    } else if (sortOn === "Descending") {
      displaySolves?.sort((a, b) => b.endTime - a.endTime);
    }
  } else if (sortBy === "plus2") {
    displaySolves?.sort((a, b) => {
      if (a.plus2 || b.plus2) {
        return -1;
      } else if (!a.plus2 && !b.plus2) {
        return 1;
      } else {
        return 0;
      }
    });
  }
};
