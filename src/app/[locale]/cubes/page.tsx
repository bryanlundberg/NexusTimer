"use client";
import { Button } from "@/components/button/index";
import { InputText } from "@/components/input-text/index";
import ModalCreate from "@/components/cubes/ModalCreate";
import { OverallContainer } from "@/components/OverallContainer";
import { CubesContent } from "@/components/cubes/CubesContent";
import { OverallHeader } from "@/components/OverallHeader";
import { OptionsContainer } from "@/components/cubes/OptionsContainer";
import { useCubes } from "@/hooks/useCubes";
import { AnimatePresence } from "framer-motion";
import useModalCube from "@/hooks/useModalCube";
import { useCubesModalStore } from "@/store/CubesModalStore";
import { useTranslations } from "next-intl";
import { PlusIcon } from "@heroicons/react/24/solid";

export default function CubesPage() {
  const { filterCubes, handleSearchFilter } = useCubes();
  const { modalOpen, setModalOpen } = useCubesModalStore();
  const { setSelectedCategory } = useModalCube();
  const t = useTranslations("Index.CubesPage");
  return (
    <>
      <OverallContainer>
        <OverallHeader title={t("title")}>
          <OptionsContainer>
            <InputText
              placeholder={t("filter-cubes")}
              onChange={handleSearchFilter}
              className="border light:bg-neutral-50 light:border-neutral-200 light:focus:bg-white dark:bg-zinc-950 dark:border-zinc-800 dark:focus:bg-zinc-900"
            />
            <Button
              onClick={() => {
                setSelectedCategory("2x2");
                setModalOpen(true);
              }}
              icon={<PlusIcon className="w-6 h-6" />}
              label={t("cube")}
            />
          </OptionsContainer>
        </OverallHeader>
        <CubesContent filterCubes={filterCubes} />
        <AnimatePresence>{modalOpen && <ModalCreate />}</AnimatePresence>
      </OverallContainer>
    </>
  );
}
