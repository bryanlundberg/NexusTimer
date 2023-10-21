"use client";
import Button from "@/components/button/Button";
import InputText from "@/components/input-text/InputText";
import TableRow from "@/components/TableRow";
import { Cube } from "@/interfaces/Cube";
import genId from "@/lib/genId";
import TableHeader from "@/components/TableHeader";
import ModalCreate from "@/components/ModalCreate";
import loadCubes from "@/lib/loadCubes";
import { useTimerStore } from "@/store/timerStore";
import { useCubesModalStore } from "@/store/CubesModalStore";
import Plus from "@/icons/Plus";
import translation from "@/translations/global.json";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import Navigation from "@/components/navbar/Navbar";
import Image from "next/image";
import nodata from "@/images/no-data.png";
import { useEffect, useState } from "react";

export default function CubesPage() {
  const { cubes, setCubes } = useTimerStore();
  const [filterCubes, setFilterCubes] = useState(cubes);
  const { modalOpen, setModalOpen } = useCubesModalStore();
  const { lang } = useSettingsModalStore();

  const handleSearchFilter = (searchCube: string) => {
    setFilterCubes(
      cubes!.filter((cube: Cube) =>
        cube.name.toLowerCase().startsWith(searchCube.toLowerCase())
      )
    );
  };

  useEffect(() => {
    const cubes = loadCubes();
    setCubes(cubes);
  }, [setCubes, setModalOpen]);

  useEffect(() => {
    setFilterCubes(cubes);
  }, [modalOpen, cubes]);

  return (
    <>
      <div className="flex flex-col w-full min-h-full mx-auto mt-3 rounded-md grow md:max-w-6xl xl:border light:border-neutral-200 dark:border-zinc-800">
        <div className="py-4 border-b light:border-neutral-200 dark:border-zinc-800 ">
          <div className="w-full mx-auto">
            <div className="flex flex-col items-center justify-between gap-3 mx-3 sm:flex-row">
              <div className="text-2xl font-medium">
                {translation.cubes["header"][lang]}
              </div>
              <div className="flex justify-end gap-3">
                {/* Options */}
                <InputText
                  placeholder={
                    translation.inputs.placeholders["filter-cubes"][lang]
                  }
                  onChange={handleSearchFilter}
                  className="border light:bg-neutral-100 light:border-neutral-200 light:focus:bg-neutral-50 dark:bg-zinc-950 dark:border-zinc-800 dark:focus:bg-zinc-900"
                />
                <Button
                  disabled={false}
                  handleClick={() => setModalOpen(true)}
                  className="border-dashed w-28 hover:border-solid"
                >
                  <div className="flex items-center justify-between">
                    <Plus />
                    <div>{translation.cubes["cube"][lang]}</div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* content */}
        {filterCubes && filterCubes.length > 0 ? (
          <div className="h-full m-3 overflow-auto grow">
            <div className="table w-full text-sm">
              <TableHeader />
              <div className="table-row-group h-10 text-sm">
                {filterCubes.map((cube) => (
                  <TableRow key={genId()} cube={cube} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => {
              setModalOpen(true);
            }}
            className="flex flex-col items-center justify-center h-full m-3 overflow-auto border border-dashed rounded-md cursor-pointer grow border-zinc-800"
          >
            <div className="flex flex-col items-center justify-center gap-1 p-3 font-medium">
              <Image
                src={nodata}
                alt={"no-cubes-for-display"}
                width={56}
                height={61}
              />
              <div>{translation.cubes["no-cubes-for-display"][lang]}</div>
            </div>
          </div>
        )}
        {modalOpen && <ModalCreate />}
      </div>
      <Navigation />
    </>
  );
}
