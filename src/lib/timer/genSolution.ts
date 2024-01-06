import { Categories } from "@/interfaces/Categories";
import { Layers } from "@/interfaces/types/Layers";
import cubeSolver from "cube-solver";

export default function genSolution(
  event: Categories,
  scramble: string | null,
  layer: Layers
): CrossSolutions {
  const solution: CrossSolutions = {
    cross: "",
    xcross: "",
  };

  console.log(event, scramble, layer);

  if (event === "3x3" && scramble) {
    if (layer === "yellow") {
      solution.cross = cubeSolver.solve(scramble, "cross");
      solution.xcross = cubeSolver.solve(scramble, "xcross");
    }
    if (layer === "white") {
      solution.cross = `${cubeSolver.solve("" + scramble + "", "cross")}`;
      solution.xcross = `${cubeSolver.solve("" + scramble, "xcross")}`;
    }
    if (layer === "green") {
      solution.cross = cubeSolver.solve(scramble, "cross");
      solution.xcross = cubeSolver.solve(scramble, "xcross");
    }
    if (layer === "blue") {
      solution.cross = cubeSolver.solve(scramble, "cross");
      solution.xcross = cubeSolver.solve(scramble, "xcross");
    }
    if (layer === "red") {
      solution.cross = cubeSolver.solve(scramble, "cross");
      solution.xcross = cubeSolver.solve(scramble, "xcross");
    }
    if (layer === "orange") {
      solution.cross = cubeSolver.solve(scramble, "cross");
      solution.xcross = cubeSolver.solve(scramble, "xcross");
    }
  }
  return solution;
}
