import { useEffect, useState } from "react";
import Select from "./Select";
import { Cube } from "@/interfaces/Cube";
import loadCubes from "@/lib/loadCubes";
import findCube from "@/lib/findCube";

export default function HeaderTimer() {
  const [cubes, setCubes] = useState<Cube[]>([]);
  const [currentCube, setCurrentCube] = useState<Cube>();

  useEffect(() => {
    const cubesDB = loadCubes();
    setCurrentCube(cubesDB[0]);
    setCubes(cubesDB);
  }, []);

  const handleChange = (cubeId: string) => {
    const cube = findCube({ cubeId });
    setCurrentCube(cube);
  };

  const validCubeStatus = currentCube !== undefined;
  console.log(currentCube?.id);

  return (
    <>
      {/* Selectors category/cube */}
      <div className="flex flex-row justify-center gap-5 p-4">
        <Select options={cubes} handleChange={handleChange} />
      </div>
    </>
  );
}
