import { useEffect, useState } from "react";
import Select from "./Select";
import { Cube } from "@/interfaces/Cube";
import loadCubes from "@/lib/loadCubes";
import findCube from "@/lib/findCube";
import Settings from "@/icons/Settings";

export default function HeaderTimer({
  handleSelectedCube,
  cubeName,
  scramble,
}: {
  handleSelectedCube: any;
  cubeName: string;
  scramble: string | null;
}) {
  const [cubes, setCubes] = useState<Cube[]>([]);

  useEffect(() => {
    const cubesDB = loadCubes();
    setCubes(cubesDB);
  }, []);

  const handleChange = (cubeId: string) => {
    const cube = findCube({ cubeId });
    handleSelectedCube(cube);
  };

  return (
    <>
      {/* Selectors category/cube */}
      <div className="flex flex-col items-center justify-center gap-5 p-4">
        <div className="flex items-center">
          <div
            className="w-6 h-6 text-netral-50 hover:text-neutral-200 hover:cursor-pointer"
            onClick={() => alert("Settings modal pending")}
          >
            <Settings />
          </div>

          <Select text={cubeName} options={cubes} handleChange={handleChange} />
        </div>

        <div className="text-center font-medium text-2xl">
          {scramble ? scramble : "Pick a Cube to load a scramble."}
        </div>
      </div>
    </>
  );
}
