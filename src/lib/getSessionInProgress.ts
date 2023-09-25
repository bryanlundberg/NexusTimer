import { Cube } from "@/interfaces/Cube";

export default function getSessionInProgress(cubes: Cube[] | null) {
  if (!cubes) return 0;
  let inProgress = {
    sessions: 0,
    solves: 0,
  };

  for (const cube of cubes) {
    if (cube.solves.session.length > 0) {
      inProgress.sessions++;
      inProgress.solves += cube.solves.session.length;
    }
  }

  return `${inProgress.sessions}/${cubes.length} [${inProgress.solves}]`;
}
