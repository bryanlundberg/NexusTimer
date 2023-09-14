import { Cube } from "@/interfaces/Cube";

export default function updateCube({
  cubeId,
  cubes,
}: {
  cubeId: string;
  cubes: Cube[];
}) {
  console.log(cubes);
  const cube = cubes.find((cube) => cube.id === cubeId);
  if (cube) {
    //update
    cube.favorite = !cube.favorite;
  }
  console.log(cube);
  console.log(cubes);
  window.localStorage.setItem("cubes", JSON.stringify(cubes));
  return cubes;
}
