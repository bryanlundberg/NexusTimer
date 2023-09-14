import { useEffect, useState } from "react";
import Select from "./Select";
import { Cube } from "@/interfaces/Cube";
import { Categories } from "@/interfaces/Categories";

const category = ["2x2", "3x3", "4x4"];

export default function HeaderTimer() {
  const [cubes, setCubes] = useState<Cube[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Categories>("2x2");
  const [currentCube, setCurrentCube] = useState<Cube>();

  useEffect(() => {
    const cubesDB = window.localStorage.getItem("cubes");
    if (!cubesDB) {
      window.localStorage.setItem("cubes", "[]");
    }

    if (cubesDB) {
      const parseCubes = JSON.parse(cubesDB);
      setCubes(parseCubes);
    }
  }, []);

  const handleChange = (type: any, newValue: any) => {
    if (type === "Category") {
      setCurrentCategory(newValue);
    }

    if (type === "Cube") {
      const choosedCube = cubes.find((cube) => cube.id === newValue);
      if (choosedCube) {
        setCurrentCube(choosedCube);
      }
    }
  };

  console.log(currentCategory, currentCube?.name);

  return (
    <>
      {/* Selectors category/cube */}
      <div className="flex flex-row justify-center gap-5 p-4">
        <Select
          type="Category"
          options={category}
          handleChange={handleChange}
          currentSelection={currentCategory}
        />
        <Select
          type="Cube"
          options={cubes}
          handleChange={handleChange}
          currentSelection={currentCube?.id}
        />
      </div>
    </>
  );
}
