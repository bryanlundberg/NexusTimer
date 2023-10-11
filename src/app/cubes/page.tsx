"use client";
import Button from "@/components/Button";
import InputText from "@/components/InputText";
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
import Navigation from "@/components/Navigation";
import Image from "next/image";
import nodata from "@/images/no-data.png";
import { useEffect } from "react";

export default function CubesPage() {
  const { cubes, setCubes } = useTimerStore();
  const { modalOpen, setModalOpen } = useCubesModalStore();
  const { lang } = useSettingsModalStore();

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

  useEffect(() => {
    setModalOpen(false);
    const cubes = loadCubes();
    setCubes(cubes);
  }, [setCubes, setModalOpen]);

  return (
    <>
      <div className="mt-3 grow w-full md:max-w-6xl mx-auto flex flex-col xl:border border-zinc-800 rounded-md min-h-full">
        <div className="border-b border-zinc-800 py-4 ">
          <div className="w-full mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mx-3">
              <div className="font-medium text-2xl">
                {translation.cubes["header"][lang]}
              </div>
              <div className="flex justify-end gap-3">
                {/* Options */}
                <InputText
                  placeholder={
                    translation.inputs.placeholders["filter-cubes"][lang]
                  }
                  onChange={handleSearchFilter}
                />
                <Button
                  disabled={false}
                  handleClick={() => setModalOpen(true)}
                  className="w-28 border-dashed hover:border-solid"
                >
                  <div className="flex justify-between items-center">
                    <Plus />
                    <div>{translation.cubes["cube"][lang]}</div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* content */}
        {cubes && cubes.length > 0 ? (
          <div className="h-full overflow-auto grow m-3">
            <div className="table w-full text-sm">
              <TableHeader />
              <div className="table-row-group h-10 border-zinc-800 text-white text-sm">
                {cubes.map((cube) => (
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
            className="cursor-pointer h-full overflow-auto grow m-3 border border-zinc-800 border-dashed rounded-md justify-center items-center flex flex-col"
          >
            <div className="flex flex-col justify-center items-center gap-1 p-3 font-medium">
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
