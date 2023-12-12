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

export default function CubesPage() {
  const { filterCubes, modalOpen, setModalOpen, lang, handleSearchFilter } =
    useCubes();

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
              className="border light:bg-neutral-100 light:border-neutral-200 light:focus:bg-neutral-50 dark:bg-zinc-950 dark:border-zinc-800 dark:focus:bg-zinc-900"
            />
            <Button
              onClick={() => setModalOpen(true)}
              className="w-28"
              icon={<Plus />}
              label={translation.cubes["cube"][lang]}
            />
          </OptionsContainer>
        </OverallHeader>
        <CubesContent filterCubes={filterCubes} />
        {modalOpen && <ModalCreate />}
      </OverallContainer>
    </>
  );
}
