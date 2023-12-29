import { Solve } from "@/interfaces/Solve";
import loadCubes from "./loadCubes";
import formatTime from "./formatTime";

export default function searchQuery({
  query,
  cubeId,
  currentTab,
}: {
  query: string;
  cubeId: string | null;
  currentTab: "Session" | "All";
}): Solve[] | null {
  if (!cubeId) return null;

  const cubeDB = loadCubes();

  const selectedCube = cubeDB.filter((u) => u.id === cubeId);

  if (!selectedCube) return null;

  let solves = null;

  if (currentTab === "Session") {
    solves = selectedCube[0].solves.session.filter((u) => {
      if (formatTime(u.time).includes(query)) {
        return u;
      }
    });
  }

  if (currentTab === "All") {
    solves = selectedCube[0].solves.all.filter((u) => {
      if (formatTime(u.time).includes(query)) {
        return u;
      }
    });
  }
  return solves;
}
