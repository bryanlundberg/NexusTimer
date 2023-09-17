"use client";
import Button from "@/components/Button";
import InputText from "@/components/InputText";
import TableRow from "@/components/TableRow";
import { useState } from "react";
import { Cube } from "@/interfaces/Cube";
import genId from "@/lib/genId";
import TableHeader from "@/components/TableHeader";
import ModalCreate from "@/components/ModalCreate";
import loadCubes from "@/lib/loadCubes";
import { useTimerStore } from "@/store/timerStore";
import { Categories } from "@/interfaces/Categories";
import createCube from "@/lib/createCube";

export default function CubesPage() {
  const { cubes, setCubes } = useTimerStore();
  const [isCreatingCube, setIsCreatingCube] = useState<boolean>(false);

  const handleClick = () => {
    setIsCreatingCube(true);
  };

  const handleCreateCube = (name: string, category: Categories) => {
    if (name === "") return;
    const newCubes = createCube({
      cubeName: name,
      category: category,
    });
    setCubes(newCubes);
    setIsCreatingCube(false);
  };

  const handleClose = () => {
    setIsCreatingCube(false);
  };

  const handleSearchFilter = (searchCube: string) => {
    const cubesDB = loadCubes();
    if (!cubesDB) return;
    if (searchCube === "") {
      const cubesDB = loadCubes();
      setCubes(cubesDB);
      return;
    }
    const filterCubes = cubesDB.filter((cube: Cube) =>
      cube.name.toLowerCase().startsWith(searchCube.toLowerCase())
    );

    if (filterCubes) {
      setCubes(filterCubes);
    }
  };

  return (
    <>
      <div className="w-full md:w-10/12 mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold mt-5">Welcome back!</h1>
        <p className="text-lg text-gray-400">
          Here&rsquo;s a list of your cubes!
        </p>

        {/* Filters table */}
        <div className="mt-8"></div>

        <div className="flex align-middle gap-3">
          {/* Options */}
          <InputText
            placeholder="Filter your cubes"
            onChange={handleSearchFilter}
          />
          <Button disabled={false} handleClick={handleClick}>
            + Cube
          </Button>
        </div>

        <div>
          {/* table */}
          <div className="overflow-auto">
            <div className="table w-full mt-4 border rounded-lg text-sm border-zinc-800">
              <TableHeader />
              <div className="table-row-group h-10 border-b border-zinc-800 text-white text-sm">
                {cubes?.map((cube) => {
                  return <TableRow key={genId()} cube={cube} />;
                })}
              </div>
            </div>
          </div>
        </div>
        {isCreatingCube && (
          <ModalCreate
            handleCreateCube={handleCreateCube}
            handleClose={handleClose}
          />
        )}
      </div>
    </>
  );
}
