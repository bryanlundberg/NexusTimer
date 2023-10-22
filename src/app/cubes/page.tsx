"use client";
import { Button } from "@/components/button/index";
import InputText from "@/components/input-text/InputText";
import TableRow from "@/components/cubes/TableRow";
import { Cube } from "@/interfaces/Cube";
import genId from "@/lib/genId";
import TableHeader from "@/components/cubes/TableHeader";
import ModalCreate from "@/components/cubes/ModalCreate";
import loadCubes from "@/lib/loadCubes";
import { useTimerStore } from "@/store/timerStore";
import { useCubesModalStore } from "@/store/CubesModalStore";
import Plus from "@/icons/Plus";
import translation from "@/translations/global.json";
import { useSettingsModalStore } from "@/store/SettingsModalStore";

import { useEffect, useState } from "react";
import { OverallContainer } from "@/components/OverallContainer";
import EmptyCubes from "@/components/cubes/EmptyCubes";
import { CubesSection } from "@/components/cubes/CubesSection";
import { CubesContent } from "@/components/cubes/CubesContent";

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
      <OverallContainer>
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
                  onClick={() => setModalOpen(true)}
                  className="w-28"
                  icon={<Plus />}
                  label={translation.cubes["cube"][lang]}
                />
              </div>
            </div>
          </div>
        </div>
        <CubesContent filterCubes={filterCubes} />
        {modalOpen && <ModalCreate />}
      </OverallContainer>
    </>
  );
}
