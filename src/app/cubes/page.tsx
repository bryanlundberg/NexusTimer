"use client";
import { Button } from "@/components/button/index";
import { InputText } from "@/components/input-text/index";
import ModalCreate from "@/components/cubes/ModalCreate";
import Plus from "@/icons/Plus";
import translation from "@/translations/global.json";
import { OverallContainer } from "@/components/OverallContainer";
import { CubesContent } from "@/components/cubes/CubesContent";
import { OverallHeader } from "@/components/OverallHeader";
import { OptionsContainer } from "@/components/cubes/OptionsContainer";
import { useCubes } from "@/hooks/useCubes";
import { AnimatePresence } from "framer-motion";
import useModalCube from "@/hooks/useModalCube";
import { useCubesModalStore } from "@/store/CubesModalStore";
import { useSettingsModalStore } from "@/store/SettingsModalStore";

export default function CubesPage() {
  const { filterCubes, handleSearchFilter } = useCubes();
  const { modalOpen, setModalOpen } = useCubesModalStore();
  const { setSelectedCategory } = useModalCube();
  const { lang } = useSettingsModalStore();

  return (
    <>
      <OverallContainer>
        <OverallHeader title={translation.cubes["header"][lang]}>
          <OptionsContainer>
            <InputText
              placeholder={
                translation.inputs.placeholders["filter-cubes"][lang]
              }
              onChange={handleSearchFilter}
              className="border light:bg-neutral-50 light:border-neutral-200 light:focus:bg-white dark:bg-zinc-950 dark:border-zinc-800 dark:focus:bg-zinc-900"
            />
            <Button
              onClick={() => {
                setSelectedCategory("2x2");
                setModalOpen(true);
              }}
              icon={<Plus />}
              label={translation.cubes["cube"][lang]}
            />
          </OptionsContainer>
        </OverallHeader>
        <CubesContent filterCubes={filterCubes} />
        <AnimatePresence>{modalOpen && <ModalCreate />}</AnimatePresence>
      </OverallContainer>
    </>
  );
}
